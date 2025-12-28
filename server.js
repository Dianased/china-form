import express from "express";
import leadsRouter from "./routes/leads.js";

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use("/api", leadsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server started on port", PORT);
});
