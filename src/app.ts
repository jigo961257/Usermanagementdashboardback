import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth"
import dashboardRoutes from "./routes/dashboard"
import userRoutes from "./routes/user"

// dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/user", userRoutes);


app.get("/", (_req: Request, res: Response) => {
  res.send("API is working");
});

// app.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}`);
// });
export default app;
