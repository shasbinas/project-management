import { Router } from "express";

import { getUser, getUsers, postUser, updateUser } from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.post("/", postUser);
router.patch("/:userId", updateUser);
router.get("/:userId", getUser);

export default router;
