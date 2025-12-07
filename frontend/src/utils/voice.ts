// Voice search disabled for now — Expo Go does not support native modules.
// Re-enable once we build a custom dev client.


// Cleans TMDB search results from speech-to-text input,
export function sanitizeSpeech(text: string): string {
  return text.trim().toLowerCase();
}
