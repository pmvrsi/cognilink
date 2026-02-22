import { GoogleGenAI, createUserContent, createPartFromUri } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const question       = formData.get('question') as string;
    const labelsRaw      = formData.get('labels') as string | null;
    const summariesRaw   = formData.get('label_summary') as string | null;
    const matrixRaw      = formData.get('adjacencyMatrix') as string | null;
    const files          = formData.getAll('files') as File[];

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const labels:          string[]    = labelsRaw    ? JSON.parse(labelsRaw)    : [];
    const label_summary:   string[]    = summariesRaw ? JSON.parse(summariesRaw) : [];
    const adjacencyMatrix: number[][]  = matrixRaw    ? JSON.parse(matrixRaw)    : [];

    const graphContext = labels.length
      ? `The knowledge graph extracted from the document has ${labels.length} topics: ${labels.join(', ')}.

Topic summaries:
${labels.map((l, i) => `- ${l}: ${label_summary[i] ?? ''}`).join('\n')}

Prerequisite relationships:
${labels.flatMap((l, i) =>
  adjacencyMatrix[i]?.map((v, j) => v === 1 ? `${l} → ${labels[j]}` : null).filter(Boolean) ?? []
).join('\n') || 'None recorded.'}
`
      : 'No graph has been generated yet.';

    const systemPrompt = `You are a helpful study assistant. A student is asking questions about their study material. You have access to the full document they uploaded as well as a knowledge graph summarising its key topics and prerequisite relationships. Answer the student's question using the document content as your primary source, and reference the graph structure where relevant. Be concise and clear.`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    // Upload any attached files so Gemini can read the full document
    const fileParts = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: file.type });

        const uploaded = await ai.files.upload({
          file: blob,
          config: { mimeType: file.type, displayName: file.name },
        });

        const uri      = uploaded.uri      ?? (uploaded as any).file?.uri;
        const mimeType = uploaded.mimeType ?? (uploaded as any).file?.mimeType;

        if (!uri || !mimeType) throw new Error(`Failed to upload file: ${file.name}`);
        return createPartFromUri(uri, mimeType);
      })
    );

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: createUserContent([
        { text: systemPrompt },
        { text: `Graph context:\n${graphContext}` },
        ...fileParts,
        { text: `Student question: ${question}` },
      ]),
    });

    const answer = response.text;
    if (!answer) {
      return NextResponse.json({ error: 'Empty response from Gemini' }, { status: 500 });
    }

    return NextResponse.json({ answer });

  } catch (error) {
    console.error('Ask API Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
