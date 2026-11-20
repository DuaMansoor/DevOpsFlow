const statusStyles = {
  success: "bg-green-500/15 text-green-400",
  running: "bg-blue-500/15 text-blue-400",
  failed: "bg-red-500/15 text-red-400",
  pending: "bg-yellow-500/15 text-yellow-400",
};

export default function PipelineTable({ pipelines, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-800 text-slate-300">
          <tr>
            <th className="p-4">Pipeline Name</th>
            <th className="p-4">Repository</th>
            <th className="p-4">Branch</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {pipelines.map((pipeline) => (
            <tr
              key={pipeline.id}
              className="border-t border-slate-700 text-slate-200"
            >
              <td className="p-4 font-medium">{pipeline.name}</td>

              <td className="p-4">{pipeline.repositoryUrl}</td>

              <td className="p-4">{pipeline.branch}</td>

              <td className="p-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    statusStyles[pipeline.status] || statusStyles.pending
                  }`}
                >
                  {pipeline.status}
                </span>
              </td>

              <td className="space-x-3 p-4">
                <button
                  onClick={() => onEdit(pipeline)}
                  className="text-cyan-400 hover:underline"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(pipeline.id)}
                  className="text-red-400 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pipelines.length === 0 && (
        <p className="p-6 text-center text-slate-400">
          No pipelines available.
        </p>
      )}
    </div>
  );
}