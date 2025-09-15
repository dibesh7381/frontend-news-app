import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { token } = useAuth(); // user se ab direct backend fetch karenge
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://backend-news-app-a6jn.onrender.com/api/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to fetch profile");
        }

        const data = await res.json();
        setUserData(data);
        setError("");
      } catch (err) {
        console.error("Error fetching profile:", err.message);
        setUserData(null);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) return <Loader />;

  if (!token) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white shadow rounded-2xl mt-8 text-center">
        <h2 className="text-xl font-bold mb-4">You are not logged in</h2>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Login Now
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white shadow rounded-2xl mt-8 text-center">
        <h2 className="text-xl font-bold mb-4 text-red-600">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded-2xl mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">My Profile</h2>

      {userData ? (
        <div className="space-y-3">
          <p>
            <span className="font-semibold">Name:</span> {userData.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {userData.email}
          </p>
          <p>
            <span className="font-semibold">Role:</span>{" "}
            <span
              className={`px-2 py-1 rounded ${
                userData.role === "reporter"
                  ? "bg-blue-200 text-blue-800"
                  : "bg-green-200 text-green-800"
              }`}
            >
              {userData.role}
            </span>
          </p>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No profile data found.
        </p>
      )}
    </div>
  );
};

export default Profile;

