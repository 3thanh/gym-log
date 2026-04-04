"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ActiveExercise, ActiveWorkout, CompletedSet, SavedWorkout } from "@/lib/types";
import { ensureAnonymousSession, syncWorkoutToSupabase } from "@/lib/supabase/sync";

const STORAGE_HISTORY = "gym-log:history";
const STORAGE_LAST = "gym-log:last-workout";

type GymContextValue = {
  history: SavedWorkout[];
  active: ActiveWorkout | null;
  lastSaved: SavedWorkout | null;
  syncStatus: string | null;
  startFromLast: () => void;
  startTemplate: () => void;
  logCurrentSet: () => void;
  undoLastSet: () => void;
  bumpWeight: (delta: number) => void;
  setRepsDelta: (delta: number) => void;
  finishWorkout: () => void;
  cancelWorkout: () => void;
};

const GymContext = createContext<GymContextValue | null>(null);

function makeExercise(
  name: string,
  plannedSets: number,
  lastWeight: number,
  lastReps: number
): ActiveExercise {
  return {
    id: crypto.randomUUID(),
    name,
    plannedSets,
    completed: [],
    weight: lastWeight,
    reps: lastReps,
  };
}

const DEFAULT_EXERCISES = () => [
  makeExercise("Bench Press (Barbell)", 4, 185, 8),
  makeExercise("Lateral Raise (Dumbbell)", 3, 22.5, 12),
  makeExercise("Incline Bench Press (Barbell)", 3, 135, 10),
];

function loadHistory(): SavedWorkout[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_HISTORY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedWorkout[];
  } catch {
    return [];
  }
}

function loadLast(): SavedWorkout | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_LAST);
    if (!raw) return null;
    return JSON.parse(raw) as SavedWorkout;
  } catch {
    return null;
  }
}

function cloneWorkoutToActive(saved: SavedWorkout): ActiveWorkout {
  const exercises: ActiveExercise[] = saved.exercises.map((ex) => {
    const last = ex.sets.at(-1);
    const w = last?.weight ?? 0;
    const r = last?.reps ?? 8;
    return {
      id: crypto.randomUUID(),
      name: ex.name,
      plannedSets: Math.max(ex.sets.length, 3),
      completed: [],
      weight: w,
      reps: r,
    };
  });
  return {
    id: crypto.randomUUID(),
    name: saved.name,
    startedAt: new Date().toISOString(),
    exercises,
    exerciseIndex: 0,
  };
}

export function GymProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<SavedWorkout[]>([]);
  const [active, setActive] = useState<ActiveWorkout | null>(null);
  const [lastSaved, setLastSaved] = useState<SavedWorkout | null>(null);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
    setLastSaved(loadLast());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_HISTORY, JSON.stringify(history));
  }, [history, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (lastSaved) localStorage.setItem(STORAGE_LAST, JSON.stringify(lastSaved));
  }, [lastSaved, hydrated]);

  useEffect(() => {
    void ensureAnonymousSession();
  }, []);

  const startFromLast = useCallback(() => {
    const last = loadLast();
    if (last) {
      setActive(cloneWorkoutToActive(last));
      return;
    }
    setActive({
      id: crypto.randomUUID(),
      name: "Push day",
      startedAt: new Date().toISOString(),
      exercises: DEFAULT_EXERCISES(),
      exerciseIndex: 0,
    });
  }, []);

  const startTemplate = useCallback(() => {
    setActive({
      id: crypto.randomUUID(),
      name: "Push day",
      startedAt: new Date().toISOString(),
      exercises: DEFAULT_EXERCISES(),
      exerciseIndex: 0,
    });
  }, []);

  const logCurrentSet = useCallback(() => {
    setActive((w) => {
      if (!w) return w;
      const ex = w.exercises[w.exerciseIndex];
      if (!ex) return w;
      const done: CompletedSet = {
        weight: ex.weight,
        reps: ex.reps,
        completedAt: new Date().toISOString(),
      };
      const nextCompleted = [...ex.completed, done];
      const nextExercises = [...w.exercises];
      let nextIndex = w.exerciseIndex;

      if (nextCompleted.length >= ex.plannedSets) {
        nextExercises[w.exerciseIndex] = { ...ex, completed: nextCompleted };
        if (w.exerciseIndex + 1 < w.exercises.length) {
          nextIndex = w.exerciseIndex + 1;
        } else {
          nextExercises[w.exerciseIndex] = { ...ex, completed: nextCompleted };
        }
      } else {
        const prevWeight = ex.weight;
        const prevReps = ex.reps;
        nextExercises[w.exerciseIndex] = {
          ...ex,
          completed: nextCompleted,
          weight: prevWeight,
          reps: prevReps,
        };
      }

      return { ...w, exercises: nextExercises, exerciseIndex: nextIndex };
    });
  }, []);

  const undoLastSet = useCallback(() => {
    setActive((w) => {
      if (!w) return w;
      const ex = w.exercises[w.exerciseIndex];
      if (!ex || ex.completed.length === 0) return w;
      const nextExercises = [...w.exercises];
      const completed = ex.completed.slice(0, -1);
      nextExercises[w.exerciseIndex] = { ...ex, completed };
      return { ...w, exercises: nextExercises };
    });
  }, []);

  const bumpWeight = useCallback((delta: number) => {
    setActive((w) => {
      if (!w) return w;
      const ex = w.exercises[w.exerciseIndex];
      if (!ex) return w;
      const next = [...w.exercises];
      next[w.exerciseIndex] = {
        ...ex,
        weight: Math.max(0, Math.round((ex.weight + delta) * 10) / 10),
      };
      return { ...w, exercises: next };
    });
  }, []);

  const setRepsDelta = useCallback((delta: number) => {
    setActive((w) => {
      if (!w) return w;
      const ex = w.exercises[w.exerciseIndex];
      if (!ex) return w;
      const next = [...w.exercises];
      next[w.exerciseIndex] = {
        ...ex,
        reps: Math.max(0, ex.reps + delta),
      };
      return { ...w, exercises: next };
    });
  }, []);

  const finishWorkout = useCallback(() => {
    setActive((w) => {
      if (!w) return w;
      const endedAt = new Date().toISOString();
      const saved: SavedWorkout = {
        id: w.id,
        name: w.name,
        startedAt: w.startedAt,
        endedAt,
        exercises: w.exercises.map((e) => ({
          name: e.name,
          sets: e.completed,
        })),
      };
      setHistory((h) => [saved, ...h]);
      setLastSaved(saved);
      setSyncStatus(null);
      void (async () => {
        const r = await syncWorkoutToSupabase(saved);
        setSyncStatus(
          r.ok ? "Synced to cloud" : r.error ? `Cloud: ${r.error}` : "Saved locally only"
        );
      })();
      return null;
    });
  }, []);

  const cancelWorkout = useCallback(() => {
    setActive(null);
  }, []);

  const value = useMemo<GymContextValue>(
    () => ({
      history,
      active,
      lastSaved,
      syncStatus,
      startFromLast,
      startTemplate,
      logCurrentSet,
      undoLastSet,
      bumpWeight,
      setRepsDelta,
      finishWorkout,
      cancelWorkout,
    }),
    [
      history,
      active,
      lastSaved,
      syncStatus,
      startFromLast,
      startTemplate,
      logCurrentSet,
      undoLastSet,
      bumpWeight,
      setRepsDelta,
      finishWorkout,
      cancelWorkout,
    ]
  );

  return <GymContext.Provider value={value}>{children}</GymContext.Provider>;
}

export function useGym() {
  const ctx = useContext(GymContext);
  if (!ctx) throw new Error("useGym must be used within GymProvider");
  return ctx;
}
