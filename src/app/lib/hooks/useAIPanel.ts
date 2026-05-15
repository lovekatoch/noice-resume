"use client";
import { useState, useCallback, useRef } from "react";

const STORAGE_KEY = "noiceresume_ai_count";
const GLOBAL_LIMIT = 10;
const REGENERATE_LIMIT = 3;

const API_URL = "/api/enhance";

interface UseAIPanelOptions {
  onAccept: (text: string) => void;
  generateMock?: () => string;
}

interface UseAIPanelReturn {
  aiPanelOpen: boolean;
  streamingText: string;
  isLoading: boolean;
  aiTargetIdx: number | null;
  regenerateCount: number;
  globalEnhanceCount: number;
  openPanel: (prompt: string, idx?: number, context?: string) => void;
  closePanel: () => void;
  handleAccept: (text: string) => void;
  handleRegenerate: () => void;
  setStreamingText: (text: string) => void;
  setAiTargetIdx: (idx: number | null) => void;
  error: string | undefined;
  globalLimitReached: boolean;
}

export const useAIPanel = ({
  onAccept,
  generateMock,
}: UseAIPanelOptions): UseAIPanelReturn => {
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiTargetIdx, setAiTargetIdx] = useState<number | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [regenerateCount, setRegenerateCount] = useState(0);
  const [globalEnhanceCount, setGlobalEnhanceCount] = useState(() => {
    if (typeof window === "undefined") return 0;
    try {
      return parseInt(sessionStorage.getItem(STORAGE_KEY) || "0", 10);
    } catch {
      return 0;
    }
  });
  const abortControllerRef = useRef<AbortController | null>(null);
  const contextRef = useRef<string>("");
  const promptRef = useRef<string>("");

  const globalLimitReached = globalEnhanceCount >= GLOBAL_LIMIT;

  const triggerAPI = useCallback(
    async (_isRegenerate: boolean) => {
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      setIsLoading(true);
      setStreamingText("");
      setError(undefined);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const isTestEnvironment = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
        
        if (isTestEnvironment) {
          await new Promise(resolve => setTimeout(resolve, 1500));
          setStreamingText(generateMock ? generateMock() : "Default AI text for testing");
        } else {
          const response = await fetch(API_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                prompt: promptRef.current,
                context: contextRef.current || "Resume enhancement request",
              }),
              signal: controller.signal,
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
              throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            const result = await response.json();
            if (result.error) {
              throw new Error(result.error);
            }
            setStreamingText(result.content || "");
          }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to fetch AI suggestion");
      } finally {
        setIsLoading(false);
      }
    },
    [generateMock] // deps — uses refs
  );

  const openPanel = useCallback(
    (prompt: string, idx?: number, context?: string) => {
      if (globalLimitReached) {
        setError(`AI enhancement limit reached for this session (${GLOBAL_LIMIT} max).`);
        return;
      }

      if (idx !== undefined) setAiTargetIdx(idx);
      promptRef.current = prompt;
      contextRef.current = context ?? prompt;

      // Increment global count
      const newCount = globalEnhanceCount + 1;
      setGlobalEnhanceCount(newCount);
      try {
        sessionStorage.setItem(STORAGE_KEY, String(newCount));
      } catch {
        // ignore
      }

      // Reset regenerate count for new session
      setRegenerateCount(0);
      setAiPanelOpen(true);
      setIsLoading(true);
      triggerAPI(false);
    },
    [globalLimitReached, globalEnhanceCount, triggerAPI]
  );

  const closePanel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setAiPanelOpen(false);
    setStreamingText("");
    setAiTargetIdx(null);
    setIsLoading(false);
    setError(undefined);
    setRegenerateCount(0);
    contextRef.current = "";
    promptRef.current = "";
  }, []);

  const handleAccept = useCallback(
    (text: string) => {
      onAccept(text);
      closePanel();
    },
    [onAccept, closePanel]
  );

  const handleRegenerate = useCallback(() => {
    if (regenerateCount >= REGENERATE_LIMIT) {
      setError(`Regeneration limit reached (${REGENERATE_LIMIT} max).`);
      return;
    }
    const newRegenCount = regenerateCount + 1;
    setRegenerateCount(newRegenCount);
    // Count regenerate toward global 10-limit
    const newGlobalCount = globalEnhanceCount + 1;
    setGlobalEnhanceCount(newGlobalCount);
    try {
      sessionStorage.setItem(STORAGE_KEY, String(newGlobalCount));
    } catch {
      // ignore
    }
    triggerAPI(true);
  }, [regenerateCount, globalEnhanceCount, triggerAPI]);

  return {
    aiPanelOpen,
    streamingText,
    isLoading,
    aiTargetIdx,
    regenerateCount,
    globalEnhanceCount,
    openPanel,
    closePanel,
    handleAccept,
    handleRegenerate,
    setStreamingText,
    setAiTargetIdx,
    error,
    globalLimitReached,
  };
};
