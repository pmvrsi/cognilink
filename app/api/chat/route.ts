import { GoogleGenAI, createUserContent, createPartFromUri } from '@google/genai';
import { NextResponse } from 'next/server';

const ADJ_MATRIX_SCHEMA = {
  type: "object",
  properties: {
    n: {
      type: "integer",
      description: "Exact number of topics. Must equal labels.length."
    },
    labels: {
      type: "array",
      items: { type: "string" },
      description: "Array of n topic names. Length must equal n."
    },
    adjacencyMatrix: {
      type: "array",
      items: {
        type: "array",
        items: {
          type: "integer",
          enum: [0, 1]
        }
      },
      description: "n×n matrix of 0s and 1s. adjacencyMatrix[i][j]=1 means topic i is a prerequisite for topic j. No bidirectional entries (i.e. if [i][j]=1 then [j][i] must be 0)."
    }
  },
  required: ["n", "labels", "adjacencyMatrix"]
};

const SYSTEM_PROMPT = `
You are an AI agent that organises student learning materials into a knowledge graph represented as an adjacency matrix.

Given a syllabus or set of lecture slides, extract the key topics and identify ONLY prerequisite relationships between them (i.e. topic A must be learned before topic B).

Rules:
- Only encode prerequisite relationships. Do NOT encode bidirectional "related" links.
- adjacencyMatrix[i][j] = 1 means topic i is a prerequisite for topic j.
- adjacencyMatrix[i][j] = 0 otherwise.
- The matrix must be strictly n×n where n = labels.length.
- The matrix must have no entry where both [i][j]=1 and [j][i]=1 (no cycles).

Example: 4 topics A, B, C, D. A is a prerequisite of B. B is a prerequisite of C and D.
Output:
{
  "n": 4,
  "labels": ["A", "B", "C", "D"],
  "adjacencyMatrix": [[0,1,0,0],[0,0,1,1],[0,0,0,0],[0,0,0,0]]
}

You MUST output valid JSON matching the schema exactly. Do not include any explanation outside the JSON.
`;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const prompt = formData.get('prompt') as string;
    const files = formData.getAll('files') as File[];

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    // Upload all files to Gemini Files API and collect their URIs
    const uploadedFileParts = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: file.type });

        const uploaded = await ai.files.upload({
          file: blob,
          config: { mimeType: file.type, displayName: file.name },
        });

        // The SDK returns the file metadata at the top level (uri, mimeType)
        const uri      = uploaded.uri      ?? (uploaded as any).file?.uri;
        const mimeType = uploaded.mimeType ?? (uploaded as any).file?.mimeType;

        if (!uri || !mimeType) {
          throw new Error(`Failed to upload file: ${file.name}`);
        }

        return createPartFromUri(uri, mimeType);
      })
    );

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: createUserContent([
        { text: SYSTEM_PROMPT },
        { text: prompt },
        ...uploadedFileParts,  // Attach uploaded files here
      ]),
      config: {
        responseMimeType: 'application/json',
        responseSchema: ADJ_MATRIX_SCHEMA,
      },
    });

    const raw = response.text;
    if (!raw) {
      return NextResponse.json({ error: 'Empty response from Gemini' }, { status: 500 });
    }

    // Parse and do a basic sanity check before returning
    const parsed = JSON.parse(raw);
    if (
      parsed.labels.length !== parsed.n ||
      parsed.adjacencyMatrix.length !== parsed.n ||
      parsed.adjacencyMatrix.some((row: number[]) => row.length !== parsed.n)
    ) {
      console.error('Gemini returned malformed matrix:', parsed);
      return NextResponse.json({ error: 'Malformed graph from model' }, { status: 500 });
    }

    return NextResponse.json(parsed);

  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
