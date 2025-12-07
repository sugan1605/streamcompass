import { MotiView } from "moti";

export function BounceScale({ children }: { children: React.ReactNode }) {
  return (
    <MotiView
      from={{ scale: 0.85 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        damping: 12,
        stiffness: 180,
      }}
    >
      {children}
    </MotiView>
  );
}
