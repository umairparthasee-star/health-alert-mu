import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

interface SymptomMessage {
    role: 'user' | 'model';
    text: string;
}

interface GeminiHistoryMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

interface SymptomRequestBody {
    messages: SymptomMessage[];
    ageGroup?: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as SymptomRequestBody;
        const { messages, ageGroup } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { success: false, message: "Chat history is required." },
                { status: 400 }
            );
        }

        // 🛡️ Filter greeting so history always starts with a 'user' turn
        const userStartIndex = messages.findIndex(msg => msg.role === 'user');
        if (userStartIndex === -1) {
            return NextResponse.json(
                { success: false, message: "No user message found to start conversation." },
                { status: 400 }
            );
        }
        
        const apiHistory = messages.slice(userStartIndex);

        // 🛡️ Force a strict, quick alternating sequence
        const alternatingHistory: GeminiHistoryMessage[] = [];
        let expectedRole: SymptomMessage['role'] = 'user';

        for (const msg of apiHistory) {
            const currentRole = msg.role === 'user' ? 'user' : 'model';
            if (currentRole === expectedRole) {
                alternatingHistory.push({
                    role: currentRole,
                    parts: [{ text: msg.text }]
                });
                expectedRole = expectedRole === 'user' ? 'model' : 'user';
            }
        }

        if (alternatingHistory.length > 0 && alternatingHistory[alternatingHistory.length - 1].role === 'model') {
            alternatingHistory.pop();
        }

        const systemInstruction = `
            You are "Health Alert Mauritius AI Companion".
            The user belongs to this age group: "${ageGroup || '13-65'}".
            
            CRITICAL RULE 1: ON-TOPIC GUARDRAILS
            - If the user asks about anything unrelated to physical health (e.g., cooking, code, jokes, pizza), reply with exactly this message and stop:
              "I am sorry, but I am designed only to assist with public health inquiries, symptoms, and prevention tips in Mauritius. Please provide health-related symptoms."
            
            CRITICAL RULE 2: ALLOWED DISEASES
            - You can only address: Chikungunya, Dengue, Leptospirosis, Influenza (Flu), and Common Cold. Never mention others.
            
            CRITICAL RULE 3: TRIAGE FLOW (MAX 2 SENTENCES PER TURN)
            - Keep your responses extremely direct to prevent latency.
            - If details are short, ask exactly ONE short follow-up question (e.g., "Where is the pain, and do you have a fever?").
            - If they provide enough details, briefly name the risk among our 5 allowed diseases, give 1 next step, and tell them to visit a hospital if it worsens.
            - Never use bullet points or lists. 
        `;

        // ⚡ Using gemini-3.1-flash-lite for instant, real-time responses
        const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite', 
            contents: alternatingHistory,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.1, // Drastically cuts down thinking time
            }
        });

        return NextResponse.json({
            success: true,
            reply: response.text
        });

    } catch (error: unknown) {
        console.error("Gemini API Error Detail:", error);
        const message = error instanceof Error ? error.message : "Failed to process chat with AI.";
        return NextResponse.json(
            { success: false, message },
            { status: 500 }
        );
    }
}