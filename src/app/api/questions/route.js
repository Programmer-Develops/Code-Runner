import { GoogleGenAI } from '@google/genai';
import connectToDatabase from '@/lib/mongodb';
import Question from '@/models/Question';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Define a strict JSON schema for the generated question
const responseJsonSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    testCases: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          input: { type: 'string' },
          expectedOutput: { type: 'string' },
        },
        required: ['input', 'expectedOutput'],
        additionalProperties: false,
      },
    },
  },
  required: ['title', 'description', 'testCases'],
  additionalProperties: false,
};

export async function POST(request) {
  try {
    const { difficulty, language } = await request.json();

    if (!difficulty || !language) {
      return Response.json({ error: 'Missing difficulty or language' }, { status: 400 });
    }

    await connectToDatabase();

    const model = 'gemini-2.5-flash'; // Current best fast & capable model (stable)

    const prompt = `Generate a coding question for ${difficulty} difficulty in ${language}.
Include a title, description, and exactly 3 test cases with input and expected output.
Respond ONLY with valid JSON matching this exact structure:
{
  "title": "string",
  "description": "string",
  "testCases": [
    { "input": "string", "expectedOutput": "string" },
    ...
  ]
}
Do not add any explanations, markdown, or extra text.`;

    const result = await genAI.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',        // Forces pure JSON (no ```json fences)
        responseJsonSchema,                          // Enforces exact structure
      },
    });

    // result.text is now guaranteed to be valid JSON string
    let generatedQuestion;
    try {
      generatedQuestion = JSON.parse(result.text.trim());
    } catch (parseError) {
      console.error('Failed to parse JSON from Gemini:', result.text);
      return Response.json({ error: 'Invalid JSON from AI' }, { status: 500 });
    }

    // Validate required fields (extra safety)
    if (!generatedQuestion.title || !generatedQuestion.description || !Array.isArray(generatedQuestion.testCases) || generatedQuestion.testCases.length !== 3) {
      console.error('Invalid structure from AI:', generatedQuestion);
      return Response.json({ error: 'AI returned incomplete question' }, { status: 500 });
    }

    // Assign XP based on difficulty
    let xp;
    if (difficulty === 'Easy') {
      xp = Math.floor(Math.random() * 16) + 5; // 5-20
    } else if (difficulty === 'Hard') {
      xp = Math.floor(Math.random() * 40) + 21; // 21-60
    } else {
      xp = Math.floor(Math.random() * 51) + 61; // 61-110 (Medium)
    }

    // Save to database
    const question = new Question({
      title: generatedQuestion.title,
      description: generatedQuestion.description,
      difficulty,
      xp,
      testCases: generatedQuestion.testCases,
      language,
    });

    await question.save();

    return Response.json(question);
  } catch (error) {
    console.error('Error generating question:', error);
    return Response.json({ error: 'Failed to generate question' }, { status: 500 });
  }
}