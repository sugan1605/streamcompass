const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;

if (!TMDB_API_KEY) {
    console.warn("[TMDB] Missing EXPO_PUBLIC_TMDB_API_KEY in .env. Add it to frontend/ .env");
}


export const TMDB_CONFIG = {
    apiKey: TMDB_API_KEY as string,
    baseUrl: "https://api.themoviedb.org/3",
    imageBaseUrl: "https://image.tmdb.org/t/p/w500",
};

