import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserSubmissions } from '../problemSlice';
import { Link } from 'react-router';

function SubmissionsPage() {
  const dispatch = useDispatch();
  const { submissions, loading } = useSelector((state) => state.problems);

  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [langFilter, setLangFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchUserSubmissions());
  }, [dispatch]);

  // Derived Statistics
  const stats = useMemo(() => {
    const total = submissions?.length || 0;
    const accepted = submissions?.filter((s) => s.status === 'accepted')?.length || 0;
    const rate = total > 0 ? Math.round((accepted / total) * 100) : 0;
    return { total, accepted, rate };
  }, [submissions]);

  // Filtered List
  const filteredSubmissions = useMemo(() => {
    return (submissions || []).filter((sub) => {
      const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
      const matchesLang = langFilter === 'all' || sub.language?.toLowerCase() === langFilter.toLowerCase();
      return matchesStatus && matchesLang;
    });
  }, [submissions, statusFilter, langFilter]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <span className="badge badge-success text-white font-medium">Accepted</span>;
      case 'wrong':
        return <span className="badge badge-error text-white font-medium">Wrong Answer</span>;
      case 'error':
        return <span className="badge badge-warning text-white font-medium">Runtime Error</span>;
      default:
        return <span className="badge badge-ghost capitalize">{status}</span>;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Top Navbar */}
      <div className="navbar bg-base-100 shadow px-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="btn btn-ghost text-xl font-bold tracking-wider">
            LeetCode
          </Link>
          <span className="badge badge-primary font-semibold">My Submissions</span>
        </div>
        <Link to="/" className="btn btn-ghost btn-sm">
          Back to Problems
        </Link>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Header Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Submission History</h1>
          <p className="text-sm text-base-content/70 mt-1">
            Review your past problem solutions, execution stats, and code.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="stat bg-base-100 rounded-xl shadow p-4">
            <div className="stat-title text-xs font-semibold uppercase">Total Submissions</div>
            <div className="stat-value text-2xl text-primary">{stats.total}</div>
          </div>
          <div className="stat bg-base-100 rounded-xl shadow p-4">
            <div className="stat-title text-xs font-semibold uppercase">Accepted Submissions</div>
            <div className="stat-value text-2xl text-success">{stats.accepted}</div>
          </div>
          <div className="stat bg-base-100 rounded-xl shadow p-4">
            <div className="stat-title text-xs font-semibold uppercase">Acceptance Rate</div>
            <div className="stat-value text-2xl text-info">{stats.rate}%</div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-base-100 p-4 rounded-xl shadow mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select select-bordered select-sm"
            >
              <option value="all">All Statuses</option>
              <option value="accepted">Accepted</option>
              <option value="wrong">Wrong Answer</option>
              <option value="error">Error</option>
            </select>

            {/* Language Filter */}
            <select
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              className="select select-bordered select-sm"
            >
              <option value="all">All Languages</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="c++">C++</option>
              <option value="java">Java</option>
            </select>

            {(statusFilter !== 'all' || langFilter !== 'all') && (
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setLangFilter('all');
                }}
                className="btn btn-ghost btn-sm text-xs"
              >
                Reset Filters
              </button>
            )}
          </div>

          <span className="text-xs text-base-content/60">
            Showing {filteredSubmissions.length} of {submissions?.length || 0}
          </span>
        </div>

        {/* Submissions Table */}
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
                    <th>Problem</th>
                    <th>Status</th>
                    <th>Language</th>
                    <th>Runtime</th>
                    <th>Memory</th>
                    <th>Submitted At</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-base-content/60">
                        No submissions found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((sub) => (
                      <tr key={sub._id} className="hover">
                        <td>
                          {sub.problemId ? (
                            <Link
                              to={`/problem/${sub.problemId._id}`}
                              className="font-medium hover:text-primary transition-colors"
                            >
                              {sub.problemId.title}
                            </Link>
                          ) : (
                            <span className="text-base-content/50">Deleted Problem</span>
                          )}
                        </td>
                        <td>{getStatusBadge(sub.status)}</td>
                        <td>
                          <span className="badge badge-ghost badge-sm uppercase font-mono">
                            {sub.language}
                          </span>
                        </td>
                        <td className="font-mono text-xs">
                          {sub.runtime ? `${sub.runtime.toFixed(2)} ms` : '-'}
                        </td>
                        <td className="font-mono text-xs">
                          {sub.memory ? `${sub.memory} kB` : '-'}
                        </td>
                        <td className="text-xs text-base-content/70">
                          {formatDate(sub.createdAt)}
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => setSelectedSubmission(sub)}
                            className="btn btn-outline btn-primary btn-xs"
                          >
                            View Code
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Code Viewer Modal */}
      {selectedSubmission && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">
                  {selectedSubmission.problemId?.title || 'Submission Details'}
                </h3>
                <div className="flex gap-2 items-center mt-1">
                  {getStatusBadge(selectedSubmission.status)}
                  <span className="badge badge-outline badge-sm uppercase">
                    {selectedSubmission.language}
                  </span>
                  <span className="text-xs text-base-content/60">
                    {formatDate(selectedSubmission.createdAt)}
                  </span>
                </div>
              </div>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setSelectedSubmission(null)}
              >
                ✕
              </button>
            </div>

            {/* Error Message if any */}
            {selectedSubmission.errorMessage && (
              <div className="alert alert-error text-xs mb-3 font-mono">
                <span>{selectedSubmission.errorMessage}</span>
              </div>
            )}

            {/* Code Box */}
            <div className="mockup-code text-xs max-h-96 overflow-y-auto">
              <pre>
                <code>{selectedSubmission.code}</code>
              </pre>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setSelectedSubmission(null)}
              >
                Close
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setSelectedSubmission(null)}></div>
        </div>
      )}
    </div>
  );
}

export default SubmissionsPage;
