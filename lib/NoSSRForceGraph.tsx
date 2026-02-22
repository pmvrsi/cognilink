'use client';

import dynamic from 'next/dynamic';
import { useRef, useEffect, useState, useCallback } from 'react';

// Dynamically import ForceGraph2D with SSR disabled (it uses browser APIs)
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export interface GraphNode {
  id: number;
  name: string;
  x?: number;
  y?: number;
}

export interface GraphLink {
  source: number;
  target: number;
}

export interface ForceGraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface NoSSRForceGraphProps {
  graphData: ForceGraphData;
  onNodeClick?: (nodeId: number) => void;
}

/**
 * Adjacency-matrix → force-graph converter.
 * Call this on the client (or in the API) before passing data to <NoSSRForceGraph>.
 */
export function adjacencyMatrixToGraphData(
  n: number,
  labels: string[],
  adjacencyMatrix: number[][],
): ForceGraphData {
  const nodes: GraphNode[] = labels.map((name, i) => ({ id: i, name }));
  const links: GraphLink[] = [];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (adjacencyMatrix[i][j] === 1) {
        links.push({ source: i, target: j });
      }
    }
  }

  return { nodes, links };
}

const MAX_LABEL_LENGTH = 22;

function truncateLabel(text: string): string {
  if (text.length <= MAX_LABEL_LENGTH) return text;
  return text.slice(0, MAX_LABEL_LENGTH - 1) + '…';
}

export default function NoSSRForceGraph({ graphData, onNodeClick }: NoSSRForceGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fgRef = useRef<any>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });

  // Keep graph dimensions in sync with container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) setSize({ width, height });
    };
    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Increase repulsion & link distance so nodes spread out, then zoom-to-fit
  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;

    // Stronger repulsion — pushes nodes apart (default is −30)
    fg.d3Force('charge')?.strength(-300);

    // Longer resting link distance (default ≈ 30)
    fg.d3Force('link')?.distance(120);

    // Reheat the simulation so it re-lays-out with the new forces
    fg.d3ReheatSimulation();

    // After the layout stabilises, zoom so the full graph is visible
    const timer = setTimeout(() => fg.zoomToFit(400, 60), 1500);
    return () => clearTimeout(timer);
  }, [graphData]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodeCanvasObject = useCallback(
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const r = 5;
      // Fixed world-space font size — scales proportionally with zoom
      const fontSize = 4;
      const x = node.x ?? 0;
      const y = node.y ?? 0;
      const label = truncateLabel(node.name ?? '');

      // Circle
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fillStyle = '#219ebc';
      ctx.fill();
      ctx.strokeStyle = '#8ecae6';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Label below — only show when zoomed in enough to read
      if (globalScale > 0.35) {
        ctx.font = `${fontSize}px "Ubuntu Mono", monospace`;
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, y + r + fontSize + 2);
      }
    },
    [],
  );

  // Handle node click: call parent callback WITHOUT pinning the node
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNodeClick = useCallback((node: any) => {
    // Clear any fixed position so the node doesn't freeze
    node.fx = undefined;
    node.fy = undefined;
    onNodeClick?.(node.id as number);
  }, [onNodeClick]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        width={size.width}
        height={size.height}
        backgroundColor="transparent"
        nodeColor={() => '#219ebc'}
        nodeRelSize={5}
        nodeLabel={(node: any) => node.name}
        linkColor={() => 'rgba(255,255,255,0.18)'}
        linkWidth={1}
        linkDirectionalArrowLength={5}
        linkDirectionalArrowRelPos={1}
        cooldownTicks={100}
        nodeCanvasObject={nodeCanvasObject}
        nodeCanvasObjectMode={() => 'replace'}
        onNodeClick={handleNodeClick}
      />
    </div>
  );
}
