// src/app/question/page.js
'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function QuestionPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const difficulty = searchParams.get('difficulty');
  const language = searchParams.get('language');

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [executing, setExecuting] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [activeTab, setActiveTab] = useState('testcases');

  // Initialize code template based on language
  useEffect(() => {
    if (language && question) {
      const templates = {
        javascript: `// Write your solution here
function solution(str) {
    // Your code here
    
}

// Test with INPUT
console.log(solution(INPUT));`,
        python: `# Write your solution here
def solution(s):
    # Your code here
    pass

# Test with INPUT
print(solution(INPUT))`
      };
      
      setCode(templates[language.toLowerCase()] || '');
    }
  }, [language, question]);

  // Fetch AI-generated question
  useEffect(() => {
    if (difficulty && language) {
      const fetchQuestion = async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ difficulty, language }),
          });

          if (!response.ok) throw new Error('Failed to fetch question');

          const data = await response.json();
          setQuestion(data);
        } catch (error) {
          console.error('Error generating question:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchQuestion();
    }
  }, [difficulty, language]);

  // Run all test cases
  const runTests = async () => {
    if (!question || !question.testCases || question.testCases.length === 0) {
      setOutput('No test cases available');
      return;
    }

    setExecuting(true);
    setTestResults([]);
    setOutput('Running test cases...');
    setActiveTab('results');

    const results = [];

    for (let i = 0; i < question.testCases.length; i++) {
      const testCase = question.testCases[i];
      
      try {
        const response = await fetch('/api/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            code, 
            language: language.toLowerCase(), 
            input: testCase.input 
          }),
        });

        const result = await response.json();
        
        if (result.status === 'Error') {
          // If there's an error, mark all remaining tests as failed
          results.push({
            testCase: i + 1,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: result.output,
            passed: false,
            error: true,
            status: 'Error'
          });
          break; // Stop testing on first error
        }

        const actualOutput = (result.output || '').trim();
        const expectedOutput = (testCase.expectedOutput || '').trim();
        const passed = actualOutput === expectedOutput;

        results.push({
          testCase: i + 1,
          input: testCase.input,
          expected: expectedOutput,
          actual: actualOutput,
          passed,
          error: false,
          status: result.status
        });
      } catch (error) {
        results.push({
          testCase: i + 1,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: 'Network Error',
          passed: false,
          error: true,
          status: 'Error'
        });
        break;
      }
    }

    setTestResults(results);
    setExecuting(false);

    // Summary message
    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;
    
    if (passedCount === totalCount && totalCount === question.testCases.length) {
      setOutput(`✓ Accepted\n\nAll ${totalCount} test cases passed!`);
    } else if (results.some(r => r.error)) {
      setOutput(`✗ Runtime Error\n\n${results.find(r => r.error)?.actual}`);
    } else {
      setOutput(`✗ Wrong Answer\n\n${passedCount}/${question.testCases.length} test cases passed`);
    }
  };

  // Submit solution
  const handleSubmit = async () => {
    if (!question || !session) {
      alert('⚠️ Please sign in to submit!');
      return;
    }

    // Must run tests first
    if (testResults.length === 0) {
      alert('⚠️ Please run test cases before submitting!');
      return;
    }

    const allPassed = testResults.every(r => r.passed);
    const totalTests = question.testCases?.length || 0;
    
    if (!allPassed) {
      const passedCount = testResults.filter(r => r.passed).length;
      const confirmSubmit = confirm(
        `Only ${passedCount}/${totalTests} test cases passed.\n\nAre you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }

    setExecuting(true);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          questionId: question._id,
          code,
          language: language.toLowerCase(),
          testResults,
          passed: allPassed
        }),
      });

      const result = await response.json();

      if (response.ok) {
        const xpEarned = result.xpEarned || 0;
        const status = result.status || 'Submitted';
        const message = result.message || `You earned ${xpEarned} XP!`;
        
        alert(`🎉 ${status}!\n\n${message}\n\nXP Earned: ${xpEarned}`);
        window.location.href = '/';
      } else {
        const errorMsg = result.error || result.message || 'Unknown error';
        alert(`❌ Submission failed\n\n${errorMsg}`);
        console.error('Submission error details:', result);
      }
    } catch (error) {
      console.error('Error submitting code:', error);
      alert(`❌ Network Error\n\nFailed to connect to server. Please check your connection and try again.`);
    } finally {
      setExecuting(false);
    }
  };

  // Auth check
  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Authentication Required</h2>
          <p>Please sign in to continue.</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Generating your coding challenge...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!question) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="text-center text-red-400">
          <h2 className="text-2xl mb-4">Error</h2>
          <p>Failed to load question. Please try again.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 bg-blue-600 px-6 py-2 rounded hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">{question.title}</h1>
          <span className={`px-3 py-1 rounded text-xs font-semibold ${
            difficulty === 'Easy' ? 'bg-green-600' :
            difficulty === 'Medium' ? 'bg-yellow-600' :
            'bg-red-600'
          }`}>
            {difficulty}
          </span>
        </div>
        <button 
          onClick={() => window.location.href = '/'}
          className="text-gray-400 hover:text-white"
        >
          ← Back
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 border-r border-gray-700 overflow-auto">
          <div className="p-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap mb-6">
                {question.description}
              </p>
            </div>

            {/* Test Cases */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Examples:</h3>
              {question.testCases && question.testCases.slice(0, 2).map((testCase, index) => (
                <div key={index} className="mb-4 bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <p className="font-semibold mb-2 text-sm text-gray-400">Example {index + 1}:</p>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-400">Input:</span>
                      <pre className="text-sm bg-gray-900 p-2 rounded mt-1 font-mono">
                        {testCase.input}
                      </pre>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-400">Output:</span>
                      <pre className="text-sm bg-gray-900 p-2 rounded mt-1 font-mono">
                        {testCase.expectedOutput}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-sm">
                <span className="font-semibold text-purple-400">Reward:</span>{' '}
                <span className="text-white">{question.xp} XP</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          {/* Language & Actions */}
          <div className="border-b border-gray-700 bg-gray-800 px-4 py-2 flex items-center justify-between">
            <span className="text-sm font-medium">{language}</span>
            <div className="flex gap-2">
              <button
                onClick={runTests}
                disabled={executing}
                className="bg-white text-gray-900 hover:bg-gray-200 px-4 py-1.5 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {executing ? 'Running...' : 'Run'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={executing}
                className="bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Submit
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 overflow-hidden">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-gray-900 p-4 font-mono text-sm resize-none focus:outline-none"
              placeholder="Write your code here..."
              spellCheck="false"
              style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
            />
          </div>

          {/* Results Panel */}
          <div className="h-64 border-t border-gray-700 bg-gray-800 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => setActiveTab('testcases')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                  activeTab === 'testcases' 
                    ? 'border-white text-white' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Test Cases
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                  activeTab === 'results' 
                    ? 'border-white text-white' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Test Results
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4">
              {activeTab === 'testcases' && (
                <div className="space-y-3">
                  {question.testCases?.map((tc, i) => (
                    <div key={i} className="text-sm">
                      <p className="text-gray-400 mb-1">Case {i + 1} =</p>
                      <pre className="bg-gray-900 p-2 rounded font-mono text-xs">
                        {tc.input}
                      </pre>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'results' && (
                <div>
                  {testResults.length === 0 ? (
                    <p className="text-gray-400 text-sm">Run code to see results</p>
                  ) : (
                    <div className="space-y-3">
                      <pre className="text-sm whitespace-pre-wrap mb-4">{output}</pre>
                      {testResults.map((test, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded border text-sm ${
                            test.passed
                              ? 'bg-green-900/20 border-green-600'
                              : 'bg-red-900/20 border-red-600'
                          }`}
                        >
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Case {test.testCase}</span>
                            <span className={`font-bold ${
                              test.passed ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {test.passed ? 'Passed' : 'Failed'}
                            </span>
                          </div>
                          {!test.passed && (
                            <div className="space-y-1 text-xs">
                              <p><span className="text-gray-400">Input:</span> {test.input}</p>
                              <p><span className="text-gray-400">Expected:</span> {test.expected}</p>
                              <p><span className="text-gray-400">Got:</span> {test.actual}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}