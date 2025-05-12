export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  description: string;
  imageUrl?: string;
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  reps: number;
  weight: number;
  date: Date;
}

export interface WorkoutHistory {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
  date: Date;
}