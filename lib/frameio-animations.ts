import { Variants } from 'framer-motion'

// Page Transition
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] // Frame.io easing
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3 }
  }
}

// Card Hover
export const cardHover: Variants = {
  rest: { 
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  hover: { 
    y: -8,
    scale: 1.02,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
}

// Stagger Children
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
}

// Fade In Scale
export const fadeInScale: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: 0.3 }
  }
}

// Slide In
export const slideIn = (direction: 'left' | 'right' | 'up' | 'down'): Variants => {
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y'
  const value = direction === 'left' || direction === 'up' ? -100 : 100
  
  return {
    initial: { [axis]: value, opacity: 0 },
    animate: { 
      [axis]: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
    },
    exit: { 
      [axis]: -value, 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  }
}

// Glow Effect
export const glowEffect: Variants = {
  initial: { boxShadow: '0 0 0 rgba(99, 102, 241, 0)' },
  animate: { 
    boxShadow: [
      '0 0 20px rgba(99, 102, 241, 0.2)',
      '0 0 40px rgba(99, 102, 241, 0.4)',
      '0 0 20px rgba(99, 102, 241, 0.2)'
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}



