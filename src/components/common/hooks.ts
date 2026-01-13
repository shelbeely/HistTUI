/**
 * Custom hooks for HistTUI
 */

import { useInput, useApp as useInkApp } from 'ink';
import { useState, useEffect, useCallback } from 'react';
import { matchesKey } from '../../utils';
import { config } from '../../config';

/**
 * Hook for handling keyboard input with configurable bindings
 */
export function useKeyboard(handlers: {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onPageUp?: () => void;
  onPageDown?: () => void;
  onHome?: () => void;
  onEnd?: () => void;
  onEnter?: () => void;
  onSearch?: () => void;
  onHelp?: () => void;
  onTab?: () => void;
  onShiftTab?: () => void;
  onNumber?: (num: number) => void;
  onChar?: (char: string) => void;
}) {
  const { exit } = useInkApp();
  const keyBindings = config.get().keyBindings;

  useInput((input, key) => {
    // Quit
    if (matchesKey(input, keyBindings.quit) || (key.ctrl && input === 'c')) {
      exit();
      return;
    }

    // Help
    if (matchesKey(input, keyBindings.help) && handlers.onHelp) {
      handlers.onHelp();
      return;
    }

    // Search
    if (matchesKey(input, keyBindings.search) && handlers.onSearch) {
      handlers.onSearch();
      return;
    }

    // Navigation
    if (matchesKey(input, keyBindings.navigate.up) && handlers.onUp) {
      handlers.onUp();
      return;
    }

    if (matchesKey(input, keyBindings.navigate.down) && handlers.onDown) {
      handlers.onDown();
      return;
    }

    if (matchesKey(input, keyBindings.navigate.left) && handlers.onLeft) {
      handlers.onLeft();
      return;
    }

    if (matchesKey(input, keyBindings.navigate.right) && handlers.onRight) {
      handlers.onRight();
      return;
    }

    if (matchesKey(input, keyBindings.navigate.pageUp) && handlers.onPageUp) {
      handlers.onPageUp();
      return;
    }

    if (matchesKey(input, keyBindings.navigate.pageDown) && handlers.onPageDown) {
      handlers.onPageDown();
      return;
    }

    if (matchesKey(input, keyBindings.navigate.home) && handlers.onHome) {
      handlers.onHome();
      return;
    }

    if (matchesKey(input, keyBindings.navigate.end) && handlers.onEnd) {
      handlers.onEnd();
      return;
    }

    // Enter
    if (key.return && handlers.onEnter) {
      handlers.onEnter();
      return;
    }

    // Tab
    if (key.tab && !key.shift && handlers.onTab) {
      handlers.onTab();
      return;
    }

    if (key.tab && key.shift && handlers.onShiftTab) {
      handlers.onShiftTab();
      return;
    }

    // Numbers (for tab shortcuts)
    if (handlers.onNumber && /^[1-9]$/.test(input)) {
      handlers.onNumber(parseInt(input, 10));
      return;
    }

    // Character input
    if (handlers.onChar && input.length === 1 && !key.ctrl && !key.meta) {
      handlers.onChar(input);
      return;
    }
  });
}

/**
 * Hook for list navigation
 */
export function useListNavigation<T>(items: T[], pageSize: number = 20) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);

  // Reset when items change
  useEffect(() => {
    setSelectedIndex(0);
    setScrollOffset(0);
  }, [items.length]);

  const moveUp = useCallback(() => {
    setSelectedIndex(prev => {
      const newIndex = Math.max(0, prev - 1);
      if (newIndex < scrollOffset) {
        setScrollOffset(newIndex);
      }
      return newIndex;
    });
  }, [scrollOffset]);

  const moveDown = useCallback(() => {
    setSelectedIndex(prev => {
      const newIndex = Math.min(items.length - 1, prev + 1);
      if (newIndex >= scrollOffset + pageSize) {
        setScrollOffset(newIndex - pageSize + 1);
      }
      return newIndex;
    });
  }, [items.length, scrollOffset, pageSize]);

  const pageUp = useCallback(() => {
    setSelectedIndex(prev => {
      const newIndex = Math.max(0, prev - pageSize);
      setScrollOffset(Math.max(0, newIndex));
      return newIndex;
    });
  }, [pageSize]);

  const pageDown = useCallback(() => {
    setSelectedIndex(prev => {
      const newIndex = Math.min(items.length - 1, prev + pageSize);
      setScrollOffset(Math.min(items.length - pageSize, newIndex));
      return newIndex;
    });
  }, [items.length, pageSize]);

  const goHome = useCallback(() => {
    setSelectedIndex(0);
    setScrollOffset(0);
  }, []);

  const goEnd = useCallback(() => {
    const lastIndex = items.length - 1;
    setSelectedIndex(lastIndex);
    setScrollOffset(Math.max(0, lastIndex - pageSize + 1));
  }, [items.length, pageSize]);

  const selectedItem = items[selectedIndex];
  const visibleItems = items.slice(scrollOffset, scrollOffset + pageSize);

  return {
    selectedIndex,
    selectedItem,
    visibleItems,
    scrollOffset,
    moveUp,
    moveDown,
    pageUp,
    pageDown,
    goHome,
    goEnd,
    setSelectedIndex,
  };
}

/**
 * Hook for managing search input
 */
export function useSearch(onSearch: (query: string) => void) {
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const startSearch = useCallback(() => {
    setSearchMode(true);
    setSearchQuery('');
  }, []);

  const cancelSearch = useCallback(() => {
    setSearchMode(false);
    setSearchQuery('');
  }, []);

  const handleSearchInput = useCallback((char: string) => {
    if (char === '\r') {
      // Enter - execute search
      onSearch(searchQuery);
      setSearchMode(false);
    } else if (char === '\x1B') {
      // Escape - cancel
      cancelSearch();
    } else if (char === '\x7F' || char === '\x08') {
      // Backspace
      setSearchQuery(prev => prev.slice(0, -1));
    } else if (char.length === 1 && !char.match(/[\x00-\x1F]/)) {
      // Printable character
      setSearchQuery(prev => prev + char);
    }
  }, [searchQuery, onSearch, cancelSearch]);

  return {
    searchMode,
    searchQuery,
    startSearch,
    cancelSearch,
    handleSearchInput,
  };
}

/**
 * Hook for periodic updates
 */
export function useInterval(callback: () => void, delay: number | null) {
  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(callback, delay);
    return () => clearInterval(id);
  }, [callback, delay]);
}
