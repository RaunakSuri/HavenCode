import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import Editor from '@monaco-editor/react';
import axiosClient from '../utils/axiosClient';

function ProblemPage() {
  const { id } = useParams();

  // Problem State
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active Left Tab: 'description' | 'submissions'
  const [leftTab, setLeftTab] = useState('description');
  const [pastSubmissions, setPastSubmissions] = useState([]);
  const [loadingPastSubs, setLoadingPastSubs] = useState(false);

  // Editor State
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [theme, setTheme] = useState('vs-dark');

  // Bottom Console State
  const [activeConsoleTab, setActiveConsoleTab] = useState('testcases'); // 'testcases' | 'result'
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);

  // Execution States
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);

  // Fetch Problem Details
  useEffect(() => {
    async function fetchProblem() {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/problem/getProblem/${id}`);
        const data = res.data;
        setProblem(data);

        // Find initial code for default language (javascript)
        const defaultStart = data.startCode?.find(
          (sc) => sc.language.toLowerCase() === 'javascript'
        );
        if (defaultStart) {
          setCode(defaultStart.initialCode);
        } else if (data.startCode?.length > 0) {
          setLanguage(data.startCode[0].language.toLowerCase());
          setCode(data.startCode[0].initialCode);
        }
      } catch (err) {
        setError(err.response?.data || err.message || 'Failed to load problem.');
      } finally {
        setLoading(false);
      }
    }
    fetchProblem();
  }, [id]);

  // Fetch Past Submissions when Submissions tab is clicked
  useEffect(() => {
    if (leftTab === 'submissions') {
      async function fetchPastSubs() {
        try {
          setLoadingPastSubs(true);
          const res = await axiosClient.get(`/problem/submittedSolutions?pid=${id}`);
          setPastSubmissions(Array.isArray(res.data) ? res.data : []);
        } catch {
          setPastSubmissions([]);
        } finally {
          setLoadingPastSubs(false);
        }
      }
      fetchPastSubs();
    }
  }, [leftTab, id]);

  // Handle Language Change
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const langCode = problem?.startCode?.find(
      (sc) => sc.language.toLowerCase() === newLang.toLowerCase()
    );
    if (langCode) {
      setCode(langCode.initialCode);
    }
  };

  // Run Code (Visible Test Cases only)
  const handleRunCode = async () => {
    try {
      setRunning(true);
      setActiveConsoleTab('result');
      setRunResult(null);
      setSubmitResult(null);

      const res = await axiosClient.post(`/submission/run/${id}`, {
        code,
        language,
      });
      setRunResult(res.data);
    } catch (err) {
      setRunResult({ error: err.response?.data || err.message || 'Run failed' });
    } finally {
      setRunning(false);
    }
  };

  // Submit Code (Hidden Test Cases & DB Save)
  const handleSubmitCode = async () => {
    try {
      setSubmitting(true);
      setActiveConsoleTab('result');
      setSubmitResult(null);
      setRunResult(null);

      const res = await axiosClient.post(`/submission/submit/${id}`, {
        code,
        language,
      });
      setSubmitResult(res.data);
    } catch (err) {
      setSubmitResult({ error: err.response?.data || err.message || 'Submission failed' });
    } finally {
      setSubmitting(false);
    }
  };

  // Map language to Monaco editor language mode
  const getMonacoLanguage = (lang) => {
    switch (lang.toLowerCase()) {
      case 'c++':
        return 'cpp';
      case 'python':
        return 'python';
      case 'java':
        return 'java';
      default:
        return 'javascript';
    }
  };

  const getDifficultyBadge = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return <span className="badge badge-success text-white">Easy</span>;
      case 'medium':
        return <span className="badge badge-warning text-white">Medium</span>;
      case 'hard':
        return <span className="badge badge-error text-white">Hard</span>;
      default:
        return <span className="badge">{diff}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-base-200 p-4">
        <div className="alert alert-error max-w-md">
          <span>{typeof error === 'string' ? error : 'Problem not found.'}</span>
        </div>
        <Link to="/" className="btn btn-primary btn-sm mt-4">
          Back to Problems
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-base-200 overflow-hidden">
      {/* ================= TOP NAVBAR ================= */}
      <div className="navbar bg-base-100 shadow px-4 min-h-12 h-12 flex justify-between items-center z-10 border-b border-base-300">
        <div className="flex items-center gap-3">
          <Link to="/" className="btn btn-ghost btn-sm text-lg font-bold tracking-wider">
            LeetCode
          </Link>
          <span className="text-base-content/40">/</span>
          <span className="text-sm font-semibold truncate max-w-xs">{problem.title}</span>
        </div>

        {/* Center: Run & Submit Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunCode}
            disabled={running || submitting}
            className="btn btn-ghost btn-sm font-semibold"
          >
            {running ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              '▶ Run'
            )}
          </button>
          <button
            onClick={handleSubmitCode}
            disabled={running || submitting}
            className="btn btn-success btn-sm text-white font-semibold"
          >
            {submitting ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              '✓ Submit'
            )}
          </button>
        </div>

        {/* Right Links */}
        <div className="flex items-center gap-2">
          <Link to="/submissions" className="btn btn-ghost btn-xs text-xs">
            My Submissions
          </Link>
          <Link to="/" className="btn btn-ghost btn-xs text-xs">
            Problem List
          </Link>
        </div>
      </div>

      {/* ================= MAIN SPLIT CONTAINER ================= */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* ================= LEFT PANEL: Problem Statement & Tabs ================= */}
        <div className="w-full md:w-1/2 flex flex-col border-r border-base-300 bg-base-100 overflow-hidden">
          {/* Left Panel Tabs Header */}
          <div className="tabs tabs-bordered bg-base-200/50 px-4 pt-2 border-b border-base-300">
            <button
              onClick={() => setLeftTab('description')}
              className={`tab text-xs font-semibold ${leftTab === 'description' ? 'tab-active text-primary' : ''}`}
            >
              Description
            </button>
            <button
              onClick={() => setLeftTab('submissions')}
              className={`tab text-xs font-semibold ${leftTab === 'submissions' ? 'tab-active text-primary' : ''}`}
            >
              Submissions
            </button>
          </div>

          {/* Left Panel Content */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {leftTab === 'description' ? (
              <>
                {/* Title & Metadata */}
                <div>
                  <h1 className="text-2xl font-bold">{problem.title}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    {getDifficultyBadge(problem.difficulty)}
                    {problem.tags && (
                      <span className="badge badge-ghost badge-sm capitalize">
                        {problem.tags}
                      </span>
                    )}
                  </div>
                </div>

                {/* Problem Description Statement */}
                <div className="prose max-w-none text-sm text-base-content/90 whitespace-pre-wrap leading-relaxed">
                  {problem.description}
                </div>

                {/* Visible Test Cases / Examples */}
                <div className="space-y-4 pt-4 border-t border-base-200">
                  <h3 className="font-bold text-base">Examples</h3>
                  {problem.visibleTestCases?.map((tc, index) => (
                    <div key={index} className="bg-base-200/60 rounded-xl p-4 text-xs font-mono space-y-2">
                      <div className="font-semibold text-base-content/80">Example {index + 1}:</div>
                      <div>
                        <span className="text-base-content/60 font-semibold">Input: </span>
                        <span>{tc.input}</span>
                      </div>
                      <div>
                        <span className="text-base-content/60 font-semibold">Output: </span>
                        <span>{tc.output}</span>
                      </div>
                      {tc.explanation && (
                        <div className="font-sans text-base-content/70">
                          <span className="font-semibold text-base-content/80 font-mono">Explanation: </span>
                          {tc.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Submissions Tab */
              <div className="space-y-4">
                <h3 className="font-bold text-base">My Submissions for this Problem</h3>
                {loadingPastSubs ? (
                  <div className="flex justify-center py-10">
                    <span className="loading loading-spinner text-primary"></span>
                  </div>
                ) : pastSubmissions.length === 0 ? (
                  <div className="text-sm text-base-content/60 py-8 text-center">
                    You have not made any submissions for this problem yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Language</th>
                          <th>Runtime</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pastSubmissions.map((sub) => (
                          <tr key={sub._id}>
                            <td>
                              <span
                                className={`badge badge-sm font-medium ${
                                  sub.status === 'accepted'
                                    ? 'badge-success text-white'
                                    : 'badge-error text-white'
                                }`}
                              >
                                {sub.status}
                              </span>
                            </td>
                            <td className="uppercase font-mono text-xs">{sub.language}</td>
                            <td className="font-mono text-xs">
                              {sub.runtime ? `${sub.runtime.toFixed(2)} ms` : '-'}
                            </td>
                            <td className="text-xs text-base-content/60">
                              {new Date(sub.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT PANEL: Editor & Console ================= */}
        <div className="w-full md:w-1/2 flex flex-col bg-base-100 overflow-hidden">
          {/* Editor Header Bar (Language & Theme selection) */}
          <div className="bg-base-200/80 px-4 py-2 border-b border-base-300 flex justify-between items-center min-h-11">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-base-content/70">Language:</span>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="select select-bordered select-xs capitalize"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="c++">C++</option>
                <option value="java">Java</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="select select-bordered select-xs"
              >
                <option value="vs-dark">Dark Theme</option>
                <option value="light">Light Theme</option>
              </select>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 min-h-[300px] overflow-hidden">
            <Editor
              height="100%"
              language={getMonacoLanguage(language)}
              theme={theme}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>

          {/* ================= CONSOLE & RESULTS PANEL ================= */}
          <div className="h-64 border-t border-base-300 bg-base-100 flex flex-col">
            {/* Console Tabs */}
            <div className="tabs tabs-bordered bg-base-200/50 px-4 pt-1 border-b border-base-300 flex justify-between items-center">
              <div>
                <button
                  onClick={() => setActiveConsoleTab('testcases')}
                  className={`tab tab-sm text-xs font-semibold ${
                    activeConsoleTab === 'testcases' ? 'tab-active text-primary' : ''
                  }`}
                >
                  Testcases
                </button>
                <button
                  onClick={() => setActiveConsoleTab('result')}
                  className={`tab tab-sm text-xs font-semibold ${
                    activeConsoleTab === 'result' ? 'tab-active text-primary' : ''
                  }`}
                >
                  Test Result
                </button>
              </div>

              {(running || submitting) && (
                <div className="flex items-center gap-2 text-xs text-primary font-semibold pr-2">
                  <span className="loading loading-spinner loading-xs"></span>
                  {running ? 'Running on Judge0...' : 'Evaluating Submissions...'}
                </div>
              )}
            </div>

            {/* Console Body */}
            <div className="flex-1 p-4 overflow-y-auto text-xs font-mono">
              {activeConsoleTab === 'testcases' ? (
                /* Testcases Tab: Show buttons for each test case */
                <div>
                  <div className="flex gap-2 mb-3">
                    {problem.visibleTestCases?.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTestCaseIndex(idx)}
                        className={`btn btn-xs ${
                          selectedTestCaseIndex === idx ? 'btn-primary' : 'btn-ghost bg-base-200'
                        }`}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                  </div>

                  {problem.visibleTestCases?.[selectedTestCaseIndex] && (
                    <div className="space-y-2 bg-base-200/50 p-3 rounded-lg">
                      <div>
                        <div className="text-base-content/60 font-semibold mb-1">Input:</div>
                        <div className="bg-base-300 p-2 rounded">
                          {problem.visibleTestCases[selectedTestCaseIndex].input}
                        </div>
                      </div>
                      <div>
                        <div className="text-base-content/60 font-semibold mb-1">Expected Output:</div>
                        <div className="bg-base-300 p-2 rounded">
                          {problem.visibleTestCases[selectedTestCaseIndex].output}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Test Result Tab */
                <div>
                  {/* While Loading */}
                  {(running || submitting) && (
                    <div className="flex flex-col items-center justify-center py-10 gap-2">
                      <span className="loading loading-spinner loading-md text-primary"></span>
                      <span className="text-base-content/70">Running code against Judge0 compiler...</span>
                    </div>
                  )}

                  {/* Submission Result */}
                  {!running && !submitting && submitResult && (
                    <div className="space-y-3">
                      {submitResult.error ? (
                        <div className="alert alert-error text-xs">
                          <span>{submitResult.error}</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-lg font-bold ${
                                submitResult.status === 'accepted' ? 'text-success' : 'text-error'
                              }`}
                            >
                              {submitResult.status === 'accepted' ? '✓ Accepted' : '✗ ' + (submitResult.status || 'Wrong Answer')}
                            </span>
                            <span className="badge badge-outline">
                              Passed: {submitResult.testCasesPassed} / {submitResult.testCasesTotal || 0}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 bg-base-200/60 p-3 rounded-lg">
                            <div>
                              <span className="text-base-content/60 block">Runtime</span>
                              <span className="font-semibold text-sm">
                                {submitResult.runtime ? `${submitResult.runtime.toFixed(2)} ms` : 'N/A'}
                              </span>
                            </div>
                            <div>
                              <span className="text-base-content/60 block">Memory</span>
                              <span className="font-semibold text-sm">
                                {submitResult.memory ? `${submitResult.memory} kB` : 'N/A'}
                              </span>
                            </div>
                          </div>

                          {submitResult.errorMessage && (
                            <div className="mt-2 bg-error/10 text-error p-3 rounded-lg border border-error/20 whitespace-pre-wrap">
                              {submitResult.errorMessage}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Run Result (array of test results from Judge0) */}
                  {!running && !submitting && runResult && (
                    <div className="space-y-2">
                      {runResult.error ? (
                        <div className="alert alert-error text-xs">
                          <span>{runResult.error}</span>
                        </div>
                      ) : Array.isArray(runResult) ? (
                        runResult.map((res, i) => (
                          <div key={i} className="bg-base-200/50 p-2 rounded border border-base-300">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold">Test Case {i + 1}</span>
                              <span
                                className={`badge badge-xs font-semibold ${
                                  res.status_id === 3 ? 'badge-success text-white' : 'badge-error text-white'
                                }`}
                              >
                                {res.status_id === 3 ? 'Passed' : 'Failed'}
                              </span>
                            </div>
                            {res.stdout && (
                              <div>
                                <span className="text-base-content/60">Output: </span>
                                <span>{res.stdout}</span>
                              </div>
                            )}
                            {res.stderr && (
                              <div className="text-error mt-1 whitespace-pre-wrap">
                                {res.stderr}
                              </div>
                            )}
                            {res.compile_output && (
                              <div className="text-error mt-1 whitespace-pre-wrap">
                                {res.compile_output}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-base-content/70">Execution completed.</div>
                      )}
                    </div>
                  )}

                  {/* Empty Result placeholder */}
                  {!running && !submitting && !runResult && !submitResult && (
                    <div className="text-base-content/50 text-center py-8">
                      Click "Run" or "Submit" to see the execution results here.
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

export default ProblemPage;
