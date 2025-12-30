import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

// роуты
import signupRouter from "./routes/signup.js";
app.use("/api", signupRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = Number(process.env.PORT);
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server started on port", PORT);
});
