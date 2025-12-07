import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { auth } from "../firebaseConfig";

// @ts-ignore – runtime-funksjonene finnes, typene i RN-pakken er bare kranglete
import { onAuthStateChanged, signOut } from "firebase/auth";

// Vi bruker en veldig enkel type her i stedet for å importere User fra firebase/auth
type AuthUser = {
  uid: string;
  email: string | null;
  // legg til mer hvis du trenger (displayName, photoURL, etc.)
} | null;

interface AuthContextValue {
  user: AuthUser;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: any) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email ?? null,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
