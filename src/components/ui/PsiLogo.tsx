import { cn } from "@/lib/utils";

interface PsiLogoProps {
  className?: string;
  /** Visual size scale */
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  /** Override text color (defaults to navy) */
  color?: string;
  /** Subtitle line below the wordmark */
  subtitle?: string;
  /** Disable the shimmer effect */
  noShimmer?: boolean;
}

const SIZE = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl",
  xl: "text-7xl md:text-8xl",
  "2xl": "text-8xl md:text-9xl",
} as const;

/**
 * Animated .PSI. wordmark.
 * Uses Playfair Display (serif) with a shimmer/brillo overlay that travels
 * across the letters on mount and replays slowly on hover.
 */
export function PsiLogo({
  className,
  size = "lg",
  color = "#1C3F6E",
  subtitle,
  noShimmer,
}: PsiLogoProps) {
  return (
    <div className={cn("inline-flex flex-col items-center select-none", className)}>
      <span
        className={cn(
          "psi-logo-shimmer relative font-bold leading-none tracking-tight",
          SIZE[size],
          noShimmer && "psi-logo-shimmer--off"
        )}
        style={{
          fontFamily: "'Playfair Display', serif",
          color,
          letterSpacing: "-2px",
        }}
        aria-label=".PSI."
      >
        .PSI.
      </span>
      {subtitle && (
        <span
          className="mt-1 text-[11px] md:text-xs font-medium tracking-[0.18em] uppercase opacity-70"
          style={{ color, fontFamily: "'DM Sans', sans-serif" }}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
}