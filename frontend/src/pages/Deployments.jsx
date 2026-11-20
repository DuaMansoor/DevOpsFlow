
const statusStyles = {
  running: "bg-green-500/10 text-green-400",
  pending: "bg-yellow-500/10 text-yellow-400",
  stopped: "bg-slate-700 text-slate-300",
  failed: "bg-red-500/10 text-red-400",
};

export default function Deployments({
  deployments,
  setDeployments,
}) {
  // Simulate scaling a Kubernetes deployment
  const updateReplicas = (id, change) => {
    setDeployments((previous) =>
      previous.map((deployment) => {
        if (deployment.id !== id) {
          return deployment;
        }

        const replicas = Math.max(
          0,
          deployment.replicas + change
        );

        return {
          ...deployment,
          replicas,
          readyReplicas: Math.min(
            deployment.readyReplicas,
            replicas
          ),
          status: replicas === 0 ? "stopped" : "pending",
        };
      })
    );
  };

  // Simulate restarting a deployment
  const handleRestart = (id) => {
    setDeployments((previous) =>
      previous.map((deployment) =>
        deployment.id === id
          ? {
              ...deployment,
              readyReplicas: 0,
              status:
                deployment.replicas === 0
                  ? "stopped"
                  : "pending",
            }
          : deployment
      )
    );
  };

  // Remove deployment from demo list
  const handleDelete = (id) => {
    if (
      !window.confirm(
        "Remove this deployment from the demo list?"
      )
    ) {
      return;
    }

    setDeployments((previous) =>
      previous.filter(
        (deployment) => deployment.id !== id
      )
    );
  };

  // Calculate deployment statistics
  const runningCount = deployments.filter(
    (deployment) => deployment.status === "running"
  ).length;

  const pendingCount = deployments.filter(
    (deployment) => deployment.status === "pending"
  ).length;

  const totalReplicas = deployments.reduce(
    (total, deployment) => total + deployment.replicas,
    0
  );

  return (
    <main className="p-6 text-white md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page Header */}
        <header>
          <h1 className="text-3xl font-bold">
            Kubernetes Deployments
          </h1>

          <p className="mt-2 text-slate-400">
            Monitor and manage application deployments.
          </p>

          <p className="mt-2 text-xs text-yellow-400">
            Demo mode: Deployment actions are simulated.
          </p>
        </header>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total Deployments",
              value: deployments.length,
            },
            {
              label: "Running",
              value: runningCount,
            },
            {
              label: "Pending",
              value: pendingCount,
            },
            {
              label: "Desired Replicas",
              value: totalReplicas,
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

        {/* Deployment Table */}
        <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 p-5">
            <h2 className="text-xl font-semibold">
              Deployment List
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800 text-slate-300">
                <tr>
                  <th className="p-4">Deployment</th>
                  <th className="p-4">Namespace</th>
                  <th className="p-4">Image</th>
                  <th className="p-4">Replicas</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {deployments.map((deployment) => (
                  <tr
                    key={deployment.id}
                    className="border-t border-slate-800"
                  >
                    {/* Deployment Name */}
                    <td className="p-4 font-medium">
                      {deployment.name}
                    </td>

                    {/* Namespace */}
                    <td className="p-4 text-slate-400">
                      {deployment.namespace}
                    </td>

                    {/* Docker Image */}
                    <td className="p-4 text-slate-400">
                      {deployment.image}
                    </td>

                    {/* Ready / Desired Replicas */}
                    <td className="p-4">
                      {deployment.readyReplicas}/
                      {deployment.replicas}
                    </td>

                    {/* Deployment Status */}
                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          statusStyles[deployment.status] ||
                          statusStyles.pending
                        }`}
                      >
                        {deployment.status}
                      </span>
                    </td>

                    {/* Management Actions */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {/* Scale Down */}
                        <button
                          type="button"
                          onClick={() =>
                            updateReplicas(
                              deployment.id,
                              -1
                            )
                          }
                          disabled={deployment.replicas === 0}
                          className="rounded-lg bg-slate-700 px-3 py-2 hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                          title="Scale down"
                          aria-label={`Scale down ${deployment.name}`}
                        >
                          −
                        </button>

                        {/* Scale Up */}
                        <button
                          type="button"
                          onClick={() =>
                            updateReplicas(
                              deployment.id,
                              1
                            )
                          }
                          className="rounded-lg bg-cyan-500/10 px-3 py-2 text-cyan-400 hover:bg-cyan-500/20"
                          title="Scale up"
                          aria-label={`Scale up ${deployment.name}`}
                        >
                          +
                        </button>

                        {/* Restart */}
                        <button
                          type="button"
                          onClick={() =>
                            handleRestart(deployment.id)
                          }
                          disabled={deployment.replicas === 0}
                          className="rounded-lg bg-blue-500/10 px-3 py-2 text-blue-400 hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Restart
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(deployment.id)
                          }
                          className="rounded-lg bg-red-500/10 px-3 py-2 text-red-400 hover:bg-red-500/20"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Empty State */}
                {deployments.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-slate-400"
                    >
                      No deployments available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <p className="text-xs text-slate-500">
          Replica counts and statuses are mock values.
          Changes do not affect a Kubernetes cluster.
        </p>
      </div>
    </main>
  );
}
