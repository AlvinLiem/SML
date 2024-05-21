// src/app/api/chat/route.js
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { message } = await request.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    return NextResponse.json({
      text: response.choices[0].message.content.trim(),
    });
  } catch (error) {
    console.error("Error fetching OpenAI response:", error);

    let errorMessage = "Failed to fetch response from OpenAI";
    if (error.code === "insufficient_quota") {
      errorMessage =
        "You have exceeded your API quota. Please check your plan and billing details.";
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
