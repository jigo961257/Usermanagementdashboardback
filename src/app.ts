import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth"
import dashboardRoutes from "./routes/dashboard"

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8001;

app.use(cors());
app.use(express.json());

// Routes
app.use("/user", authRoutes);
app.use("/dashboard", dashboardRoutes);


app.get("/", (_req: Request, res: Response) => {
  res.send("API is working");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
