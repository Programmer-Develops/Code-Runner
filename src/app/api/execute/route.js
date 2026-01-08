import axios from 'axios';

export async function POST(request) {
  try {
    const { code, language, input } = await request.json();

    // Using Judge0 API for code execution
    const response = await axios.post(`${process.env.JUDGE0_BASE_URL}/submissions`, {
      source_code: code,
      language_id: language === 'javascript' ? 63 : 71, // 63 for JS, 71 for Python
      stdin: input,
    }, {
      headers: {
        'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
    });

    const token = response.data.token;

    // Wait for execution result
    let result;
    do {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const statusResponse = await axios.get(`${process.env.JUDGE0_BASE_URL}/submissions/${token}`, {
        headers: {
          'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
      });
      result = statusResponse.data;
    } while (result.status.id <= 2); // 1: In Queue, 2: Processing

    return Response.json({
      output: result.stdout || result.stderr || result.compile_output,
      status: result.status.description,
    });
  } catch (error) {
    console.error('Error executing code:', error);
    return Response.json({ error: 'Failed to execute code' }, { status: 500 });
  }
}