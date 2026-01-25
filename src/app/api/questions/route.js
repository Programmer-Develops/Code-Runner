import { GoogleGenAI } from '@google/genai';
import connectToDatabase from '@/lib/mongodb';
import Question from '@/models/Question';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

    const model = 'gemini-3-flash-preview';  // ← Updated model (more stable + better)

    const prompt = `Generate a unique coding question for ${difficulty} difficulty in ${language}.
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
        responseMimeType: 'application/json',
        responseJsonSchema,
      },
    });

    let generatedQuestion;
    try {
      generatedQuestion = JSON.parse(result.text.trim());
    } catch (parseError) {
      console.error('Failed to parse JSON from Gemini:', result.text);
      return Response.json({ error: 'Invalid JSON from AI' }, { status: 500 });
    }

    if (!generatedQuestion.title || !generatedQuestion.description || !Array.isArray(generatedQuestion.testCases) || generatedQuestion.testCases.length !== 3) {
      console.error('Invalid structure from AI:', generatedQuestion);
      return Response.json({ error: 'AI returned incomplete question' }, { status: 500 });
    }

    let xp;
    if (difficulty === 'Easy') {
      xp = Math.floor(Math.random() * 16) + 5;
    } else if (difficulty === 'Hard') {
      xp = Math.floor(Math.random() * 40) + 21;
    } else {
      xp = Math.floor(Math.random() * 51) + 61;
    }

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