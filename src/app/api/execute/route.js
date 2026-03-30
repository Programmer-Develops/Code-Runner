import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Judge0 CE public instance — free, no API key needed
const JUDGE0_URL = 'https://ce.judge0.com';

const LANGUAGE_IDS = {
  python:     71,  // Python 3.8.1
  py:         71,
  javascript: 63,  // Node.js 12.14.0
  js:         63,
};

async function submitCode(sourceCode, languageId, stdin) {
  const res = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source_code:     sourceCode,
      language_id:     languageId,
      stdin:           stdin || '',
      cpu_time_limit:  5,
      memory_limit:    128000,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Judge0 submit failed: ${res.status} — ${txt}`);
  }

  const data = await res.json();
  return data.token;
}

async function pollResult(token, maxAttempts = 20) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 600)); // wait 600ms between polls

    const res = await fetch(
      `${JUDGE0_URL}/submissions/${token}?base64_encoded=false&fields=status,stdout,stderr,compile_output`,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (!res.ok) throw new Error(`Judge0 poll failed: ${res.status}`);

    const data = await res.json();
    const statusId = data.status?.id;

    if (statusId <= 2) continue; // 1=In Queue, 2=Processing — keep waiting

    return data;
  }

  throw new Error('Timed out waiting for Judge0');
}

function parseResult(result) {
  const statusId = result.status?.id;

  if (statusId === 3) {
    // Accepted
    return { success: true, output: result.stdout?.trim() || '' };
  }

  if (statusId === 5) {
    return { success: false, error: 'Time Limit Exceeded (5 seconds)' };
  }

  if (statusId === 6) {
    return {
      success: false,
      error: `Compilation Error:\n${result.compile_output?.trim() || 'Unknown compilation error'}`,
    };
  }

  if (statusId >= 7 && statusId <= 12) {
    return {
      success: false,
      error: `Runtime Error:\n${result.stderr?.trim() || result.stdout?.trim() || 'No output'}`,
    };
  }

  // Anything else — return whatever output exists
  return {
    success: true,
    output: result.stdout?.trim() || result.stderr?.trim() || `Status: ${result.status?.description}`,
  };
}

export async function POST(request) {
  try {
    const { code, language, input = '' } = await request.json();

    if (!code || !language) {
      return NextResponse.json({ error: 'Code and language are required' }, { status: 400 });
    }

    if (code.trim().length === 0) {
      return NextResponse.json({ output: '', status: 'Error', error: 'Code cannot be empty' });
    }

    const languageId = LANGUAGE_IDS[language.toLowerCase()];
    if (!languageId) {
      return NextResponse.json(
        { error: 'Unsupported language. Use "javascript" or "python"' },
        { status: 400 }
      );
    }

    const token  = await submitCode(code, languageId, input);
    const result = await pollResult(token);
    const parsed = parseResult(result);

    return NextResponse.json({
      output: parsed.success ? parsed.output : parsed.error,
      status: parsed.success ? 'Success' : 'Error',
    });

  } catch (error) {
    console.error('Execute route error:', error);
    return NextResponse.json(
      { output: `Server Error: ${error.message}`, status: 'Error' },
      { status: 500 }
    );
  }
}