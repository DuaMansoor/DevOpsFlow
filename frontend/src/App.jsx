function App() {
  const stats = [
    { title: "Total Pipelines", value: "0" },
    { title: "Active Containers", value: "0" },
    { title: "Deployments", value: "0" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-8 py-6">
        <h1 className="text-3xl font-bold text-cyan-400">
          DevOpsFlow
        </h1>
        <p className="mt-2 text-slate-400">
          CI/CD Automation & Kubernetes Management
        </p>
      </header>

      <main className="mx-auto max-w-7xl p-8">
        <h2 className="mb-6 text-2xl font-semibold">
          Dashboard Overview
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
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

        <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-xl font-semibold">
            Recent Pipeline Activity
          </h3>
          <p className="mt-3 text-slate-400">
            No pipeline activity yet.
            Connect Jenkins to get started.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;