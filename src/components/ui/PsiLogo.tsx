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
 * Animated .PSI. wordmark — dorado clásico con barrido de luz.
 * Tipografía Playfair Display (serif) sobre color dorado institucional,
 * con animación de "sweep" / brillo continuo que recorre las letras.
 */
export function PsiLogo({
  className,
  size = "lg",
  color = "#A07C2E",
  subtitle,
  noShimmer,
}: PsiLogoProps) {
  return (
    <div className={cn("inline-flex flex-col items-center select-none", className)}>
      <span
        className={cn(
          "psi-gold-sweep relative font-bold leading-none tracking-tight",
          SIZE[size],
          noShimmer && "psi-gold-sweep--off"
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