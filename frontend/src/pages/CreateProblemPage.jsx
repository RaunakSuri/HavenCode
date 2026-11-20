import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router';
import { createProblem } from '../problemSlice';

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
    { language: 'javascript', initialCode: 'function solution() {\n  // your code here\n}' },
  ]);

  // Dynamic Array: Reference Solution (one per language)
  const [referenceSolution, setReferenceSolution] = useState([
    { language: 'javascript', completeCode: 'function solution() {\n  // complete working solution\n}' },
  ]);

  // Handlers for Visible Test Cases
  const addVisibleTestCase = () => {
    setVisibleTestCases([...visibleTestCases, { input: '', output: '', explanation: '' }]);
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
    setReferenceSolution([...referenceSolution, { language: 'python', completeCode: '' }]);
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
        setError(resultAction.payload || 'Failed to create problem. Ensure reference solution passes Judge0 test cases.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 pb-12">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow px-6 flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="btn btn-ghost text-xl font-bold tracking-wider">
            LeetCode
          </Link>
          <span className="badge badge-warning font-semibold">Create Problem</span>
        </div>
        <Link to="/admin" className="btn btn-ghost btn-sm">
          Cancel & Back
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-base-100 rounded-xl shadow p-8">
          <h1 className="text-2xl font-bold mb-2">Create New Problem</h1>
          <p className="text-sm text-base-content/70 mb-6">
            Enter the details, test cases, and reference solutions. Reference solutions will be verified against visible test cases via Judge0 upon saving.
          </p>

          {error && (
            <div className="alert alert-error text-sm mb-6">
              <span>{typeof error === 'string' ? error : JSON.stringify(error)}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Problem Title</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Two Sum"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>

            {/* Difficulty & Tag */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Difficulty</span>
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Category / Tag</span>
                </label>
                <select
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="select select-bordered w-full"
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
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Problem Description</span>
              </label>
              <textarea
                placeholder="Explain the problem statement clearly..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                className="textarea textarea-bordered w-full font-mono text-sm"
              />
            </div>

            {/* ================= VISIBLE TEST CASES ================= */}
            <div className="border border-base-300 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-bold text-lg">Visible Test Cases</h3>
                  <p className="text-xs text-base-content/60">Visible to users as examples and used to verify solutions.</p>
                </div>
                <button
                  type="button"
                  onClick={addVisibleTestCase}
                  className="btn btn-outline btn-primary btn-xs"
                >
                  + Add Example
                </button>
              </div>

              <div className="space-y-4">
                {visibleTestCases.map((tc, index) => (
                  <div key={index} className="bg-base-200 p-4 rounded-lg space-y-2 relative">
                    {visibleTestCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVisibleTestCase(index)}
                        className="btn btn-ghost btn-circle btn-xs text-error absolute top-2 right-2"
                      >
                        ✕
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <label className="label py-1 text-xs font-semibold">Input (STDIN)</label>
                        <input
                          type="text"
                          placeholder="e.g. [2,7,11,15]\n9"
                          value={tc.input}
                          onChange={(e) => updateVisibleTestCase(index, 'input', e.target.value)}
                          required
                          className="input input-bordered input-sm w-full font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="label py-1 text-xs font-semibold">Expected Output</label>
                        <input
                          type="text"
                          placeholder="e.g. [0,1]"
                          value={tc.output}
                          onChange={(e) => updateVisibleTestCase(index, 'output', e.target.value)}
                          required
                          className="input input-bordered input-sm w-full font-mono text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="label py-1 text-xs font-semibold">Explanation</label>
                      <input
                        type="text"
                        placeholder="e.g. Because nums[0] + nums[1] == 9, we return [0, 1]."
                        value={tc.explanation}
                        onChange={(e) => updateVisibleTestCase(index, 'explanation', e.target.value)}
                        required
                        className="input input-bordered input-sm w-full text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= HIDDEN TEST CASES ================= */}
            <div className="border border-base-300 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-bold text-lg">Hidden Test Cases</h3>
                  <p className="text-xs text-base-content/60">Used to grade final submissions upon submission.</p>
                </div>
                <button
                  type="button"
                  onClick={addHiddenTestCase}
                  className="btn btn-outline btn-primary btn-xs"
                >
                  + Add Hidden Case
                </button>
              </div>

              <div className="space-y-4">
                {hiddenTestCases.map((tc, index) => (
                  <div key={index} className="bg-base-200 p-4 rounded-lg relative">
                    {hiddenTestCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHiddenTestCase(index)}
                        className="btn btn-ghost btn-circle btn-xs text-error absolute top-2 right-2"
                      >
                        ✕
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <label className="label py-1 text-xs font-semibold">Input (STDIN)</label>
                        <input
                          type="text"
                          placeholder="e.g. [3,2,4]\n6"
                          value={tc.input}
                          onChange={(e) => updateHiddenTestCase(index, 'input', e.target.value)}
                          required
                          className="input input-bordered input-sm w-full font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="label py-1 text-xs font-semibold">Expected Output</label>
                        <input
                          type="text"
                          placeholder="e.g. [1,2]"
                          value={tc.output}
                          onChange={(e) => updateHiddenTestCase(index, 'output', e.target.value)}
                          required
                          className="input input-bordered input-sm w-full font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= START CODE TEMPLATES ================= */}
            <div className="border border-base-300 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-bold text-lg">Starter Code Templates</h3>
                  <p className="text-xs text-base-content/60">Boilerplate prefilled in the code editor for users.</p>
                </div>
                <button
                  type="button"
                  onClick={addStartCode}
                  className="btn btn-outline btn-primary btn-xs"
                >
                  + Add Language Template
                </button>
              </div>

              <div className="space-y-4">
                {startCode.map((sc, index) => (
                  <div key={index} className="bg-base-200 p-4 rounded-lg space-y-2 relative">
                    {startCode.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStartCode(index)}
                        className="btn btn-ghost btn-circle btn-xs text-error absolute top-2 right-2"
                      >
                        ✕
                      </button>
                    )}
                    <div className="w-48">
                      <label className="label py-1 text-xs font-semibold">Language</label>
                      <select
                        value={sc.language}
                        onChange={(e) => updateStartCode(index, 'language', e.target.value)}
                        className="select select-bordered select-sm w-full capitalize"
                      >
                        {DEFAULT_LANGUAGES.map((lang) => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label py-1 text-xs font-semibold">Initial Code</label>
                      <textarea
                        value={sc.initialCode}
                        onChange={(e) => updateStartCode(index, 'initialCode', e.target.value)}
                        required
                        rows={3}
                        className="textarea textarea-bordered w-full font-mono text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= REFERENCE SOLUTIONS ================= */}
            <div className="border border-base-300 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-bold text-lg">Reference Solutions</h3>
                  <p className="text-xs text-base-content/60">
                    Complete working solutions. Backend executes these against Judge0 to ensure correctness before saving.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addReferenceSolution}
                  className="btn btn-outline btn-primary btn-xs"
                >
                  + Add Reference Solution
                </button>
              </div>

              <div className="space-y-4">
                {referenceSolution.map((rs, index) => (
                  <div key={index} className="bg-base-200 p-4 rounded-lg space-y-2 relative">
                    {referenceSolution.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeReferenceSolution(index)}
                        className="btn btn-ghost btn-circle btn-xs text-error absolute top-2 right-2"
                      >
                        ✕
                      </button>
                    )}
                    <div className="w-48">
                      <label className="label py-1 text-xs font-semibold">Language</label>
                      <select
                        value={rs.language}
                        onChange={(e) => updateReferenceSolution(index, 'language', e.target.value)}
                        className="select select-bordered select-sm w-full capitalize"
                      >
                        {DEFAULT_LANGUAGES.map((lang) => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label py-1 text-xs font-semibold">Complete Working Code</label>
                      <textarea
                        value={rs.completeCode}
                        onChange={(e) => updateReferenceSolution(index, 'completeCode', e.target.value)}
                        required
                        rows={4}
                        className="textarea textarea-bordered w-full font-mono text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t border-base-200">
              <Link to="/admin" className="btn btn-ghost">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary min-w-32"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    Verifying via Judge0...
                  </span>
                ) : (
                  'Save Problem'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateProblemPage;
