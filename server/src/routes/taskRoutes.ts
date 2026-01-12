import { Router } from "express";
import {
  createComment,
  createTask,
  deleteTask,
  getTasks,
  getUserTasks,
  updateTask,
  updateTaskStatus,
} from "../controllers/taskController";

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);
router.post("/comments", createComment);
router.patch("/:taskId/status", updateTaskStatus);
router.patch("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);
router.get("/user/:userId", getUserTasks);

export default router;
