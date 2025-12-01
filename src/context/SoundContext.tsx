import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Audio, AVPlaybackSource } from "expo-av";

type SoundContextValue = {
  soundEnabled: boolean;
  toggleSound: () => void;
  playClick: () => Promise<void>;
};

const SoundContext = createContext<SoundContextValue | undefined>(undefined);


const CLICK_SOUND: AVPlaybackSource = require("../../assets/sounds/mouse-click-117076.mp3");

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [clickSound, setClickSound] = useState<Audio.Sound | null>(null);

  // last inn lyden én gang
  useEffect(() => {
    let sound: Audio.Sound | null = null;

    (async () => {
      try {
        const { sound: loadedSound } = await Audio.Sound.createAsync(
          CLICK_SOUND
        );
        sound = loadedSound;
        setClickSound(loadedSound);
      } catch (e) {
        console.warn("Failed to load click sound", e);
      }
    })();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const playClick = async () => {
    try {
      if (!soundEnabled || !clickSound) return;
      await clickSound.replayAsync();
    } catch (e) {
      console.log("Error playing click sound", e);
    }
  };

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, playClick }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundSettings() {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    throw new Error("useSoundSettings must be used inside SoundProvider");
  }
  return ctx;
}
