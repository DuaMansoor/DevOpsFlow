
import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import Pipelines from "./pages/Pipelines";
import Containers from "./pages/Containers";
import Deployments from "./pages/Deployments";
import BuildHistory from "./pages/BuildHistory";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";

import PipelineStatusCards from "./components/PipelineStatusCards";
import RecentPipelineActivity from "./components/RecentPipelineActivity";

import {
  initialContainers,
  initialDeployments,
} from "./data/mockInfrastructure";

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
)
  .trim()
  .replace(/\/+$/, "");

// Works whether VITE_API_URL ends in /api or not
const API_URL = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;

// Initial pipeline data
const initialPipelines = [
  {
    id: 1,
    name: "Frontend CI Pipeline",
    repositoryUrl: "https://github.com/example/frontend",
    branch: "main",
    status: "success",
  },
  {
    id: 2,
    name: "Backend Deployment",
    repositoryUrl: "https://github.com/example/backend",
    branch: "dev",
    status: "running",
  },
  {
    id: 3,
    name: "Docker Build Pipeline",
    repositoryUrl: "https://github.com/example/demo-app",
    branch: "main",
    status: "failed",
  },
];

function App() {
  // Authentication state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  // Active sidebar page
  const [activePage, setActivePage] = useState("dashboard");

  // Shared frontend state
  const [pipelines, setPipelines] = useState(initialPipelines);

  const [containers, setContainers] = useState(
    initialContainers
  );

  const [deployments, setDeployments] = useState(
    initialDeployments
  );

  // Check existing login session when application loads
  useEffect(() => {
    const controller = new AbortController();

    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${API_URL}/auth/me`,
          {
            method: "GET",
            credentials: "include",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();

        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Session check failed:", error);
          setUser(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setAuthLoading(false);
        }
      }
    };

    checkAuth();

    return () => controller.abort();
  }, []);

  // Calculate dashboard statistics
  const activeContainers = containers.filter(
    (container) => container.status === "running"
  ).length;

  const stats = [
    {
      title: "Total Pipelines",
      value: pipelines.length,
    },
    {
      title: "Active Containers",
      value: activeContainers,
    },
    {
      title: "Deployments",
      value: deployments.length,
    },
  ];

  // Handle successful backend login
  const handleLogin = (loggedInUser) => {
    if (!loggedInUser) {
      return;
    }

    setUser(loggedInUser);
    setLogoutError("");
    setActivePage("dashboard");
  };

  // Handle backend logout
  const handleLogout = async () => {
    if (logoutLoading) return;

    setLogoutLoading(true);
    setLogoutError("");

    try {
      const response = await fetch(
        `${API_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Logout failed. Please try again.");
      }

      setUser(null);
      setActivePage("dashboard");
    } catch (error) {
      console.error("Logout error:", error);
      setLogoutError(error.message);
    } finally {
      setLogoutLoading(false);
    }
  };

  // Render active dashboard page
  const renderContent = () => {
    switch (activePage) {
      case "pipelines":
        return (
          <Pipelines
            pipelines={pipelines}
            setPipelines={setPipelines}
          />
        );

      case "containers":
        return (
          <Containers
            containers={containers}
            setContainers={setContainers}
          />
        );

      case "deployments":
        return (
          <Deployments
            deployments={deployments}
            setDeployments={setDeployments}
          />
        );

      case "history":
        return <BuildHistory />;

      case "settings":
        return <Settings />;

      case "dashboard":
      default:
        return (
          <main className="mx-auto max-w-7xl p-6 md:p-8">
            <h2 className="mb-6 text-2xl font-semibold">
              Dashboard Overview
            </h2>

            {/* Dashboard Statistics */}
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-6"
                >
                  <p className="text-sm text-slate-400">
                    {stat.title}
                  </p>

                  <p className="mt-3 text-4xl font-bold text-cyan-400">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Pipeline Status Overview */}
            <section className="mt-8">
              <h3 className="mb-4 text-xl font-semibold">
                Pipeline Status Overview
              </h3>

              <PipelineStatusCards
                pipelines={pipelines}
              />
            </section>

            {/* Recent Pipeline Activity */}
            <RecentPipelineActivity
              pipelines={pipelines}
            />
          </main>
        );
    }
  };

  // Loading screen while checking session
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <p className="text-sm text-slate-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Show Login / Signup if not authenticated
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  // Main dashboard
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      {/* Main Content */}
      <div className="min-w-0 flex-1">
        {/* Top Header */}
        <header className="border-b border-slate-800 px-6 py-5 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold">
                DevOpsFlow Dashboard
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                CI/CD Automation & Kubernetes Management
              </p>
            </div>

            {/* User Profile and Logout */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">
                  {user.name || "DevOpsFlow User"}
                </p>

                <p className="text-xs text-slate-400">
                  {user.email}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={logoutLoading}
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {logoutLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>

          {logoutError && (
            <p
              role="alert"
              className="mt-3 text-sm text-red-400"
            >
              {logoutError}
            </p>
          )}
        </header>

        {/* Active Page */}
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
