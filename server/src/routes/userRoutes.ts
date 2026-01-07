import { Router } from "express";

import { getUser, getUsers, postUser } from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.post("/", postUser);
router.get("/:userId", getUser);

export default router;
