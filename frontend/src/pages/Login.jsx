import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0F19] p-4 sm:p-6 transition-colors duration-300 relative overflow-hidden">
      {/* Premium Background Blurs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none animate-pulse duration-[8000ms]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-purple-500/10 blur-3xl pointer-events-none animate-pulse duration-[6000ms]"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="w-full max-w-md bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/40 dark:border-slate-800/40 rounded-[28px] p-6 sm:p-8 shadow-2xl relative z-10 transition-all duration-300"
      >
        {/* Logo block */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-base font-black shadow-lg shadow-blue-500/20 mb-4 select-none">
            S
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Startup CRM <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Lite</span>
          </h1>
          <p className="text-slate-500 dark:text-gray-400 mt-2 text-xs font-semibold uppercase tracking-wider">
            Sign in to your dashboard
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200/40 dark:border-rose-900/30 rounded-2xl text-rose-600 dark:text-rose-400 text-xs font-bold"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400 dark:text-gray-500">
                <Mail size={16} className="stroke-[2.25]" />
              </span>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200/60 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/50 text-slate-905 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm font-semibold"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400 dark:text-gray-500">
                <Lock size={16} className="stroke-[2.25]" />
              </span>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200/60 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/50 text-slate-905 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm font-semibold"
              />
            </div>
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 active:scale-[0.985] disabled:opacity-50 disabled:pointer-events-none transition-all text-xs uppercase tracking-wider mt-8"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={14} className="stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800/80 pt-6">
          <p className="text-xs font-semibold text-slate-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline ml-1"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
