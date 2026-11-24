import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router';
import { createProblem } from '../problemSlice';
import ThemeToggle from '../components/ThemeToggle';

const DEFAULT_LANGUAGES = ['javascript', 'c++', 'java', 'python'];

function CreateProblemPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Basic Info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [tags, setTags] = useState('array');

  // Dynamic Array: Visible Test Cases
  const [visibleTestCases, setVisibleTestCases] = useState([
    { input: '', output: '', explanation: '' },
  ]);

  // Dynamic Array: Hidden Test Cases
  const [hiddenTestCases, setHiddenTestCases] = useState([
    { input: '', output: '' },
  ]);

  // Dynamic Array: Start Code (one per language)
  const [startCode, setStartCode] = useState([
    {
      language: 'javascript',
      initialCode: 'function solution() {\n  // your code here\n}',
    },
  ]);

  // Dynamic Array: Reference Solution (one per language)
  const [referenceSolution, setReferenceSolution] = useState([
    {
      language: 'javascript',
      completeCode: 'function solution() {\n  // complete working solution\n}',
    },
  ]);

  // Handlers for Visible Test Cases
  const addVisibleTestCase = () => {
    setVisibleTestCases([
      ...visibleTestCases,
      { input: '', output: '', explanation: '' },
    ]);
  };
  const removeVisibleTestCase = (index) => {
    setVisibleTestCases(visibleTestCases.filter((_, i) => i !== index));
  };
  const updateVisibleTestCase = (index, field, value) => {
    const updated = [...visibleTestCases];
    updated[index][field] = value;
    setVisibleTestCases(updated);
  };

  // Handlers for Hidden Test Cases
  const addHiddenTestCase = () => {
    setHiddenTestCases([...hiddenTestCases, { input: '', output: '' }]);
  };
  const removeHiddenTestCase = (index) => {
    setHiddenTestCases(hiddenTestCases.filter((_, i) => i !== index));
  };
  const updateHiddenTestCase = (index, field, value) => {
    const updated = [...hiddenTestCases];
    updated[index][field] = value;
    setHiddenTestCases(updated);
  };

  // Handlers for Start Code
  const addStartCode = () => {
    setStartCode([...startCode, { language: 'python', initialCode: '' }]);
  };
  const removeStartCode = (index) => {
    setStartCode(startCode.filter((_, i) => i !== index));
  };
  const updateStartCode = (index, field, value) => {
    const updated = [...startCode];
    updated[index][field] = value;
    setStartCode(updated);
  };

  // Handlers for Reference Solution
  const addReferenceSolution = () => {
    setReferenceSolution([
      ...referenceSolution,
      { language: 'python', completeCode: '' },
    ]);
  };
  const removeReferenceSolution = (index) => {
    setReferenceSolution(referenceSolution.filter((_, i) => i !== index));
  };
  const updateReferenceSolution = (index, field, value) => {
    const updated = [...referenceSolution];
    updated[index][field] = value;
    setReferenceSolution(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const problemData = {
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      startCode,
      referenceSolution,
    };

    try {
      const resultAction = await dispatch(createProblem(problemData));
      if (createProblem.fulfilled.match(resultAction)) {
        navigate('/admin');
      } else {
        setError(
          resultAction.payload ||
            'Failed to create problem. Ensure the reference solution passes the visible test cases.'
        );
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F131E] pb-20 font-sans text-[#DFE2F2] selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* ================= UNIFIED NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-[#0B0F1A]/85 backdrop-blur-xl border-b border-[#263049] px-6 sm:px-10 h-16 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img src="/logo.svg" alt="HavenCode" className="h-8 sm:h-9 w-auto group-hover:scale-105 transition-all duration-200" />
            </Link>
            <span className="text-[#64748B] font-light">/</span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1B1F2B] text-[#5DE6FF] border border-[#263049]">
              Create Problem
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/admin"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-[#DFE2F2] hover:bg-[#1B1F2B] transition-colors"
            >
              Cancel & Back
            </Link>
          </div>
        </div>
      </header>

      {/* ================= PAGE HERO & TITLE ================= */}
      <main className="mx-auto w-full max-w-7xl px-6 sm:px-10 pt-10 sm:pt-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#262A36] text-[#5DE6FF] border border-[#424754]/40 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#5DE6FF] animate-pulse"></span>
            <span>Admin Workspace</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#DFE2F2] tracking-tight">
            Create New Problem
          </h1>
          <p className="text-[#94A3B8] text-sm sm:text-base mt-1.5 max-w-xl">
            Add the problem details, test cases, and reference solutions.
            Reference solutions are checked against visible test cases when
            saving.
          </p>
        </div>

        <div className="max-w-4xl">
          <div className="bg-[#171B27] rounded-3xl shadow-soft border border-[#263049] p-6 sm:p-8">
            {error && (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-400 text-sm mb-6 flex items-center gap-3">
                <span className="font-bold text-base">!</span>
                <span>
                  {typeof error === 'string' ? error : JSON.stringify(error)}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[#DFE2F2] mb-1.5">
                  Problem Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Two Sum"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0A0E19] border border-[#263049] text-[#DFE2F2] text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                />
              </div>

              {/* Difficulty & Tag */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#DFE2F2] mb-1.5">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A0E19] border border-[#263049] text-[#DFE2F2] text-sm focus:outline-none focus:border-[#3B82F6] capitalize"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#DFE2F2] mb-1.5">
                    Category / Tag
                  </label>
                  <select
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A0E19] border border-[#263049] text-[#DFE2F2] text-sm focus:outline-none focus:border-[#3B82F6]"
                  >
                    <option value="array">Array</option>
                    <option value="strings">Strings</option>
                    <option value="linkedList">Linked List</option>
                    <option value="tree">Tree</option>
                    <option value="heap">Heap</option>
                    <option value="graph">Graph</option>
                    <option value="dp">Dynamic Programming</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#DFE2F2] mb-1.5">
                  Problem Description
                </label>
                <textarea
                  placeholder="Explain the problem statement clearly..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0E19] border border-[#263049] text-[#DFE2F2] text-sm font-mono focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              {/* ================= VISIBLE TEST CASES ================= */}
              <div className="border border-[#263049] rounded-2xl p-5 bg-[#101524]">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-base text-[#DFE2F2]">
                      Visible Test Cases
                    </h3>
                    <p className="text-xs text-[#94A3B8]">
                      Visible to users as examples and used to verify solutions.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addVisibleTestCase}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1B1F2B] hover:bg-[#262A36] text-[#5DE6FF] border border-[#263049] transition-all"
                  >
                    + Add Example
                  </button>
                </div>

                <div className="space-y-4">
                  {visibleTestCases.map((tc, index) => (
                    <div
                      key={index}
                      className="bg-[#171B27] p-4 rounded-xl border border-[#263049] space-y-3 relative"
                    >
                      {visibleTestCases.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVisibleTestCase(index)}
                          className="w-6 h-6 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-xs absolute top-3 right-3 transition-colors"
                        >
                          ✕
                        </button>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-[#94A3B8] mb-1">
                            Input
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. [2,7,11,15]\n9"
                            value={tc.input}
                            onChange={(e) =>
                              updateVisibleTestCase(
                                index,
                                'input',
                                e.target.value
                              )
                            }
                            required
                            className="w-full px-3 py-2 rounded-lg bg-[#0A0E19] border border-[#263049] text-[#DFE2F2] font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#94A3B8] mb-1">
                            Expected Output
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. [0,1]"
                            value={tc.output}
                            onChange={(e) =>
                              updateVisibleTestCase(
                                index,
                                'output',
                                e.target.value
                              )
                            }
                            required
                            className="w-full px-3 py-2 rounded-lg bg-[#0A0E19] border border-[#263049] text-[#DFE2F2] font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#94A3B8] mb-1">
                          Explanation
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Because nums[0] + nums[1] == 9, we return [0, 1]."
                          value={tc.explanation}
                          onChange={(e) =>
                            updateVisibleTestCase(
                              index,
                              'explanation',
                              e.target.value
                            )
                          }
                          required
                          className="w-full px-3 py-2 rounded-lg bg-[#0A0E19] border border-[#263049] text-[#DFE2F2] text-xs focus:outline-none focus:border-[#3B82F6]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ================= HIDDEN TEST CASES ================= */}
              <div className="border border-[#263049] rounded-2xl p-5 bg-[#101524]">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-base text-[#DFE2F2]">
                      Hidden Test Cases
                    </h3>
                    <p className="text-xs text-[#94A3B8]">
                      Used to grade final submissions.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addHiddenTestCase}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1B1F2B] hover:bg-[#262A36] text-[#5DE6FF] border border-[#263049] transition-all"
                  >
                    + Add Hidden Case
                  </button>
                </div>

                <div className="space-y-4">
                  {hiddenTestCases.map((tc, index) => (
                    <div
                      key={index}
                      className="bg-[#171B27] p-4 rounded-xl border border-[#263049] relative"
                    >
                      {hiddenTestCases.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHiddenTestCase(index)}
                          className="w-6 h-6 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-xs absolute top-3 right-3 transition-colors"
                        >
                          ✕
                        </button>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-[#94A3B8] mb-1">
                            Input
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. [3,2,4]\n6"
                            value={tc.input}
                            onChange={(e) =>
                              updateHiddenTestCase(
                                index,
                                'input',
                                e.target.value
                              )
                            }
                            required
                            className="w-full px-3 py-2 rounded-lg bg-[#0A0E19] border border-[#263049] text-[#DFE2F2] font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#94A3B8] mb-1">
                            Expected Output
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. [1,2]"
                            value={tc.output}
                            onChange={(e) =>
                              updateHiddenTestCase(
                                index,
                                'output',
                                e.target.value
                              )
                            }
                            required
                            className="w-full px-3 py-2 rounded-lg bg-[#0A0E19] border border-[#263049] text-[#DFE2F2] font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ================= START CODE TEMPLATES ================= */}
              <div className="border border-[#263049] rounded-2xl p-5 bg-[#101524]">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-base text-[#DFE2F2]">
                      Starter Code Templates
                    </h3>
                    <p className="text-xs text-[#94A3B8]">
                      Starter code shown in the editor.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addStartCode}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1B1F2B] hover:bg-[#262A36] text-[#5DE6FF] border border-[#263049] transition-all"
                  >
                    + Add Language Template
                  </button>
                </div>

                <div className="space-y-4">
                  {startCode.map((sc, index) => (
                    <div
                      key={index}
                      className="bg-[#171B27] p-4 rounded-xl border border-[#263049] space-y-3 relative"
                    >
                      {startCode.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStartCode(index)}
                          className="w-6 h-6 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-xs absolute top-3 right-3 transition-colors"
                        >
                          ✕
                        </button>
                      )}
                      <div className="w-48">
                        <label className="block text-xs font-medium text-[#94A3B8] mb-1">
                          Language
                        </label>
                        <select
                          value={sc.language}
                          onChange={(e) =>
                            updateStartCode(index, 'language', e.target.value)
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-[#0A0E19] border border-[#263049] text-[#DFE2F2] text-xs capitalize focus:outline-none focus:border-[#3B82F6]"
                        >
                          {DEFAULT_LANGUAGES.map((lang) => (
                            <option key={lang} value={lang}>
                              {lang}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#94A3B8] mb-1">
                          Initial Code
                        </label>
                        <textarea
                          value={sc.initialCode}
                          onChange={(e) =>
                            updateStartCode(
                              index,
                              'initialCode',
                              e.target.value
                            )
                          }
                          required
                          rows={3}
                          className="w-full px-3 py-2 rounded-lg bg-[#0A0E19] border border-[#263049] text-[#DFE2F2] font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ================= REFERENCE SOLUTIONS ================= */}
              <div className="border border-[#263049] rounded-2xl p-5 bg-[#101524]">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-base text-[#DFE2F2]">
                      Reference Solutions
                    </h3>
                    <p className="text-xs text-[#94A3B8]">
                      Complete working solutions. These are checked against the
                      visible test cases before saving.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addReferenceSolution}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1B1F2B] hover:bg-[#262A36] text-[#5DE6FF] border border-[#263049] transition-all"
                  >
                    + Add Reference Solution
                  </button>
                </div>

                <div className="space-y-4">
                  {referenceSolution.map((rs, index) => (
                    <div
                      key={index}
                      className="bg-[#171B27] p-4 rounded-xl border border-[#263049] space-y-3 relative"
                    >
                      {referenceSolution.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeReferenceSolution(index)}
                          className="w-6 h-6 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-xs absolute top-3 right-3 transition-colors"
                        >
                          ✕
                        </button>
                      )}
                      <div className="w-48">
                        <label className="block text-xs font-medium text-[#94A3B8] mb-1">
                          Language
                        </label>
                        <select
                          value={rs.language}
                          onChange={(e) =>
                            updateReferenceSolution(
                              index,
                              'language',
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-[#0A0E19] border border-[#263049] text-[#DFE2F2] text-xs capitalize focus:outline-none focus:border-[#3B82F6]"
                        >
                          {DEFAULT_LANGUAGES.map((lang) => (
                            <option key={lang} value={lang}>
                              {lang}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#94A3B8] mb-1">
                          Complete Working Code
                        </label>
                        <textarea
                          value={rs.completeCode}
                          onChange={(e) =>
                            updateReferenceSolution(
                              index,
                              'completeCode',
                              e.target.value
                            )
                          }
                          required
                          rows={4}
                          className="w-full px-3 py-2 rounded-lg bg-[#0A0E19] border border-[#263049] text-[#DFE2F2] font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#263049]">
                <Link
                  to="/admin"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#94A3B8] hover:bg-[#1B1F2B] hover:text-[#DFE2F2] transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] text-[#0A0E19] shadow-[0_0_16px_rgba(34,211,238,0.3)] hover:shadow-[0_0_24px_rgba(34,211,238,0.5)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-[#0A0E19] border-t-transparent rounded-full animate-spin"></span>
                      Verifying solution...
                    </span>
                  ) : (
                    'Save Problem'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateProblemPage;
