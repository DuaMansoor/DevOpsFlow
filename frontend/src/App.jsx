
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Pipelines from "./pages/Pipelines";
import Containers from "./pages/Containers";
import Deployments from "./pages/Deployments";
import BuildHistory from "./pages/BuildHistory";
import Settings from "./pages/Settings";

import PipelineStatusCards from "./components/PipelineStatusCards";
import RecentPipelineActivity from "./components/RecentPipelineActivity";

import {
  initialContainers,
  initialDeployments,
} from "./data/mockInfrastructure";

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

  // Calculate Dashboard statistics
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

  // Render active page
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
          <h1 className="text-xl font-semibold">
            DevOpsFlow Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            CI/CD Automation & Kubernetes Management
          </p>
        </header>

        {/* Active Page */}
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
