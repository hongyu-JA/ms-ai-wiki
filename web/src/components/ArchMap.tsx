import type { ArchitectureGraph, ArchNode, Layer } from "../lib/load-architecture";

interface Props {
  graph: ArchitectureGraph;
}

const SVG_WIDTH = 1400;
const SVG_HEIGHT = 900;
const LAYER_HEIGHT = SVG_HEIGHT / 7; // 7 layers

function nodeRadius(tier: 1 | 2 | 3): number {
  return tier === 1 ? 14 : tier === 2 ? 11 : 9;
}

/** v0: static positions — Tools werden gleichmässig im Layer-Band verteilt. */
function staticLayout(nodes: ArchNode[], layers: Layer[]) {
  const positioned: Array<ArchNode & { x: number; y: number }> = [];
  for (const layer of layers) {
    const layerNodes = nodes.filter((n) => n.layer === layer.id);
    const yCenter = (layer.order - 0.5) * LAYER_HEIGHT;
    const spacing = SVG_WIDTH / (layerNodes.length + 1);
    layerNodes.forEach((node, i) => {
      positioned.push({
        ...node,
        x: spacing * (i + 1),
        y: yCenter,
      });
    });
  }
  return positioned;
}

export default function ArchMap({ graph }: Props) {
  const { layers, nodes } = graph;
  const positionedNodes = staticLayout(nodes, layers);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full"
        style={{ minHeight: "calc(100vh - 120px)", background: "#fafafa" }}
      >
        {/* Layer bands */}
        {layers.map((layer) => (
          <g key={layer.id}>
            <rect
              x={0}
              y={(layer.order - 1) * LAYER_HEIGHT}
              width={SVG_WIDTH}
              height={LAYER_HEIGHT}
              fill={layer.color_bg}
              opacity={0.6}
            />
            <text
              x={12}
              y={(layer.order - 1) * LAYER_HEIGHT + 18}
              fill={layer.color_fg}
              fontSize={11}
              fontWeight="bold"
            >
              {layer.name}
            </text>
            <text
              x={12}
              y={(layer.order - 1) * LAYER_HEIGHT + 32}
              fill={layer.color_fg}
              fontSize={9}
              opacity={0.7}
            >
              {layer.description}
            </text>
          </g>
        ))}

        {/* Nodes */}
        {positionedNodes.map((node) => {
          const layer = layers.find((l) => l.id === node.layer)!;
          return (
            <g key={node.slug} transform={`translate(${node.x}, ${node.y})`}>
              <circle
                r={nodeRadius(node.tier)}
                fill={layer.color_fg}
                stroke="white"
                strokeWidth={2}
                opacity={node.isDeprecated ? 0.5 : 1}
              />
              <text
                y={nodeRadius(node.tier) + 14}
                textAnchor="middle"
                fontSize={10}
                fill="#222"
                fontWeight="500"
              >
                {node.displayName}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
