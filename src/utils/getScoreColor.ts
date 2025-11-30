export function getScoreColor(rating: number | null | undefined): string {
  if (!rating || rating <= 0) {
    return "#6b7280"; // grå – ingen score
  }

  if (rating >= 7.5) {
    return "#22c55e"; // grønn (bra)
  }

  if (rating >= 5) {
    return "#eab308"; // gul (midt på treet)
  }

  return "#ef4444";   // rød (lav)
}
