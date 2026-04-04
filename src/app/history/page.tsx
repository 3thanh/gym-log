"use client";

import { useGym } from "@/context/GymProvider";

export default function HistoryPage() {
  const { history } = useGym();

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 px-4 pt-8">
      <h1 className="text-2xl font-semibold text-text">History</h1>
      {history.length === 0 ? (
        <p className="text-text-muted">Complete a workout to see it here.</p>
      ) : (
        <ul className="space-y-3">
          {history.map((h) => (
            <li
              key={h.id}
              className="rounded-2xl border border-border bg-surface p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold text-text">{h.name}</h2>
                <span className="text-xs text-text-muted">
                  {new Date(h.endedAt).toLocaleDateString()}
                </span>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-text-muted">
                {h.exercises.map((e) => (
                  <li key={e.name}>
                    <span className="font-medium text-text">{e.name}</span>
                    <span className="text-text-muted">
                      {" "}
                      · {e.sets.length} sets · best{" "}
                      {e.sets.length
                        ? `${Math.max(...e.sets.map((s) => s.weight))} lb`
                        : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
