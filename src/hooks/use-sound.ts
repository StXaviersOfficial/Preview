'use client';

import { useCallback, useEffect, useState } from "react";
import { play, setSoundEnabled, isSoundEnabled } from "@/lib/site/sounds";

export function useSound() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(isSoundEnabled());
  }, []);

  const toggle = useCallback(() => {
    const newState = !enabled;
    setEnabled(newState);
    setSoundEnabled(newState);
    if (newState) play("toggle");
  }, [enabled]);

  const playSound = useCallback((name: Parameters<typeof play>[0]) => {
    play(name);
  }, []);

  return { enabled, toggle, playSound };
}
