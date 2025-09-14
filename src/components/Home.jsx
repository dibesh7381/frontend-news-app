import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { useAuth } from "./AuthContext";

function Home() {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();

  if (authLoading) return <Loader />;

  if (!user) {
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome to My Blog</h2>
        <p className="mb-4 text-gray-600">
          You are logged in as <span className="font-semibold">{user.role}</span>.
        </p>

        {user.role === "reporter" ? (
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

