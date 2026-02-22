import { GoogleGenAI, createUserContent } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { question, labels, label_summary, adjacencyMatrix } = await req.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const graphContext = labels?.length
      ? `The knowledge graph has ${labels.length} topics.

Topic summaries:
${(labels as string[]).map((l: string, i: number) => `- ${l}: ${label_summary?.[i] ?? ''}`).join('\n')}

Prerequisite relationships:
${(labels as string[]).flatMap((l: string, i: number) =>
  (adjacencyMatrix?.[i] as number[])?.map((v: number, j: number) =>
    v === 1 ? `${l} → ${labels[j]}` : null
  ).filter(Boolean) ?? []
).join('\n') || 'None recorded.'}`
      : 'No graph has been generated yet.';

    const systemPrompt = `You are a helpful study assistant. Answer the student's question using the knowledge graph context below. Draw on the topic summaries to give detailed, accurate answers. Be concise and clear.`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: createUserContent([
        { text: systemPrompt },
        { text: `Graph context:\n${graphContext}\n\nStudent question: ${question}` },
      ]),
    });

    const answer = response.text;
    if (!answer) {
      return NextResponse.json({ error: 'Empty response from Gemini' }, { status: 500 });
    }

    return NextResponse.json({ answer });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Ask API Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
