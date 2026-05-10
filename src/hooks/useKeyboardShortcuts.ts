"use client";

import { useEffect, useCallback } from "react";

type ShortcutKey = "ctrl+k" | "ctrl+enter" | "ctrl+s" | "ctrl+shift+c" | "escape";

interface Shortcuts {
  onCtrlK?: () => void;
  onCtrlEnter?: () => void;
  onCtrlS?: () => void;
  onCtrlShiftC?: () => void;
  onEscape?: () => void;
}

function isMac(): boolean {
  if (typeof window === "undefined") return false;
  return navigator.platform.toLowerCase().includes("mac");
}

export function useKeyboardShortcuts(shortcuts: Shortcuts) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isMacPlatform = isMac();
      const modifier = isMacPlatform ? e.metaKey : e.ctrlKey;

      if (modifier && e.key === "k") {
        e.preventDefault();
        shortcuts.onCtrlK?.();
      } else if (modifier && e.key === "Enter") {
        e.preventDefault();
        shortcuts.onCtrlEnter?.();
      } else if (modifier && e.key === "s") {
        e.preventDefault();
        shortcuts.onCtrlS?.();
      } else if (modifier && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        shortcuts.onCtrlShiftC?.();
      } else if (e.key === "Escape") {
        e.preventDefault();
        shortcuts.onEscape?.();
      }
    },
    [
      shortcuts.onCtrlK,
      shortcuts.onCtrlEnter,
      shortcuts.onCtrlS,
      shortcuts.onCtrlShiftC,
      shortcuts.onEscape,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
}