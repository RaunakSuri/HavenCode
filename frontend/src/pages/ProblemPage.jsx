import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import Editor from '@monaco-editor/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axiosClient from '../utils/axiosClient';
import ThemeToggle from '../components/ThemeToggle';

function ProblemPage() {
  const { id } = useParams();

  // Problem State
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active Left Tab: 'description' | 'submissions' | 'ai'
  const [leftTab, setLeftTab] = useState('description');
  const [pastSubmissions, setPastSubmissions] = useState([]);
  const [loadingPastSubs, setLoadingPastSubs] = useState(false);

  // Assistant State
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "👋 Hi! I'm your **coding assistant**. Need a hint, a complexity breakdown, or help debugging your logic? Pick a quick prompt below or type your question!",
    },
  ]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Editor State
  const [language, setLanguage] = useState('c++');
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

        // Find initial code for default language (c++)
        const defaultStart = data.startCode?.find(
          (sc) => sc.language.toLowerCase() === 'c++'
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

  // Send AI Message
  const handleSendAiMessage = async (customPrompt) => {
    const promptToSend = customPrompt || aiPrompt;
    if (!promptToSend.trim() || aiLoading) return;

    const userMessage = { role: 'user', content: promptToSend };
    setMessages((prev) => [...prev, userMessage]);
    setAiPrompt('');
    setAiLoading(true);

    try {
      const res = await axiosClient.post('/ai/chat', {
        prompt: promptToSend,
        problemTitle: problem?.title,
        problemDescription: problem?.description,
        userCode: code,
        language: language,
      });

      const assistantMessage = {
        role: 'assistant',
        content: res.data.reply || 'No response received. Please try again.',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            err.response?.data && typeof err.response.data === 'string'
              ? `⚠️ ${err.response.data}`
              : '⚠️ The assistant is temporarily busy. Please wait a moment and try again!',
        },
      ]);
    } finally {
      setAiLoading(false);
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

  const getDifficultyPill = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/50 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Easy
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/50 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Medium
          </span>
        );
      case 'hard':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/50 text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            Hard
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#1B1F2B] text-[#94A3B8] border border-[#263049]">
            {diff}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#0F131E]">
        <div className="w-12 h-12 rounded-2xl bg-[#262A36] flex items-center justify-center mb-4">
          <div className="w-6 h-6 border-2 border-[#5DE6FF] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="font-display font-medium text-[#94A3B8] text-sm">Loading problem...</p>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#0F131E] p-6">
        <div className="bg-[#171B27] rounded-3xl p-8 max-w-md w-full shadow-float border border-[#263049] text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-950/50 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
            !
          </div>
          <h2 className="font-display font-bold text-xl text-[#DFE2F2] mb-2">Problem Not Found</h2>
          <p className="text-[#94A3B8] text-sm mb-6">
            {typeof error === 'string' ? error : 'The requested problem could not be loaded.'}
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] text-[#0A0E19] shadow-[0_0_16px_rgba(34,211,238,0.3)] transition-all"
          >
            ← Return to Problems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0F131E] overflow-hidden font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* ================= TOP WORKSTATION HEADER ================= */}
      <header className="bg-[#0B0F1A]/85 backdrop-blur-xl border-b border-[#263049] px-4 sm:px-6 h-14 min-h-14 flex items-center justify-between z-20 shrink-0">
        {/* Left: Brand & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-[#22D3EE] flex items-center justify-center shadow-sm text-[#0A0E19] font-black text-sm group-hover:scale-105 transition-transform">
              H
            </div>
            <span className="font-display font-bold text-[#DFE2F2] text-base tracking-tight hidden sm:inline">
              HavenCode
            </span>
          </Link>
          <span className="text-[#64748B] font-light">/</span>
          <div className="flex items-center gap-2 max-w-xs sm:max-w-md truncate">
            <span className="font-semibold text-[#DFE2F2] text-sm truncate">{problem.title}</span>
            {getDifficultyPill(problem.difficulty)}
          </div>
        </div>

        {/* Center: Run & Submit Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRunCode}
            disabled={running || submitting}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#DFE2F2] bg-[#1B1F2B] hover:bg-[#262A36] border border-[#263049] shadow-xs hover:shadow transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {running ? (
              <span className="w-3.5 h-3.5 border-2 border-[#5DE6FF] border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <svg className="w-3 h-3 text-[#5DE6FF] fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
            <span>Run</span>
          </button>

          <button
            onClick={handleSubmitCode}
            disabled={running || submitting}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold text-[#0A0E19] bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] shadow-[0_0_16px_rgba(34,211,238,0.3)] hover:shadow-[0_0_24px_rgba(34,211,238,0.5)] transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="w-3.5 h-3.5 border-2 border-[#0A0E19] border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            <span>Submit Solution</span>
          </button>
        </div>

        {/* Right: Quick Links */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <ThemeToggle />
          <Link
            to="/"
            className="px-3 py-1.5 rounded-xl text-[#94A3B8] hover:text-[#DFE2F2] hover:bg-[#1B1F2B] transition-colors"
          >
            Problems
          </Link>
          <Link
            to="/solved"
            className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-xl text-[#94A3B8] hover:text-[#DFE2F2] hover:bg-[#1B1F2B] transition-colors"
          >
            Solved Problems
          </Link>
          <Link
            to="/submissions"
            className="px-3 py-1.5 rounded-xl text-[#94A3B8] hover:text-[#DFE2F2] hover:bg-[#1B1F2B] transition-colors"
          >
            Submissions
          </Link>
        </div>
      </header>

      {/* ================= MAIN SPLIT VIEW ================= */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-2 gap-2">
        {/* ================= LEFT PANEL: Problem Details / Submissions / AI ================= */}
        <div className="w-full md:w-1/2 flex flex-col bg-[#171B27] rounded-2xl border border-[#263049] shadow-soft overflow-hidden">
          {/* Segmented Control Tabs */}
          <div className="px-4 pt-3 pb-2 border-b border-[#263049] flex items-center justify-between bg-[#101524]">
            <div className="inline-flex p-1 bg-[#1B1F2B] rounded-xl gap-1 text-xs font-semibold">
              <button
                onClick={() => setLeftTab('description')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  leftTab === 'description'
                    ? 'bg-[#262A36] text-[#DFE2F2] shadow-sm font-bold'
                    : 'text-[#94A3B8] hover:text-[#DFE2F2]'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setLeftTab('submissions')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  leftTab === 'submissions'
                    ? 'bg-[#262A36] text-[#DFE2F2] shadow-sm font-bold'
                    : 'text-[#94A3B8] hover:text-[#DFE2F2]'
                }`}
              >
                Submissions
              </button>
              <button
                onClick={() => setLeftTab('ai')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  leftTab === 'ai'
                    ? 'bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] text-[#0A0E19] shadow-sm font-bold'
                    : 'text-[#5DE6FF] hover:bg-[#1B1F2B]'
                }`}
              >
                <span>✨</span>
                <span>Assistant</span>
              </button>
            </div>

            {leftTab === 'ai' && (
              <span className="text-[11px] font-mono text-[#5DE6FF] bg-[#262A36] px-2.5 py-1 rounded-full border border-[#424754]/40 font-medium">
                Ready to help
              </span>
            )}
          </div>

          {/* Left Panel Body */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6">
            {leftTab === 'description' && (
              <>
                {/* Title & Topic Tags */}
                <div>
                  <h1 className="font-display text-2xl font-extrabold text-[#DFE2F2] tracking-tight">
                    {problem.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    {getDifficultyPill(problem.difficulty)}
                    {problem.tags && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1B1F2B] text-[#94A3B8] border border-[#263049] capitalize">
                        {problem.tags}
                      </span>
                    )}
                  </div>
                </div>

                {/* Problem Description Statement */}
                <div className="text-[#C2C6D6] text-sm leading-relaxed whitespace-pre-wrap font-normal">
                  {problem.description}
                </div>

                {/* Examples */}
                <div className="space-y-4 pt-4 border-t border-[#263049]">
                  <h3 className="font-display font-bold text-sm text-[#DFE2F2] uppercase tracking-wider">
                    Examples
                  </h3>
                  {problem.visibleTestCases?.map((tc, index) => (
                    <div
                      key={index}
                      className="bg-[#1B1F2B] border border-[#263049] rounded-2xl p-4 text-xs font-mono space-y-2.5"
                    >
                      <div className="font-sans font-bold text-[#DFE2F2] text-xs">
                        Example {index + 1}:
                      </div>
                      <div className="bg-[#0A0E19] p-2.5 rounded-xl border border-[#263049]">
                        <span className="text-[#64748B] font-medium">Input: </span>
                        <span className="text-[#DFE2F2]">{tc.input}</span>
                      </div>
                      <div className="bg-[#0A0E19] p-2.5 rounded-xl border border-[#263049]">
                        <span className="text-[#64748B] font-medium">Output: </span>
                        <span className="text-[#DFE2F2]">{tc.output}</span>
                      </div>
                      {tc.explanation && (
                        <div className="font-sans text-[#94A3B8] text-xs pt-1">
                          <span className="font-semibold text-[#DFE2F2]">Explanation: </span>
                          {tc.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {leftTab === 'submissions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#263049]">
                  <h3 className="font-display font-bold text-base text-[#DFE2F2]">
                    My Submissions for this Problem
                  </h3>
                  <span className="text-xs text-[#64748B]">
                    {pastSubmissions.length} record{pastSubmissions.length === 1 ? '' : 's'}
                  </span>
                </div>

                {loadingPastSubs ? (
                  <div className="flex justify-center py-12">
                    <div className="w-7 h-7 border-2 border-[#5DE6FF] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : pastSubmissions.length === 0 ? (
                  <div className="text-center py-12 bg-[#1B1F2B] rounded-2xl border border-[#263049]">
                    <p className="text-sm font-medium text-[#DFE2F2]">No submissions yet</p>
                    <p className="text-xs text-[#64748B] mt-1">
                      Write your solution in the editor and click Submit Solution!
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-[#263049]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#101524] text-[#64748B] font-semibold border-b border-[#263049]">
                        <tr>
                          <th className="px-3.5 py-2.5">Status</th>
                          <th className="px-3.5 py-2.5">Language</th>
                          <th className="px-3.5 py-2.5">Runtime</th>
                          <th className="px-3.5 py-2.5">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#263049]">
                        {pastSubmissions.map((sub) => (
                          <tr key={sub._id} className="hover:bg-[#1B1F2B] transition-colors">
                            <td className="px-3.5 py-2.5">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                  sub.status === 'accepted'
                                    ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-rose-950/50 text-rose-400 border border-rose-500/30'
                                }`}
                              >
                                {sub.status}
                              </span>
                            </td>
                            <td className="px-3.5 py-2.5 font-mono uppercase text-[#94A3B8]">
                              {sub.language}
                            </td>
                            <td className="px-3.5 py-2.5 font-mono text-[#94A3B8]">
                              {sub.runtime ? `${sub.runtime.toFixed(2)} ms` : '-'}
                            </td>
                            <td className="px-3.5 py-2.5 text-[#64748B]">
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

            {leftTab === 'ai' && (
              <div className="flex flex-col h-full space-y-4">
                {/* Assistant Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#263049]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-[#22D3EE] text-[#0A0E19] flex items-center justify-center font-bold text-sm shadow-soft">
                      ✨
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-[#DFE2F2]">
                        Coding Assistant
                      </h3>
                      <p className="text-[11px] text-[#94A3B8]">
                        Get help with {problem.title}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setMessages([
                        {
                          role: 'assistant',
                          content:
                            'Chat cleared! How can I help you with this problem or your code?',
                        },
                      ])
                    }
                    className="text-xs text-[#64748B] hover:text-[#DFE2F2] font-medium px-2 py-1 rounded-lg hover:bg-[#262A36] transition-colors"
                  >
                    Clear Chat
                  </button>
                </div>

                {/* Quick Action Prompt Chips */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() =>
                      handleSendAiMessage(
                        'Give me a subtle hint to point me in the right direction without spoiling the full solution.'
                      )
                    }
                    disabled={aiLoading}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-950/40 hover:bg-amber-950/60 text-amber-400 border border-amber-500/30 transition-all active:scale-95 disabled:opacity-50"
                  >
                    💡 Hint
                  </button>
                  <button
                    onClick={() =>
                      handleSendAiMessage(
                        'Explain this problem with a simple real-world analogy and trace Example 1 step by step.'
                      )
                    }
                    disabled={aiLoading}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#1B1F2B] hover:bg-[#262A36] text-[#DFE2F2] border border-[#263049] transition-all active:scale-95 disabled:opacity-50"
                  >
                    📖 Explain Problem
                  </button>
                  <button
                    onClick={() =>
                      handleSendAiMessage(
                        'Review my current code in the editor. Are there any edge cases, logical bugs, or syntax errors? Explain without immediately rewriting the entire solution.'
                      )
                    }
                    disabled={aiLoading}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#1B1F2B] hover:bg-[#262A36] text-[#5DE6FF] border border-[#263049] transition-all active:scale-95 disabled:opacity-50"
                  >
                    🐛 Debug My Code
                  </button>
                  <button
                    onClick={() =>
                      handleSendAiMessage(
                        'What is the optimal Time and Space complexity for solving this problem, and what data structures achieve it?'
                      )
                    }
                    disabled={aiLoading}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-950/40 hover:bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 transition-all active:scale-95 disabled:opacity-50"
                  >
                    ⏱️ Complexity
                  </button>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 min-h-[300px]">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        msg.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className="text-[10px] text-[#64748B] font-medium mb-1 px-1">
                        {msg.role === 'user' ? 'You' : 'Assistant'}
                      </div>
                      <div
                        className={`max-w-[92%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] text-[#0A0E19] shadow-soft whitespace-pre-wrap'
                            : 'bg-[#1B1F2B] text-[#DFE2F2] border border-[#263049] shadow-sm'
                        }`}
                      >
                        {msg.role === 'user' ? (
                          msg.content
                        ) : (
                          <div className="prose prose-xs max-w-none text-xs leading-relaxed space-y-2 text-[#DFE2F2] break-words [&_table]:w-full [&_table]:border-collapse [&_table]:my-2.5 [&_th]:bg-[#262A36] [&_th]:p-1.5 [&_th]:text-left [&_th]:font-semibold [&_td]:p-1.5 [&_td]:border-b [&_td]:border-[#263049] [&_pre]:bg-[#0A0E19] [&_pre]:text-[#DFE2F2] [&_pre]:p-2.5 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_code]:font-mono [&_code]:text-[11px]">
                            <Markdown remarkPlugins={[remarkGfm]}>
                              {msg.content}
                            </Markdown>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {aiLoading && (
                    <div className="flex flex-col items-start">
                      <div className="text-[10px] text-[#64748B] font-medium mb-1 px-1">
                        Assistant
                      </div>
                      <div className="bg-[#1B1F2B] border border-[#263049] rounded-2xl px-4 py-3 flex items-center gap-2.5 text-xs text-[#94A3B8]">
                        <span className="w-3.5 h-3.5 border-2 border-[#5DE6FF] border-t-transparent rounded-full animate-spin"></span>
                        <span className="font-medium">Formulating guidance...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Input Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendAiMessage();
                  }}
                  className="pt-2 border-t border-[#263049] flex gap-2"
                >
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ask about this problem or your code..."
                    disabled={aiLoading}
                    className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-[#0A0E19] border border-[#263049] focus:bg-[#0A0E19] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-[#DFE2F2] placeholder:text-[#64748B]"
                  />
                  <button
                    type="submit"
                    disabled={aiLoading || !aiPrompt.trim()}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] text-[#0A0E19] shadow-soft transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT PANEL: Editor & Console ================= */}
        <div className="w-full md:w-1/2 flex flex-col bg-[#171B27] rounded-2xl border border-[#263049] shadow-soft overflow-hidden">
          {/* Editor Header Bar (Language & Theme selection) */}
          <div className="bg-[#101524] px-4 py-2.5 border-b border-[#263049] flex justify-between items-center min-h-11">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#64748B]">Language:</span>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-[#0A0E19] border border-[#263049] text-[#DFE2F2] text-xs font-medium rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#3B82F6] capitalize shadow-xs"
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
                className="bg-[#0A0E19] border border-[#263049] text-[#DFE2F2] text-xs font-medium rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#3B82F6] shadow-xs"
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
                fontFamily: "'JetBrains Mono', monospace",
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>

          {/* ================= CONSOLE & RESULTS PANEL ================= */}
          <div className="h-64 border-t border-[#263049] bg-[#171B27] flex flex-col">
            {/* Console Header Tabs */}
            <div className="bg-[#101524] px-4 pt-2 pb-1.5 border-b border-[#263049] flex justify-between items-center">
              <div className="inline-flex p-1 bg-[#1B1F2B] rounded-xl gap-1 text-xs font-semibold">
                <button
                  onClick={() => setActiveConsoleTab('testcases')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeConsoleTab === 'testcases'
                      ? 'bg-[#262A36] text-[#DFE2F2] shadow-sm font-bold'
                      : 'text-[#94A3B8] hover:text-[#DFE2F2]'
                  }`}
                >
                  Test Cases
                </button>
                <button
                  onClick={() => setActiveConsoleTab('result')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeConsoleTab === 'result'
                      ? 'bg-[#262A36] text-[#DFE2F2] shadow-sm font-bold'
                      : 'text-[#94A3B8] hover:text-[#DFE2F2]'
                  }`}
                >
                  Result
                </button>
              </div>

              {(running || submitting) && (
                <div className="flex items-center gap-2 text-xs text-[#5DE6FF] font-semibold pr-2">
                  <span className="w-3.5 h-3.5 border-2 border-[#5DE6FF] border-t-transparent rounded-full animate-spin"></span>
                  <span>{running ? 'Running your code...' : 'Checking your solution...'}</span>
                </div>
              )}
            </div>

            {/* Console Content */}
            <div className="flex-1 p-4 overflow-y-auto text-xs font-mono">
              {activeConsoleTab === 'testcases' ? (
                /* Testcases Tab */
                <div className="space-y-3">
                  <div className="flex gap-2">
                    {problem.visibleTestCases?.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTestCaseIndex(idx)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          selectedTestCaseIndex === idx
                            ? 'bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] text-[#0A0E19] shadow-soft'
                            : 'bg-[#262A36] text-[#94A3B8] hover:bg-[#313441]'
                        }`}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                  </div>

                  {problem.visibleTestCases?.[selectedTestCaseIndex] && (
                    <div className="space-y-2.5 bg-[#1B1F2B] p-3.5 rounded-xl border border-[#263049]">
                      <div>
                        <div className="text-[#64748B] font-sans font-semibold text-[11px] mb-1">
                          Input:
                        </div>
                        <div className="bg-[#0A0E19] p-2 rounded-lg border border-[#263049] text-[#DFE2F2]">
                          {problem.visibleTestCases[selectedTestCaseIndex].input}
                        </div>
                      </div>
                      <div>
                        <div className="text-[#64748B] font-sans font-semibold text-[11px] mb-1">
                          Expected Output:
                        </div>
                        <div className="bg-[#0A0E19] p-2 rounded-lg border border-[#263049] text-[#DFE2F2]">
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
                      <div className="w-7 h-7 border-2 border-[#5DE6FF] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[#94A3B8] font-sans text-xs">
                        Running your code against the test cases...
                      </span>
                    </div>
                  )}

                  {/* Submission Result */}
                  {!running && !submitting && submitResult && (
                    <div className="space-y-3 font-sans">
                      {submitResult.error ? (
                        <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
                          {submitResult.error}
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between pb-2 border-b border-[#263049]">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-base font-bold font-display ${
                                  submitResult.status === 'accepted' ? 'text-emerald-400' : 'text-rose-400'
                                }`}
                              >
                                {submitResult.status === 'accepted'
                                  ? '✓ Accepted'
                                  : '✗ ' + (submitResult.status || 'Wrong Answer')}
                              </span>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#262A36] text-[#DFE2F2] border border-[#263049]">
                              Passed {submitResult.testCasesPassed} / {submitResult.testCasesTotal || 0}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#1B1F2B] p-3 rounded-xl border border-[#263049]">
                              <span className="text-[11px] text-[#64748B] font-medium block">
                                Runtime
                              </span>
                              <span className="font-mono font-bold text-[#DFE2F2] text-sm">
                                {submitResult.runtime ? `${submitResult.runtime.toFixed(2)} ms` : 'N/A'}
                              </span>
                            </div>
                            <div className="bg-[#1B1F2B] p-3 rounded-xl border border-[#263049]">
                              <span className="text-[11px] text-[#64748B] font-medium block">
                                Memory
                              </span>
                              <span className="font-mono font-bold text-[#DFE2F2] text-sm">
                                {submitResult.memory ? `${submitResult.memory} kB` : 'N/A'}
                              </span>
                            </div>
                          </div>

                          {submitResult.errorMessage && (
                            <div className="mt-2 bg-rose-950/40 text-rose-400 p-3 rounded-xl border border-rose-500/30 text-xs font-mono whitespace-pre-wrap">
                              {submitResult.errorMessage}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Run Result (visible test cases) */}
                  {!running && !submitting && runResult && (
                    <div className="space-y-2.5 font-sans">
                      {runResult.error ? (
                        <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
                          {runResult.error}
                        </div>
                      ) : Array.isArray(runResult) ? (
                        runResult.map((res, i) => (
                          <div
                            key={i}
                            className="bg-[#1B1F2B] p-3 rounded-xl border border-[#263049] font-mono text-xs"
                          >
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="font-sans font-bold text-[#DFE2F2]">
                                Test Case {i + 1}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  res.status_id === 3
                                    ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-rose-950/50 text-rose-400 border border-rose-500/30'
                                }`}
                              >
                                {res.status_id === 3 ? 'Passed' : 'Failed'}
                              </span>
                            </div>
                            {res.stdout && (
                              <div className="bg-[#0A0E19] p-2 rounded-lg border border-[#263049] mt-1">
                                <span className="text-[#64748B]">Output: </span>
                                <span className="text-[#DFE2F2]">{res.stdout}</span>
                              </div>
                            )}
                            {res.stderr && (
                              <div className="text-rose-400 mt-1 whitespace-pre-wrap bg-rose-950/40 p-2 rounded-lg border border-rose-500/30">
                                {res.stderr}
                              </div>
                            )}
                            {res.compile_output && (
                              <div className="text-rose-400 mt-1 whitespace-pre-wrap bg-rose-950/40 p-2 rounded-lg border border-rose-500/30">
                                {res.compile_output}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-[#94A3B8] font-sans text-xs">Run complete.</div>
                      )}
                    </div>
                  )}

                  {/* Empty placeholder */}
                  {!running && !submitting && !runResult && !submitResult && (
                    <div className="text-[#64748B] font-sans text-center py-8 text-xs">
                      Run or submit your code to see the results.
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
