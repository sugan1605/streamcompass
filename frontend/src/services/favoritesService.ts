import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { app } from "../firebaseConfig";

/**
 * En favorittfilm slik den lagres i Firestore.
 */
export interface FavoriteMovie {
  movieId: string;          // 🔹 Bruker string siden Firestore doc-id er string
  title: string;
  posterUrl: string | null;
  overview: string;
}

// 🔹 Firestore-instans
const db = getFirestore(app);

/**
 * Returnerer riktig collection-ref for en brukers favoritter.
 */
function favoritesCollection(userId: string) {
  return collection(db, "users", userId, "favorites");
}

/**
 * Henter alle favoritter for en bestemt bruker.
 */
export async function getFavorites(
  userId?: string | null
): Promise<FavoriteMovie[]> {
  if (!userId) return [];

  const snap = await getDocs(favoritesCollection(userId));

return snap.docs.map((docSnap : any) => {
  const data = docSnap.data() as Partial<FavoriteMovie>;
  return {
    movieId: data.movieId ?? docSnap.id,
    title: data.title ?? "Unknown",
    posterUrl: data.posterUrl ?? null,
    overview: data.overview ?? "",
  };
});

}

/**
 * Lagrer en favorittfilm i Firestore.
 */
export async function addFavorite(userId: string, favorite: FavoriteMovie) {
  const ref = doc(favoritesCollection(userId), favorite.movieId);
  await setDoc(ref, favorite, { merge: true });
}

/**
 * Fjerner en favorittfilm fra Firestore.
 */
export async function removeFavorite(userId: string, movieId: string) {
  const ref = doc(favoritesCollection(userId), movieId);
  await deleteDoc(ref);
}
