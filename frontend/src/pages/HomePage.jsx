import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProblems, fetchSolvedProblems } from '../problemSlice';
import { logoutUser } from '../authSlice';
import { Link } from 'react-router';

function HomePage() {
  const dispatch = useDispatch();
  
  // Data from Redux
  const { user } = useSelector((state) => state.auth);
  const { problems, solvedProblems, loading } = useSelector((state) => state.problems);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [tag, setTag] = useState('all');
  const [status, setStatus] = useState('all'); // 'all', 'solved', 'unsolved'

  // Fetch problems & solved problems on mount
  useEffect(() => {
    dispatch(fetchAllProblems());
    dispatch(fetchSolvedProblems());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Set of solved IDs for fast O(1) checks
  const solvedProblemIds = useMemo(() => {
    return new Set(
      (solvedProblems || []).map((p) => (typeof p === 'string' ? p : p._id))
    );
  }, [solvedProblems]);

  // Client-side filtering logic
  const filteredProblems = useMemo(() => {
    return (problems || []).filter((problem) => {
      const isSolved = solvedProblemIds.has(problem._id);

      // Search matching
      const matchesSearch = problem.title?.toLowerCase().includes(search.toLowerCase());

      // Difficulty matching
      const matchesDifficulty =
        difficulty === 'all' || problem.difficulty?.toLowerCase() === difficulty.toLowerCase();

      // Tag matching
      const matchesTag =
        tag === 'all' || (problem.tags && problem.tags.toLowerCase() === tag.toLowerCase());

      // Status matching
      const matchesStatus =
        status === 'all' ||
        (status === 'solved' && isSolved) ||
        (status === 'unsolved' && !isSolved);

      return matchesSearch && matchesDifficulty && matchesTag && matchesStatus;
    });
  }, [problems, search, difficulty, tag, status, solvedProblemIds]);

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

  return (
    <div className="min-h-screen bg-base-200">
      {/* ================= NAVBAR ================= */}
      <div className="navbar bg-base-100 shadow-md px-6">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl font-bold tracking-wider">
            LeetCode
          </Link>
        </div>

        <div className="flex-none gap-4">
          {/* Solved Problems Counter */}
          <div className="badge badge-outline badge-primary py-3 px-4 font-medium">
            Solved: {solvedProblems?.length || 0}
          </div>

          {/* User Profile Avatar & Dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar placeholder"
            >
              <div className="bg-primary text-primary-content rounded-full w-10">
                <span className="text-base uppercase font-semibold">
                  {user?.firstName ? user.firstName[0] : 'U'}
                </span>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-200"
            >
              <li className="menu-title px-4 py-2">
                <span className="font-bold text-base-content text-sm">
                  {user?.firstName}
                </span>
                <span className="text-xs text-base-content/60 font-normal">
                  {user?.emailId}
                </span>
              </li>
              <div className="divider my-1"></div>
              <li>
                <button onClick={handleLogout} className="text-error font-medium">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Problems</h1>
          <p className="text-base-content/70 text-sm mt-1">
            Pick a problem to start coding and practice your DSA skills.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-base-100 p-4 rounded-xl shadow mb-6 flex flex-wrap gap-4 items-center justify-between">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-full sm:w-64"
          />

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="select select-bordered select-sm"
            >
              <option value="all">All Status</option>
              <option value="solved">Solved</option>
              <option value="unsolved">Unsolved</option>
            </select>

            {/* Difficulty Filter */}
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="select select-bordered select-sm"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* Tag Filter */}
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="select select-bordered select-sm"
            >
              <option value="all">All Tags</option>
              <option value="array">Array</option>
              <option value="strings">Strings</option>
              <option value="linkedList">Linked List</option>
              <option value="tree">Tree</option>
              <option value="heap">Heap</option>
              <option value="graph">Graph</option>
              <option value="dp">Dynamic Programming</option>
            </select>

            {/* Reset Button */}
            {(search || difficulty !== 'all' || tag !== 'all' || status !== 'all') && (
              <button
                onClick={() => {
                  setSearch('');
                  setDifficulty('all');
                  setTag('all');
                  setStatus('all');
                }}
                className="btn btn-ghost btn-sm text-xs"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Table of Problems */}
        <div className="bg-base-100 rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="border-b border-base-200">
                    <th className="w-16">Status</th>
                    <th>Title</th>
                    <th className="w-32">Difficulty</th>
                    <th className="w-36">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProblems.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-10 text-base-content/60">
                        No problems found.
                      </td>
                    </tr>
                  ) : (
                    filteredProblems.map((problem) => {
                      const isSolved = solvedProblemIds.has(problem._id);
                      return (
                        <tr key={problem._id} className="hover">
                          <td>
                            {isSolved ? (
                              <span className="text-success font-bold text-lg">✓</span>
                            ) : (
                              <span className="text-base-content/30">-</span>
                            )}
                          </td>
                          <td>
                            <Link
                              to={`/problem/${problem._id}`}
                              className="font-medium hover:text-primary transition-colors"
                            >
                              {problem.title}
                            </Link>
                          </td>
                          <td>{getDifficultyBadge(problem.difficulty)}</td>
                          <td>
                            {problem.tags && (
                              <span className="badge badge-ghost badge-sm capitalize">
                                {problem.tags}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;