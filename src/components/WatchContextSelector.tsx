import { View, Pressable, Text } from "react-native";
import { WatchContext } from "@/src/types/movies";

const ACCENT = "#f97316";

/**
 * Korte labels for hvem du ser filmen med.
 * Brukes på Home → Who & mood card.
 */
const LABELS: { value: WatchContext; label: string }[] = [
  { value: "solo", label: "Just me" },
  { value: "partner", label: "Partner" },
  { value: "friends", label: "Friends" },
  { value: "family", label: "Family" },
  { value: "kids", label: "Kids" },
];

type Props = {
  value: WatchContext;
  onChange: (value: WatchContext) => void;
};

/*
 * WatchContextSelector:
 * Viser valg for hvem du ser film med.
 * Oppdaterer valgt context i Home-screen via onChange.
 */
export function WatchContextSelector({ value, onChange }: Props) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {LABELS.map((item) => {
        const active = item.value === value;

        return (
          <Pressable
            key={item.value}
            onPress={() => onChange(item.value)}
            // Tailwind for base-shape + farge
            className={`rounded-full px-4 py-2 ${
              active ? "bg-slate-900" : "bg-slate-100"
            }`}
            // Accent border på aktiv (må bruke style)
            style={active ? { borderWidth: 1, borderColor: ACCENT } : undefined}
          >
            {/* Teksten – lys/dark avhengig av aktiv */}
            <Text
              className={`text-sm font-semibold ${
                active ? "text-slate-50" : "text-slate-900"
              }`}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
