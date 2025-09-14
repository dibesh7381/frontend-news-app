import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import ConfirmModal from "../components/ConfirmModal";
import { useAuth } from "./AuthContext";

const ReporterPage = () => {
  const navigate = useNavigate();
  // ✅ Correct destructuring - use same name as in AuthContext
  const { user, token, authLoading } = useAuth();

  const [myPosts, setMyPosts] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingPostId, setEditingPostId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    if (authLoading) return; // ✅ Wait for auth check

    if (!token || !user || user.role !== "reporter") {
      setUnauthorized(true);
      setLoading(false);
    } else {
      fetchMyPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user, authLoading]);

  const fetchMyPosts = async () => {
    try {
      const res = await fetch("https://backend-news-app-a6jn.onrender.com/api/posts/my-posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMyPosts(data);
    } catch (err) {
      console.error("Error fetching posts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://backend-news-app-a6jn.onrender.com/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ title: "", description: "" });
        fetchMyPosts();
      }
    } catch (err) {
      console.error("Error adding post", err);
    }
  };

  const handleDeleteClick = (id) => {
    setPostToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    try {
      await fetch(`https://backend-news-app-a6jn.onrender.com/api/posts/${postToDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMyPosts();
    } catch (err) {
      console.error("Error deleting post", err);
    } finally {
      setConfirmOpen(false);
      setPostToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setPostToDelete(null);
  };

  const handleEditClick = (post) => {
    setEditingPostId(post._id);
    setEditForm({ title: post.title, description: post.description });
  };

  const handleEditChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleEditSubmit = async (id) => {
    try {
      const res = await fetch(`https://backend-news-app-a6jn.onrender.com/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        setEditingPostId(null);
        fetchMyPosts();
      }
    } catch (err) {
      console.error("Error updating post", err);
    }
  };

  if (authLoading || loading) return <Loader />;

  if (unauthorized) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="flex flex-1 items-center justify-center">
          <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">Only reporters can access this page.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      {/* ✅ Confirm Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        message="Are you sure you want to delete this post?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <div className="flex flex-col items-center justify-start flex-1 p-6 w-full max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-8 text-center">Reporter Dashboard</h2>

        {/* Add News Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 p-6 rounded-2xl shadow-lg mb-10 w-full max-w-lg"
        >
          <h3 className="text-2xl font-semibold mb-4 text-center">Add News</h3>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-700 rounded-lg mb-3 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-700 rounded-lg mb-3 bg-gray-800 text-white h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition cursor-pointer"
          >
            Add News
          </button>
        </form>

        {/* My Posts */}
        <h3 className="text-2xl font-semibold mb-6 text-center">My Posts</h3>
        <div className="flex flex-col items-center gap-6 w-full">
          {myPosts.length === 0 ? (
            <p className="text-center text-gray-400">No posts yet</p>
          ) : (
            myPosts.map((post) => (
              <div
                key={post._id}
                className="bg-gray-900 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition w-full max-w-lg flex flex-col justify-between"
              >
                {editingPostId === post._id ? (
                  <>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-gray-600 rounded mb-2 bg-gray-800 text-white"
                    />
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-gray-600 rounded mb-2 bg-gray-800 text-white h-24 resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSubmit(post._id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPostId(null)}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="text-xl font-semibold break-words">{post.title}</h4>
                    <p className="text-gray-400 mt-2 break-words flex-1">{post.description}</p>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleEditClick(post)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(post._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReporterPage;
