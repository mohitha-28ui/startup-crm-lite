import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Lock, Mail, Loader2, ArrowRight } from "lucide-react";

export default function Register() {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Reset error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await register(name, email, password);
      navigate("/"); // Redirect to dashboard on success
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950 p-4 sm:p-6 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl transition-all duration-200">
        
        {/* Header section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Create Account
          </h1>
          <p className="text-slate-500 dark:text-gray-400 mt-2 text-sm">
            Get started with Startup CRM Lite
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name Input Group */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider block">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400 dark:text-gray-500">
                <User size={18} />
              </span>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-gray-700 rounded-2xl bg-slate-50 dark:bg-gray-850 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-gray-800 focus:bg-white dark:focus:bg-gray-900 transition-all text-sm"
              />
            </div>
          </div>

          {/* Email Input Group */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400 dark:text-gray-500">
                <Mail size={18} />
              </span>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-gray-700 rounded-2xl bg-slate-50 dark:bg-gray-850 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-gray-800 focus:bg-white dark:focus:bg-gray-900 transition-all text-sm"
              />
            </div>
          </div>

          {/* Password Input Group */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400 dark:text-gray-500">
                <Lock size={18} />
              </span>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-gray-700 rounded-2xl bg-slate-50 dark:bg-gray-850 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-gray-800 focus:bg-white dark:focus:bg-gray-900 transition-all text-sm"
              />
            </div>
          </div>

          {/* Confirm Password Input Group */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider block">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400 dark:text-gray-500">
                <Lock size={18} />
              </span>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-gray-700 rounded-2xl bg-slate-50 dark:bg-gray-850 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-gray-800 focus:bg-white dark:focus:bg-gray-900 transition-all text-sm"
              />
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all text-sm mt-8"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Creating Account...
              </>
            ) : (
              <>
                Register
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-8 text-center border-t border-slate-100 dark:border-gray-800 pt-6">
          <p className="text-sm text-slate-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 dark:text-blue-500 font-bold hover:underline"
            >
              Sign in instead
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
