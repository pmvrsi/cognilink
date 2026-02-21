import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { matrix, labels } = await req.json();

    // 1. Create Nodes
    const nodes = labels.map((name: string, i: number) => ({
      id: i,
      name: name,
    }));

    // 2. Create Links from the Adjacency Matrix
    const links: { source: number; target: number }[] = [];
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1) {
          links.push({ source: i, target: j });
        }
      }
    }

    // 3. Return the formatted graph data to the frontend
    return NextResponse.json({ nodes, links });
  } catch (error) {
    return NextResponse.json({ error: 'Formatting failed' }, { status: 500 });
  }
}