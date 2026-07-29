import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, exercisesTable } from "@workspace/db";
import {
  CreateExerciseBody,
  UpdateExerciseBody,
  GetExerciseParams,
  DeleteExerciseParams,
  UpdateExerciseParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/exercises", async (req, res): Promise<void> => {
  const exercises = await db.select().from(exercisesTable).orderBy(exercisesTable.name);
  res.json(exercises);
});

router.post("/exercises", async (req, res): Promise<void> => {
  const parsed = CreateExerciseBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [exercise] = await db.insert(exercisesTable).values(parsed.data).returning();
  res.status(201).json(exercise);
});

router.get("/exercises/:id", async (req, res): Promise<void> => {
  const params = GetExerciseParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [exercise] = await db
    .select()
    .from(exercisesTable)
    .where(eq(exercisesTable.id, params.data.id));
  if (!exercise) {
    res.status(404).json({ error: "Exercise not found" });
    return;
  }
  res.json(exercise);
});

router.patch("/exercises/:id", async (req, res): Promise<void> => {
  const params = UpdateExerciseParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = UpdateExerciseBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [exercise] = await db
    .update(exercisesTable)
    .set(parsed.data)
    .where(eq(exercisesTable.id, params.data.id))
    .returning();
  if (!exercise) {
    res.status(404).json({ error: "Exercise not found" });
    return;
  }
  res.json(exercise);
});

router.delete("/exercises/:id", async (req, res): Promise<void> => {
  const params = DeleteExerciseParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(exercisesTable).where(eq(exercisesTable.id, params.data.id));
  res.status(204).send();
});

export default router;
