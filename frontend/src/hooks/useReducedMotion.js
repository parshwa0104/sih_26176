import { useMediaQuery } from './useMediaQuery'

/** True when the OS requests reduced motion. */
export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
