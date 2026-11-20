
import { useState } from "react";
import PipelineTable from "../components/PipelineTable";

export default function Pipelines({ pipelines, setPipelines }) {
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    repositoryUrl: "",
    branch: "main",
  });

  const resetForm = () => {
    setForm({
      name: "",
      repositoryUrl: "",
      branch: "main",
    });
    setEditingId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.repositoryUrl.trim()) return;

    if (editingId !== null) {
      setPipelines((previous) =>
        previous.map((pipeline) =>
          pipeline.id === editingId
            ? { ...pipeline, ...form }
            : pipeline
        )
      );
    } else {
      setPipelines((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          ...form,
          status: "pending",
        },
      ]);
    }

    resetForm();
  };

  const handleEdit = (pipeline) => {
    setEditingId(pipeline.id);

    setForm({
      name: pipeline.name,
      repositoryUrl: pipeline.repositoryUrl,
      branch: pipeline.branch,
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this pipeline?")) return;

    setPipelines((previous) =>
      previous.filter((pipeline) => pipeline.id !== id)
    );

    if (editingId === id) resetForm();
  };

  return (
    <main className="p-6 text-white md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <h1 className="text-3xl font-bold">
            Pipeline Management
          </h1>
          <p className="mt-2 text-slate-400">
            Create and manage your CI/CD pipelines.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 rounded-xl border border-slate-700 bg-slate-900 p-6 md:grid-cols-3"
        >
          <input
            className="rounded-lg border border-slate-700 bg-slate-800 p-3"
            placeholder="Pipeline name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />

          <input
            type="url"
            className="rounded-lg border border-slate-700 bg-slate-800 p-3"
            placeholder="GitHub repository URL"
            value={form.repositoryUrl}
            onChange={(e) =>
              setForm({
                ...form,
                repositoryUrl: e.target.value,
              })
            }
            required
          />

          <input
            className="rounded-lg border border-slate-700 bg-slate-800 p-3"
            placeholder="Branch"
            value={form.branch}
            onChange={(e) =>
              setForm({ ...form, branch: e.target.value })
            }
            required
          />

          <div className="flex gap-3 md:col-span-3">
            <button
              type="submit"
              className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
            >
              {editingId !== null
                ? "Save Changes"
                : "Create Pipeline"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-600 px-5 py-3"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <section>
          <h2 className="mb-4 text-xl font-semibold">
            All Pipelines ({pipelines.length})
          </h2>

          <PipelineTable
            pipelines={pipelines}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
      </div>
    </main>
  );
}
