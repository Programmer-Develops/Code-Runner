export async function POST(request) {
  try {
    const { code, language, input } = await request.json();

    // Using Piston API for code execution (free alternative to CodeX)
    const pistonLanguage = language === 'javascript' ? 'js' : language;

    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: pistonLanguage,
        version: language === 'javascript' ? '18.15.0' : '3.10.0',
        files: [{
          content: code
        }],
        stdin: input || '',
        args: [],
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1
      })
    });

    if (!response.ok) {
      throw new Error(`Piston API error: ${response.status}`);
    }

    const result = await response.json();

    if (result.run && result.run.stderr) {
      return Response.json({ output: `Error: ${result.run.stderr}` });
    }

    return Response.json({ output: result.run.stdout || result.run.stderr || 'No output' });
  } catch (error) {
    console.error('Error executing code:', error);
    return Response.json({ output: 'Error executing code. Please try again.' }, { status: 500 });
  }
}
