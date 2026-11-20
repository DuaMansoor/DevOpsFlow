
import { useState } from "react";

const initialBuilds = [
  {
    id: "b1",
    buildNumber: 105,
    pipeline: "Frontend CI Pipeline",
    branch: "main",
    status: "success",
    timestamp: "2026-11-20T09:30:00",
    duration: "2m 35s",
    logs: [
      "[INFO] Starting Jenkins build #105",
      "[INFO] Cloning GitHub repository...",
      "[INFO] Installing dependencies...",
      "[INFO] Running tests...",
      "[INFO] Building application...",
      "[SUCCESS] Build completed successfully.",
    ],
  },
  {
    id: "b2",
    buildNumber: 104,
    pipeline: "Backend Deployment",
    branch: "dev",
    status: "failed",
    timestamp: "2026-11-19T14:15:00",
    duration: "1m 48s",
    logs: [
      "[INFO] Starting Jenkins build #104",
      "[INFO] Cloning repository...",
      "[INFO] Installing dependencies...",
      "[ERROR] Unit tests failed.",
      "[FAILED] Build terminated.",
    ],
  },
  {
    id: "b3",
    buildNumber: 103,
    pipeline: "Docker Build Pipeline",
    branch: "main",
    status: "running",
    timestamp: "2026-11-19T11:00:00",
    duration: "In progress",
    logs: [
      "[INFO] Starting Jenkins build #103",
      "[INFO] Preparing Docker build...",
      "[INFO] Building container image...",
      "[INFO] Waiting for completion...",
    ],
  },
  {
    id: "b4",
    buildNumber: 102,
    pipeline: "Frontend CI Pipeline",
    branch: "main",
    status: "success",
    timestamp: "2026-11-18T10:20:00",
    duration: "3m 12s",
    logs: [
      "[INFO] Starting Jenkins build #102",
      "[INFO] Running npm install...",
      "[INFO] Running production build...",
      "[SUCCESS] Build completed successfully.",
    ],
  },
];

const statusStyles = {
  success: "bg-green-500/10 text-green-400",
  failed: "bg-red-500/10 text-red-400",
  running: "bg-blue-500/10 text-blue-400",
  pending: "bg-yellow-500/10 text-yellow-400",
};

export default function BuildHistory() {
  const [builds] = useState(initialBuilds);
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredBuilds = builds
    .filter(
      (build) =>
        statusFilter === "all" ||
        build.status === statusFilter
    )
    .filter((build) =>
      `${build.pipeline} ${build.buildNumber} ${build.branch}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort(
      (a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
    );

  const formatDate = (date) =>
    new Date(date).toLocaleString();

  return (
    <main className="p-6 text-white md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold">
            Build History
          </h1>
          <p className="mt-2 text-slate-400">
            Monitor CI/CD build execution and view logs.
          </p>
          <p className="mt-2 text-xs text-yellow-400">
            Demo mode: Build records and logs are simulated.
          </p>
        </header>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Builds", value: builds.length },
            {
              label: "Successful",
              value: builds.filter(
                (b) => b.status === "success"
              ).length,
            },
            {
              label: "Failed",
              value: builds.filter(
                (b) => b.status === "failed"
              ).length,
            },
            {
              label: "Running",
              value: builds.filter(
                (b) => b.status === "running"
              ).length,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5"
            >
              <p className="text-sm text-slate-400">
                {stat.label}
              </p>
              <p className="mt-3 text-3xl font-bold text-cyan-400">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            placeholder="Search pipeline, build number, branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900 p-3 outline-none focus:border-cyan-500"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="rounded-lg border border-slate-700 bg-slate-900 p-3 outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="running">Running</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Build Table */}
        <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 p-5">
            <h2 className="text-xl font-semibold">
              Build Records ({filteredBuilds.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800 text-slate-300">
                <tr>
                  <th className="p-4">Build #</th>
                  <th className="p-4">Pipeline</th>
                  <th className="p-4">Branch</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Started At</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredBuilds.map((build) => (
                  <tr
                    key={build.id}
                    className="border-t border-slate-800"
                  >
                    <td className="p-4 font-semibold text-cyan-400">
                      #{build.buildNumber}
                    </td>

                    <td className="p-4">
                      {build.pipeline}
                    </td>

                    <td className="p-4 text-slate-400">
                      {build.branch}
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          statusStyles[build.status] ||
                          statusStyles.pending
                        }`}
                      >
                        {build.status}
                      </span>
                    </td>

                    <td className="p-4 text-slate-400">
                      {formatDate(build.timestamp)}
                    </td>

                    <td className="p-4 text-slate-400">
                      {build.duration}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => setSelectedBuild(build)}
                        className="rounded-lg bg-cyan-500/10 px-3 py-2 font-medium text-cyan-400 hover:bg-cyan-500/20"
                      >
                        View Logs
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredBuilds.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-8 text-center text-slate-400"
                    >
                      No matching build records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Build Logs Viewer */}
        {selectedBuild && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setSelectedBuild(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="build-logs-title"
              className="w-full max-w-3xl rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2
                    id="build-logs-title"
                    className="text-xl font-bold"
                  >
                    Build #{selectedBuild.buildNumber} Logs
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {selectedBuild.pipeline}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedBuild(null)}
                  className="rounded-lg bg-slate-800 px-3 py-2 text-slate-300 hover:bg-slate-700"
                  aria-label="Close build logs"
                >
                  ✕
                </button>
              </div>

              <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-slate-800 bg-slate-950 p-5 font-mono text-sm leading-7 text-green-400">
                {selectedBuild.logs.join("\n")}
              </pre>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setSelectedBuild(null)}
                  className="rounded-lg bg-cyan-500 px-5 py-2 font-semibold text-slate-950 hover:bg-cyan-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
