import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProblems, fetchSolvedProblems } from '../problemSlice';
import { logoutUser } from '../authSlice';
import { Link, useSearchParams } from 'react-router';
import ThemeToggle from '../components/ThemeToggle';

function HomePage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  // Real Data from Redux & DB
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

  // Handle URL query parameters (e.g. ?status=solved)
  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam === 'solved') {
      setStatus('solved');
      setTimeout(() => {
        document.getElementById('problems')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [searchParams]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Set of solved problem IDs for fast O(1) checks
  const solvedProblemIds = useMemo(() => {
    return new Set(
      (solvedProblems || [])
        .filter(Boolean)
        .map((p) => (typeof p === 'string' ? p : p._id))
    );
  }, [solvedProblems]);

  // Breakdown statistics computed directly from DB data
  const stats = useMemo(() => {
    const total = problems?.length || 0;
    const catalogIds = new Set((problems || []).map((p) => p._id));
    const solved = [...solvedProblemIds].filter((id) => catalogIds.has(id)).length;

    const easyTotal = (problems || []).filter((p) => p.difficulty?.toLowerCase() === 'easy').length;
    const easySolved = (problems || []).filter(
      (p) => p.difficulty?.toLowerCase() === 'easy' && solvedProblemIds.has(p._id)
    ).length;

    const medTotal = (problems || []).filter((p) => p.difficulty?.toLowerCase() === 'medium').length;
    const medSolved = (problems || []).filter(
      (p) => p.difficulty?.toLowerCase() === 'medium' && solvedProblemIds.has(p._id)
    ).length;

    const hardTotal = (problems || []).filter((p) => p.difficulty?.toLowerCase() === 'hard').length;
    const hardSolved = (problems || []).filter(
      (p) => p.difficulty?.toLowerCase() === 'hard' && solvedProblemIds.has(p._id)
    ).length;

    return {
      total,
      solved,
      easy: { solved: easySolved, total: easyTotal },
      med: { solved: medSolved, total: medTotal },
      hard: { solved: hardSolved, total: hardTotal },
      percent: total > 0 ? Math.min(100, Math.round((solved / total) * 100)) : 0,
    };
  }, [problems, solvedProblems, solvedProblemIds]);

  // Dynamic greeting based on current time
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const displayName = user?.firstName || 'Raunak';

  // Client-side filtering logic
  const filteredProblems = useMemo(() => {
    return (problems || []).filter((problem) => {
      const isSolved = solvedProblemIds.has(problem._id);

      const matchesSearch =
        problem.title?.toLowerCase().includes(search.toLowerCase()) ||
        problem.tags?.toLowerCase().includes(search.toLowerCase());

      const matchesDifficulty =
        difficulty === 'all' || problem.difficulty?.toLowerCase() === difficulty.toLowerCase();

      const matchesTag =
        tag === 'all' || (problem.tags && problem.tags.toLowerCase() === tag.toLowerCase());

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

  const scrollToProblems = () => {
    document.getElementById('problems')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const startQuickPractice = (level) => {
    setSearch('');
    setTag('all');
    setStatus('all');
    setDifficulty(level);
    scrollToProblems();
  };

  const practiceLevels = [
    { id: 'easy', label: 'Easy', dot: 'bg-emerald-400' },
    { id: 'medium', label: 'Medium', dot: 'bg-amber-400' },
    { id: 'hard', label: 'Hard', dot: 'bg-rose-400' },
  ];

  return (
    <div className="min-h-screen bg-[#0F131E] text-[#DFE2F2] pb-20 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* ================= MODERN DARK NAVBAR ================= */}
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

            <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-[#171B27] border border-[#263049] text-xs font-medium">
              <Link
                to="/"
                className="px-3.5 py-1.5 rounded-full bg-[#262A36] text-[#DFE2F2] font-semibold shadow-[0_0_16px_-4px_rgba(34,211,238,0.3)]"
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
                      <span className="font-bold text-[#DFE2F2] text-sm">{user?.firstName}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#262A36] text-[#94A3B8]">
                        {user?.role || 'Developer'}
                      </span>
                    </div>
                    <span className="text-[#64748B] text-[11px] font-normal truncate">{user?.emailId}</span>
                  </div>
                </li>

                {/* Live Progress Summary */}
                <li className="px-1 py-1 border-b border-[#263049] pb-2.5">
                  <div className="flex flex-col gap-1.5 p-0 hover:bg-transparent">
                    <div className="flex justify-between items-center text-[11px] text-[#94A3B8]">
                      <span>Solved Progress</span>
                      <span className="font-bold text-[#DFE2F2]">{stats.solved} / {stats.total}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#262A36] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] rounded-full transition-all duration-500"
                        style={{ width: `${stats.percent}%` }}
                      ></div>
                    </div>
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

      {/* ================= GREETING HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-10 sm:pt-14 pb-8">
        {/* Modern Dark Ambient Glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[600px] h-[340px] bg-[#3B82F6]/10 rounded-full blur-[140px]"></div>
          <div className="absolute top-20 right-10 w-[460px] h-[280px] bg-[#22D3EE]/10 rounded-full blur-[120px]"></div>
          <div className="absolute -top-[400px] right-[-140px] h-[720px] w-[720px] rounded-full border border-white/[0.04]"></div>
          <div className="absolute -top-[310px] right-[-60px] h-[550px] w-[550px] rounded-full border border-white/[0.03]"></div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10">
          {/* Greeting Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight text-[#DFE2F2] leading-[1.15]">
            {greeting},{' '}
            <span className="bg-gradient-to-r from-[#ADC6FF] via-[#5DE6FF] to-[#3B82F6] bg-clip-text text-transparent font-bold">
              {displayName}.
            </span>
          </h1>
          <p className="mt-2.5 text-base sm:text-lg text-[#94A3B8] font-normal max-w-xl">
            Ready for your next challenge?
          </p>

          {/* Explore Problems CTA Button */}
          <div className="mt-7">
            <button
              type="button"
              onClick={scrollToProblems}
              className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] text-[#0A0E19] px-6 py-3.5 text-sm font-bold shadow-[0_0_24px_-4px_rgba(34,211,238,0.4)] hover:shadow-[0_0_32px_0px_rgba(34,211,238,0.65)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#0A0E19]/15 text-[#0A0E19]">
                <svg className="h-3 w-3 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span>Explore Problems</span>
              <span className="transition-transform group-hover:translate-x-1 font-bold">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= QUICK PRACTICE CARD ================= */}
      <section className="mx-auto w-full max-w-7xl px-6 sm:px-10 pb-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#263049] bg-[#171B27]/90 p-6 sm:p-7 shadow-soft backdrop-blur-xl">
          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center justify-between">
            {/* Left: Icon & Title & Difficulty Pills */}
            <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
              <div className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl bg-[#262A36] text-[#5DE6FF] shadow-sm border border-[#424754]/40">
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5Z" />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-display text-lg font-bold tracking-tight text-[#DFE2F2]">
                  Quick Practice
                </h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Choose a difficulty and start solving.
                </p>

                {/* Difficulty Pills */}
                <div className="mt-3.5 flex flex-wrap gap-2.5">
                  {practiceLevels.map((level) => {
                    const active = difficulty === level.id;
                    return (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => startQuickPractice(level.id)}
                        className={`group inline-flex items-center gap-2 rounded-full border py-1.5 pl-3.5 pr-3 text-xs font-semibold transition-all duration-150 active:scale-95 ${
                          active
                            ? 'border-[#5DE6FF]/60 bg-[#262A36] text-[#5DE6FF] shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                            : 'border-[#263049] bg-[#1B1F2B] hover:bg-[#262A36] hover:border-[#424754] text-[#DFE2F2]'
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${level.dot} shadow-xs`}></span>
                        <span>{level.label}</span>
                        <span className="text-[#64748B] group-hover:text-[#94A3B8] font-bold ml-0.5">
                          &gt;
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Floating 3D Neumorphic Code Tile */}
            <div className="pointer-events-none relative hidden shrink-0 lg:block pr-3">
              <div className="grid h-20 w-20 rotate-6 place-items-center rounded-2xl border border-[#263049] bg-gradient-to-br from-[#171B27] via-[#1B1F2B] to-[#262A36] shadow-xl">
                <span className="bg-gradient-to-br from-[#3B82F6] to-[#22D3EE] bg-clip-text font-mono text-xl font-bold text-transparent">
                  &lt;/&gt;
                </span>
              </div>
              <span className="absolute -right-1 -top-1 h-2 w-2 rotate-45 rounded-[2px] bg-[#5DE6FF]/40"></span>
              <span className="absolute right-0 top-6 h-1 w-1 rotate-45 rounded-[2px] bg-[#3B82F6]/50"></span>
              <span className="absolute -left-1 bottom-1 h-1.5 w-1.5 rotate-45 rounded-[2px] bg-[#22D3EE]/40"></span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= YOUR PROGRESS SUMMARY (REAL DB VALUES) ================= */}
      <section className="mx-auto w-full max-w-7xl px-6 sm:px-10 pb-10">
        <div className="rounded-[2rem] border border-[#263049] bg-[#171B27] p-6 sm:p-7 shadow-soft">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#263049]">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-[#262A36] text-[#5DE6FF]">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
                </svg>
              </div>
              <h2 className="font-display text-base font-bold tracking-tight text-[#DFE2F2]">
                Your Progress
              </h2>
            </div>
            <Link
              to="/submissions"
              className="group inline-flex items-center gap-1 text-xs font-semibold text-[#5DE6FF] hover:text-[#ADC6FF] transition-colors"
            >
              <span>View details</span>
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>

          {/* 4 Metrics Columns with Clean Dividers */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#263049]">
            {/* Total Solved */}
            <div className="py-2 sm:py-0 px-4 first:pl-0">
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-[#DFE2F2]">
                {stats.solved}
              </div>
              <div className="mt-1 text-xs font-medium text-[#94A3B8]">
                Solved
              </div>
            </div>

            {/* Easy Solved */}
            <div className="py-2 sm:py-0 px-4">
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-[#DFE2F2]">
                {stats.easy.solved}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[#94A3B8]">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-xs"></span>
                <span>Easy</span>
              </div>
            </div>

            {/* Medium Solved */}
            <div className="py-2 sm:py-0 px-4">
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-[#DFE2F2]">
                {stats.med.solved}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[#94A3B8]">
                <span className="h-2 w-2 rounded-full bg-amber-400 shadow-xs"></span>
                <span>Medium</span>
              </div>
            </div>

            {/* Hard Solved */}
            <div className="py-2 sm:py-0 px-4 last:pr-0">
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-[#DFE2F2]">
                {stats.hard.solved}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[#94A3B8]">
                <span className="h-2 w-2 rounded-full bg-rose-400 shadow-xs"></span>
                <span>Hard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROBLEMS CATALOG SECTION ================= */}
      <section id="problems" className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="bg-[#171B27] rounded-3xl shadow-soft border border-[#263049] p-6 sm:p-8 space-y-6">
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-[#DFE2F2] tracking-tight">
                Problems
              </h2>
              <p className="text-sm text-[#94A3B8] mt-0.5">
                Choose a problem and start coding.
              </p>
              <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#263049] bg-[#1B1F2B] px-2.5 py-0.5 text-xs font-semibold text-[#94A3B8]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5DE6FF]"></span>
                {loading ? 'Loading…' : `${problems?.length || 0} problems`}
              </span>
            </div>

            {/* Search Input Bar */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#64748B]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search by title or topic..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0A0E19] border border-[#263049] rounded-xl text-sm text-[#DFE2F2] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Topic Pills Carousel / Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#263049]">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setTag(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  tag === cat.id
                    ? 'bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] text-[#0A0E19] font-bold shadow-[0_0_16px_-4px_rgba(34,211,238,0.35)]'
                    : 'bg-[#1B1F2B] text-[#94A3B8] hover:bg-[#262A36] hover:text-[#DFE2F2] border border-[#263049]/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Secondary Controls: Difficulty & Status Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              {/* Difficulty Toggles */}
              <div className="inline-flex rounded-xl bg-[#1B1F2B] p-1 border border-[#263049]">
                {['all', 'easy', 'medium', 'hard'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-3 py-1 rounded-lg capitalize font-medium transition-all ${
                      difficulty === d
                        ? 'bg-[#262A36] text-[#DFE2F2] font-semibold shadow-xs'
                        : 'text-[#94A3B8] hover:text-[#DFE2F2]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Status Toggles */}
              <div className="inline-flex rounded-xl bg-[#1B1F2B] p-1 border border-[#263049]">
                {[
                  { id: 'all', label: 'All Status' },
                  { id: 'solved', label: `Solved (${stats.solved})` },
                  { id: 'unsolved', label: 'Todo' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStatus(s.id)}
                    className={`px-3 py-1 rounded-lg font-medium transition-all ${
                      status === s.id
                        ? 'bg-[#262A36] text-[#DFE2F2] font-semibold shadow-xs'
                        : 'text-[#94A3B8] hover:text-[#DFE2F2]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {(search || difficulty !== 'all' || tag !== 'all' || status !== 'all') && (
              <button
                onClick={() => {
                  setSearch('');
                  setDifficulty('all');
                  setTag('all');
                  setStatus('all');
                }}
                className="text-xs font-semibold text-[#5DE6FF] hover:text-[#ADC6FF] transition-colors"
              >
                Reset Filters ↺
              </button>
            )}
          </div>

          {/* Table Container */}
          <div className="rounded-2xl border border-[#263049] overflow-hidden shadow-xs">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3 bg-[#171B27]">
                <span className="w-7 h-7 border-2 border-[#5DE6FF] border-t-transparent rounded-full animate-spin"></span>
                <span className="text-xs text-[#94A3B8] font-medium">Loading catalog...</span>
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
                    {filteredProblems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-16 text-[#94A3B8]">
                          <div className="text-2xl mb-1">🔍</div>
                          <div className="font-semibold text-[#DFE2F2]">No problems found</div>
                          <div className="text-xs text-[#64748B] mt-1">Try a different search or filter.</div>
                        </td>
                      </tr>
                    ) : (
                      filteredProblems.map((problem) => {
                        const isSolved = solvedProblemIds.has(problem._id);
                        return (
                          <tr key={problem._id} className="hover:bg-[#1B1F2B] transition-colors group">
                            <td className="py-4 px-6">
                              {isSolved ? (
                                <span className="w-6 h-6 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-bold shadow-xs">
                                  ✓
                                </span>
                              ) : (
                                <span className="w-6 h-6 rounded-full bg-[#1B1F2B] text-[#64748B] border border-[#263049] flex items-center justify-center text-xs">
                                  ○
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6">
                              <Link
                                to={`/problem/${problem._id}`}
                                className="font-semibold text-[#DFE2F2] group-hover:text-[#5DE6FF] transition-colors flex items-center gap-2"
                              >
                                <span>{problem.title}</span>
                              </Link>
                            </td>
                            <td className="py-4 px-6">{getDifficultyBadge(problem.difficulty)}</td>
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
                                className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#262A36] text-[#5DE6FF] hover:bg-gradient-to-r hover:from-[#3B82F6] hover:to-[#22D3EE] hover:text-[#0A0E19] border border-[#3B82F6]/30 transition-all shadow-xs"
                              >
                                {isSolved ? 'Review' : 'Solve'} →
                              </Link>
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
      </section>
    </div>
  );
}

export default HomePage;
