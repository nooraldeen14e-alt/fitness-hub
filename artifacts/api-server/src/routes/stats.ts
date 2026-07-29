import { Router } from "express";
import { eq, sql, and, gte } from "drizzle-orm";
import { db, workoutsTable, workoutExercisesTable, exercisesTable } from "@workspace/db";

const router = Router();

router.get("/stats/summary", async (req, res): Promise<void> => {
  const workouts = await db.select().from(workoutsTable).orderBy(workoutsTable.date);

  const totalWorkouts = workouts.length;
  const completedWorkouts = workouts.filter((w) => w.status === "completed").length;

  // Calculate streak (consecutive days with completed workouts from today backwards)
  let currentStreak = 0;
  const completedDates = workouts
    .filter((w) => w.status === "completed")
    .map((w) => new Date(w.date).toDateString());
  const uniqueDates = [...new Set(completedDates)].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  for (const dateStr of uniqueDates) {
    const d = new Date(dateStr);
    const diff = Math.floor((cursor.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 1) {
      currentStreak++;
      cursor = d;
    } else {
      break;
    }
  }

  const totalVolumeKg = workouts.reduce((sum, w) => sum + (w.totalVolume ?? 0), 0);

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const thisWeekWorkouts = workouts.filter(
    (w) => new Date(w.date) >= startOfWeek && w.status === "completed"
  ).length;

  const completedWithDuration = workouts.filter(
    (w) => w.status === "completed" && w.durationMinutes
  );
  const avgDurationMinutes =
    completedWithDuration.length > 0
      ? completedWithDuration.reduce((sum, w) => sum + (w.durationMinutes ?? 0), 0) /
        completedWithDuration.length
      : null;

  res.json({
    totalWorkouts,
    completedWorkouts,
    currentStreak,
    totalVolumeKg,
    thisWeekWorkouts,
    avgDurationMinutes,
  });
});

router.get("/stats/weekly", async (req, res): Promise<void> => {
  const workouts = await db.select().from(workoutsTable).orderBy(workoutsTable.date);

  // Build weekly buckets for the last 8 weeks
  const result: { week: string; workoutCount: number; totalVolumeKg: number }[] = [];
  const now = new Date();

  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() - i * 7);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const weekWorkouts = workouts.filter((w) => {
      const d = new Date(w.date);
      return d >= weekStart && d < weekEnd && w.status === "completed";
    });

    result.push({
      week: weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      workoutCount: weekWorkouts.length,
      totalVolumeKg: weekWorkouts.reduce((sum, w) => sum + (w.totalVolume ?? 0), 0),
    });
  }

  res.json(result);
});

router.get("/stats/muscle-groups", async (req, res): Promise<void> => {
  const rows = await db
    .select({
      muscleGroup: exercisesTable.muscleGroup,
      count: sql<number>`count(*)::int`,
    })
    .from(workoutExercisesTable)
    .innerJoin(exercisesTable, eq(workoutExercisesTable.exerciseId, exercisesTable.id))
    .groupBy(exercisesTable.muscleGroup);

  res.json(rows);
});

export default router;
