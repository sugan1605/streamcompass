import { View, Pressable, Text } from "react-native";
import { Mood } from "@/src/types/movies";

const ACCENT = "#f97316";

/**
 * Liste med alle moods brukeren kan velge mellom.
 * Vises som "piller" i Home → Who & Mood card.
 */
const MOODS: { value: Mood; label: string }[] = [
  { value: "chill", label: "Chill" },
  { value: "funny", label: "Funny" },
  { value: "intense", label: "Intense" },
  { value: "romantic", label: "Romantic" },
  { value: "scary", label: "Scary" },
  { value: "random", label: "Surprise me" },
];

type Props = {
  value: Mood;
  onChange: (value: Mood) => void;
};

/**
 * MoodSelector:
 * Viser små knapper for moods og markerer valgt mood.
 * Oppdaterer parent-state via onChange.
 */
export function MoodSelector({ value, onChange }: Props) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {MOODS.map((item) => {
        const active = item.value === value;

        return (
          <Pressable
            key={item.value}
            onPress={() => onChange(item.value)}
            className={`rounded-full px-4 py-2 ${
              active ? "bg-orange-500" : "bg-slate-100"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                active ? "text-slate-950" : "text-slate-900"
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
