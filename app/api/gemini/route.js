// app/api/gemini/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    // 1. Parse the request body from the frontend
    const { prompt } = await req.json();

    // 2. Initialize the model (Gemini 2.5 Flash is great for speed)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 3. Generate content
    const result = await model.generateContent(prompt || "Say hello world!");
    const response = await result.response;
    const text = response.text();

    // 4. Return the data to the frontend
    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}