import { cn } from "@/lib/utils";

interface ClinicLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ClinicLogo({ className, size = "md" }: ClinicLogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(sizeClasses[size], className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Three interlocking circles - Yellow, White, Light Blue */}
      {/* Yellow circle (left) */}
      <circle
        cx="35"
        cy="45"
        r="25"
        fill="none"
        stroke="hsl(45, 93%, 58%)"
        strokeWidth="4"
        className="drop-shadow-sm"
      />
      
      {/* White/cream circle (center-top) */}
      <circle
        cx="50"
        cy="35"
        r="25"
        fill="none"
        stroke="hsl(40, 30%, 96%)"
        strokeWidth="4"
        className="drop-shadow-sm"
      />
      
      {/* Light blue circle (right) */}
      <circle
        cx="65"
        cy="45"
        r="25"
        fill="none"
        stroke="hsl(199, 89%, 60%)"
        strokeWidth="4"
        className="drop-shadow-sm"
      />
      
      {/* Overlay to create interlocking effect */}
      <defs>
        <clipPath id="yellowClip">
          <circle cx="35" cy="45" r="23" />
        </clipPath>
        <clipPath id="whiteClip">
          <circle cx="50" cy="35" r="23" />
        </clipPath>
        <clipPath id="blueClip">
          <circle cx="65" cy="45" r="23" />
        </clipPath>
      </defs>
      
      {/* Intersection areas with subtle gradient fills */}
      <circle
        cx="35"
        cy="45"
        r="12"
        fill="hsl(45, 93%, 58%)"
        opacity="0.15"
      />
      <circle
        cx="50"
        cy="35"
        r="12"
        fill="hsl(40, 30%, 96%)"
        opacity="0.15"
      />
      <circle
        cx="65"
        cy="45"
        r="12"
        fill="hsl(199, 89%, 60%)"
        opacity="0.15"
      />
    </svg>
  );
}
