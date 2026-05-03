"use client";
import { useState, useCallback } from "react";

interface UseAIPanelOptions {
  onAccept: (text: string) => void;
  generateMock?: (isRegenerate: boolean) => string;
}

interface UseAIPanelReturn {
  aiPanelOpen: boolean;
  streamingText: string;
  isLoading: boolean;
  aiTargetIdx: number | null;
  openPanel: (idx?: number) => void;
  closePanel: () => void;
  handleAccept: (text: string) => void;
  handleRegenerate: () => void;
  setStreamingText: (text: string) => void;
  setAiTargetIdx: (idx: number | null) => void;
}

const DEFAULT_MOCK_TEXT =
  "Generated text will appear here. Connect a real AI backend in Phase 2.";

export const useAIPanel = ({
  onAccept,
  generateMock,
}: UseAIPanelOptions): UseAIPanelReturn => {
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiTargetIdx, setAiTargetIdx] = useState<number | null>(null);

  const triggerMock = useCallback(
    (isRegenerate: boolean) => {
      setIsLoading(true);
      setStreamingText("");
      setTimeout(() => {
        setStreamingText(generateMock?.(isRegenerate) ?? DEFAULT_MOCK_TEXT);
        setIsLoading(false);
      }, 1500);
    },
    [generateMock]
  );

  const openPanel = useCallback(
    (idx?: number) => {
      if (idx !== undefined) setAiTargetIdx(idx);
      setAiPanelOpen(true);
      triggerMock(false);
    },
    [triggerMock]
  );

  const closePanel = useCallback(() => {
    setAiPanelOpen(false);
    setStreamingText("");
    setAiTargetIdx(null);
    setIsLoading(false);
  }, []);

  const handleAccept = useCallback(
    (text: string) => {
      onAccept(text);
      closePanel();
    },
    [onAccept, closePanel]
  );

  const handleRegenerate = useCallback(() => {
    triggerMock(true);
  }, [triggerMock]);

  return {
    aiPanelOpen,
    streamingText,
    isLoading,
    aiTargetIdx,
    openPanel,
    closePanel,
    handleAccept,
    handleRegenerate,
    setStreamingText,
    setAiTargetIdx,
  };
};
