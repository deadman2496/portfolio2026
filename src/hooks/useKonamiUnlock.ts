"use client";

import { clear } from "console";
import { useCallback, useEffect, useRef, useState } from "react";

const KONAMI_WITH_SPACE = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
  "space",
];

const VOLUME_SEQUENCE = [
  "volumeup",
  "volumeup",
  "volumedown",
  "volumedown",
  "volumeup",
];

const DEFAULT_STORAGE_KEY = "portfolio-hidden-tabs-unlocked";

function normalizeKey(event: KeyboardEvent) {
  if (event.code === "Space") {
    return "space";
  }
  if (event.key === "AudioVolumeUp") {
    return "volumeup";
  }

  if (event.key === "AudioVolumeDown") {
    return "volumedown";
  }
  
  return event.key.toLowerCase();
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    target.isContentEditable
  );
}

function getNextProgress(sequence: string[], currentProgress: number, key: string) {
  const expectedKey = sequence[currentProgress];

  if (key === expectedKey) {
    return currentProgress + 1;
  }

  return key === sequence[0] ? 1 : 0;
}

export function useKonamiUnlock(storageKey = DEFAULT_STORAGE_KEY) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockCount, setUnlockCount] = useState(0);

  const konamiProgressRef = useRef(0);
  const volumeProgressRef = useRef(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const unlock = useCallback(() => {
    window.localStorage.setItem(storageKey, "true");
    setIsUnlocked(true);
    setUnlockCount((current) => current + 1);
  }, [storageKey]);

  const resetUnlock = useCallback(() => {
    window.localStorage.removeItem(storageKey);
    setIsUnlocked(false);
    konamiProgressRef.current = 0;
    volumeProgressRef.current = 0;
  }, [storageKey]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedUnlock =
        window.localStorage.getItem(storageKey) === "true";

      setIsUnlocked(savedUnlock);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [storageKey]);

  useEffect(() => {
    function resetProgressTimer() {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }

      resetTimerRef.current = setTimeout(() => {
        konamiProgressRef.current = 0;
        volumeProgressRef.current = 0;
      }, 1800);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      const key = normalizeKey(event);

      const nextKonamiProgress = getNextProgress(
        KONAMI_WITH_SPACE,
        konamiProgressRef.current,
        key,
      );

      const nextVolumeProgress = getNextProgress(
        VOLUME_SEQUENCE,
        volumeProgressRef.current,
        key,
      );

      konamiProgressRef.current = nextKonamiProgress;
      volumeProgressRef.current = nextVolumeProgress;

      if (
        nextKonamiProgress === KONAMI_WITH_SPACE.length ||
        nextVolumeProgress === VOLUME_SEQUENCE.length
      ) {
        event.preventDefault();

        konamiProgressRef.current = 0;
        volumeProgressRef.current = 0;

        unlock();
        return;
      }

      resetProgressTimer();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, [unlock]);

  return {
    isUnlocked,
    unlock,
    unlockCount,
    resetUnlock,
  };
}