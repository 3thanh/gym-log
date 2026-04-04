"use client";

import { useMemo } from "react";
import { useGym } from "@/context/GymProvider";

export default function InsightsPage() {
  const { history } = useGym();

  const stats = useMemo(() => {
    if (history.length === 0) return null;
    const last = history[0];
    const prev = history[1];
    const weekAgo = Date.now() - 7 * 86400000;
    const sessionsThisWeek = history.filter(
      (h) => new Date(h.endedAt).getTime() >= weekAgo
    ).length;
    const volume = last.exercises.reduce(
      (acc, e) =>
        acc + e.sets.reduce((a, s) => a + s.weight * s.reps, 0),
      0
    );
    let volDelta: string | null = null;
    if (prev) {
      const pv = prev.exercises.reduce(
        (acc, e) =>
          acc + e.sets.reduce((a, s) => a + s.weight * s.reps, 0),
        0
      );
      if (pv > 0) {
        const pct = Math.round(((volume - pv) / pv) * 100);
        volDelta = `${pct >= 0 ? "+" : ""}${pct}% vs prior session`;
      }
    }
    return { sessionsThisWeek, volume, volDelta, last };
  }, [history]);

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 px-4 pt-8">
      <h1 className="text-2xl font-semibold text-text">Insights</h1>
      {!stats && (
        <p className="text-text-muted">
          Log a few workouts to unlock trends and volume snapshots.
        </p>
      )}
      {stats && (
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
          <article className="min-w-[85%] snap-start rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Last session
            </p>
            <p className="mt-2 text-lg font-semibold text-text">
              {stats.last.name}
            </p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-text">
              {Math.round(stats.volume).toLocaleString()}{" "}
              <span className="text-base font-normal text-text-muted">lb·reps</span>
            </p>
            {stats.volDelta && (
              <p className="mt-2 text-sm text-text-muted">{stats.volDelta}</p>
            )}
            <p className="mt-3 text-sm text-primary">
              Next: repeat loads if RPE felt easy; add 2.5–5 lb on top sets if you
              cleared all reps.
            </p>
          </article>
          <article className="min-w-[85%] snap-start rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Consistency
            </p>
            <p className="mt-2 text-3xl font-semibold tabular-nums text-text">
              {stats.sessionsThisWeek}
            </p>
            <p className="text-sm text-text-muted">sessions in the last 7 days</p>
            <p className="mt-3 text-sm text-primary">
              Anchor two fixed weekdays to protect the habit.
            </p>
          </article>
        </div>
      )}
    </main>
  );
}
