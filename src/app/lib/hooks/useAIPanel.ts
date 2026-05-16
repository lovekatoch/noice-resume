"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import {
  captureAiEnhanceRequested,
  captureAiEnhanceSuccess,
  captureAiEnhanceError,
  captureAiEnhanceAccepted,
  captureAiEnhancementUsed,
  captureAiTokenUsage,
} from "lib/analytics";

const COOLDOWN_STORAGE_KEY = "noiceresume_ai_cooldown";
const COUNT_STORAGE_KEY = "noiceresume_ai_count";
const COOLDOWN_SECONDS = 60;
const REGENERATE_LIMIT = 3;

const API_URL = "/api/enhance";

export type AIErrorType = "network" | "rate_limit" | "server" | "content" | "unknown";

export interface AIError {
  message: string;
  type: AIErrorType;
  retryable: boolean;
}

function classifyError(err: unknown): AIError {
  const message = err instanceof Error ? err.message : "Failed to fetch AI suggestion";

  if (
    message.toLowerCase().includes("network") ||
    message.toLowerCase().includes("failed to fetch") ||
    message.toLowerCase().includes("fetch")
  ) {
    return { message, type: "network", retryable: true };
  }
  if (
    message.toLowerCase().includes("limit") ||
    message.toLowerCase().includes("rate") ||
    message.toLowerCase().includes("429")
  ) {
    return { message, type: "rate_limit", retryable: true };
  }
  if (
    message.toLowerCase().includes("500") ||
    message.toLowerCase().includes("502") ||
    message.toLowerCase().includes("503") ||
    message.toLowerCase().includes("worker error")
  ) {
    return { message, type: "server", retryable: true };
  }
  return { message, type: "unknown", retryable: false };
}

interface UseAIPanelOptions {
  onAccept: (text: string) => void;
}

interface UseAIPanelReturn {
  aiPanelOpen: boolean;
  streamingText: string;
  isLoading: boolean;
  aiTargetIdx: number | null;
  regenerateCount: number;
  openPanel: (prompt: string, idx?: number, context?: string, sectionType?: string, fieldCount?: number) => void;
  closePanel: () => void;
  handleAccept: (text: string) => void;
  handleRegenerate: () => void;
  handleRetry: () => void;
  setStreamingText: (text: string) => void;
  setAiTargetIdx: (idx: number | null) => void;
  error: string | undefined;
  aiError: AIError | undefined;
  retryCount: number;
  isCooldown: boolean;
  cooldownRemaining: number;
}

export const useAIPanel = ({
  onAccept,
}: UseAIPanelOptions): UseAIPanelReturn => {
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiTargetIdx, setAiTargetIdx] = useState<number | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [aiError, setAiError] = useState<AIError | undefined>(undefined);
  const [regenerateCount, setRegenerateCount] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [cooldownUntil, setCooldownUntil] = useState(() => {
    if (typeof window === "undefined") return 0;
    try {
      return parseInt(sessionStorage.getItem(COOLDOWN_STORAGE_KEY) || "0", 10);
    } catch {
      return 0;
    }
  });
  const cooldownUntilRef = useRef(cooldownUntil);
  cooldownUntilRef.current = cooldownUntil;
  const globalEnhanceCountRef = useRef(0);

  useEffect(() => {
    try {
      globalEnhanceCountRef.current = parseInt(sessionStorage.getItem(COUNT_STORAGE_KEY) || "0", 10);
    } catch {
      globalEnhanceCountRef.current = 0;
    }
  }, []);

  const abortControllerRef = useRef<AbortController | null>(null);
  const contextRef = useRef<string>("");
  const promptRef = useRef<string>("");
  const sectionTypeRef = useRef<string>("unknown");
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const cooldownRemaining = Math.max(0, Math.ceil((cooldownUntil - now) / 1000));
  const isCooldown = cooldownRemaining > 0;

  const incrementGlobalCount = useCallback(() => {
    globalEnhanceCountRef.current += 1;
    try {
      sessionStorage.setItem(COUNT_STORAGE_KEY, String(globalEnhanceCountRef.current));
    } catch {
      // ignore
    }
  }, []);

  const setCooldown = useCallback(() => {
    const until = Date.now() + COOLDOWN_SECONDS * 1000;
    setCooldownUntil(until);
    try {
      sessionStorage.setItem(COOLDOWN_STORAGE_KEY, String(until));
    } catch {
      // ignore
    }
  }, []);

  const triggerAPI = useCallback(
    async (_isRegenerate: boolean) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      startTimeRef.current = Date.now();
      setIsLoading(true);
      setStreamingText("");
      setError(undefined);
      setAiError(undefined);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: promptRef.current,
            context: contextRef.current || "Resume enhancement request",
            stream: true,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const contentType = response.headers.get("Content-Type") || "";

        if (contentType.includes("text/event-stream")) {
          const reader = response.body!.getReader();
          const decoder = new TextDecoder();
          let accumulatedText = "";
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const payload = line.slice(6).trim();
                if (!payload || payload === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(payload);
                  if (parsed.type === "done") {
                    accumulatedText = parsed.content || accumulatedText;
                    setStreamingText(accumulatedText);
                  } else if (parsed.choices?.[0]?.delta?.content) {
                    accumulatedText += parsed.choices[0].delta.content;
                    setStreamingText(accumulatedText);
                  }
                } catch { /* skip malformed SSE payloads */ }
              }
            }
          }

          if (buffer.startsWith("data: ")) {
            const payload = buffer.slice(6).trim();
            if (payload && payload !== "[DONE]") {
              try {
                const parsed = JSON.parse(payload);
                if (parsed.type === "done") {
                  accumulatedText = parsed.content || accumulatedText;
                  setStreamingText(accumulatedText);
                }
              } catch { /* skip */ }
            }
          }

          captureAiEnhanceSuccess({
            sectionType: sectionTypeRef.current,
            isRegenerate: _isRegenerate,
            responseTimeMs: Date.now() - startTimeRef.current,
            globalEnhanceCount: globalEnhanceCountRef.current,
          });
        } else {
          const result = await response.json();
          if (result.error) {
            throw new Error(result.error);
          }
          setStreamingText(result.content || "");

          captureAiEnhanceSuccess({
            sectionType: sectionTypeRef.current,
            isRegenerate: _isRegenerate,
            responseTimeMs: Date.now() - startTimeRef.current,
            globalEnhanceCount: globalEnhanceCountRef.current,
          });

          if (result.usage) {
            captureAiTokenUsage({
              sectionType: result.section_type || sectionTypeRef.current,
              promptTokens: result.usage.prompt_tokens,
              completionTokens: result.usage.completion_tokens,
              totalTokens: result.usage.total_tokens,
              model: "deepseek-chat",
            });
          }
        }

        setRetryCount(0);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        const classified = classifyError(err);
        setAiError(classified);
        const errorMessage = classified.message;
        setError(errorMessage);
        captureAiEnhanceError({
          sectionType: sectionTypeRef.current,
          isRegenerate: _isRegenerate,
          errorMessage,
          globalEnhanceCount: globalEnhanceCountRef.current,
        });
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const openPanel = useCallback(
    (prompt: string, idx?: number, context?: string, sectionType?: string, fieldCount?: number) => {
      const remaining = Math.max(0, Math.ceil((cooldownUntilRef.current - Date.now()) / 1000));
      if (remaining > 0) {
        setError(`Please wait ${remaining}s before your next enhancement.`);
        return;
      }

      if (idx !== undefined) setAiTargetIdx(idx);
      promptRef.current = prompt;
      contextRef.current = context ?? prompt;
      sectionTypeRef.current = sectionType ?? "unknown";

      incrementGlobalCount();
      setCooldown();
      setRegenerateCount(0);
      setRetryCount(0);
      setAiPanelOpen(true);
      setIsLoading(true);
      captureAiEnhanceRequested({
        sectionType: sectionTypeRef.current,
        isRegenerate: false,
        globalEnhanceCount: globalEnhanceCountRef.current,
      });
      captureAiEnhancementUsed({
        sectionType: sectionTypeRef.current,
        fieldCount: fieldCount ?? 0,
      });
      triggerAPI(false);
    },
    [setCooldown, incrementGlobalCount, triggerAPI]
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
    setAiError(undefined);
    setRegenerateCount(0);
    setRetryCount(0);
    contextRef.current = "";
    promptRef.current = "";
    sectionTypeRef.current = "unknown";
  }, []);

  const handleAccept = useCallback(
    (text: string) => {
      captureAiEnhanceAccepted({
        sectionType: sectionTypeRef.current,
        globalEnhanceCount: globalEnhanceCountRef.current,
      });
      onAccept(text);
      closePanel();
    },
    [onAccept, closePanel]
  );

  const handleRegenerate = useCallback(() => {
    if (regenerateCount >= REGENERATE_LIMIT) {
      const classified = classifyError(new Error(`Regeneration limit reached (${REGENERATE_LIMIT} max).`));
      setAiError(classified);
      setError(classified.message);
      return;
    }
    incrementGlobalCount();
    const newRegenCount = regenerateCount + 1;
    setRegenerateCount(newRegenCount);
    captureAiEnhanceRequested({
      sectionType: sectionTypeRef.current,
      isRegenerate: true,
      globalEnhanceCount: globalEnhanceCountRef.current,
    });
    setRetryCount(0);
    triggerAPI(true);
  }, [regenerateCount, triggerAPI, incrementGlobalCount]);

  const handleRetry = useCallback(() => {
    if (retryCount >= 2) {
      setError("Max retries reached. Please try again later.");
      return;
    }
    setRetryCount((c) => c + 1);
    triggerAPI(false);
  }, [retryCount, triggerAPI]);

  return {
    aiPanelOpen,
    streamingText,
    isLoading,
    aiTargetIdx,
    regenerateCount,
    openPanel,
    closePanel,
    handleAccept,
    handleRegenerate,
    handleRetry,
    setStreamingText,
    setAiTargetIdx,
    error,
    aiError,
    retryCount,
    isCooldown,
    cooldownRemaining,
  };
};
