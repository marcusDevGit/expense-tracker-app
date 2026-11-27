import { useEffect, useRef } from "react";

interface ShortcutHandlers {
  onNewExpense?: () => void;
  onToggleHelp?: () => void;
  onEscape?: () => void;
  onNavigate?: (index: number) => void;
}

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

/**
 * Registers global keyboard shortcuts for quick navigation and expense creation.
 */
export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handlersRef.current.onEscape?.();
        return;
      }

      if (isEditableElement(event.target)) return;

      if (event.key === "?") {
        event.preventDefault();
        handlersRef.current.onToggleHelp?.();
        return;
      }

      if (event.ctrlKey || event.metaKey) return;

      if (event.altKey && /^[1-6]$/.test(event.key)) {
        event.preventDefault();
        handlersRef.current.onNavigate?.(Number(event.key) - 1);
        return;
      }

      if (event.altKey) return;

      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        handlersRef.current.onNewExpense?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
