// src/app/api/execute/route.js

import { NextResponse } from 'next/server';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { spawn } from 'child_process';
import { existsSync } from 'fs';

const EXECUTION_TIMEOUT = 5000; // 5 seconds

// JavaScript execution - LeetCode style
async function executeJavaScript(code, input) {
  const tempFile = join(tmpdir(), `code_js_${Date.now()}_${Math.random().toString(36)}.js`);
  
  // Wrap user code to capture the function output
  const sandboxedCode = `
// Capture console output
let consoleOutput = '';
const originalLog = console.log;
console.log = (...args) => {
  const output = args.map(arg => {
    if (typeof arg === 'boolean') return String(arg);
    if (typeof arg === 'object') return JSON.stringify(arg);
    return String(arg);
  }).join(' ');
  consoleOutput += output + '\\n';
  originalLog(...args);
};

// Input data
const INPUT = ${JSON.stringify(input)};

try {
  // User's code
  ${code}
  
  // Output the captured console output (trimmed)
  process.stdout.write(consoleOutput.trim());
} catch (error) {
  process.stderr.write(\`Runtime Error: \${error.message}\\n\${error.stack}\`);
  process.exit(1);
}
`;

  try {
    await writeFile(tempFile, sandboxedCode);
    
    return new Promise((resolve) => {
      const node = spawn('node', [tempFile], {
        timeout: EXECUTION_TIMEOUT,
        killSignal: 'SIGKILL'
      });

      let output = '';
      let errorOutput = '';

      node.stdout.on('data', (data) => {
        output += data.toString();
      });

      node.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      node.on('close', async (code) => {
        await unlink(tempFile).catch(() => {});
        
        if (code === 0) {
          resolve({ success: true, output: output.trim() });
        } else {
          resolve({ success: false, error: errorOutput.trim() });
        }
      });

      node.on('error', async (error) => {
        await unlink(tempFile).catch(() => {});
        resolve({ success: false, error: `Execution Error: ${error.message}` });
      });

      setTimeout(() => {
        node.kill('SIGKILL');
        unlink(tempFile).catch(() => {});
        resolve({ success: false, error: 'Time Limit Exceeded (5 seconds)' });
      }, EXECUTION_TIMEOUT);
    });
  } catch (error) {
    await unlink(tempFile).catch(() => {});
    throw error;
  }
}

// Python execution - LeetCode style
async function executePython(code, input) {
  const tempDir = join(tmpdir(), 'coderunner');
  const tempFile = join(tempDir, `code_py_${Date.now()}_${Math.random().toString(36)}.py`);
  
  try {
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    // Wrap Python code with input handling
    const wrappedCode = `
import sys
import json

# Input data available as INPUT variable
INPUT = ${JSON.stringify(input)}

try:
    # User's code
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
        killSignal: 'SIGKILL'
      });

      let output = '';
      let errorOutput = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      python.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      python.on('close', async (code) => {
        await unlink(tempFile).catch(() => {});
        
        if (code === 0) {
          resolve({ success: true, output: output.trim() });
        } else {
          resolve({ success: false, error: errorOutput.trim() });
        }
      });

      python.on('error', async (error) => {
        await unlink(tempFile).catch(() => {});
        if (error.code === 'ENOENT') {
          resolve({ 
            success: false, 
            error: 'Python is not installed. Download from https://www.python.org/downloads/ and check "Add to PATH" during installation.'
          });
        } else {
          resolve({ success: false, error: `Execution Error: ${error.message}` });
        }
      });

      setTimeout(() => {
        python.kill('SIGKILL');
        unlink(tempFile).catch(() => {});
        resolve({ success: false, error: 'Time Limit Exceeded (5 seconds)' });
      }, EXECUTION_TIMEOUT);
    });
  } catch (error) {
    await unlink(tempFile).catch(() => {});
    throw error;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { code, language, input = '' } = body;

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }

    // Validate code is not empty
    if (code.trim().length === 0) {
      return NextResponse.json({
        output: '',
        status: 'Error',
        error: 'Code cannot be empty'
      });
    }

    let result;

    switch (language.toLowerCase()) {
      case 'javascript':
      case 'js':
        result = await executeJavaScript(code, input);
        break;
      case 'python':
      case 'py':
        result = await executePython(code, input);
        break;
      default:
        return NextResponse.json(
          { error: 'Unsupported language. Use "javascript" or "python"' },
          { status: 400 }
        );
    }

    if (result.success) {
      return NextResponse.json({
        output: result.output,
        status: 'Success'
      });
    } else {
      return NextResponse.json({
        output: result.error,
        status: 'Error'
      });
    }

  } catch (error) {
    console.error('Execution error:', error);
    
    return NextResponse.json({
      output: `Server Error: ${error.message}`,
      status: 'Error'
    }, { status: 500 });
  }
}