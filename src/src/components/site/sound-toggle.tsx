'use client';

import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/hooks/use-sound";
import { cn } from "@/lib/utils";

export function SoundToggle({ className }: { className?: string }) {
  const { enabled, toggle } = useSound();
  
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={enabled ? "Mute sounds" : "Enable sounds"}
      title={enabled ? "Mute sounds" : "Enable sounds"}
      className={cn(
        "relative inline-flex size-10 items-center justify-center rounded-full bg-xavier/10 text-xavier-dark transition-colors hover:bg-xavier/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-xavier/40",
        className
      )}
    >
      {enabled ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
    </button>
  );
}
