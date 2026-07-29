import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, workoutsTable, workoutExercisesTable, exercisesTable } from "@workspace/db";
import {
  CreateWorkoutBody,
  UpdateWorkoutBody,
  GetWorkoutParams,
  DeleteWorkoutParams,
  UpdateWorkoutParams,
  AddWorkoutExerciseParams,
  RemoveWorkoutExerciseParams,
  AddWorkoutExerciseBody,
} from "@workspace/api-zod";

const router = Router();

router.get("/workouts", async (req, res): Promise<void> => {
  const workouts = await db.select().from(workoutsTable).orderBy(workoutsTable.date);
  res.json(workouts.reverse());
});

router.post("/workouts", async (req, res): Promise<void> => {
  const parsed = CreateWorkoutBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [workout] = await db
    .insert(workoutsTable)
    .values({ ...parsed.data, date: new Date(parsed.data.date) })
    .returning();
  res.status(201).json(workout);
});

router.get("/workouts/:id", async (req, res): Promise<void> => {
  const params = GetWorkoutParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [workout] = await db
    .select()
    .from(workoutsTable)
    .where(eq(workoutsTable.id, params.data.id));
  if (!workout) {
    res.status(404).json({ error: "Workout not found" });
    return;
  }
  const exerciseRows = await db
    .select({
      id: workoutExercisesTable.id,
      workoutId: workoutExercisesTable.workoutId,
      exerciseId: workoutExercisesTable.exerciseId,
      exerciseName: exercisesTable.name,
      sets: workoutExercisesTable.sets,
      reps: workoutExercisesTable.reps,
      weightKg: workoutExercisesTable.weightKg,
      durationSeconds: workoutExercisesTable.durationSeconds,
      notes: workoutExercisesTable.notes,
      orderIndex: workoutExercisesTable.orderIndex,
    })
    .from(workoutExercisesTable)
    .innerJoin(exercisesTable, eq(workoutExercisesTable.exerciseId, exercisesTable.id))
    .where(eq(workoutExercisesTable.workoutId, params.data.id))
    .orderBy(workoutExercisesTable.orderIndex);

  res.json({ ...workout, exercises: exerciseRows });
});

router.patch("/workouts/:id", async (req, res): Promise<void> => {
  const params = UpdateWorkoutParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = UpdateWorkoutBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updateData: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.date) {
    updateData.date = new Date(parsed.data.date);
  }
  const [workout] = await db
    .update(workoutsTable)
    .set(updateData)
    .where(eq(workoutsTable.id, params.data.id))
    .returning();
  if (!workout) {
    res.status(404).json({ error: "Workout not found" });
    return;
  }
  res.json(workout);
});

router.delete("/workouts/:id", async (req, res): Promise<void> => {
  const params = DeleteWorkoutParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(workoutsTable).where(eq(workoutsTable.id, params.data.id));
  res.status(204).send();
});

router.post("/workouts/:id/exercises", async (req, res): Promise<void> => {
  const params = AddWorkoutExerciseParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = AddWorkoutExerciseBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [ex] = await db
    .select()
    .from(exercisesTable)
    .where(eq(exercisesTable.id, parsed.data.exerciseId));
  if (!ex) {
    res.status(404).json({ error: "Exercise not found" });
    return;
  }
  const [workoutExercise] = await db
    .insert(workoutExercisesTable)
    .values({
      workoutId: params.data.id,
      exerciseId: parsed.data.exerciseId,
      sets: parsed.data.sets,
      reps: parsed.data.reps ?? null,
      weightKg: parsed.data.weightKg ?? null,
      durationSeconds: parsed.data.durationSeconds ?? null,
      notes: parsed.data.notes ?? null,
      orderIndex: parsed.data.orderIndex ?? 0,
    })
    .returning();

  // Recompute totalVolume on parent workout
  const allExercises = await db
    .select()
    .from(workoutExercisesTable)
    .where(eq(workoutExercisesTable.workoutId, params.data.id));
  const totalVolume = allExercises.reduce((sum, e) => {
    if (e.weightKg && e.sets && e.reps) {
      return sum + e.weightKg * e.sets * e.reps;
    }
    return sum;
  }, 0);
  await db
    .update(workoutsTable)
    .set({ totalVolume })
    .where(eq(workoutsTable.id, params.data.id));

  res.status(201).json({ ...workoutExercise, exerciseName: ex.name });
});

router.delete("/workouts/:workoutId/exercises/:exerciseId", async (req, res): Promise<void> => {
  const params = RemoveWorkoutExerciseParams.safeParse({
    workoutId: Number(req.params.workoutId),
    exerciseId: Number(req.params.exerciseId),
  });
  if (!params.success) {
    res.status(400).json({ error: "Invalid params" });
    return;
  }
  await db
    .delete(workoutExercisesTable)
    .where(eq(workoutExercisesTable.id, params.data.exerciseId));

  // Recompute totalVolume
  const allExercises = await db
    .select()
    .from(workoutExercisesTable)
    .where(eq(workoutExercisesTable.workoutId, params.data.workoutId));
  const totalVolume = allExercises.reduce((sum, e) => {
    if (e.weightKg && e.sets && e.reps) {
      return sum + e.weightKg * e.sets * e.reps;
    }
    return sum;
  }, 0);
  await db
    .update(workoutsTable)
    .set({ totalVolume })
    .where(eq(workoutsTable.id, params.data.workoutId));

  res.status(204).send();
});

export default router;
