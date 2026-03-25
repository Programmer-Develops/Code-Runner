// src/app/api/execute/route.js
import { NextResponse } from 'next/server';
import { writeFile, unlink, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

export const runtime = 'nodejs';        // ← VERY IMPORTANT for Vercel
export const dynamic = 'force-dynamic'; // Prevents static optimization issues

const EXECUTION_TIMEOUT = 5000; // 5 seconds

// JavaScript execution
async function executeJavaScript(code, input) {
  const tempFile = join(tmpdir(), `code_js_${Date.now()}_${Math.random().toString(36)}.js`);

  const sandboxedCode = `
// Capture console output
let consoleOutput = '';
const originalLog = console.log;
console.log = (...args) => {
  const output = args.map(arg => {
    if (typeof arg === 'boolean') return String(arg);
    if (typeof arg === 'object' && arg !== null) return JSON.stringify(arg);
    return String(arg);
  }).join(' ');
  consoleOutput += output + '\\n';
  originalLog(...args);
};

const INPUT = ${JSON.stringify(input)};

try {
  ${code}
  process.stdout.write(consoleOutput.trim());
} catch (error) {
  process.stderr.write(\`Runtime Error: \${error.message}\\n\${error.stack || ''}\`);
  process.exit(1);
}
`;

  try {
    await writeFile(tempFile, sandboxedCode);

    return new Promise((resolve) => {
      const node = spawn('node', [tempFile], {
        timeout: EXECUTION_TIMEOUT,
        killSignal: 'SIGKILL',
      });

      let output = '';
      let errorOutput = '';

      node.stdout.on('data', (data) => { output += data.toString(); });
      node.stderr.on('data', (data) => { errorOutput += data.toString(); });

      node.on('close', async (code) => {
        await unlink(tempFile).catch(() => {});
        resolve({
          success: code === 0,
          output: output.trim(),
          error: errorOutput.trim() || null,
        });
      });

      node.on('error', async (err) => {
        await unlink(tempFile).catch(() => {});
        resolve({ success: false, error: `Execution Error: ${err.message}` });
      });

      // Extra safety timeout
      setTimeout(() => {
        node.kill('SIGKILL');
        unlink(tempFile).catch(() => {});
        resolve({ success: false, error: 'Time Limit Exceeded (5 seconds)' });
      }, EXECUTION_TIMEOUT + 500);
    });
  } catch (error) {
    await unlink(tempFile).catch(() => {});
    throw error;
  }
}

// Python execution
async function executePython(code, input) {
  const tempDir = join(tmpdir(), 'coderunner');
  const tempFile = join(tempDir, `code_py_${Date.now()}_${Math.random().toString(36)}.py`);

  try {
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    const wrappedCode = `
import sys
import json

INPUT = ${JSON.stringify(input)}

try:
${code.split('\n').map(line => '    ' + line).join('\n')}
except Exception as e:
    print(f"Runtime Error: {str(e)}", file=sys.stderr)
    import traceback
    traceback.print_exc()
    sys.exit(1)
`;

    await writeFile(tempFile, wrappedCode);

    return new Promise((resolve) => {
      const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
      const python = spawn(pythonCmd, ['-u', tempFile], {
        timeout: EXECUTION_TIMEOUT,
        killSignal: 'SIGKILL',
      });

      let output = '';
      let errorOutput = '';

      python.stdout.on('data', (data) => { output += data.toString(); });
      python.stderr.on('data', (data) => { errorOutput += data.toString(); });

      python.on('close', async (code) => {
        await unlink(tempFile).catch(() => {});
        resolve({
          success: code === 0,
          output: output.trim(),
          error: errorOutput.trim() || null,
        });
      });

      python.on('error', async (err) => {
        await unlink(tempFile).catch(() => {});
        resolve({
          success: false,
          error: err.code === 'ENOENT'
            ? 'Python is not installed on the server.'
            : `Execution Error: ${err.message}`,
        });
      });

      setTimeout(() => {
        python.kill('SIGKILL');
        unlink(tempFile).catch(() => {});
        resolve({ success: false, error: 'Time Limit Exceeded (5 seconds)' });
      }, EXECUTION_TIMEOUT + 500);
    });
  } catch (error) {
    await unlink(tempFile).catch(() => {});
    throw error;
  }
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

    let result;
    const lang = language.toLowerCase();

    if (lang === 'javascript' || lang === 'js') {
      result = await executeJavaScript(code, input);
    } else if (lang === 'python' || lang === 'py') {
      result = await executePython(code, input);
    } else {
      return NextResponse.json({ error: 'Unsupported language. Use "javascript" or "python"' }, { status: 400 });
    }

    return NextResponse.json({
      output: result.success ? result.output : result.error,
      status: result.success ? 'Success' : 'Error',
    });

  } catch (error) {
    console.error('Execution error:', error);
    return NextResponse.json({
      output: `Server Error: ${error.message}`,
      status: 'Error',
    }, { status: 500 });
  }
}