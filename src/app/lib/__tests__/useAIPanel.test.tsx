import { renderHook, act } from "@testing-library/react";
import { useAIPanel } from "lib/hooks/useAIPanel";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

const MOCK_TEXT = "Mock AI text";

describe("useAIPanel", () => {
  it("should start closed with no streaming text", () => {
    const { result } = renderHook(() =>
      useAIPanel({ onAccept: jest.fn() })
    );
    expect(result.current.aiPanelOpen).toBe(false);
    expect(result.current.streamingText).toBe("");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.aiTargetIdx).toBeNull();
  });

  it("should open panel and start loading", () => {
    const { result } = renderHook(() =>
      useAIPanel({ onAccept: jest.fn(), generateMock: () => MOCK_TEXT })
    );
    act(() => {
      result.current.openPanel("prompt");
    });
    expect(result.current.aiPanelOpen).toBe(true);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.streamingText).toBe("");
  });

  it("should finish loading after timeout and set text", async () => {
    const { result } = renderHook(() =>
      useAIPanel({ onAccept: jest.fn(), generateMock: () => MOCK_TEXT })
    );
    act(() => {
      result.current.openPanel("prompt");
    });
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.streamingText).toBe(MOCK_TEXT);
  });

  it("should call onAccept and close on accept", () => {
    const onAccept = jest.fn();
    const { result } = renderHook(() =>
      useAIPanel({ onAccept, generateMock: () => MOCK_TEXT })
    );
    act(() => {
      result.current.openPanel("prompt");
    });
    act(() => {
      result.current.handleAccept("Accepted text");
    });
    expect(onAccept).toHaveBeenCalledWith("Accepted text");
    expect(result.current.aiPanelOpen).toBe(false);
    expect(result.current.streamingText).toBe("");
  });

  it("should close panel and reset state", () => {
    const { result } = renderHook(() =>
      useAIPanel({ onAccept: jest.fn(), generateMock: () => MOCK_TEXT })
    );
    act(() => {
      result.current.openPanel("prompt", 2);
    });
    expect(result.current.aiTargetIdx).toBe(2);
    act(() => {
      result.current.closePanel();
    });
    expect(result.current.aiPanelOpen).toBe(false);
    expect(result.current.streamingText).toBe("");
    expect(result.current.aiTargetIdx).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("should regenerate and reload", async () => {
    const generateMock = jest
      .fn()
      .mockReturnValueOnce("First text")
      .mockReturnValueOnce("Regenerated text");
    const { result } = renderHook(() =>
      useAIPanel({ onAccept: jest.fn(), generateMock })
    );
    act(() => {
      result.current.openPanel("prompt");
    });
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });
    expect(result.current.streamingText).toBe("First text");

    act(() => {
      result.current.handleRegenerate();
    });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.streamingText).toBe("");

    await act(async () => {
      jest.advanceTimersByTime(1500);
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.streamingText).toBe("Regenerated text");
  });

  it("should set aiTargetIdx via openPanel", () => {
    const { result } = renderHook(() =>
      useAIPanel({ onAccept: jest.fn() })
    );
    act(() => {
      result.current.openPanel("prompt", 3);
    });
    expect(result.current.aiTargetIdx).toBe(3);
  });

  it("should not set aiTargetIdx when opening without index", () => {
    const { result } = renderHook(() =>
      useAIPanel({ onAccept: jest.fn() })
    );
    act(() => {
      result.current.openPanel("prompt");
    });
    expect(result.current.aiTargetIdx).toBeNull();
  });

  it("should use default mock text when generateMock is not provided", async () => {
    const { result } = renderHook(() =>
      useAIPanel({ onAccept: jest.fn() })
    );
    act(() => {
      result.current.openPanel("prompt");
    });
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });
    expect(result.current.streamingText).toBeTruthy();
  });
});
