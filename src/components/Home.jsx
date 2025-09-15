import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { useAuth } from "./AuthContext";

function Home() {
  const { token } = useAuth(); // token backend fetch ke liye
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://backend-news-app-a6jn.onrender.com/api/users/home",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to fetch user info");
        }

        const data = await res.json();
        setUserData(data);
        setError("");
      } catch (err) {
        console.error("Error fetching user:", err.message);
        setError(err.message);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  if (loading) return <Loader />;

  // agar login nahi hai
  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-bold mb-2">Welcome</h2>
          <p className="text-gray-600 mb-4">Please login to continue</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // agar fetch me error aaya
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-bold mb-4 text-red-600">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // safe rendering: optional chaining aur null check
  const role = userData?.role;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome to My Blog</h2>
        <p className="mb-4 text-gray-600">
          You are logged in as <span className="font-semibold">{role || "User"}</span>.
        </p>

        {role === "reporter" ? (
          <button
            onClick={() => navigate("/reporter")}
            className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Reporter Page
          </button>
        ) : (
          <button
            onClick={() => navigate("/news")}
            className="bg-green-600 text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Read News
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;



