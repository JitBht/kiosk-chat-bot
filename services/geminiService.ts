import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { BotResponse } from '../types';
import { BotResponseType } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        responseType: {
            type: Type.STRING,
            enum: [BotResponseType.CONTINUE_CONVERSATION, BotResponseType.SUGGEST_MEDICINE, BotResponseType.SUGGEST_LAB_TEST, BotResponseType.SUGGEST_CONSULTATION],
            description: "Classify your response type. Use 'CONTINUE_CONVERSATION' if you need more information. Use 'SUGGEST_MEDICINE' for mild cases, 'SUGGEST_LAB_TEST' for persistent but non-urgent issues, and 'SUGGEST_CONSULTATION' for severe symptoms.",
        },
        message: {
            type: Type.STRING,
            description: "A friendly, empathetic message for the user. If asking a question, make it clear. It MUST end with the disclaimer: 'Please remember, I am an AI assistant, not a medical professional. My suggestions are not a substitute for professional medical advice. Always consult a doctor or pharmacist for any health concerns.'",
        },
        suggestions: {
            type: Type.ARRAY,
            description: "A list of general over-the-counter medicines. Should be empty unless responseType is 'SUGGEST_MEDICINE'.",
            items: {
                type: Type.STRING
            }
        },
        labTests: {
            type: Type.ARRAY,
            description: "A list of suggested lab tests. Should be empty unless responseType is 'SUGGEST_LAB_TEST'.",
            items: {
                type: Type.STRING
            }
        }
    },
    required: ["responseType", "message"]
};

const systemInstruction = `You are MediBot, a friendly, humble, and positive AI assistant in a medical kiosk.
Your goal is to have a natural, empathetic conversation with the user to understand their symptoms thoroughly before providing any suggestion. You are not a doctor and you must make this clear in every response.

Conversation Flow:
1.  If the user's message is vague (e.g., "I feel sick", "headache"), ask clarifying questions to get more details. Examples: "I'm sorry to hear that. To help me understand, could you tell me more about your symptoms?", "How long has this been happening?", "Can you describe the pain?", "Do you have other symptoms like fever or nausea?". Your responseType should be 'CONTINUE_CONVERSATION'.
2.  Continue the conversation, gathering information about symptom duration, severity, type of pain, accompanying symptoms, etc.
3.  Once you have a clear and sufficient understanding of the user's condition, you must make a final recommendation.

Recommendation categories:
-   'SUGGEST_MEDICINE': For MILD and well-defined symptoms (e.g., common cold, runny nose, slight headache, minor muscle ache). Suggest common over-the-counter medicines.
-   'SUGGEST_LAB_TEST': For symptoms that are persistent, recurring, but not immediately life-threatening (e.g., prolonged fatigue, unexplained weight loss, chronic digestive issues). Suggest relevant lab tests.
-   'SUGGEST_CONSULTATION': For SEVERE or concerning symptoms (e.g., chest pain, difficulty breathing, high fever for multiple days, severe abdominal pain, confusion, uncontrolled bleeding, numbness, sudden vision changes). DO NOT suggest medicine. Strongly recommend an immediate doctor consultation.

Important Rules:
- Your response MUST ALWAYS be in the provided JSON format.
- Every 'message' you generate MUST end with the disclaimer: "Please remember, I am an AI assistant, not a medical professional. My suggestions are not a substitute for professional medical advice. Always consult a doctor or pharmacist for any health concerns."
- Maintain a caring, empathetic, and reassuring tone throughout the conversation.`;

let chat: Chat | null = null;

function getChatSession(): Chat {
    if (!chat) {
        console.log("Creating new chat session.");
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.5,
            }
        });
    }
    return chat;
}

export const sendChatMessage = async (userInput: string): Promise<BotResponse> => {
    try {
        const chatSession = getChatSession();
        const response = await chatSession.sendMessage({ message: userInput });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);

        // Basic validation
        if (!parsedResponse.responseType || !parsedResponse.message) {
            throw new Error("Invalid response format from API");
        }
        
        return parsedResponse as BotResponse;

    } catch (error) {
        console.error("Error fetching bot response:", error);
        // Fallback response
        return {
            responseType: BotResponseType.SUGGEST_CONSULTATION,
            message: "I'm having some trouble processing that right now. It's always safest to consult with a healthcare professional for any medical concerns. Please see a doctor to be sure. Please remember, I am an AI assistant, not a medical professional. My suggestions are not a substitute for professional medical advice. Always consult a doctor or pharmacist for any health concerns."
        };
    }
};