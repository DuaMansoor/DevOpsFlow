import { useEffect, useState } from "react";
import PipelineTable from "../components/PipelineTable";
import api from "../services/api";

export default function Pipelines({ pipelines, setPipelines }) {
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    repositoryUrl: "",
    branch: "main",
  });

  // Fetch all pipelines
  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        setError("");

        const response = await api.get("/pipelines");
        setPipelines(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch pipelines.");
      } finally {
        setLoading(false);
      }
    };

    fetchPipelines();
  }, [setPipelines]);

  // Reset form
  const resetForm = () => {
    setForm({
      name: "",
      repositoryUrl: "",
      branch: "main",
    });

    setEditingId(null);
  };

  // Create or update pipeline
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.repositoryUrl.trim()) return;

    try {
      setSubmitting(true);
      setError("");

      if (editingId !== null) {
        // Update existing pipeline
        const response = await api.put(`/pipelines/${editingId}`, form);

        setPipelines((previous) =>
          previous.map((pipeline) =>
            pipeline.id === editingId ? response.data.data : pipeline,
          ),
        );
      } else {
        // Create new pipeline
        const response = await api.post("/pipelines", form);

        setPipelines((previous) => [...previous, response.data.data]);
      }

      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save pipeline.");
    } finally {
      setSubmitting(false);
    }
  };

  // Edit pipeline
  const handleEdit = (pipeline) => {
    setEditingId(pipeline.id);

    setForm({
      name: pipeline.name,
      repositoryUrl: pipeline.repositoryUrl,
      branch: pipeline.branch,
    });
  };

  // Delete pipeline
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pipeline?")) {
      return;
    }

    try {
      setError("");

      await api.delete(`/pipelines/${id}`);

      setPipelines((previous) =>
        previous.filter((pipeline) => pipeline.id !== id),
      );

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete pipeline.");
    }
  };

  return (
    <main className="p-6 text-white md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <h1 className="text-3xl font-bold">Pipeline Management</h1>

          <p className="mt-2 text-slate-400">
            Create and manage your CI/CD pipelines.
          </p>
        </header>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 rounded-xl border border-slate-700 bg-slate-900 p-6 md:grid-cols-3"
        >
          <input
            className="rounded-lg border border-slate-700 bg-slate-800 p-3"
            placeholder="Pipeline name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
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
            onChange={(e) => setForm({ ...form, branch: e.target.value })}
            required
          />

          <div className="flex gap-3 md:col-span-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
            >
              {submitting
                ? "Please wait..."
                : editingId !== null
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

          {loading ? (
            <p className="text-slate-400">Loading pipelines...</p>
          ) : (
            <PipelineTable
              pipelines={pipelines}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </section>
      </div>
    </main>
  );
}
