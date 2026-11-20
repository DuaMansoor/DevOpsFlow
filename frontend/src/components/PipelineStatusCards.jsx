
const statusCards = [
  {
    status: "success",
    label: "Successful",
    color: "text-green-400",
    border: "border-green-500/30",
  },
  {
    status: "running",
    label: "Running",
    color: "text-blue-400",
    border: "border-blue-500/30",
  },
  {
    status: "failed",
    label: "Failed",
    color: "text-red-400",
    border: "border-red-500/30",
  },
  {
    status: "pending",
    label: "Pending",
    color: "text-yellow-400",
    border: "border-yellow-500/30",
  },
];

export default function PipelineStatusCards({ pipelines }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statusCards.map((card) => {
        const count = pipelines.filter(
          (pipeline) => pipeline.status === card.status
        ).length;

        return (
          <div
            key={card.status}
            className={`rounded-xl border bg-slate-900 p-5 ${card.border}`}
          >
            <p className="text-sm text-slate-400">
              {card.label}
            </p>

            <p className={`mt-3 text-3xl font-bold ${card.color}`}>
              {count}
            </p>
          </div>
        );
      })}
    </div>
  );
}
