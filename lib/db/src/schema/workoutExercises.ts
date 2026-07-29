import { pgTable, text, serial, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { workoutsTable } from "./workouts";
import { exercisesTable } from "./exercises";

export const workoutExercisesTable = pgTable("workout_exercises", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id").notNull().references(() => workoutsTable.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id").notNull().references(() => exercisesTable.id),
  sets: integer("sets").notNull().default(1),
  reps: integer("reps"),
  weightKg: real("weight_kg"),
  durationSeconds: integer("duration_seconds"),
  notes: text("notes"),
  orderIndex: integer("order_index").notNull().default(0),
});

export const insertWorkoutExerciseSchema = createInsertSchema(workoutExercisesTable).omit({ id: true });
export type InsertWorkoutExercise = z.infer<typeof insertWorkoutExerciseSchema>;
export type WorkoutExercise = typeof workoutExercisesTable.$inferSelect;
