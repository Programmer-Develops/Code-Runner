'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({ language, onExecute, onSubmit }) {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleExecute = async () => {
    const result = await onExecute(code, language, input);
    setOutput(result.output);
  };

  const handleSubmit = async () => {
    await onSubmit(code, language, output);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 mb-4">
        <Editor
          height="400px"
          language={language}
          value={code}
          onChange={setCode}
          theme="vs-dark"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Input:</label>
        <textarea
          className="w-full p-2 border rounded"
          rows="3"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Output:</label>
        <textarea
          className="w-full p-2 border rounded bg-gray-100"
          rows="3"
          value={output}
          readOnly
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleExecute}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Run Code
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
