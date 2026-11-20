
import { useState } from "react";

export default function Auth({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setIsSignup((prev) => !prev);
    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setError("");
    setSuccess("");
    setShowPassword(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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

    if (isSignup) {
      if (form.password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      // Demo only: No account is created.
      setSuccess("Form validated! Switch to Login to continue.");
      return;
    }

    // Demo login: No real credential verification.
    onLogin();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-3 text-4xl">⚙️</div>

          <h1 className="text-3xl font-bold text-cyan-400">
            DevOpsFlow
          </h1>

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
                autoComplete={
                  isSignup ? "new-password" : "current-password"
                }
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

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-lg bg-cyan-500 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            {isSignup ? "Create Account" : "Sign In"}
          </button>
        </form>

        {/* Switch Form */}
        <p className="mt-6 text-center text-sm text-slate-400">
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={switchForm}
            className="font-semibold text-cyan-400 hover:underline"
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </p>

        <p className="mt-5 text-center text-xs text-yellow-400">
          Demo mode: Authentication is not connected to a backend.
        </p>
      </div>
    </div>
  );
}
