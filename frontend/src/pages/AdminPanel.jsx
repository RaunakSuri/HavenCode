import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProblems, deleteProblem } from '../problemSlice';
import { Link } from 'react-router';
import ThemeToggle from '../components/ThemeToggle';

function AdminPanel() {
  const dispatch = useDispatch();
  const { problems, loading } = useSelector((state) => state.problems);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchAllProblems());
  }, [dispatch]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await dispatch(deleteProblem(deleteId));
    setDeleting(false);
    setDeleteId(null);
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

  return (
    <div className="min-h-screen bg-[#0F131E] text-[#DFE2F2] pb-20 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* ================= UNIFIED NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-[#0B0F1A]/85 backdrop-blur-xl border-b border-[#263049] px-6 sm:px-10 h-16 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img src="/logo.svg" alt="HavenCode" className="h-8 sm:h-9 w-auto group-hover:scale-105 transition-all duration-200" />
            </Link>
            <span className="text-[#64748B] font-light">/</span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/40 text-amber-400 border border-amber-500/30">
              Admin Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-[#DFE2F2] hover:bg-[#1B1F2B] transition-colors"
            >
              ← Back to Site
            </Link>
            <Link
              to="/admin/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#0A0E19] bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] shadow-[0_0_16px_rgba(34,211,238,0.3)] hover:shadow-[0_0_24px_rgba(34,211,238,0.5)] active:scale-95 transition-all"
            >
              <span>+ Add Problem</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ================= PAGE HERO & TITLE ================= */}
      <main className="mx-auto w-full max-w-7xl px-6 sm:px-10 pt-10 sm:pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#262A36] text-[#5DE6FF] border border-[#424754]/40 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#5DE6FF] animate-pulse"></span>
              <span>Problem Management</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#DFE2F2] tracking-tight">
              Problem Catalog
            </h1>
            <p className="text-[#94A3B8] text-sm sm:text-base mt-1.5 max-w-xl">
              Create, review, update, or remove problems and test cases.
            </p>
          </div>
          <Link
            to="/admin/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#0A0E19] bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] shadow-[0_0_16px_rgba(34,211,238,0.3)] hover:shadow-[0_0_24px_rgba(34,211,238,0.5)] active:scale-95 transition-all self-start md:self-auto"
          >
            <span>+ Create New Problem</span>
          </Link>
        </div>

        {/* Problems Table */}
        <div className="bg-[#171B27] rounded-3xl border border-[#263049] shadow-soft overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-8 h-8 border-2 border-[#5DE6FF] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#64748B] text-xs font-medium">
                Loading problems...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#101524] text-[#64748B] font-semibold text-xs border-b border-[#263049] uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Difficulty</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#263049]">
                  {!problems || problems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-16 text-[#64748B] text-sm"
                      >
                        No problems found in the database. Click &quot;+ Add
                        Problem&quot; to publish one!
                      </td>
                    </tr>
                  ) : (
                    problems.map((problem, index) => (
                      <tr
                        key={problem._id}
                        className="hover:bg-[#1B1F2B] transition-colors duration-150 group"
                      >
                        <td className="px-6 py-4 font-mono text-xs text-[#64748B]">
                          {String(index + 1).padStart(2, '0')}
                        </td>
                        <td className="px-6 py-4 font-semibold text-[#DFE2F2]">
                          {problem.title}
                        </td>
                        <td className="px-6 py-4">
                          {getDifficultyPill(problem.difficulty)}
                        </td>
                        <td className="px-6 py-4">
                          {problem.tags && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1B1F2B] text-[#94A3B8] border border-[#263049] capitalize">
                              {problem.tags}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Link
                            to={`/admin/edit/${problem._id}`}
                            className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold text-[#5DE6FF] hover:text-[#DFE2F2] bg-[#1B1F2B] hover:bg-[#262A36] border border-[#263049] transition-all"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => setDeleteId(problem._id)}
                            className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-950/60 border border-rose-500/30 transition-all"
                          >
                            Delete
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

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0E19]/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#171B27] rounded-3xl max-w-md w-full shadow-float border border-[#263049] p-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/50 text-rose-400 border border-rose-500/30 flex items-center justify-center mb-4 text-xl font-bold">
              !
            </div>
            <h3 className="font-display font-bold text-lg text-[#DFE2F2] mb-2">
              Confirm Problem Deletion
            </h3>
            <p className="text-sm text-[#94A3B8] mb-6">
              Are you sure you want to delete this problem? This action
              permanently removes the problem, its test cases, and its starter
              code.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#94A3B8] hover:bg-[#1B1F2B] hover:text-[#DFE2F2] transition-colors"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-soft transition-all"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Problem'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
