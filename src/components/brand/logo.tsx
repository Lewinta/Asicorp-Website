import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  showText = true,
  compact = false,
}: {
  className?: string;
  showText?: boolean;
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 transition-all duration-300",
        compact ? "lg:gap-2.5" : "lg:gap-3",
        className,
      )}
    >
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300",
          compact ? "p-1.5 lg:p-1.5" : "p-1.5 lg:p-2",
        )}
      >
        <Image
          src="/brand/logo-nobg.png"
          alt="Logo ASICORP"
          width={221}
          height={214}
          className={cn(
            "h-9 w-auto object-contain transition-all duration-300",
            compact ? "lg:h-10" : "lg:h-12",
          )}
          priority
        />
      </span>
      {showText && (
        <span
          className={cn(
            "font-display font-extrabold tracking-tight text-primary transition-all duration-300",
            compact ? "text-xl lg:text-xl" : "text-xl lg:text-3xl",
          )}
        >
          ASICORP
        </span>
      )}
    </span>
  );
}
