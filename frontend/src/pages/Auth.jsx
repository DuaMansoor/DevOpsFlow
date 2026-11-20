import { useState } from "react";

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
)
  .trim()
  .replace(/\/+$/, "");

// Works whether VITE_API_URL ends in /api or not
const API_URL = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;

const emptyForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function Auth({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const switchForm = () => {
    if (loading) return;

    setIsSignup((prev) => !prev);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    if (
      !form.email.trim() ||
      !form.password ||
      (isSignup && (!form.name.trim() || !form.confirmPassword))
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (isSignup && form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (isSignup && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isSignup ? "/auth/register" : "/auth/login";

      const payload = isSignup
        ? {
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
          }
        : {
            email: form.email.trim(),
            password: form.password,
          };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error("Authentication failed:", {
          status: response.status,
          message: data.message || data.error,
        });

        throw new Error(
          data.message ||
            data.error ||
            `Authentication failed (HTTP ${response.status}).`
        );
      }

      if (isSignup) {
        setSuccess("Account created! Please sign in.");
        setIsSignup(false);

        setForm({
          name: "",
          email: form.email.trim(),
          password: "",
          confirmPassword: "",
        });
      } else {
        // The backend must establish a valid session.
        onLogin(data.user);
      }
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Cannot connect to the backend server."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-3 text-4xl">⚙️</div>

          <h1 className="text-3xl font-bold text-cyan-400">DevOpsFlow</h1>

          <p className="mt-2 text-sm text-slate-400">
            CI/CD Automation & Kubernetes Management
          </p>
        </div>

        {/* Login / Signup Tabs */}
        <div className="mb-8 flex rounded-lg bg-slate-800 p-1">
          <button
            type="button"
            onClick={() => {
              if (isSignup) switchForm();
            }}
            className={`w-1/2 rounded-md py-3 text-sm font-semibold transition ${
              !isSignup
                ? "bg-cyan-500 text-slate-950"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isSignup) switchForm();
            }}
            className={`w-1/2 rounded-md py-3 text-sm font-semibold transition ${
              isSignup
                ? "bg-cyan-500 text-slate-950"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold">
            {isSignup ? "Create an Account" : "Welcome Back"}
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {isSignup
              ? "Fill in your details to get started"
              : "Sign in to access your DevOps dashboard"}
          </p>
        </div>

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name - Signup Only */}
          {isSignup && (
            <div>
              <label
                htmlFor="auth-name"
                className="mb-2 block text-sm text-slate-300"
              >
                Full Name
              </label>

              <input
                id="auth-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 outline-none focus:border-cyan-500"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="auth-email"
              className="mb-2 block text-sm text-slate-300"
            >
              Email Address
            </label>

            <input
              id="auth-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 outline-none focus:border-cyan-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="auth-password"
              className="mb-2 block text-sm text-slate-300"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                required
                minLength={isSignup ? 8 : undefined}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 pr-16 outline-none focus:border-cyan-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-cyan-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password - Signup Only */}
          {isSignup && (
            <div>
              <label
                htmlFor="auth-confirm"
                className="mb-2 block text-sm text-slate-300"
              >
                Confirm Password
              </label>

              <input
                id="auth-confirm"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 outline-none focus:border-cyan-500"
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          {/* Success */}
          {success && (
            <p role="status" className="text-sm text-green-400">
              {success}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-cyan-500 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isSignup
                ? "Create Account"
                : "Sign In"}
          </button>
        </form>

        {/* Switch Form */}
        <p className="mt-6 text-center text-sm text-slate-400">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            disabled={loading}
            onClick={switchForm}
            className="font-semibold text-cyan-400 hover:underline disabled:opacity-50"
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}