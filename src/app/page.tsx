"use client";

import { useRouter } from "next/navigation";
import { useGym } from "@/context/GymProvider";

export default function HomePage() {
  const router = useRouter();
  const { startFromLast, startTemplate, lastSaved, active, syncStatus } = useGym();

  const goWorkout = () => router.push("/workout");

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 pt-8">
      <header>
        <p className="text-sm text-text-muted">Train without the spreadsheet</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-text">
          Start workout
        </h1>
      </header>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => {
            startFromLast();
            goWorkout();
          }}
          className="min-h-14 w-full rounded-2xl bg-primary px-4 text-base font-semibold text-primary-on shadow-sm active:scale-[0.99] transition-transform"
        >
          Resume last
        </button>
        <button
          type="button"
          onClick={() => {
            startTemplate();
            goWorkout();
          }}
          className="min-h-12 w-full rounded-2xl border border-border bg-surface text-base font-medium text-text"
        >
          Start template (push day)
        </button>
      </div>

      {syncStatus && (
        <p
          className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text-muted"
          role="status"
        >
          {syncStatus}
        </p>
      )}

      {lastSaved && (
        <p className="text-sm text-text-muted">
          Last session:{" "}
          <span className="font-medium text-text">{lastSaved.name}</span> ·{" "}
          {new Date(lastSaved.endedAt).toLocaleDateString()}
        </p>
      )}

      {active && (
        <p className="text-sm text-primary">
          Workout in progress —{" "}
          <button type="button" className="underline" onClick={goWorkout}>
            continue
          </button>
        </p>
      )}
    </main>
  );
}
