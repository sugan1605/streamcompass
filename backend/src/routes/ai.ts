import { Router } from "express";
import { openai } from "../openaiClient";

const router = Router();

// Enkel Movie-type for request bodies
interface Movie {
  id: number;
  title: string;
  overview?: string;
  genres?: { id: number; name: string }[];
  vote_average?: number;
  maturityRating?: string;
}

// Payload til /recommendations
interface RecommendationsBody {
  history?: Movie[];
  favorites?: Movie[];
  candidates?: Movie[];
  maturityFilter?: string | null;
  genreFilter?: string | null;
}

// Payload til /summary
interface SummaryBody {
  title: string;
  overview?: string;
  genres?: { id: number; name: string }[];
  runtime?: number;
  maturityRating?: string;
}

// ========== AI RECOMMENDATIONS ==========
router.post("/recommendations", async (req, res) => {
  try {
    const {
      history = [],
      favorites = [],
      candidates = [],
      maturityFilter = null,
      genreFilter = null,
    } = req.body as RecommendationsBody;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: `
Return only a JSON array of recommendations.
Each recommendation MUST be an object with:
{ "id": <candidateId>, "reason": "<short explanation>" }

Choose IDs only from the candidates list.
If maturityFilter or genreFilter is provided, prioritize accordingly.
No additional text outside the JSON array.
        `.trim(),
        },
        {
          role: "user",
          content: JSON.stringify({
            history,
            favorites,
            candidates,
            maturityFilter,
            genreFilter,
          }),
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "[]";

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error("Failed to parse AI recommendations:", e, raw);
      parsed = [];
    }

    res.json({ recommendations: parsed });
  } catch (err) {
    console.error("AI /recommendations error:", err);
    res.status(500).json({ error: "Failed to get AI recommendations" });
  }
});

// ========== AI SUMMARY ==========
router.post("/summary", async (req, res) => {
  try {
    const { title, overview, genres = [], runtime, maturityRating } =
      req.body as SummaryBody;

    if (!title) {
      return res.status(400).json({ error: "Missing 'title' in request body" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `
Write a brief, spoiler-safe movie summary (max 3 sentences).
Keep it simple, natural, and clean.
Avoid explicit content details.
        `.trim(),
        },
        {
          role: "user",
          content: JSON.stringify({
            title,
            overview,
            genres,
            runtime,
            maturityRating,
          }),
        },
      ],
    });

    const summary = completion.choices[0]?.message?.content?.trim() ?? "";

    res.json({ summary });
  } catch (err) {
    console.error("AI /summary error:", err);
    res.status(500).json({ error: "Failed to get AI summary" });
  }
});

export default router;
