import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const { chatId, prompt } = await req.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Get chat history from DB
    const data = await Chat.findOne({ userId, _id: chatId });

    // User message
    const userPrompt = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };

    data.messages.push(userPrompt);

    // Gemini API call
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = await response.text();

    // Gemini doesn't return role structure by default, so we manually add it
    const message = {
      role: "model",
      content: text,
      timestamp: Date.now(),
    };

    data.messages.push(message);
    await data.save();

    return NextResponse.json({
      success: true,
      chat: data,
    });

  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
