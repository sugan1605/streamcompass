import express from "express";
import cors from "cors";
import aiRouter from "./routes/ai";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/ai", aiRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`StreamCompass backend running on http://localhost:${PORT}`);
});
