import { GoogleGenAI, createUserContent, createPartFromUri } from '@google/genai';
import { NextResponse } from 'next/server';

const ADJ_MATRIX_SCHEMA = {
  type: "object",
  properties: {
    n: {
      type: "integer",
      description: "Number of topics"
    },
    labels: {
      type: "array",
      items: { type: "string" },
      description: "1xN array of topic names"
    },
    adjacencyMatrix: {
      type: "array",
      items: {
        type: "array",
        items: { type: "integer" }
      },
      description: "NxN adjacency matrix. adjacencyMatrix[i][j] = 1 means topic i is a prerequisite for topic j."
    }
  },
  required: ["n", "labels", "adjacencyMatrix"]
};

const SYSTEM_PROMPT = `
Key role of the agent: An Agent that helps to organise the students' learning materials into graphs (outputted as an adjacency matrix).
Key instructions: You are given the syllabus and learning materials of a student's course. Try to extract the key topics that the student could learn, and how one topic leads to another (represent them as an arrow), and what topics between the lectures are related (represent them as a double arrow).

Output strictly in the following format, following the json schema:
int n: the number of topics in the syllabus
array label: a 1xn string array which lists the labels (i.e. the topic name)
adjacencymatrix: n by n integer adjacency matrix between the topics


For example,
A document mentions 4 key topics, A, B, C, D. A is pre-requisite of B, and B is pre-requisite to C and D. A and D are related in terms of application.

Example output:
Label: [A, B, C, D]
Adjacency matrix:
[[0,1,0,1],[0,0,1,1],[0,0,0,0],[1,0,0,0]]

Explanation:
A and D points to each other, meaning that it is doubling connected (i.e. related)
A is singly connected to B, so it is a pre-requisite of B
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

        if (!uploaded.uri || !uploaded.mimeType) {
          throw new Error(`Failed to upload file: ${file.name}`);
        }

        return createPartFromUri(uploaded.uri, uploaded.mimeType);
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
