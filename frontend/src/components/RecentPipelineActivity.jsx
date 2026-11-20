
const statusStyles = {
  success: "bg-green-500/10 text-green-400",
  running: "bg-blue-500/10 text-blue-400",
  failed: "bg-red-500/10 text-red-400",
  pending: "bg-yellow-500/10 text-yellow-400",
};

export default function RecentPipelineActivity({ pipelines }) {
  // Show the latest 5 entries in the current list
  const recentPipelines = [...pipelines].reverse().slice(0, 5);

  return (
    <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-5">
        <h3 className="text-xl font-semibold">
          Recent Pipeline Activity
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          Latest pipeline records and their current statuses.
        </p>
      </div>

      {recentPipelines.length === 0 ? (
        <p className="text-slate-400">
          No pipelines available. Create your first pipeline.
        </p>
      ) : (
        <div className="space-y-3">
          {recentPipelines.map((pipeline) => (
            <div
              key={pipeline.id}
              className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <h4 className="font-medium text-white">
                  {pipeline.name}
                </h4>

                <p className="mt-1 break-all text-sm text-slate-400">
                  {pipeline.repositoryUrl}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Branch: {pipeline.branch}
                </p>
              </div>

              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  statusStyles[pipeline.status] ||
                  statusStyles.pending
                }`}
              >
                {pipeline.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
