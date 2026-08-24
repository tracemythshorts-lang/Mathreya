/**
 * @file /src/utils/haptics.ts
 * Haptic Feedback Utility for Mobile & Touch Interactions
 * Provides visual pulses and device vibration patterns for maternal health tracking cards & buttons.
 */

export type HapticPattern = "light" | "medium" | "heavy" | "pulse" | "success" | "warm";

export const triggerHapticFeedback = (
  pattern: HapticPattern = "medium",
  element?: HTMLElement | null
) => {
  if (typeof window !== "undefined" && "navigator" in window && "vibrate" in navigator) {
    try {
      switch (pattern) {
        case "light":
          navigator.vibrate(12);
          break;
        case "medium":
          navigator.vibrate([20, 15, 20]);
          break;
        case "heavy":
          navigator.vibrate([35, 25, 45]);
          break;
        case "pulse":
          navigator.vibrate([30, 40, 30, 40, 60]);
          break;
        case "success":
          navigator.vibrate([15, 30, 40]);
          break;
        case "warm":
          navigator.vibrate([25, 20, 25, 20, 35]);
          break;
      }
    } catch {
      // Gracefully ignore vibration errors
    }
  }

  if (element) {
    element.classList.remove("haptic-active-pulse");
    void element.offsetWidth;
    element.classList.add("haptic-active-pulse");
    setTimeout(() => {
      element.classList.remove("haptic-active-pulse");
    }, 600);
  }
};
