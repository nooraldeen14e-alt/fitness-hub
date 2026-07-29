import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const workoutsTable = pgTable("workouts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
  durationMinutes: integer("duration_minutes"),
  notes: text("notes"),
  status: text("status").notNull().default("planned"), // planned | completed
  totalVolume: real("total_volume"),
});

export const insertWorkoutSchema = createInsertSchema(workoutsTable).omit({ id: true });
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type Workout = typeof workoutsTable.$inferSelect;
