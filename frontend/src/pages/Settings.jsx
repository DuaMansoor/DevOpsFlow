
import { useState } from "react";

const initialSettings = {
  githubUrl: "",
  githubBranch: "dev",
  jenkinsUrl: "",
  jenkinsJob: "",
  dockerHost: "",
  kubernetesNamespace: "default",
  kubernetesContext: "",
};

const integrations = [
  {
    id: "github",
    title: "GitHub Integration",
    description: "Configure your source code repository.",
    icon: "🔗",
    fields: [
      {
        name: "githubUrl",
        label: "Repository URL",
        placeholder: "https://github.com/owner/repository",
        type: "url",
      },
      {
        name: "githubBranch",
        label: "Default Branch",
        placeholder: "dev",
        type: "text",
      },
    ],
  },
  {
    id: "jenkins",
    title: "Jenkins Integration",
    description: "Configure your Jenkins CI/CD server.",
    icon: "⚙️",
    fields: [
      {
        name: "jenkinsUrl",
        label: "Jenkins Server URL",
        placeholder: "http://localhost:8080",
        type: "url",
      },
      {
        name: "jenkinsJob",
        label: "Jenkins Job Name",
        placeholder: "devopsflow-pipeline",
        type: "text",
      },
    ],
  },
  {
    id: "docker",
    title: "Docker Integration",
    description: "Configure the Docker environment.",
    icon: "🐳",
    fields: [
      {
        name: "dockerHost",
        label: "Docker Host",
        placeholder: "Local Docker Desktop",
        type: "text",
      },
    ],
  },
  {
    id: "kubernetes",
    title: "Kubernetes Integration",
    description: "Configure the Kubernetes environment.",
    icon: "☸️",
    fields: [
      {
        name: "kubernetesNamespace",
        label: "Namespace",
        placeholder: "default",
        type: "text",
      },
      {
        name: "kubernetesContext",
        label: "Cluster Context",
        placeholder: "minikube",
        type: "text",
      },
    ],
  },
];

export default function Settings() {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Demo only: no backend request or persistent storage.
    setSaved(true);
  };

  const handleReset = () => {
    setSettings(initialSettings);
    setSaved(false);
  };

  return (
    <main className="p-6 text-white md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <h1 className="text-3xl font-bold">
            Settings & Integrations
          </h1>

          <p className="mt-2 text-slate-400">
            Configure CI/CD platform integration settings.
          </p>

          <p className="mt-2 text-xs text-yellow-400">
            Demo mode: Settings are not connected to external
            services or stored permanently.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-2">
            {integrations.map((integration) => (
              <section
                key={integration.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="mb-6 flex items-start gap-3">
                  <span className="text-2xl" aria-hidden="true">
                    {integration.icon}
                  </span>

                  <div>
                    <h2 className="text-xl font-semibold">
                      {integration.title}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      {integration.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {integration.fields.map((field) => (
                    <div key={field.name}>
                      <label
                        htmlFor={field.name}
                        className="mb-2 block text-sm font-medium text-slate-300"
                      >
                        {field.label}
                      </label>

                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={settings[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none transition focus:border-cyan-500"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-yellow-400" />
                  Not connected
                </div>
              </section>
            ))}
          </div>

          {saved && (
            <div
              role="status"
              className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4 text-sm text-cyan-300"
            >
              Settings updated in this form only.
              No configuration has been saved to a server.
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Apply Demo Settings
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-300 transition hover:bg-slate-800"
            >
              Reset
            </button>
          </div>
        </form>

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold">
            Security Information
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Do not enter GitHub access tokens, Jenkins API
            tokens, passwords, Docker certificates, or
            Kubernetes credentials into this demo interface.
            Secure credential management must be implemented
            through the backend.
          </p>
        </section>
      </div>
    </main>
  );
}
