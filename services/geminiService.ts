import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisReport } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        // --- Foundational Metrics ---
        loadSpeed: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.INTEGER, description: "A score from 0 to 100 for load speed." },
                fcp: { type: Type.NUMBER, description: "First Contentful Paint in seconds." },
                lcp: { type: Type.NUMBER, description: "Largest Contentful Paint in seconds." },
                cls: { type: Type.NUMBER, description: "Cumulative Layout Shift score." },
            },
        },
        accessibility: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.INTEGER, description: "A score from 0 to 100 for accessibility." },
                issues: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            issue: { type: Type.STRING },
                            explanation: { type: Type.STRING },
                            recommendation: { type: Type.STRING },
                        },
                    },
                },
            },
        },
        popupBehavior: {
            type: Type.OBJECT,
            properties: {
                popups: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING },
                            trigger: { type: Type.STRING },
                            intrusiveness: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                        },
                    },
                },
            },
        },
        // --- Advanced Behavioral Analytics ---
        dashboard: {
            type: Type.OBJECT,
            properties: {
                totalSessions: { type: Type.INTEGER, description: "Total user sessions for a typical period."},
                bounceRate: { type: Type.NUMBER, description: "Bounce rate as a percentage."},
                avgSessionDuration: { type: Type.INTEGER, description: "Average session duration in seconds."},
                deviceBreakdown: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, enum: ['Desktop', 'Tablet', 'Mobile'] },
                            value: { type: Type.INTEGER, description: "Percentage for this device type." },
                        },
                    },
                },
            },
        },
        heatmaps: {
            type: Type.ARRAY,
            description: "Generate one of each type: click, scroll, and move.",
            items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING, enum: ['click', 'scroll', 'move'] },
                    points: {
                        type: Type.ARRAY,
                        description: "Generate 20-30 points for a realistic distribution.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                x: { type: Type.NUMBER, description: "X-coordinate as a percentage (0-100)." },
                                y: { type: Type.NUMBER, description: "Y-coordinate as a percentage (0-100)." },
                                intensity: { type: Type.NUMBER, description: "Intensity from 0.0 to 1.0." },
                            },
                        },
                    },
                    aiSummary: { type: Type.STRING, description: "A concise summary of what the heatmap data suggests." },
                },
            },
        },
        conversionFunnel: {
            type: Type.OBJECT,
            properties: {
                steps: {
                    type: Type.ARRAY,
                    description: "Define a plausible 4-step user funnel (e.g., Homepage -> Product Page -> Add to Cart -> Checkout).",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: "Name of the funnel step." },
                            userCount: { type: Type.INTEGER, description: "Number of users reaching this step." },
                        },
                    },
                },
                aiSummary: { type: Type.STRING, description: "A summary of funnel performance, highlighting major drop-off points." },
            },
        },
        usabilityTests: {
            type: Type.ARRAY,
            description: "Generate data for 2 simulated usability tests with different participants.",
            items: {
                type: Type.OBJECT,
                properties: {
                    participant: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING, description: "A unique participant ID, e.g., 'P12345'."},
                            location: { type: Type.STRING, description: "e.g., 'New York, USA'" },
                            device: { type: Type.STRING, description: "e.g., 'iPhone 14'" },
                            demographics: { type: Type.STRING, description: "e.g., 'Age 25-34, Tech Enthusiast'" },
                        },
                    },
                    transcript: { type: Type.STRING, description: "A 100-150 word transcript of the user thinking aloud." },
                    highlightReel: {
                        type: Type.ARRAY,
                        description: "Create 2-3 highlight moments from the transcript.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                timestamp: { type: Type.STRING, description: "e.g., '0:45'" },
                                quote: { type: Type.STRING, description: "A key quote from the user." },
                                tag: { type: Type.STRING, enum: ['Frustration', 'Discovery', 'Success', 'Confusion'] },
                                aiSummary: { type: Type.STRING, description: "A one-sentence summary of this moment's importance." },
                            },
                        },
                    },
                    aiOverallSummary: { type: Type.STRING, description: "An overall summary of this user's test session." },
                },
            },
        },
    },
    required: ["loadSpeed", "accessibility", "popupBehavior", "dashboard", "heatmaps", "conversionFunnel", "usabilityTests"]
};

export const auditWebsite = async (url: string): Promise<AnalysisReport> => {
  try {
    const prompt = `
      You are a world-class AI UX Analytics Platform. Your task is to perform a simulated, comprehensive analysis of the webpage at the URL: "${url}".
      Based on your extensive knowledge of web patterns and best practices, generate a realistic and detailed UX report.
      Do not access the URL. Instead, generate plausible data that a typical website of its kind might have.
      The report MUST cover: Foundational Metrics (Load Speed, Accessibility, Pop-ups), a main Dashboard, Heatmaps (click, scroll, move), a Conversion Funnel, and two simulated Usability Tests.
      Ensure the generated data tells a coherent story. For example, a high drop-off rate in the funnel should correlate with user frustration in the usability tests and confusing click patterns on the heatmap.
      Your response must be a valid JSON object that conforms to the provided schema.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    // Basic validation to ensure the structure matches AnalysisReport
    if (result.loadSpeed && result.accessibility && result.usabilityTests) {
        return result as AnalysisReport;
    } else {
        throw new Error("Invalid data structure received from API.");
    }

  } catch (error) {
    console.error("Error auditing website:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate UX audit: ${error.message}`);
    }
    throw new Error("An unknown error occurred during the UX audit.");
  }
};
