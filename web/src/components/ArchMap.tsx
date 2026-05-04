import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type {
  ArchitectureGraph,
  ArchNode,
  EdgeType,
} from "../lib/load-architecture";

interface Props {
  graph: ArchitectureGraph;
  visibleSlugs: Set<string>;
}

const SVG_WIDTH = 1400;
const SVG_HEIGHT = 900;
const LAYER_HEIGHT = SVG_HEIGHT / 7;

const EDGE_STYLES: Record<EdgeType, { color: string; dash: string; markerId: string; label: string }> = {
  "uses":           { color: "#1e3a8a", dash: "0",     markerId: "arr-uses",   label: "uses" },
  "hosted-on":      { color: "#581c87", dash: "0",     markerId: "arr-host",   label: "hosted-on" },
  "grounds-on":     { color: "#065f46", dash: "0",     markerId: "arr-ground", label: "grounds-on" },
  "secured-by":     { color: "#991b1b", dash: "4,2",   markerId: "arr-sec",    label: "secured-by" },
  "calls":          { color: "#7c2d12", dash: "0",     markerId: "arr-call",   label: "calls" },
  "integrated-via": { color: "#0891b2", dash: "1,3",   markerId: "arr-mcp",    label: "integrated-via" },
};

function nodeRadius(tier: 1 | 2 | 3): number {
  return tier === 1 ? 14 : tier === 2 ? 11 : 9;
}

// SimNode extends ArchNode with D3 simulation fields (x, y, vx, vy, fx, fy).
// Important: ArchNode has TWO slug fields:
//   - slug: YAML key — used for edge source/target matching (forceLink id)
//   - urlSlug: URL path — used for /products/<urlSlug> navigation in Task 7
interface SimNode extends d3.SimulationNodeDatum, ArchNode {}
interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  type: EdgeType;
  description: string;
}

interface HoveredEdge {
  edge: SimLink;
  x: number;
  y: number;
}

export default function ArchMap({ graph, visibleSlugs }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<HoveredEdge | null>(null);

  // === Effect 1: Build the visualization (runs once on mount, re-builds on graph change) ===
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { layers, nodes: rawNodes, edges } = graph;
    const layerById = new Map(layers.map((l) => [l.id, l]));

    // === Defs: arrow markers ===
    const defs = svg.append("defs");
    Object.values(EDGE_STYLES).forEach((s) => {
      defs.append("marker")
        .attr("id", s.markerId)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 18)
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

    // === Edges ===
    const linkG = svg.append("g").attr("class", "links");
    const linkSel = linkG.selectAll<SVGLineElement, SimLink>("line")
      .data(simLinks)
      .enter()
      .append("line")
      .attr("stroke", (d) => EDGE_STYLES[d.type].color)
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", (d) => EDGE_STYLES[d.type].dash)
      .attr("marker-end", (d) => `url(#${EDGE_STYLES[d.type].markerId})`)
      .attr("opacity", 0.7)
      .style("cursor", "pointer")
      .on("mouseenter", function (event: MouseEvent, d) {
        const container = svgRef.current?.parentElement;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        setHoveredEdge({
          edge: d,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
        d3.select(this).attr("stroke-width", 3);
      })
      .on("mousemove", function (event: MouseEvent, d) {
        const container = svgRef.current?.parentElement;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        setHoveredEdge({
          edge: d,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      })
      .on("mouseleave", function () {
        setHoveredEdge(null);
        d3.select(this).attr("stroke-width", 1.5);
      });

    // === Nodes ===
    const nodeG = svg.append("g").attr("class", "nodes");
    const nodeSel = nodeG.selectAll<SVGGElement, SimNode>("g")
      .data(simNodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("data-slug", (d) => d.slug)
      .attr("cursor", "pointer")
      .on("mouseenter", (_event, d) => setHoveredNode(d.slug))
      .on("mouseleave", () => setHoveredNode(null))
      .on("click", (_event, d) => {
        // CRITICAL: use urlSlug (not slug) — matches Sub-Project A's /products/<slug> routes
        window.location.href = `/products/${d.urlSlug}`;
      });

    nodeSel.append("circle")
      .attr("r", (d) => nodeRadius(d.tier))
      .attr("fill", (d) => layerById.get(d.layer)?.color_fg ?? "#888")
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
      .force("y", d3.forceY<SimNode>((d) => (d.layerOrder - 0.5) * LAYER_HEIGHT).strength(1))
      .force("x", d3.forceX<SimNode>(SVG_WIDTH / 2).strength(0.05))
      .force("collide", d3.forceCollide<SimNode>((d) => nodeRadius(d.tier) + 6))
      .force("link", d3.forceLink<SimNode, SimLink>(simLinks)
        .id((d) => d.slug)
        .distance(120)
        .strength(0.3))
      .alpha(1)
      .alphaDecay(0.05)
      .on("tick", () => {
        // After simulation, source/target are guaranteed SimNode objects
        // (simLinks was constructed with direct SimNode references, not strings).
        linkSel
          .attr("x1", (d) => (d.source as SimNode).x!)
          .attr("y1", (d) => (d.source as SimNode).y!)
          .attr("x2", (d) => (d.target as SimNode).x!)
          .attr("y2", (d) => (d.target as SimNode).y!);
        nodeSel.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
      });

    const stopTimer = setTimeout(() => simulation.stop(), 3000);

    return () => {
      clearTimeout(stopTimer);
      simulation.stop();
    };
  }, [graph]);

  // === Effect 2: React to hoveredNode changes — highlight connected, dim others ===
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    if (!hoveredNode) {
      // Reset to default state
      svg.selectAll<SVGGElement, SimNode>(".node").attr("opacity", 1);
      svg.selectAll<SVGLineElement, SimLink>(".links line").attr("opacity", 0.7).attr("stroke-width", 1.5);
      svg.selectAll<SVGCircleElement, SimNode>(".node circle").attr("stroke", "white").attr("stroke-width", 2);
      return;
    }

    // Find connected nodes + edges
    const connectedNodeSlugs = new Set<string>([hoveredNode]);
    const connectedEdges = new Set<SimLink>();

    svg.selectAll<SVGLineElement, SimLink>(".links line").each(function (d) {
      const sourceSlug = (d.source as SimNode).slug;
      const targetSlug = (d.target as SimNode).slug;
      if (sourceSlug === hoveredNode || targetSlug === hoveredNode) {
        connectedNodeSlugs.add(sourceSlug);
        connectedNodeSlugs.add(targetSlug);
        connectedEdges.add(d);
      }
    });

    // Apply dimming
    svg.selectAll<SVGGElement, SimNode>(".node")
      .attr("opacity", (d) => (connectedNodeSlugs.has(d.slug) ? 1 : 0.15));

    svg.selectAll<SVGLineElement, SimLink>(".links line")
      .attr("opacity", (d) => (connectedEdges.has(d) ? 1 : 0.05))
      .attr("stroke-width", (d) => (connectedEdges.has(d) ? 2.5 : 1.5));

    // Yellow halo on hovered node
    svg.selectAll<SVGGElement, SimNode>(".node")
      .filter((d) => d.slug === hoveredNode)
      .select("circle")
      .attr("stroke", "#fbbf24")
      .attr("stroke-width", 4);
  }, [hoveredNode]);

  // === Effect 3: React to visibleSlugs (filter) changes ===
  useEffect(() => {
    // Clear any stale hover state — if user hovered a node and then filtered
    // it out, the highlight from Effect 2 would persist incorrectly.
    setHoveredNode(null);
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    svg.selectAll<SVGGElement, SimNode>(".node")
      .classed("filtered-out", (d) => !visibleSlugs.has(d.slug));

    svg.selectAll<SVGLineElement, SimLink>(".links line")
      .classed("filtered-out", (d) => {
        const s = (d.source as SimNode).slug;
        const t = (d.target as SimNode).slug;
        return !visibleSlugs.has(s) || !visibleSlugs.has(t);
      });
  }, [visibleSlugs]);

  return (
    <div className="w-full overflow-x-auto relative">
      <style>{`
        .filtered-out { opacity: 0.05 !important; pointer-events: none; }
      `}</style>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full"
        style={{ minHeight: "calc(100vh - 120px)", background: "#fafafa" }}
      />
      {/* tooltip block (existing, unchanged) */}
      {hoveredEdge && (
        <div
          className="absolute pointer-events-none bg-gray-900 text-white p-3 rounded-md shadow-2xl"
          style={{
            left: `${hoveredEdge.x}px`,
            top: `${hoveredEdge.y}px`,
            transform: "translate(-50%, -110%)",
            maxWidth: "280px",
            zIndex: 50,
          }}
        >
          <div
            className="text-xs uppercase font-bold tracking-wide"
            style={{ color: EDGE_STYLES[hoveredEdge.edge.type].color }}
          >
            {EDGE_STYLES[hoveredEdge.edge.type].label}
          </div>
          <div className="text-sm mt-1 leading-relaxed whitespace-pre-line">
            {hoveredEdge.edge.description.trim()}
          </div>
        </div>
      )}
    </div>
  );
}
