import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loader from "./Loader";

const API_BASE = "https://backend-news-app-a6jn.onrender.com/api";

const NewsFeed = () => {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const navigate = useNavigate();

  // Fetch posts
  useEffect(() => {
    if (!token) {
      setLoading(false);
      setPosts([]);
      return;
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const postsWithOpen = data.map((p) => ({ ...p, openComments: true }));
        setPosts(postsWithOpen);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token]);

  const updatePostComments = (postId, comments) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, comments } : p))
    );
  };

  // Like / Dislike
  const handleLikeDislike = async (id, type) => {
    if (user?.role !== "customer") return;
    try {
      const res = await fetch(`${API_BASE}/posts/${id}/${type}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPosts((prev) =>
        prev.map((post) =>
          post._id === id
            ? { ...post, likes: data.likes, dislikes: data.dislikes }
            : post
        )
      );
    } catch (err) {
      console.error(`Error ${type} post:`, err);
    }
  };

  // Add Comment
  const handleAddComment = async (postId, text) => {
    if (!text.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      updatePostComments(postId, data.comments);
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Edit Comment
  const handleEditComment = async (postId, commentId) => {
    if (!editText.trim()) return;
    try {
      const res = await fetch(
        `${API_BASE}/posts/${postId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: editText }),
        }
      );
      const data = await res.json();
      updatePostComments(postId, data.comments);
      setEditingComment(null);
      setEditText("");
    } catch (err) {
      console.error("Error editing comment:", err);
    }
  };

  // Delete Comment
  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    try {
      const res = await fetch(
        `${API_BASE}/posts/${postId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      updatePostComments(postId, data.comments);
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  if (loading) return <Loader />;

  // ❌ Not logged in
  if (!user) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white shadow rounded-2xl mt-8 text-center">
        <h2 className="text-xl font-bold mb-4">You need to login</h2>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // ❌ No posts
  if (posts.length === 0) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white shadow rounded-2xl mt-8 text-center">
        <h2 className="text-xl font-bold mb-2">No news available</h2>
        <p className="text-gray-500">Check back later for news updates.</p>
      </div>
    );
  }

  return (
    <div className="p-6 grid gap-4">
      {posts.map((post) => (
        <div
          key={post._id}
          className="border p-4 rounded shadow flex flex-col gap-2 transition-all duration-300"
        >
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p className="text-gray-700">{post.description}</p>
          <p className="text-xs text-gray-500">
            By Reporter: {post.author?.name || "Unknown"}
          </p>

          {/* Like / Dislike */}
          <div className="flex gap-2 mt-2">
            {["like", "dislike"].map((type) => (
              <button
                key={type}
                onClick={() => handleLikeDislike(post._id, type)}
                className={`px-3 py-1 rounded text-white cursor-pointer ${
                  type === "like"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {type === "like" ? "👍" : "👎"}{" "}
                {post[type === "like" ? "likes" : "dislikes"] || 0}
              </button>
            ))}
          </div>

          {/* Comments Section */}
          <div className="mt-3">
            <h3
              className="font-semibold cursor-pointer select-none"
              onClick={() =>
                setPosts((prev) =>
                  prev.map((p) =>
                    p._id === post._id
                      ? { ...p, openComments: !p.openComments }
                      : p
                  )
                )
              }
            >
              Comments ({post.comments?.length || 0}){" "}
              <span className="text-gray-400">
                {post.openComments ? "▲" : "▼"}
              </span>
            </h3>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                post.openComments ? "max-h-[1000px] mt-2" : "max-h-0"
              }`}
            >
              <ul className="pl-4 text-sm text-gray-600">
                {post.comments?.map((c) => {
                  const commentUserId =
                    typeof c.user === "object"
                      ? c.user._id?.toString()
                      : c.user?.toString();
                  const currentUserId =
                    user?._id?.toString() || user?.id?.toString();
                  const isOwner = currentUserId === commentUserId;

                  return (
                    <li
                      key={c._id}
                      className="border-b py-1 flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <span className="font-medium">
                          {typeof c.user === "object" ? c.user.name : "User"}:
                        </span>{" "}
                        {editingComment === c._id ? (
                          <input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            autoFocus
                            className="border-b border-gray-400 focus:border-blue-500 outline-none ml-2 w-full"
                          />
                        ) : (
                          c.text
                        )}
                      </div>

                      {isOwner && (
                        <div className="flex gap-2 ml-2">
                          {editingComment === c._id ? (
                            <>
                              <button
                                onClick={() =>
                                  handleEditComment(post._id, c._id)
                                }
                                className="text-green-600 font-medium"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingComment(null);
                                  setEditText("");
                                }}
                                className="text-gray-500"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingComment(c._id);
                                  setEditText(c.text);
                                }}
                                className="text-blue-600 hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteComment(post._id, c._id)
                                }
                                className="text-red-600 hover:underline"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* Add Comment */}
              {user?.role === "customer" && (
                <div className="flex items-center gap-2 mt-3 border-b border-gray-300 focus-within:border-blue-500">
                  <input
                    value={commentInputs[post._id] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [post._id]: e.target.value,
                      }))
                    }
                    placeholder="Add a comment..."
                    className="flex-1 bg-transparent outline-none py-2 text-sm"
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      handleAddComment(post._id, commentInputs[post._id] || "")
                    }
                  />
                  <button
                    onClick={() =>
                      handleAddComment(post._id, commentInputs[post._id] || "")
                    }
                    disabled={!commentInputs[post._id]?.trim()}
                    className={`text-sm font-medium ${
                      commentInputs[post._id]?.trim()
                        ? "text-blue-500 hover:text-blue-600 cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Post
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsFeed;
