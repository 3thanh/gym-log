export type CompletedSet = {
  weight: number;
  reps: number;
  completedAt: string;
};

export type ActiveExercise = {
  id: string;
  name: string;
  plannedSets: number;
  completed: CompletedSet[];
  weight: number;
  reps: number;
};

export type ActiveWorkout = {
  id: string;
  name: string;
  startedAt: string;
  exercises: ActiveExercise[];
  exerciseIndex: number;
};

export type SavedWorkout = {
  id: string;
  name: string;
  startedAt: string;
  endedAt: string;
  exercises: {
    name: string;
    sets: CompletedSet[];
  }[];
};
