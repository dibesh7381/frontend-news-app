import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import ConfirmModal from "../components/ConfirmModal";
import { useAuth } from "./AuthContext";

const ReporterPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth(); // authLoading removed

  const [myPosts, setMyPosts] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingPostId, setEditingPostId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    if (!token || !user || user.role !== "reporter") {
      setUnauthorized(true);
      setLoading(false);
    } else {
      fetchMyPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://backend-news-app-a6jn.onrender.com/api/posts/my-posts",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setMyPosts(data);
    } catch (err) {
      console.error("Error fetching posts", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">You must login to access this page.</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    );
  }

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      <ConfirmModal
        isOpen={confirmOpen}
        message="Are you sure you want to delete this post?"
        onConfirm={async () => {
          if (!postToDelete) return;
          try {
            await fetch(
              `https://backend-news-app-a6jn.onrender.com/api/posts/${postToDelete}`,
              { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
            );
            fetchMyPosts();
          } catch (err) {
            console.error("Error deleting post", err);
          } finally {
            setConfirmOpen(false);
            setPostToDelete(null);
          }
        }}
        onCancel={() => {
          setConfirmOpen(false);
          setPostToDelete(null);
        }}
      />

      <div className="flex flex-col items-center justify-start flex-1 p-6 w-full max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-8 text-center">Reporter Dashboard</h2>

        {/* Add News Form */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await fetch("https://backend-news-app-a6jn.onrender.com/api/posts", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
              });
              setForm({ title: "", description: "" });
              fetchMyPosts();
            } catch (err) {
              console.error("Error adding post", err);
            }
          }}
          className="bg-gray-900 p-6 rounded-2xl shadow-lg mb-10 w-full max-w-lg"
        >
          <h3 className="text-2xl font-semibold mb-4 text-center">Add News</h3>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            required
            className="w-full p-3 border border-gray-700 rounded-lg mb-3 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
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
                      onChange={(e) => setEditForm({ ...editForm, [e.target.name]: e.target.value })}
                      className="w-full p-2 border border-gray-600 rounded mb-2 bg-gray-800 text-white"
                    />
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, [e.target.name]: e.target.value })}
                      className="w-full p-2 border border-gray-600 rounded mb-2 bg-gray-800 text-white h-24 resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          fetch(`https://backend-news-app-a6jn.onrender.com/api/posts/${editingPostId}`, {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify(editForm),
                          })
                            .then(() => {
                              setEditingPostId(null);
                              fetchMyPosts();
                            })
                            .catch((err) => console.error(err));
                        }}
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
                        onClick={() => {
                          setEditingPostId(post._id);
                          setEditForm({ title: post.title, description: post.description });
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setPostToDelete(post._id);
                          setConfirmOpen(true);
                        }}
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

