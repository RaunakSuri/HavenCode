import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProblems, fetchSolvedProblems } from '../problemSlice';
import { logoutUser } from '../authSlice';
import { Link } from 'react-router';
import ThemeToggle from '../components/ThemeToggle';
import Footer from '../components/Footer';

function SolvedProblemsPage() {
  const dispatch = useDispatch();

  // Redux Data
  const { user } = useSelector((state) => state.auth);
  const { problems, solvedProblems, loading } = useSelector(
    (state) => state.problems
  );

  // Search & Difficulty Categorization States
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all'); // 'all', 'easy', 'medium', 'hard'
  const [selectedTag, setSelectedTag] = useState('all');

  useEffect(() => {
    dispatch(fetchAllProblems());
    dispatch(fetchSolvedProblems());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Set of solved IDs
  const solvedProblemIds = useMemo(() => {
    return new Set(
      (solvedProblems || [])
        .filter(Boolean)
        .map((p) => (typeof p === 'string' ? p : p._id))
    );
  }, [solvedProblems]);

  // Full problem objects for solved problems
  const solvedList = useMemo(() => {
    return (problems || []).filter((problem) =>
      solvedProblemIds.has(problem._id)
    );
  }, [problems, solvedProblemIds]);

  // Solved Stats & Categorization
  const stats = useMemo(() => {
    const total = problems?.length || 0;
    const solved = solvedList.length;

    const easyCatalog = (problems || []).filter(
      (p) => p.difficulty?.toLowerCase() === 'easy'
    );
    const easySolved = solvedList.filter(
      (p) => p.difficulty?.toLowerCase() === 'easy'
    ).length;

    const medCatalog = (problems || []).filter(
      (p) => p.difficulty?.toLowerCase() === 'medium'
    );
    const medSolved = solvedList.filter(
      (p) => p.difficulty?.toLowerCase() === 'medium'
    ).length;

    const hardCatalog = (problems || []).filter(
      (p) => p.difficulty?.toLowerCase() === 'hard'
    );
    const hardSolved = solvedList.filter(
      (p) => p.difficulty?.toLowerCase() === 'hard'
    ).length;

    return {
      total,
      solved,
      percent: total > 0 ? Math.round((solved / total) * 100) : 0,
      easy: { solved: easySolved, total: easyCatalog.length },
      med: { solved: medSolved, total: medCatalog.length },
      hard: { solved: hardSolved, total: hardCatalog.length },
    };
  }, [problems, solvedList]);

  // Filtered Solved Problems
  const filteredSolvedProblems = useMemo(() => {
    return solvedList.filter((problem) => {
      const matchesSearch =
        problem.title?.toLowerCase().includes(search.toLowerCase()) ||
        problem.tags?.toLowerCase().includes(search.toLowerCase());

      const matchesDifficulty =
        difficultyFilter === 'all' ||
        problem.difficulty?.toLowerCase() === difficultyFilter.toLowerCase();

      const matchesTag =
        selectedTag === 'all' ||
        (problem.tags &&
          problem.tags.toLowerCase() === selectedTag.toLowerCase());

      return matchesSearch && matchesDifficulty && matchesTag;
    });
  }, [solvedList, search, difficultyFilter, selectedTag]);

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
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#1B1F2B] text-[#94A3B8] border border-[#263049]">
            {diff}
          </span>
        );
    }
  };

  const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'array', label: 'Arrays & Hashing' },
    { id: 'strings', label: 'Strings' },
    { id: 'linkedList', label: 'Linked Lists' },
    { id: 'tree', label: 'Trees' },
    { id: 'dp', label: 'Dynamic Programming' },
    { id: 'graph', label: 'Graphs' },
    { id: 'heap', label: 'Heaps' },
  ];

  return (
    <div className="min-h-screen bg-[#0F131E] text-[#DFE2F2] flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* ================= MODERN DARK NAVBAR ================= */}
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
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#262A36] text-[#DFE2F2] font-semibold shadow-[0_0_16px_-4px_rgba(34,211,238,0.3)]">
                <span>Solved Problems</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#313441] text-[#5DE6FF] border border-[#424754]/50">
                  {stats.solved}
                </span>
              </span>
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

                <li className="px-1 py-1 border-b border-[#263049] pb-2.5">
                  <div className="flex flex-col gap-1.5 p-0 hover:bg-transparent">
                    <div className="flex justify-between items-center text-[11px] text-[#94A3B8]">
                      <span>Solved Progress</span>
                      <span className="font-bold text-[#DFE2F2]">
                        {stats.solved} / {stats.total}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#262A36] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] rounded-full transition-all duration-500"
                        style={{ width: `${stats.percent}%` }}
                      ></div>
                    </div>
                  </div>
                </li>

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
      <main className="mx-auto w-full max-w-7xl px-6 sm:px-10 pt-10 sm:pt-12 pb-12 sm:pb-16 flex-1">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Conquered Challenges</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#DFE2F2] tracking-tight">
              Solved Problems
            </h1>
            <p className="text-[#94A3B8] text-sm sm:text-base mt-1.5 max-w-xl">
              Track your solved algorithm challenges categorized across Easy,
              Medium, and Hard difficulty tiers.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#DFE2F2] bg-[#171B27] hover:bg-[#1B1F2B] border border-[#263049] shadow-soft transition-all self-start md:self-auto"
          >
            <span>← Practice More Problems</span>
          </Link>
        </div>

        {/* ================= 4 CATEGORIZATION SUMMARY CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {/* Card 1: Total Solved */}
          <div className="bg-[#171B27] rounded-3xl p-6 border border-[#263049] shadow-soft hover:border-[#3B82F6]/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider font-mono">
                Total Solved
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#262A36] text-[#5DE6FF] flex items-center justify-center text-sm font-bold shadow-xs">
                ✓
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl sm:text-4xl font-extrabold text-[#DFE2F2]">
                {stats.solved}
              </span>
              <span className="text-xs text-[#64748B] font-medium">
                / {stats.total} total
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-[#262A36] rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] rounded-full transition-all duration-500"
                style={{ width: `${stats.percent}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-[#64748B] mt-2 font-medium">
              {stats.percent}% completion rate
            </div>
          </div>

          {/* Card 2: Easy Categorization */}
          <div className="bg-[#171B27] rounded-3xl p-6 border border-[#263049] shadow-soft hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Easy</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                {stats.easy.total > 0
                  ? Math.round((stats.easy.solved / stats.easy.total) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl sm:text-4xl font-extrabold text-emerald-400">
                {stats.easy.solved}
              </span>
              <span className="text-xs text-[#64748B] font-medium">
                / {stats.easy.total} available
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#262A36] rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{
                  width: `${stats.easy.total > 0 ? (stats.easy.solved / stats.easy.total) * 100 : 0}%`,
                }}
              ></div>
            </div>
            <div className="text-[11px] text-[#64748B] mt-2 font-medium">
              {stats.easy.solved} solved out of {stats.easy.total}
            </div>
          </div>

          {/* Card 3: Medium Categorization */}
          <div className="bg-[#171B27] rounded-3xl p-6 border border-[#263049] shadow-soft hover:border-amber-500/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Medium</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/60 text-amber-400 border border-amber-500/30">
                {stats.med.total > 0
                  ? Math.round((stats.med.solved / stats.med.total) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl sm:text-4xl font-extrabold text-amber-400">
                {stats.med.solved}
              </span>
              <span className="text-xs text-[#64748B] font-medium">
                / {stats.med.total} available
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#262A36] rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{
                  width: `${stats.med.total > 0 ? (stats.med.solved / stats.med.total) * 100 : 0}%`,
                }}
              ></div>
            </div>
            <div className="text-[11px] text-[#64748B] mt-2 font-medium">
              {stats.med.solved} solved out of {stats.med.total}
            </div>
          </div>

          {/* Card 4: Hard Categorization */}
          <div className="bg-[#171B27] rounded-3xl p-6 border border-[#263049] shadow-soft hover:border-rose-500/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-wider font-mono">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <span>Hard</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/60 text-rose-400 border border-rose-500/30">
                {stats.hard.total > 0
                  ? Math.round((stats.hard.solved / stats.hard.total) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl sm:text-4xl font-extrabold text-rose-400">
                {stats.hard.solved}
              </span>
              <span className="text-xs text-[#64748B] font-medium">
                / {stats.hard.total} available
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#262A36] rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-rose-400 rounded-full transition-all duration-500"
                style={{
                  width: `${stats.hard.total > 0 ? (stats.hard.solved / stats.hard.total) * 100 : 0}%`,
                }}
              ></div>
            </div>
            <div className="text-[11px] text-[#64748B] mt-2 font-medium">
              {stats.hard.solved} solved out of {stats.hard.total}
            </div>
          </div>
        </div>

        {/* ================= SOLVED PROBLEMS CATALOG ================= */}
        <div className="bg-[#171B27] rounded-3xl shadow-soft border border-[#263049] p-6 sm:p-8 space-y-6">
          {/* Controls: Search & Difficulty Toggles */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-[#DFE2F2] tracking-tight">
                Solved Catalog
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Showing {filteredSolvedProblems.length} of {stats.solved} solved
                problems
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#64748B]">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search solved problems..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0A0E19] border border-[#263049] rounded-xl text-sm text-[#DFE2F2] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Difficulty Categorization Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs border-b border-[#263049] pb-4">
            <div className="inline-flex rounded-xl bg-[#1B1F2B] p-1 border border-[#263049]">
              {[
                { id: 'all', label: `All (${stats.solved})` },
                { id: 'easy', label: `Easy (${stats.easy.solved})` },
                { id: 'medium', label: `Medium (${stats.med.solved})` },
                { id: 'hard', label: `Hard (${stats.hard.solved})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDifficultyFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg capitalize font-medium transition-all ${
                    difficultyFilter === tab.id
                      ? 'bg-[#262A36] text-[#DFE2F2] shadow-xs font-semibold'
                      : 'text-[#94A3B8] hover:text-[#DFE2F2]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Topic Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedTag(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    selectedTag === cat.id
                      ? 'bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] text-[#0A0E19] font-bold shadow-xs'
                      : 'bg-[#1B1F2B] text-[#94A3B8] hover:bg-[#262A36] hover:text-[#DFE2F2] border border-[#263049]/60'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Solved Problems Table */}
          <div className="rounded-2xl border border-[#263049] overflow-hidden shadow-xs">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 bg-[#171B27]">
                <span className="w-7 h-7 border-2 border-[#5DE6FF] border-t-transparent rounded-full animate-spin"></span>
                <span className="text-xs text-[#94A3B8] font-medium">
                  Loading solved problems...
                </span>
              </div>
            ) : filteredSolvedProblems.length === 0 ? (
              <div className="text-center py-16 bg-[#171B27]">
                <div className="w-12 h-12 rounded-2xl bg-[#262A36] text-[#5DE6FF] flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  ✓
                </div>
                <h3 className="font-display font-bold text-[#DFE2F2] text-base">
                  {stats.solved === 0
                    ? 'No problems solved yet'
                    : 'No matching solved problems'}
                </h3>
                <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                  {stats.solved === 0
                    ? 'Start practicing from the catalog and submit working solutions to build your solved collection!'
                    : 'Try selecting a different difficulty filter or resetting your search query.'}
                </p>
                <div className="mt-5">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] text-[#0A0E19] shadow-[0_0_16px_rgba(34,211,238,0.3)] transition-all"
                  >
                    <span>Browse All Problems</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#101524] border-b border-[#263049] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      <th className="py-3.5 px-6 w-16">Status</th>
                      <th className="py-3.5 px-6">Problem</th>
                      <th className="py-3.5 px-6 w-32">Difficulty</th>
                      <th className="py-3.5 px-6 w-44">Category</th>
                      <th className="py-3.5 px-6 w-28 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#263049] bg-[#171B27]">
                    {filteredSolvedProblems.map((problem) => (
                      <tr
                        key={problem._id}
                        className="hover:bg-[#1B1F2B] transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <span className="w-6 h-6 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-bold shadow-xs">
                            ✓
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <Link
                            to={`/problem/${problem._id}`}
                            className="font-semibold text-[#DFE2F2] group-hover:text-[#5DE6FF] transition-colors flex items-center gap-2"
                          >
                            <span>{problem.title}</span>
                          </Link>
                        </td>
                        <td className="py-4 px-6">
                          {getDifficultyPill(problem.difficulty)}
                        </td>
                        <td className="py-4 px-6">
                          {problem.tags && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#1B1F2B] text-[#94A3B8] capitalize border border-[#263049]">
                              {problem.tags}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Link
                            to={`/problem/${problem._id}`}
                            className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#262A36] text-emerald-400 hover:bg-emerald-500 hover:text-[#0A0E19] border border-emerald-500/30 transition-all shadow-xs"
                          >
                            <span>Review</span>
                            <span className="ml-1">→</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default SolvedProblemsPage;
