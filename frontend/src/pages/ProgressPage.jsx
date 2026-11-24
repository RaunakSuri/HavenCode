import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProblems, fetchSolvedProblems } from '../problemSlice';
import { logoutUser } from '../authSlice';
import { Link, useNavigate } from 'react-router';
import ThemeToggle from '../components/ThemeToggle';

function ProgressPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { problems, solvedProblems, loading } = useSelector(
    (state) => state.problems
  );

  useEffect(() => {
    dispatch(fetchAllProblems());
    dispatch(fetchSolvedProblems());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const stats = useMemo(() => {
    const total = problems?.length || 0;
    const solvedList = (solvedProblems || []).filter(Boolean);
    const solvedIds = new Set(
      solvedList.map((p) => (typeof p === 'string' ? p : p._id))
    );
    const catalog = problems || [];
    const solved = catalog.filter((p) => solvedIds.has(p._id)).length;

    const byDifficulty = (level) => {
      const inLevel = catalog.filter(
        (p) => p.difficulty?.toLowerCase() === level
      );
      return {
        total: inLevel.length,
        solved: inLevel.filter((p) => solvedIds.has(p._id)).length,
      };
    };

    return {
      total,
      solved,
      remaining: Math.max(total - solved, 0),
      percent: total > 0 ? Math.round((solved / total) * 100) : 0,
      easy: byDifficulty('easy'),
      medium: byDifficulty('medium'),
      hard: byDifficulty('hard'),
    };
  }, [problems, solvedProblems]);

  const summaryCards = [
    {
      label: 'Problems Solved',
      value: stats.solved,
      hint: 'Keep going',
      valueClass: 'text-[#5DE6FF]',
      iconClass: 'bg-[#1B1F2B] text-[#5DE6FF] border border-[#263049]',
      icon: '✓',
    },
    {
      label: 'Total Problems',
      value: stats.total,
      hint: 'Available to solve',
      valueClass: 'text-[#DFE2F2]',
      iconClass: 'bg-[#1B1F2B] text-[#94A3B8] border border-[#263049]',
      icon: '#',
    },
    {
      label: 'Completion',
      value: `${stats.percent}%`,
      hint: 'Of all problems',
      valueClass: 'text-emerald-400',
      iconClass:
        'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30',
      icon: '%',
    },
    {
      label: 'Remaining',
      value: stats.remaining,
      hint: 'Still to solve',
      valueClass: 'text-[#DFE2F2]',
      iconClass: 'bg-amber-950/40 text-amber-400 border border-amber-500/30',
      icon: '○',
    },
  ];

  const difficultyRows = [
    {
      label: 'Easy',
      ...stats.easy,
      bar: 'bg-emerald-400',
      text: 'text-emerald-400',
      badge: 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30',
    },
    {
      label: 'Medium',
      ...stats.medium,
      bar: 'bg-amber-400',
      text: 'text-amber-400',
      badge: 'bg-amber-950/50 text-amber-400 border-amber-500/30',
    },
    {
      label: 'Hard',
      ...stats.hard,
      bar: 'bg-rose-400',
      text: 'text-rose-400',
      badge: 'bg-rose-950/50 text-rose-400 border-rose-500/30',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F131E] text-[#DFE2F2] pb-20 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* ================= UNIFIED NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-[#0B0F1A]/85 backdrop-blur-xl border-b border-[#263049] px-6 sm:px-10 h-16 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img src="/logo.svg" alt="HavenCode" className="h-8 sm:h-9 w-auto group-hover:scale-105 transition-all duration-200" />
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
                  {stats.solved}
                </span>
              </Link>
              <Link
                to="/submissions"
                className="px-3.5 py-1.5 rounded-full text-[#94A3B8] hover:text-[#DFE2F2] transition-colors"
              >
                Submissions
              </Link>
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
                      <span className="font-bold text-[#DFE2F2] text-sm">
                        {user?.firstName}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#262A36] text-[#94A3B8]">
                        {user?.role || 'Developer'}
                      </span>
                    </div>
                    <span className="text-[#64748B] text-[11px] font-normal truncate">
                      {user?.emailId}
                    </span>
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
      <main className="mx-auto w-full max-w-7xl px-6 sm:px-10 pt-10 sm:pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#262A36] text-[#5DE6FF] border border-[#424754]/40 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#5DE6FF] animate-pulse"></span>
              <span>Your Progress</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#DFE2F2] tracking-tight">
              Progress Overview
            </h1>
            <p className="text-[#94A3B8] text-sm sm:text-base mt-1.5 max-w-xl">
              See what you&apos;ve solved and where to focus next.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="bg-[#171B27] rounded-3xl border border-[#263049] shadow-soft flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-8 h-8 border-2 border-[#5DE6FF] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#64748B] text-xs font-medium">
              Loading your progress...
            </p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {summaryCards.map((card) => (
                <div
                  key={card.label}
                  className="bg-[#171B27] rounded-3xl p-6 border border-[#263049] shadow-soft hover:border-[#3B82F6]/40 hover:shadow-glow-cyan transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                      {card.label}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${card.iconClass}`}
                    >
                      {card.icon}
                    </div>
                  </div>
                  <div
                    className={`font-display text-3xl sm:text-4xl font-extrabold ${card.valueClass}`}
                  >
                    {card.value}
                  </div>
                  <div className="text-xs text-[#64748B] mt-2">{card.hint}</div>
                </div>
              ))}
            </div>

            {/* Difficulty Breakdown */}
            <div className="bg-[#171B27] rounded-3xl border border-[#263049] shadow-soft p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#DFE2F2] tracking-tight">
                    Progress by Difficulty
                  </h2>
                  <p className="text-sm text-[#94A3B8] mt-1">
                    Your solved problems across each level.
                  </p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#262A36] text-[#DFE2F2] border border-[#263049]">
                  {stats.solved} of {stats.total} solved
                </span>
              </div>

              <div className="space-y-5">
                {difficultyRows.map((row) => {
                  const percent =
                    row.total > 0
                      ? Math.round((row.solved / row.total) * 100)
                      : 0;

                  return (
                    <div key={row.label}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${row.badge}`}
                          >
                            {row.label}
                          </span>
                          <span className="text-xs text-[#64748B] font-medium">
                            {percent}% complete
                          </span>
                        </div>
                        <span className={`text-xs font-bold ${row.text}`}>
                          {row.solved} / {row.total}
                        </span>
                      </div>
                      <div className="w-full bg-[#101524] rounded-full h-2 overflow-hidden border border-[#263049]">
                        <div
                          className={`${row.bar} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 mt-6 border-t border-[#263049] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-[#64748B]">
                  Solve a problem to update your progress.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold text-[#0A0E19] bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] shadow-[0_0_16px_rgba(34,211,238,0.3)] hover:shadow-[0_0_24px_rgba(34,211,238,0.5)] active:scale-95 transition-all"
                >
                  Continue Practicing →
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default ProgressPage;
