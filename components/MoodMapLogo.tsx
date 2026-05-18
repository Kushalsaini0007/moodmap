import Link from "next/link";
import { BrainCircuit } from "lucide-react";

type MoodMapLogoProps = {
  href?: string;
  className?: string;
  size?: "sm" | "md";
};

function LogoBadge({ size }: { size: "sm" | "md" }) {
  const badgeSize = size === "sm" ? "h-9 w-9" : "h-10 w-10";
  const iconClass =
    size === "sm" ? "h-4 w-4 text-white" : "h-5 w-5 text-white";

  return (
    <div
      className={`flex ${badgeSize} items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-amber-400 shadow-md shadow-purple-500/20`}
    >
      <BrainCircuit className={iconClass} strokeWidth={2} aria-hidden />
    </div>
  );
}

export function MoodMapLogo({
  href = "/",
  className = "",
  size = "md",
}: MoodMapLogoProps) {
  const textSize =
    size === "sm" ? "text-base font-semibold" : "text-lg font-bold";

  const content = (
    <>
      <LogoBadge size={size} />
      <span
        className={`bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent ${textSize} tracking-tight`}
      >
        MoodMap AI
      </span>
    </>
  );

  const wrapperClass = `flex items-center gap-2.5 ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        className={`${wrapperClass} transition-opacity hover:opacity-90`}
      >
        {content}
      </Link>
    );
  }

  return <div className={wrapperClass}>{content}</div>;
}
