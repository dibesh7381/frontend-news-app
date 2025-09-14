import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loader from "../components/Loader";

const NewsFeed = () => {
  const { user, token, loading } = useAuth(); 
  const [posts, setPosts] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const navigate = useNavigate();

  // Fetch Posts and sort
  useEffect(() => {
    if (!user || !token) return;

    const fetchPosts = async () => {
      try {
        const res = await fetch(" https://backend-news-app-a6jn.onrender.com/api/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // Current reporter ke posts top pe
        const sortedPosts = data.sort((a, b) => {
          const aIsCurrent = String(a.author?._id) === String(user._id);
          const bIsCurrent = String(b.author?._id) === String(user._id);

          if (aIsCurrent && !bIsCurrent) return -1;
          if (!aIsCurrent && bIsCurrent) return 1;

          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setPosts(sortedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, [token, user]);

  const handleLike = async (id) => {
    if (user?.role !== "customer") return;
    try {
      const res = await fetch(` https://backend-news-app-a6jn.onrender.com/api/posts/${id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPosts((prev) =>
        prev.map((post) =>
          post._id === id ? { ...post, likes: data.likes, dislikes: data.dislikes } : post
        )
      );
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleDislike = async (id) => {
    if (user?.role !== "customer") return;
    try {
      const res = await fetch(` https://backend-news-app-a6jn.onrender.com/api/posts/${id}/dislike`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPosts((prev) =>
        prev.map((post) =>
          post._id === id ? { ...post, likes: data.likes, dislikes: data.dislikes } : post
        )
      );
    } catch (err) {
      console.error("Error disliking post:", err);
    }
  };

  const handleComment = async (postId, text) => {
    if (!text.trim()) return;
    try {
      const res = await fetch(` https://backend-news-app-a6jn.onrender.com/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? { ...post, comments: data.comments } : post))
      );
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleEditComment = async (postId, commentId) => {
    if (!editText.trim()) return;
    try {
      const res = await fetch(
        ` https://backend-news-app-a6jn.onrender.com/api/posts/${postId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ text: editText }),
        }
      );
      const data = await res.json();
      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? { ...post, comments: data.comments } : post))
      );
      setEditingComment(null);
      setEditText("");
    } catch (err) {
      console.error("Error editing comment:", err);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const res = await fetch(
        ` https://backend-news-app-a6jn.onrender.com/api/posts/${postId}/comments/${commentId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? { ...post, comments: data.comments } : post))
      );
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  if (loading) return <Loader />;

  if (!user) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white shadow rounded-2xl mt-8 text-center">
        <h2 className="text-xl font-bold mb-4">You need to login</h2>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 grid gap-4">
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No news available</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="border p-4 rounded shadow flex flex-col gap-2">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-700">{post.description}</p>
            <p className="text-xs text-gray-500">
              By Reporter: {post.author?.name || "Unknown"}
            </p>

            {/* Like / Dislike */}
            {user?.role === "customer" ? (
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => handleLike(post._id)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer"
                >
                  👍 {post.likes || 0}
                </button>
                <button
                  onClick={() => handleDislike(post._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
                >
                  👎 {post.dislikes || 0}
                </button>
              </div>
            ) : (
              <div className="flex gap-4 mt-2">
                <span className="px-3 py-1 bg-green-200 text-green-800 rounded cursor-pointer">
                  👍 {post.likes || 0}
                </span>
                <span className="px-3 py-1 bg-red-200 text-red-800 rounded cursor-pointer">
                  👎 {post.dislikes || 0}
                </span>
              </div>
            )}

            {/* Comments */}
            <div className="mt-3">
              <h3 className="font-semibold">Comments</h3>
              <ul className="pl-4 text-sm text-gray-600">
                {post.comments?.map((c) => {
                  const commentOwnerId = String(c.user?._id || c.user?.id || c.user || "");
                  const currentUserId = String(user?._id || user?.id || "");
                  const isCommentOwner = commentOwnerId === currentUserId;

                  return (
                    <li key={c._id} className="border-b py-1 flex justify-between items-center">
                      <div>
                        <span className="font-medium">{c.user?.name || "User"}:</span>{" "}
                        {editingComment === c._id ? (
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="border-b border-gray-400 focus:border-blue-500 outline-none ml-2"
                          />
                        ) : (
                          c.text
                        )}
                      </div>

                      {isCommentOwner && (
                        <div className="flex gap-2">
                          {editingComment === c._id ? (
                            <>
                              <button
                                onClick={() => handleEditComment(post._id, c._id)}
                                className="text-green-600 cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => { setEditingComment(null); setEditText(""); }}
                                className="text-gray-500 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => { setEditingComment(c._id); setEditText(c.text); }}
                                className="text-blue-600 cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(post._id, c._id)}
                                className="text-red-600 cursor-pointer"
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
                    type="text"
                    value={commentInputs[post._id] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({ ...prev, [post._id]: e.target.value }))
                    }
                    placeholder="Add a comment..."
                    className="flex-1 bg-transparent outline-none py-2 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleComment(post._id, commentInputs[post._id] || "");
                    }}
                  />
                  <button
                    onClick={() => handleComment(post._id, commentInputs[post._id] || "")}
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
        ))
      )}
    </div>
  );
};

export default NewsFeed;




