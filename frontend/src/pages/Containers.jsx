
const statusStyles = {
  running: "bg-green-500/10 text-green-400",
  stopped: "bg-red-500/10 text-red-400",
};

export default function Containers({
  containers,
  setContainers,
}) {
  // Update container status
  const updateStatus = (id, status) => {
    setContainers((previous) =>
      previous.map((container) =>
        container.id === id
          ? { ...container, status }
          : container
      )
    );
  };

  // Remove container
  const handleDelete = (id) => {
    if (
      !window.confirm(
        "Remove this container from the demo list?"
      )
    ) {
      return;
    }

    setContainers((previous) =>
      previous.filter(
        (container) => container.id !== id
      )
    );
  };

  const runningCount = containers.filter(
    (container) => container.status === "running"
  ).length;

  const stoppedCount = containers.filter(
    (container) => container.status === "stopped"
  ).length;

  return (
    <main className="p-6 text-white md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page Header */}
        <header>
          <h1 className="text-3xl font-bold">
            Container Management
          </h1>

          <p className="mt-2 text-slate-400">
            View and manage Docker containers.
          </p>

          <p className="mt-2 text-xs text-yellow-400">
            Demo mode: Actions only update the frontend.
          </p>
        </header>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total Containers",
              value: containers.length,
            },
            {
              label: "Running",
              value: runningCount,
            },
            {
              label: "Stopped",
              value: stoppedCount,
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

        {/* Container Table */}
        <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 p-5">
            <h2 className="text-xl font-semibold">
              Docker Containers
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800 text-slate-300">
                <tr>
                  <th className="p-4">Container Name</th>
                  <th className="p-4">Image</th>
                  <th className="p-4">Ports</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {containers.map((container) => (
                  <tr
                    key={container.id}
                    className="border-t border-slate-800"
                  >
                    {/* Container Name */}
                    <td className="p-4 font-medium">
                      {container.name}
                    </td>

                    {/* Docker Image */}
                    <td className="p-4 text-slate-400">
                      {container.image}
                    </td>

                    {/* Ports */}
                    <td className="p-4 text-slate-400">
                      {container.ports}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          statusStyles[container.status] ||
                          "bg-slate-700 text-slate-300"
                        }`}
                      >
                        {container.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {container.status === "running" ? (
                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(
                                container.id,
                                "stopped"
                              )
                            }
                            className="rounded-lg bg-yellow-500/10 px-3 py-2 text-yellow-400 hover:bg-yellow-500/20"
                          >
                            Stop
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(
                                container.id,
                                "running"
                              )
                            }
                            className="rounded-lg bg-green-500/10 px-3 py-2 text-green-400 hover:bg-green-500/20"
                          >
                            Start
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(container.id)
                          }
                          className="rounded-lg bg-red-500/10 px-3 py-2 text-red-400 hover:bg-red-500/20"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Empty State */}
                {containers.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-slate-400"
                    >
                      No containers available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
