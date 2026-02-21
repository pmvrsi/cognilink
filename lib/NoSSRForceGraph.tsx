'use client'; // Required

import dynamic from 'next/dynamic';

const ForceGraph = dynamic(() => import('react-force-graph-2d'), { 
  ssr: false, 
  loading: () => <div>Loading...</div> 
});
export default ForceGraph;

// export default function NoSSRForceGraph({ graphData }: { graphData: GraphData }) {
//   const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
//     const label = node.name || node.id;
//     const fontSize = 12 / globalScale;
//     ctx.font = `${fontSize}px Sans-Serif`;

//     const textWidth = ctx.measureText(label).width;
//     const paddingX = 6 / globalScale;
//     const paddingY = 4 / globalScale;
//     const width = textWidth + paddingX * 2;
//     const height = fontSize + paddingY * 2;
//     const x = node.x - width / 2;
//     const y = node.y - height / 2;
//     const radius = 6 / globalScale; // corner radius

//     // Draw rounded rectangle
//     ctx.beginPath();
//     const r = radius;
//     ctx.moveTo(x + r, y);
//     ctx.lineTo(x + width - r, y);
//     ctx.quadraticCurveTo(x + width, y, x + width, y + r);
//     ctx.lineTo(x + width, y + height - r);
//     ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
//     ctx.lineTo(x + r, y + height);
//     ctx.quadraticCurveTo(x, y + height, x, y + height - r);
//     ctx.lineTo(x, y + r);
//     ctx.quadraticCurveTo(x, y, x + r, y);
//     ctx.closePath();

//     // Fill & stroke
//     ctx.fillStyle = '#2563eb'; // blue
//     ctx.fill();
//     ctx.strokeStyle = '#1d4ed8';
//     ctx.lineWidth = 1 / globalScale;
//     ctx.stroke();

//     // Draw text in the middle
//     ctx.fillStyle = 'white';
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'middle';
//     ctx.fillText(label, node.x, node.y);
//   }, []);

//   return (
//     <ForceGraph2D
//       graphData={graphData}
//       nodeCanvasObject={nodeCanvasObject}
//       nodePointerAreaPaint={nodeCanvasObject} // ensures pointer/hover hits work with custom shape
//       nodeLabel={() => ''} // disable default tooltip label if you want only inline labels
//     />
//   );
// }