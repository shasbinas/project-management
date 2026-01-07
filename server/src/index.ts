import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
/* ROUTE IMPORTS */
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import searchRoutes from "./routes/searchRoutes";
import userRoutes from "./routes/userRoutes";
import teamRoutes from "./routes/teamRoutes";
import authRoutes from "./routes/authRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import { verifyToken } from "./middleware/authMiddleware";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"], credentials: true }));

/* ROUTES */
app.get("/", (req, res) => {
  res.send("This is home route");
});

app.use("/auth", authRoutes);

/* PROTECTED ROUTES */
app.use("/projects", verifyToken, projectRoutes);
app.use("/tasks", verifyToken, taskRoutes);
app.use("/search", verifyToken, searchRoutes);
app.use("/users", verifyToken, userRoutes);
app.use("/teams", verifyToken, teamRoutes);
app.use("/upload", uploadRoutes);

/* SERVER */
const port = Number(process.env.PORT) || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
