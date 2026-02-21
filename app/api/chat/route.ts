import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { promises as fs } from 'fs';
import path from 'path';

const adjmatschema = z.object({
  // List of topics / nodes inferred by the model
  nodes: z.array(
    z.object({
      id: z.string(),           // unique identifier for the topic
      label: z.string(),        // human-readable topic name
      // you can add more fields here if you like, e.g. description: z.string().optional()
    })
  ).min(1),

  // Adjacency matrix encoding links between topics.
  // matrix[i][j] represents the link from nodes[i] -> nodes[j].
  adjacencyMatrix: z
    .array(z.array(z.number())) // 0/1 or weight; you can restrict to z.literal(0).or(z.literal(1)) if you want binary
    .superRefine((matrix, ctx) => {
      // Ensure the matrix is square and its size matches the number of nodes.
      // We need access to `nodes`, so we do this check at the object level below.
    }),
})
.superRefine((data, ctx) => {
  const { nodes, adjacencyMatrix } = data;

  const n = nodes.length;

  if (adjacencyMatrix.length !== n) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `adjacencyMatrix must have ${n} rows to match nodes.length`,
      path: ['adjacencyMatrix'],
    });
    return;
  }

  adjacencyMatrix.forEach((row, i) => {
    if (row.length !== n) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Row ${i} of adjacencyMatrix must have length ${n}`,
        path: ['adjacencyMatrix', i],
      });
    }
  });
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // 1) Read multiple local files (demo-only)
    // You can list as many files as you want here
    const filePaths = [
      // "/Users/isaacsze/Desktop/HackLDN 2026/cognilink/resource/test.txt",
    ];

    const fileParts: { fileData: { fileUri: string; mimeType: string } }[] = [];

    for (const filePath of filePaths) {
      try {
        const fileBuffer = await fs.readFile(filePath);
        // Basic MIME type mapping - expand if needed for PDFs, images, etc.
        const ext = path.extname(filePath).toLowerCase();
        let mimeType = 'text/plain'; 
        if (ext === '.pdf') mimeType = 'application/pdf';
        else if (ext === '.png') mimeType = 'image/png';
        else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';

        const uploadResponse = await ai.files.upload({
          file: {
            data: fileBuffer,
            mimeType,
          },
          config: {
            displayName: path.basename(filePath),
            mimeType,
          }
        });

        fileParts.push({
          fileData: {
            fileUri: uploadResponse.file.uri,
            mimeType: uploadResponse.file.mimeType,
          },
        });
      } catch (err) {
        console.warn(`Failed to process file ${filePath}:`, err);
        // Continue with other files if one fails
      }
    }

    // 2) The system prompt
    const systemPrompt = `
Key role of the agent: An Agent that helps to organise the students' learning materials into graphs (outputted as an adjacency matrix).
Key instructions: You are given the syllabus and learning materials of a student's course. Try to extract the key topics that the student could learn, and how one topic leads to another (represent them as an arrow), and what topics between the lectures are related (represent them as a double arrow).

Output strictly in the following format:
n by n integer adjacency matrix between the topics
a 1xn string array which lists the labels (i.e. the topic name)

For example,
A document mentions 4 key topics, A, B, C, D. A is pre-requisite of B, and B is pre-requisite to C and D. A and D are related in terms of application.

Example output:
Label: [A, B, C, D]
Adjacency matrix:
[[0, 1, 0, 1],[0,0,1,1],[0,0,0,0],[1,0,0,0]]

Explanation:
A and D points to each other, meaning that it is doubling connected (i.e. related)
A is singly connected to B, so it is a pre-requisite of B
`;

    // 3) Call Gemini with prompt + all uploaded files
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: systemPrompt + "\n\n" + prompt },
            ...fileParts
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: zodToJsonSchema(adjmatschema),
      },
    });

    console.log(response)

    // You may want to log/inspect what shape Gemini returns once:
    // console.log(JSON.stringify(response, null, 2));

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
