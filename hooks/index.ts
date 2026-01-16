// Hooks barrel export
export * from './useSmartMoney';
export * from './useLocalStorage';
export * from './useDebounce';
export * from './useMediaQuery';
export * from './useClipboard';
export * from './useInterval';
export * from './useOnClickOutside';
export * from './usePrevious';
export * from './useKeyboardShortcuts';
export * from './useIntersectionObserver';
export * from './useUtilities';
// Note: useBrowser.ts contains duplicates of other hooks, so we export only unique ones
export { useWindowSize, useBreakpoints, useScrollPosition, useLockBodyScroll, useEscapeKey } from './useBrowser';
