import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader"; // ✅ Loader import

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // ✅ start loader

    try {
      const res = await fetch("https://backend-news-app-a6jn.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      navigate("/login");
    } catch (err) {
      setError("Something went wrong!");
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-4">
        <div className="bg-white shadow-2xl rounded-3xl max-w-md w-full p-8 sm:p-10">
          <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800 cursor-pointer">
            Create Account
          </h2>

          {error && (
            <p className="text-red-500 text-center mb-4 font-medium cursor-pointer">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1 font-medium cursor-pointer">
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium cursor-pointer">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium cursor-pointer">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="********"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition cursor-pointer"
            >
              Register
            </button>
          </form>

          <p className="text-center mt-5 text-gray-600 text-sm">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 font-medium cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;

