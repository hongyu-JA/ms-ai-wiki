import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type {
  ArchitectureGraph,
  ArchNode,
  EdgeType,
} from "../lib/load-architecture";

interface Props {
  graph: ArchitectureGraph;
}

const SVG_WIDTH = 1400;
const SVG_HEIGHT = 900;
const LAYER_HEIGHT = SVG_HEIGHT / 7;

const EDGE_STYLES: Record<EdgeType, { color: string; dash: string; markerId: string }> = {
  "uses":           { color: "#1e3a8a", dash: "0",     markerId: "arr-uses" },
  "hosted-on":      { color: "#581c87", dash: "0",     markerId: "arr-host" },
  "grounds-on":     { color: "#065f46", dash: "0",     markerId: "arr-ground" },
  "secured-by":     { color: "#991b1b", dash: "4,2",   markerId: "arr-sec" },
  "calls":          { color: "#7c2d12", dash: "0",     markerId: "arr-call" },
  "integrated-via": { color: "#0891b2", dash: "1,4",   markerId: "arr-mcp" },
};

function nodeRadius(tier: 1 | 2 | 3): number {
  return tier === 1 ? 14 : tier === 2 ? 11 : 9;
}

interface SimNode extends d3.SimulationNodeDatum, ArchNode {}
interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  type: EdgeType;
  description: string;
}

export default function ArchMap({ graph }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clean slate

    const { layers, nodes: rawNodes, edges } = graph;
    const layerById = new Map(layers.map((l) => [l.id, l]));

    // === Defs: arrow markers per edge type ===
    const defs = svg.append("defs");
    Object.entries(EDGE_STYLES).forEach(([_type, s]) => {
      defs.append("marker")
        .attr("id", s.markerId)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 18) // back off so arrow sits at node edge
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", s.color);
    });

    // === Layer bands ===
    const layerG = svg.append("g").attr("class", "layers");
    layers.forEach((layer) => {
      layerG.append("rect")
        .attr("x", 0)
        .attr("y", (layer.order - 1) * LAYER_HEIGHT)
        .attr("width", SVG_WIDTH)
        .attr("height", LAYER_HEIGHT)
        .attr("fill", layer.color_bg)
        .attr("opacity", 0.6);
      layerG.append("text")
        .attr("x", 12)
        .attr("y", (layer.order - 1) * LAYER_HEIGHT + 18)
        .attr("fill", layer.color_fg)
        .attr("font-size", 11)
        .attr("font-weight", "bold")
        .text(layer.name);
      layerG.append("text")
        .attr("x", 12)
        .attr("y", (layer.order - 1) * LAYER_HEIGHT + 32)
        .attr("fill", layer.color_fg)
        .attr("font-size", 9)
        .attr("opacity", 0.7)
        .text(layer.description);
    });

    // === Sim data ===
    const simNodes: SimNode[] = rawNodes.map((n) => ({
      ...n,
      x: SVG_WIDTH / 2,
      y: (n.layerOrder - 0.5) * LAYER_HEIGHT,
    }));
    const slugToSim = new Map(simNodes.map((n) => [n.slug, n]));
    const simLinks: SimLink[] = edges.map((e) => ({
      source: slugToSim.get(e.source)!,
      target: slugToSim.get(e.target)!,
      type: e.type,
      description: e.description,
    }));

    // === Edges (rendered first, so under nodes) ===
    const linkG = svg.append("g").attr("class", "links");
    const linkSel = linkG.selectAll("line")
      .data(simLinks)
      .enter()
      .append("line")
      .attr("stroke", (d) => EDGE_STYLES[d.type].color)
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", (d) => EDGE_STYLES[d.type].dash)
      .attr("marker-end", (d) => `url(#${EDGE_STYLES[d.type].markerId})`)
      .attr("opacity", 0.7);

    // === Nodes ===
    const nodeG = svg.append("g").attr("class", "nodes");
    const nodeSel = nodeG.selectAll("g")
      .data(simNodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("cursor", "pointer");

    nodeSel.append("circle")
      .attr("r", (d) => nodeRadius(d.tier))
      .attr("fill", (d) => layerById.get(d.layer)!.color_fg)
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("opacity", (d) => (d.isDeprecated ? 0.5 : 1));

    nodeSel.append("text")
      .attr("y", (d) => nodeRadius(d.tier) + 14)
      .attr("text-anchor", "middle")
      .attr("font-size", 10)
      .attr("fill", "#222")
      .attr("font-weight", "500")
      .text((d) => d.displayName);

    // === Force simulation ===
    const simulation = d3.forceSimulation<SimNode>(simNodes)
      // Y pinning to layer band — strong
      .force("y", d3.forceY<SimNode>((d) => (d.layerOrder - 0.5) * LAYER_HEIGHT).strength(1))
      // X mid-attraction — weak
      .force("x", d3.forceX<SimNode>(SVG_WIDTH / 2).strength(0.05))
      // Collision — strong, prevents overlap
      .force("collide", d3.forceCollide<SimNode>((d) => nodeRadius(d.tier) + 6))
      // Link attraction — moderate, pulls connected closer in X
      .force("link", d3.forceLink<SimNode, SimLink>(simLinks)
        .id((d) => d.slug)
        .distance(120)
        .strength(0.3))
      .alpha(1)
      .alphaDecay(0.05)
      .on("tick", () => {
        linkSel
          .attr("x1", (d) => (d.source as SimNode).x!)
          .attr("y1", (d) => (d.source as SimNode).y!)
          .attr("x2", (d) => (d.target as SimNode).x!)
          .attr("y2", (d) => (d.target as SimNode).y!);
        nodeSel.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
      });

    // Stop after stabilization (~3 sec)
    const stopTimer = setTimeout(() => simulation.stop(), 3000);

    return () => {
      clearTimeout(stopTimer);
      simulation.stop();
    };
  }, [graph]);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full"
        style={{ minHeight: "calc(100vh - 120px)", background: "#fafafa" }}
      />
    </div>
  );
}
