

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "pipelines", label: "Pipelines", icon: "🔄" },
  { id: "containers", label: "Containers", icon: "📦" },
  { id: "deployments", label: "Deployments", icon: "🚀" },
  { id: "history", label: "Build History", icon: "📋" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];


export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-900 p-5">
      <h1 className="mb-2 text-2xl font-bold text-cyan-400">
        DevOpsFlow
      </h1>

      <p className="mb-8 text-xs text-slate-400">
        CI/CD Management Platform
      </p>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
              activePage === item.id
                ? "bg-cyan-500 text-slate-950"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
