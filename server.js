import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import signupRouter from "./routes/signup.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// статика
app.use(express.static(path.join(__dirname, "public")));

// API
app.use("/api", signupRouter);

// главная
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server started on port", PORT);
});
