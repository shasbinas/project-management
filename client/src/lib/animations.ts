import { Variants } from "framer-motion";

// ANIMATION TOKENS
export const DURATIONS = {
  veryFast: 0.1,
  fast: 0.2,
  base: 0.3,
  slow: 0.5,
};

export const EASING = [0.25, 0.1, 0.25, 1.0] as const;

// PAGE TRANSITIONS
export const pageVariants: Variants = {
  initial: { opacity: 0, scale: 0.99 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: EASING } 
  },
  exit: { 
    opacity: 0, 
    scale: 1.01,
    transition: { duration: 0.2, ease: EASING } 
  }
};

// STAGGERED LIST ENTRY
export const fadeInVariants: Variants = {
  initial: { opacity: 0, y: 15 },
  animate: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.04,
      duration: DURATIONS.base,
      ease: EASING
    }
  })
};

// PREMIUM HOVER & TAP
export const hoverScaleVariants: Variants = {
  hover: { 
    scale: 1.01,
    y: -4,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  tap: { scale: 0.98 }
};

// MODAL SYSTEM
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: { duration: 0.2 }
  }
};

// DROPDOWN / COLLAPSIBLE
export const accordionVariants: Variants = {
  open: { 
    height: "auto", 
    opacity: 1,
    transition: { duration: 0.3, ease: EASING }
  },
  closed: { 
    height: 0, 
    opacity: 0,
    transition: { duration: 0.2, ease: EASING }
  }
};
