import { Router, type IRouter } from "express";
import healthRouter from "./health";
import exercisesRouter from "./exercises";
import workoutsRouter from "./workouts";
import statsRouter from "./stats";
import bookingRouter from "./booking";
import auditRouter from "./audit";

const router: IRouter = Router();

router.use(healthRouter);
router.use(exercisesRouter);
router.use(workoutsRouter);
router.use(statsRouter);
router.use(bookingRouter);
router.use(auditRouter);

export default router;
