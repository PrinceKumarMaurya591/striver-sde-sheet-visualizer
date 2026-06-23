import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { generateLocalTrace } from "./src/utils/localTraceEngine";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// ──────────────────────────────────────────────
// Configuration: decide whether to use Gemini API or local tracer
// Set USE_LOCAL_TRACER=true in .env to skip Gemini API entirely
// ──────────────────────────────────────────────
const USE_LOCAL_TRACER = process.env.USE_LOCAL_TRACER === "true";

// Safe lazy getter to prevent crashing on module load if GEMINI_API_KEY is not set yet.
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please set your Gemini API key in the Settings menu.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

/**
 * Attempt to generate traces using the Gemini API.
 */
async function generateWithGemini(
  problemTitle: string,
  codeSnippet: string,
  customInput: string,
  constraints?: string
): Promise<{ steps: any[] }> {
  const ai = getAiClient();

  const promptMessage = `
You are an expert DSA (Data Structures and Algorithms) visualizer assistant.
A user wants to visualize the step-by-step trace of solving this problem:
Problem: ${problemTitle}
Code Snippet being run (if any):
\`\`\`
${codeSnippet || "No custom code provided (fallback to standard optimal solution)"}
\`\`\`
Custom input array or parameters provided by user:
${customInput || "Determine a default moderate-sized visualizable input"}
Constraints or context:
${constraints || "None"}

Please execute a clean Dry Run of this algorithm on the given input, step-by-step.
Generate a structured sequence of execution states (limit to max 15 key steps for visual clarity and token budget).
At each step, specify:
1. "stepNumber": numerical 1-indexed.
2. "explanation": a clear, beginner-friendly sentence detailing what the algorithm does at this exact step (e.g., "Swapping elements at index 1 and index 3 because mid and high crossed").
3. "codeHighlightLine": an approximate line number in the user's code to highlight (if code is provided), otherwise use 1-indexed mock line numbers corresponding to important logic points.
4. "variablesState": a key-value dictionary showing the current state of critical trackers, variables, or pointers (e.g., "{ 'i': 0, 'j': 1, 'candidate': 5 }"). Values should be simple types or strings.
5. "arrayState": a flat list of integers, characters, or strings, representing the dynamic array values at this step (this is useful to visualize array sorting, binary searches, or swaps). If not applicable, return an empty array.
6. "activeIndices": an array of integer indices currently being queried, swapped, or pointed to at this step (e.g. "[1, 3]").
7. "pointerLabels": a key-value mapping of array indices to the labels/names of the pointers resting there (e.g., "{ '0': 'low', '3': 'mid/high' }"). Keep key as indices strings.

Be precise. Ensure that 'arrayState' shows actual modifications if the step performs an swap, insertion, or update.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: promptMessage,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        required: ["steps"],
        properties: {
          steps: {
            type: Type.ARRAY,
            description: "The chronologically ordered list of steps tracing the algorithm execution",
            items: {
              type: Type.OBJECT,
              required: [
                "stepNumber",
                "explanation",
                "codeHighlightLine",
                "variablesState",
                "arrayState",
                "activeIndices",
                "pointerLabels",
              ],
              properties: {
                stepNumber: {
                  type: Type.INTEGER,
                  description: "1-indexed chronologically advancing count of the execution trace list.",
                },
                explanation: {
                  type: Type.STRING,
                  description: "Detailed step level trace text explaining what changed.",
                },
                codeHighlightLine: {
                  type: Type.INTEGER,
                  description: "Line number of the associated instruction block to highlight.",
                },
                variablesState: {
                  type: Type.OBJECT,
                  description: "State variables in current scope.",
                },
                arrayState: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Dynamic array value trace if applicable.",
                },
                activeIndices: {
                  type: Type.ARRAY,
                  items: { type: Type.INTEGER },
                  description: "Array indices that are actively highlighted.",
                },
                pointerLabels: {
                  type: Type.OBJECT,
                  description: "Label overlays on indices for visual pointer representations (e.g., { '0': 'start', '3': 'end' })",
                },
              },
            },
          },
        },
      },
    },
  });

  const bodyText = response.text;
  if (!bodyText) {
    throw new Error("No response content generated by Gemini API");
  }

  return JSON.parse(bodyText.trim());
}

/**
 * Generate traces locally without any external API dependency.
 */
function generateLocally(
  problemTitle: string,
  codeSnippet: string,
  customInput: string
): { steps: any[] } {
  const steps = generateLocalTrace(problemTitle, codeSnippet, customInput);
  return { steps };
}

// AI DSA Co-Pilot visualization trace generator endpoint
app.post("/api/ai-visualize", async (req, res) => {
  try {
    const { problemTitle, codeSnippet, customInput, constraints } = req.body;

    if (!problemTitle) {
      return res.status(400).json({ error: "problemTitle is required" });
    }

    // Mode 1: Force local tracer (no API key needed)
    if (USE_LOCAL_TRACER) {
      console.log(`[Trace] Using LOCAL tracer for "${problemTitle}" (USE_LOCAL_TRACER=true)`);
      const result = generateLocally(problemTitle, codeSnippet, customInput);
      return res.json(result);
    }

    // Mode 2: Try Gemini API first, fall back to local tracer on failure
    try {
      console.log(`[Trace] Attempting Gemini API for "${problemTitle}"...`);
      const result = await generateWithGemini(problemTitle, codeSnippet, customInput, constraints);
      console.log(`[Trace] Gemini API succeeded for "${problemTitle}"`);
      return res.json(result);
    } catch (geminiError: any) {
      const isGeminiDown =
        geminiError.message?.includes("503") ||
        geminiError.message?.includes("UNAVAILABLE") ||
        geminiError.message?.includes("high demand") ||
        geminiError.message?.includes("RESOURCE_EXHAUSTED") ||
        geminiError.message?.includes("rate limit") ||
        geminiError.message?.includes("quota") ||
        geminiError.message?.includes("429") ||
        geminiError.message?.includes("API key") ||
        geminiError.message?.includes("GEMINI_API_KEY");

      console.warn(
        `[Trace] Gemini API failed for "${problemTitle}": ${geminiError.message}` +
          (isGeminiDown ? " → Falling back to LOCAL tracer." : " → Returning error.")
      );

      if (isGeminiDown) {
        // Graceful fallback to local tracer
        const result = generateLocally(problemTitle, codeSnippet, customInput);
        return res.json({
          ...result,
          _fallback: true,
          _info: "Local trace generated (Gemini API was unavailable). This trace uses a simulated execution engine.",
        });
      }

      // For other errors (e.g., invalid input), surface the error
      throw geminiError;
    }
  } catch (error: any) {
    console.error("Trace generation error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate visualization trace" });
  }
});

// Mount Vite Dev Server in Non-Production Mode, or static handler in Production mode
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Development Server running on http://localhost:${PORT}`);
  });
}

start();
