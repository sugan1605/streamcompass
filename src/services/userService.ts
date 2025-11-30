import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

// Minimal shape vi trenger fra Firebase-brukeren
type BasicUser = {
  uid: string;
  email: string | null;
};

/**
 * Oppretter / oppdaterer en enkel user-profil i Firestore.
 * Kalles etter signup.
 */
export async function createUserProfile(user: BasicUser) {
  const ref = doc(db, "users", user.uid);

  await setDoc(
    ref,
    {
      uid: user.uid,
      email: user.email,
      createdAt: new Date().toISOString(),
    },
    { merge: true }
  );
}
