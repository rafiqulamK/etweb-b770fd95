import { useEffect, useState, useCallback } from "react";
import { ConsultationPopup } from "./ConsultationPopup";

const STORAGE_KEY = "consultation_popup_dismissed";
const DISMISS_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface ConsultationTriggerProps {
  timeOnPageThreshold?: number; // seconds
  scrollDepthThreshold?: number; // percentage (0-100)
  enableExitIntent?: boolean;
}

export function ConsultationTrigger({
  timeOnPageThreshold = 45,
  scrollDepthThreshold = 60,
  enableExitIntent = true,
}: ConsultationTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  const shouldShowPopup = useCallback(() => {
    if (hasTriggered) return false;
    
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      if (Date.now() - dismissedTime < DISMISS_DURATION) {
        return false;
      }
    }
    return true;
  }, [hasTriggered]);

  const triggerPopup = useCallback(() => {
    if (shouldShowPopup()) {
      setIsOpen(true);
      setHasTriggered(true);
    }
  }, [shouldShowPopup]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  // Time on page trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerPopup();
    }, timeOnPageThreshold * 1000);

    return () => clearTimeout(timer);
  }, [timeOnPageThreshold, triggerPopup]);

  // Scroll depth trigger
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      if (scrollPercent >= scrollDepthThreshold) {
        triggerPopup();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollDepthThreshold, triggerPopup]);

  // Exit intent trigger (desktop only)
  useEffect(() => {
    if (!enableExitIntent) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        triggerPopup();
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [enableExitIntent, triggerPopup]);

  return (
    <ConsultationPopup
      isOpen={isOpen}
      onClose={handleClose}
      source="auto_trigger"
    />
  );
}
