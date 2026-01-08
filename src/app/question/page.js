'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CodeEditor from '@/components/CodeEditor';

export default function QuestionPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const difficulty = searchParams.get('difficulty');
  const language = searchParams.get('language');

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleExecute = async (code, lang, input) => {
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: lang, input }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error executing code:', error);
      return { output: 'Error executing code' };
    }
  };

  const handleSubmit = async (code, lang, output) => {
    if (!question || !session) return;

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          questionId: question._id,
          code,
          language: lang,
          output,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Submission ${result.status}! You earned ${result.xpEarned || 0} XP. 🎉`);
        // Redirect to home/dashboard
        window.location.href = '/';
      } else {
        alert(`Submission failed: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting code:', error);
      alert('Error submitting code. Please try again.');
    }
  };

  // Auth check
  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl">
        Please sign in to continue.
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl">
        Generating your coding challenge...
      </div>
    );
  }

  // Error state
  if (!question) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl text-red-600">
        Error loading question. Please try again.
      </div>
    );
  }

  // Capitalize language name for display
  const formattedLanguage =
    language.charAt(0).toUpperCase() + language.slice(1);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Question Panel */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            {question.title}
          </h2>

          <div className="prose max-w-none mb-8 text-gray-700">
            <p className="whitespace-pre-wrap">{question.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <span className="font-semibold">Difficulty:</span>{' '}
              <span
                className={`ml-2 px-3 py-1 rounded-full text-white text-sm ${
                  question.difficulty === 'Easy'
                    ? 'bg-green-500'
                    : question.difficulty === 'Medium'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
              >
                {question.difficulty}
              </span>
            </div>
            <div>
              <span className="font-semibold">Language:</span>{' '}
              <span className="ml-2">{formattedLanguage}</span>
            </div>
            <div>
              <span className="font-semibold">Potential XP:</span>{' '}
              <span className="ml-2 font-bold text-purple-600">
                {question.xp}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-4">Sample Test Cases</h3>
            {question.testCases && question.testCases.length > 0 ? (
              question.testCases.map((testCase, index) => (
                <div
                  key={testCase._id || index} // Prefer unique ID if available
                  className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <p className="font-medium mb-2">Test Case {index + 1}</p>
                  <div>
                    <strong>Input:</strong>
                    <pre className="mt-1 p-2 bg-gray-100 rounded text-sm overflow-x-auto">
                      {testCase.input || 'N/A'}
                    </pre>
                  </div>
                  <div className="mt-3">
                    <strong>Expected Output:</strong>
                    <pre className="mt-1 p-2 bg-gray-100 rounded text-sm overflow-x-auto">
                      {testCase.expectedOutput || 'N/A'}
                    </pre>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-red-500 italic">
                No test cases available. Please refresh or try a new challenge.
              </p>
            )}
          </div>
        </div>

        {/* Code Editor Panel */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <CodeEditor
            language={language}
            onExecute={handleExecute}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}