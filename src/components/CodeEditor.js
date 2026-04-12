'use client';

import Editor from '@monaco-editor/react';

export default function CodeEditor({ language, value, onChange }) {
  const handleEditorDidMount = (editor) => {
    const model = editor.getModel();
    if (model) {
      model.updateOptions({
        insertSpaces: false,
        tabSize: 4,
        indentSize: 4,
      });
    }

    editor.updateOptions({
      autoIndent: 'full',
      insertSpaces: false,
      tabSize: 4,
      detectIndentation: true,
      automaticLayout: true,
    });

    editor.focus();
  };

  return (
    <div className="h-full">
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={onChange}
        theme="vs-dark"
        onMount={handleEditorDidMount}
        options={{
          autoIndent: 'full',
          insertSpaces: false,
          tabSize: 4,
          indentSize: 4,
          detectIndentation: true,
          automaticLayout: true,
          wordWrap: 'on',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastColumn: 0,
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
        }}
      />
    </div>
  );
}
