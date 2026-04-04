import type { SavedWorkout } from "@/lib/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export async function syncWorkoutToSupabase(workout: SavedWorkout): Promise<{
  ok: boolean;
  error?: string;
}> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    return { ok: false, error: "Supabase env not configured" };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { ok: false, error: userError?.message ?? "Not signed in" };
  }

  const { error: sessionError } = await supabase.from("workout_sessions").insert({
    id: workout.id,
    user_id: user.id,
    name: workout.name,
    started_at: workout.startedAt,
    ended_at: workout.endedAt,
  });
  if (sessionError) {
    return { ok: false, error: sessionError.message };
  }

  for (let i = 0; i < workout.exercises.length; i++) {
    const ex = workout.exercises[i];
    const exerciseId = crypto.randomUUID();
    const { error: exError } = await supabase
      .from("workout_session_exercises")
      .insert({
        id: exerciseId,
        session_id: workout.id,
        user_id: user.id,
        name: ex.name,
        sort_order: i,
      });
    if (exError) {
      return { ok: false, error: exError.message };
    }

    for (let s = 0; s < ex.sets.length; s++) {
      const set = ex.sets[s];
      const { error: setError } = await supabase.from("workout_set_entries").insert({
        id: crypto.randomUUID(),
        session_exercise_id: exerciseId,
        user_id: user.id,
        set_index: s + 1,
        weight: set.weight,
        reps: set.reps,
        kind: "working",
        completed_at: set.completedAt,
      });
      if (setError) {
        return { ok: false, error: setError.message };
      }
    }
  }

  return { ok: true };
}

export async function ensureAnonymousSession(): Promise<boolean> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return false;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) return true;

  const { error } = await supabase.auth.signInAnonymously();
  return !error;
}
