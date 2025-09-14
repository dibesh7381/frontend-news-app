import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "./AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, authLoading } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false); // ✅ naam thoda clear

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("https://backend-news-app-a6jn.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      login(data.user, data.token); // ✅ context ka login call
      navigate("/"); // ✅ redirect
    } catch (err) {
      setError("Something went wrong! " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Global auth check + local form submit dono ka loader
  if (authLoading || submitting) return <Loader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-4">
      <div className="bg-white shadow-2xl rounded-3xl max-w-md w-full p-8 sm:p-10">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          Welcome Back
        </h2>

        {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition cursor-pointer"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 text-sm">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
