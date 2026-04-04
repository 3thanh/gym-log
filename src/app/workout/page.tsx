"use client";

import Link from "next/link";
import { useGym } from "@/context/GymProvider";

function allComplete(w: NonNullable<ReturnType<typeof useGym>["active"]>) {
  return w.exercises.every((e) => e.completed.length >= e.plannedSets);
}

export default function WorkoutPage() {
  const {
    active,
    startTemplate,
    logCurrentSet,
    undoLastSet,
    bumpWeight,
    setRepsDelta,
    finishWorkout,
    cancelWorkout,
  } = useGym();

  if (!active) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 px-4 pt-8">
        <h1 className="text-2xl font-semibold text-text">No active workout</h1>
        <p className="text-text-muted">Start from Home, or begin a template here.</p>
        <button
          type="button"
          onClick={() => startTemplate()}
          className="min-h-12 rounded-2xl bg-primary px-4 font-semibold text-primary-on"
        >
          Start push day
        </button>
        <Link href="/" className="text-sm text-primary underline">
          Back home
        </Link>
      </main>
    );
  }

  const ex = active.exercises[active.exerciseIndex];
  const done = allComplete(active);
  const setNum = ex ? ex.completed.length + 1 : 0;

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 px-4 pt-6">
      <header className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            In session
          </p>
          <h1 className="text-xl font-semibold text-text">{active.name}</h1>
        </div>
        <button
          type="button"
          onClick={() => finishWorkout()}
          disabled={!done}
          className="min-h-11 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Finish
        </button>
      </header>

      {ex && !done && (
        <>
          <section
            className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
            style={{ boxShadow: "inset 3px 0 0 0 var(--accent-line)" }}
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-primary">{ex.name}</h2>
              <span className="text-sm text-text-muted">
                Set {setNum} of {ex.plannedSets}
              </span>
            </div>

            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs text-text-muted">Weight (lb)</p>
                <p className="text-4xl font-semibold tabular-nums tracking-tight text-text">
                  {ex.weight}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-muted">Reps</p>
                <p className="text-4xl font-semibold tabular-nums tracking-tight text-text">
                  {ex.reps}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => bumpWeight(-5)}
                className="min-h-12 min-w-[4.5rem] flex-1 rounded-xl border border-border bg-bg text-sm font-semibold"
              >
                −5 lb
              </button>
              <button
                type="button"
                onClick={() => bumpWeight(5)}
                className="min-h-12 min-w-[4.5rem] flex-1 rounded-xl border border-border bg-bg text-sm font-semibold"
              >
                +5 lb
              </button>
              <button
                type="button"
                onClick={() => setRepsDelta(-1)}
                className="min-h-12 min-w-[3.5rem] rounded-xl border border-border bg-bg text-sm font-semibold"
              >
                −1 rep
              </button>
              <button
                type="button"
                onClick={() => setRepsDelta(1)}
                className="min-h-12 min-w-[3.5rem] rounded-xl border border-border bg-bg text-sm font-semibold"
              >
                +1 rep
              </button>
            </div>

            <button
              type="button"
              onClick={() => logCurrentSet()}
              className="mt-5 min-h-14 w-full rounded-2xl bg-primary text-base font-semibold text-primary-on active:scale-[0.99] transition-transform"
            >
              Done set
            </button>

            <button
              type="button"
              onClick={() => undoLastSet()}
              className="mt-3 w-full text-center text-sm font-medium text-text-muted"
            >
              Undo last set
            </button>
          </section>

          {ex.completed.length > 0 && (
            <section>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                Logged
              </h3>
              <ul className="space-y-2">
                {ex.completed.map((s, i) => (
                  <li
                    key={`${s.completedAt}-${i}`}
                    className="flex justify-between rounded-xl bg-surface px-3 py-2 text-sm text-text-muted"
                  >
                    <span>Set {i + 1}</span>
                    <span className="tabular-nums text-text">
                      {s.weight} lb × {s.reps}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      {done && (
        <p className="rounded-xl border border-border bg-surface p-4 text-sm text-text-muted">
          All sets logged. Tap <span className="font-medium text-text">Finish</span>{" "}
          to save and sync.
        </p>
      )}

      <button
        type="button"
        onClick={() => cancelWorkout()}
        className="mb-4 text-center text-sm font-medium text-danger"
      >
        Cancel workout
      </button>
    </main>
  );
}
