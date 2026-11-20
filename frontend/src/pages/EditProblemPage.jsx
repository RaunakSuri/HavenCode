import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router';
import { updateProblem } from '../problemSlice';
import axiosClient from '../utils/axiosClient';

const DEFAULT_LANGUAGES = ['javascript', 'c++', 'java', 'python'];

function EditProblemPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loadingProblem, setLoadingProblem] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [tags, setTags] = useState('array');
  const [visibleTestCases, setVisibleTestCases] = useState([]);
  const [hiddenTestCases, setHiddenTestCases] = useState([]);
  const [startCode, setStartCode] = useState([]);
  const [referenceSolution, setReferenceSolution] = useState([]);

  // Fetch Existing Problem Data
  useEffect(() => {
    async function fetchProblemDetails() {
      try {
        setLoadingProblem(true);
        const res = await axiosClient.get(`/problem/getProblem/${id}`);
        const data = res.data;
        setTitle(data.title || '');
        setDescription(data.description || '');
        setDifficulty(data.difficulty || 'easy');
        setTags(data.tags || 'array');
        setVisibleTestCases(data.visibleTestCases || [{ input: '', output: '', explanation: '' }]);
        setHiddenTestCases(data.hiddenTestCases || [{ input: '', output: '' }]);
        setStartCode(data.startCode || [{ language: 'javascript', initialCode: '' }]);
        setReferenceSolution(data.referenceSolution || [{ language: 'javascript', completeCode: '' }]);
      } catch (err) {
        setError(err.response?.data || err.message || 'Failed to load problem.');
      } finally {
        setLoadingProblem(false);
      }
    }
    fetchProblemDetails();
  }, [id]);

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
    setSubmitting(true);

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
      const resultAction = await dispatch(updateProblem({ id, problemData }));
      if (updateProblem.fulfilled.match(resultAction)) {
        navigate('/admin');
      } else {
        setError(resultAction.payload || 'Failed to update problem.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProblem) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 pb-12">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow px-6 flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="btn btn-ghost text-xl font-bold tracking-wider">
            LeetCode
          </Link>
          <span className="badge badge-info font-semibold">Edit Problem</span>
        </div>
        <Link to="/admin" className="btn btn-ghost btn-sm">
          Cancel & Back
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-base-100 rounded-xl shadow p-8">
          <h1 className="text-2xl font-bold mb-2">Edit Problem</h1>
          <p className="text-sm text-base-content/70 mb-6">
            Update problem details, test cases, or starter code.
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
                <h3 className="font-bold text-lg">Visible Test Cases</h3>
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
                <h3 className="font-bold text-lg">Hidden Test Cases</h3>
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

            {/* ================= START CODE ================= */}
            <div className="border border-base-300 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg">Starter Code Templates</h3>
                <button
                  type="button"
                  onClick={addStartCode}
                  className="btn btn-outline btn-primary btn-xs"
                >
                  + Add Template
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
                <h3 className="font-bold text-lg">Reference Solutions</h3>
                <button
                  type="button"
                  onClick={addReferenceSolution}
                  className="btn btn-outline btn-primary btn-xs"
                >
                  + Add Solution
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

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-base-200">
              <Link to="/admin" className="btn btn-ghost">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary min-w-32"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    Updating via Judge0...
                  </span>
                ) : (
                  'Update Problem'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProblemPage;
