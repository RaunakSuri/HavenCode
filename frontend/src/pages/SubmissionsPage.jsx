import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserSubmissions, fetchSolvedProblems } from '../problemSlice';
import { logoutUser } from '../authSlice';
import { Link, useNavigate } from 'react-router';
import ThemeToggle from '../components/ThemeToggle';

function SubmissionsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux Data
  const { user } = useSelector((state) => state.auth);
  const { submissions, solvedProblems, loading } = useSelector((state) => state.problems);

  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [langFilter, setLangFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchUserSubmissions());
    dispatch(fetchSolvedProblems());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const solvedCount = useMemo(() => {
    return (solvedProblems || []).filter(Boolean).length;
  }, [solvedProblems]);

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
      const matchesLang =
        langFilter === 'all' || sub.language?.toLowerCase() === langFilter.toLowerCase();
      return matchesStatus && matchesLang;
    });
  }, [submissions, statusFilter, langFilter]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/50 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Accepted
          </span>
        );
      case 'wrong':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/50 text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            Wrong Answer
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/50 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Runtime Error
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#1B1F2B] text-[#94A3B8] border border-[#263049] capitalize">
            {status}
          </span>
        );
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
    <div className="min-h-screen bg-[#0F131E] text-[#DFE2F2] pb-20 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* ================= UNIFIED NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-[#0B0F1A]/85 backdrop-blur-xl border-b border-[#263049] px-6 sm:px-10 h-16 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-[#22D3EE] flex items-center justify-center text-[#0A0E19] font-bold text-base shadow-[0_0_16px_rgba(34,211,238,0.3)] group-hover:scale-105 transition-all duration-200">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#DFE2F2] font-display group-hover:text-white transition-colors">
                  HavenCode
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#5DE6FF] animate-pulse"></span>
              </div>
            </Link>

            {/* Main Nav Links */}
            <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-[#171B27] border border-[#263049] text-xs font-medium">
              <Link
                to="/"
                className="px-3.5 py-1.5 rounded-full text-[#94A3B8] hover:text-[#DFE2F2] transition-colors"
              >
                Problems
              </Link>
              <Link
                to="/solved"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[#94A3B8] hover:text-[#DFE2F2] transition-colors"
              >
                <span>Solved Problems</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#313441] text-[#5DE6FF] border border-[#424754]/50">
                  {solvedCount}
                </span>
              </Link>
              <span className="px-3.5 py-1.5 rounded-full bg-[#262A36] text-[#DFE2F2] font-semibold shadow-[0_0_16px_-4px_rgba(34,211,238,0.3)]">
                Submissions
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-[#2A2110] text-[#F59E0B] border border-[#F59E0B]/40 hover:border-[#F59E0B] transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse"></span>
                <span>Admin Console</span>
              </Link>
            )}

            <ThemeToggle />

            {/* Profile Avatar Dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] flex items-center justify-center cursor-pointer shadow-[0_0_12px_rgba(34,211,238,0.25)] hover:scale-105 transition-all"
              >
                <div className="w-full h-full rounded-full bg-[#0F131E] flex items-center justify-center text-[#5DE6FF] font-bold text-xs">
                  {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
                </div>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-3 shadow-2xl bg-[#171B27] border border-[#263049] rounded-2xl w-60 mt-2 text-xs font-medium space-y-2 z-50 text-[#DFE2F2]"
              >
                <li className="px-1 py-1 border-b border-[#263049] pb-2.5">
                  <div className="flex flex-col gap-0.5 p-0 hover:bg-transparent">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#DFE2F2] text-sm">{user?.firstName}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#262A36] text-[#94A3B8]">
                        {user?.role || 'Developer'}
                      </span>
                    </div>
                    <span className="text-[#64748B] text-[11px] font-normal truncate">{user?.emailId}</span>
                  </div>
                </li>

                {/* Session Sign Out */}
                <li>
                  <button
                    onClick={handleLogout}
                    className="rounded-xl py-2 text-rose-400 hover:bg-rose-950/40 font-semibold flex items-center justify-between"
                  >
                    <span>Sign Out</span>
                    <span>→</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* ================= PAGE HERO & TITLE ================= */}
      <main className="max-w-7xl mx-auto px-6 sm:px-10 pt-10 sm:pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#262A36] text-[#5DE6FF] border border-[#424754]/40 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#5DE6FF] animate-pulse"></span>
              <span>Your Activity</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#DFE2F2] tracking-tight">
              Submission History
            </h1>
            <p className="text-[#94A3B8] text-sm sm:text-base mt-1.5 max-w-xl">
              Review your past submissions, execution metrics, and code solutions.
            </p>
          </div>
        </div>

        {/* 3 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {/* Card 1: Total Submissions */}
          <div className="bg-[#171B27] rounded-3xl p-6 border border-[#263049] shadow-soft relative overflow-hidden group hover:border-[#3B82F6]/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider font-mono">
                Total Submissions
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#262A36] text-[#5DE6FF] flex items-center justify-center text-sm font-bold shadow-xs">
                ⚡
              </div>
            </div>
            <div className="font-display text-3xl sm:text-4xl font-extrabold text-[#DFE2F2]">
              {stats.total}
            </div>
            <div className="text-xs text-[#64748B] mt-2">Every submission you&apos;ve made</div>
          </div>

          {/* Card 2: Accepted Submissions */}
          <div className="bg-[#171B27] rounded-3xl p-6 border border-[#263049] shadow-soft relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider font-mono">
                Accepted Solutions
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-950/60 text-emerald-400 flex items-center justify-center text-sm font-bold shadow-xs border border-emerald-500/30">
                ✓
              </div>
            </div>
            <div className="font-display text-3xl sm:text-4xl font-extrabold text-emerald-400">
              {stats.accepted}
            </div>
            <div className="text-xs text-[#64748B] mt-2">Passed all tests</div>
          </div>

          {/* Card 3: Acceptance Rate */}
          <div className="bg-[#171B27] rounded-3xl p-6 border border-[#263049] shadow-soft relative overflow-hidden group hover:border-[#5DE6FF]/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider font-mono">
                Acceptance Rate
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#262A36] text-[#5DE6FF] flex items-center justify-center text-sm font-bold shadow-xs border border-[#424754]/40">
                %
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-[#5DE6FF]">
                {stats.rate}%
              </div>
            </div>
            {/* Visual Progress Bar */}
            <div className="w-full h-2 bg-[#262A36] rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(stats.rate, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-[#171B27] rounded-2xl p-4 sm:p-5 border border-[#263049] shadow-soft mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#94A3B8]">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#0A0E19] border border-[#263049] text-[#DFE2F2] text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-[#3B82F6] transition-all shadow-xs"
              >
                <option value="all">All Statuses</option>
                <option value="accepted">Accepted</option>
                <option value="wrong">Wrong Answer</option>
                <option value="error">Runtime Error</option>
              </select>
            </div>

            {/* Language Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#94A3B8]">Language:</span>
              <select
                value={langFilter}
                onChange={(e) => setLangFilter(e.target.value)}
                className="bg-[#0A0E19] border border-[#263049] text-[#DFE2F2] text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-[#3B82F6] transition-all shadow-xs"
              >
                <option value="all">All Languages</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="c++">C++</option>
                <option value="java">Java</option>
              </select>
            </div>

            {(statusFilter !== 'all' || langFilter !== 'all') && (
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setLangFilter('all');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#5DE6FF] hover:text-[#ADC6FF] hover:bg-[#262A36] transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>

          <span className="text-xs text-[#64748B] font-medium">
            Showing <span className="text-[#DFE2F2] font-semibold">{filteredSubmissions.length}</span> of {submissions?.length || 0}
          </span>
        </div>

        {/* Submissions Table */}
        <div className="bg-[#171B27] rounded-3xl border border-[#263049] shadow-soft overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 bg-[#171B27]">
              <div className="w-8 h-8 border-2 border-[#5DE6FF] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#64748B] text-xs font-medium">Loading submission records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#101524] text-[#64748B] font-semibold text-xs border-b border-[#263049] uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Problem</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Language</th>
                    <th className="px-6 py-4">Runtime</th>
                    <th className="px-6 py-4">Memory</th>
                    <th className="px-6 py-4">Submitted At</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#263049]">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-[#64748B] text-sm">
                        No submissions found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((sub) => (
                      <tr
                        key={sub._id}
                        className="hover:bg-[#1B1F2B] transition-colors duration-150 group"
                      >
                        <td className="px-6 py-4">
                          {sub.problemId ? (
                            <Link
                              to={`/problem/${sub.problemId._id}`}
                              className="font-semibold text-[#DFE2F2] hover:text-[#5DE6FF] transition-colors"
                            >
                              {sub.problemId.title}
                            </Link>
                          ) : (
                            <span className="text-[#64748B] italic">Archived Problem</span>
                          )}
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(sub.status)}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium uppercase bg-[#1B1F2B] text-[#94A3B8] border border-[#263049]">
                            {sub.language}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-[#94A3B8]">
                          {sub.runtime ? `${sub.runtime.toFixed(2)} ms` : '-'}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-[#94A3B8]">
                          {sub.memory ? `${sub.memory} kB` : '-'}
                        </td>
                        <td className="px-6 py-4 text-xs text-[#64748B]">
                          {formatDate(sub.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedSubmission(sub)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#5DE6FF] hover:bg-[#262A36] border border-[#3B82F6]/30 transition-all active:scale-95"
                          >
                            <span>View Code</span>
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
      </main>

      {/* Code Viewer Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F1A]/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#171B27] rounded-3xl max-w-3xl w-full shadow-2xl border border-[#263049] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#263049] flex items-start justify-between bg-[#101524]">
              <div>
                <h3 className="font-display font-bold text-xl text-[#DFE2F2]">
                  {selectedSubmission.problemId?.title || 'Submission Details'}
                </h3>
                <div className="flex flex-wrap gap-2 items-center mt-2">
                  {getStatusBadge(selectedSubmission.status)}
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold uppercase bg-[#262A36] text-[#94A3B8] border border-[#263049]">
                    {selectedSubmission.language}
                  </span>
                  <span className="text-xs text-[#64748B]">
                    {formatDate(selectedSubmission.createdAt)}
                  </span>
                </div>
              </div>
              <button
                className="w-8 h-8 rounded-xl bg-[#262A36] hover:bg-[#313441] text-[#94A3B8] hover:text-[#DFE2F2] flex items-center justify-center text-sm transition-colors"
                onClick={() => setSelectedSubmission(null)}
              >
                ✕
              </button>
            </div>

            {/* Error Message if any */}
            {selectedSubmission.errorMessage && (
              <div className="mx-6 mt-4 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-400 text-xs font-mono whitespace-pre-wrap">
                {selectedSubmission.errorMessage}
              </div>
            )}

            {/* Code Body */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="bg-[#0A0E19] rounded-2xl p-4.5 text-[#5DE6FF] font-mono text-xs overflow-x-auto border border-[#263049]">
                <pre>
                  <code>{selectedSubmission.code}</code>
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#263049] bg-[#101524] flex justify-end gap-2">
              <button
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#262A36] hover:bg-[#313441] text-[#DFE2F2] transition-all"
                onClick={() => setSelectedSubmission(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubmissionsPage;
