import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProblems, deleteProblem } from '../problemSlice';
import { Link } from 'react-router';

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
      {/* Top Navbar */}
      <div className="navbar bg-base-100 shadow px-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="btn btn-ghost text-xl font-bold tracking-wider">
            LeetCode
          </Link>
          <span className="badge badge-warning font-semibold">Admin Panel</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="btn btn-ghost btn-sm">
            Back to Site
          </Link>
          <Link to="/admin/create" className="btn btn-primary btn-sm">
            + Add New Problem
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Manage Problems</h1>
            <p className="text-sm text-base-content/70 mt-1">
              Create, update, or remove DSA coding problems.
            </p>
          </div>
          <Link to="/admin/create" className="btn btn-primary shadow-md">
            + Create Problem
          </Link>
        </div>

        {/* Problems Table */}
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
                    <th>#</th>
                    <th>Title</th>
                    <th>Difficulty</th>
                    <th>Category</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!problems || problems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-base-content/60">
                        No problems found in database. Create one!
                      </td>
                    </tr>
                  ) : (
                    problems.map((problem, index) => (
                      <tr key={problem._id} className="hover">
                        <td className="font-medium text-base-content/60">{index + 1}</td>
                        <td className="font-semibold">{problem.title}</td>
                        <td>{getDifficultyBadge(problem.difficulty)}</td>
                        <td>
                          {problem.tags && (
                            <span className="badge badge-ghost badge-sm capitalize">
                              {problem.tags}
                            </span>
                          )}
                        </td>
                        <td className="text-right space-x-2">
                          <Link
                            to={`/admin/edit/${problem._id}`}
                            className="btn btn-outline btn-info btn-xs"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => setDeleteId(problem._id)}
                            className="btn btn-outline btn-error btn-xs"
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
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">Confirm Problem Deletion</h3>
            <p className="py-4">
              Are you sure you want to delete this problem? This action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  'Delete Problem'
                )}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setDeleteId(null)}></div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
