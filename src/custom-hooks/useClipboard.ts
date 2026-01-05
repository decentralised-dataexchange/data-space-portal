"use client";

import { useState, useCallback } from "react";

interface UseClipboardOptions {
  timeout?: number;
}

interface UseClipboardReturn {
  copied: boolean;
  copiedKey: string | null;
  copy: (text: string, key?: string) => Promise<void>;
  reset: () => void;
}

export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const { timeout = 1200 } = options;
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = useCallback(async (text: string, key?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key ?? "default");
      window.setTimeout(() => setCopiedKey(null), timeout);
    } catch {
      // Clipboard API not available or permission denied
    }
  }, [timeout]);

  const reset = useCallback(() => {
    setCopiedKey(null);
  }, []);

  return {
    copied: copiedKey !== null,
    copiedKey,
    copy,
    reset,
  };
}

export default useClipboard;
