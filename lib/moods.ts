export const MOODS = [
  { value: "happy", label: "Happy", emoji: "😊" },
  { value: "neutral", label: "Neutral", emoji: "😐" },
  { value: "sad", label: "Sad", emoji: "😢" },
  { value: "anxious", label: "Anxious", emoji: "😰" },
  { value: "productive", label: "Productive", emoji: "🎯" },
] as const;

export type MoodValue = (typeof MOODS)[number]["value"];

export function isMoodValue(s: string): s is MoodValue {
  return (MOODS as readonly { value: string }[]).some((m) => m.value === s);
}
