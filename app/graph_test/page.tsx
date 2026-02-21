'use client';

import { useEffect, useState } from 'react';
import NoSSRForceGraph from '@/lib/NoSSRForceGraph';

export default function Page() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  const rawMatrix = [
    [0, 1, 0],
    [0, 0, 1],
    [1, 0, 0],
  ];
  const labels = ['Linear Algebra', 'Neural Nets', 'Backprop'];

  const processMatrix = async () => {
    const res = await fetch('/api/save-graph', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matrix: rawMatrix, labels }),
    });

    const formattedData = await res.json();
    setGraphData(formattedData);
  };

  // Auto-load on first client render
  useEffect(() => {
    processMatrix();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="h-screen w-full">
      <NoSSRForceGraph graphData={graphData} />
    </main>
  );
}