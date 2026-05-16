import { renderHook, act } from "@testing-library/react";
import { useAIPanel } from "lib/hooks/useAIPanel";

const MOCK_RESPONSE = { content: "Mock AI text" };

const mockFetch = (response: { content: string }, ok = true) =>
  jest.fn().mockResolvedValue({
    ok,
    json: jest.fn().mockResolvedValue(response),
  });

beforeEach(() => {
  jest.restoreAllMocks();
});

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
    global.fetch = mockFetch(MOCK_RESPONSE);
    const { result } = renderHook(() =>
      useAIPanel({ onAccept: jest.fn() })
    );
    act(() => {
      result.current.openPanel("prompt");
    });
    expect(result.current.aiPanelOpen).toBe(true);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.streamingText).toBe("");
  });

  it("should finish loading after API response and set text", async () => {
    global.fetch = mockFetch(MOCK_RESPONSE);
    const { result } = renderHook(() =>
      useAIPanel({ onAccept: jest.fn() })
    );
    act(() => {
      result.current.openPanel("prompt");
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.streamingText).toBe(MOCK_RESPONSE.content);
  });

  it("should call onAccept and close on accept", async () => {
    global.fetch = mockFetch(MOCK_RESPONSE);
    const onAccept = jest.fn();
    const { result } = renderHook(() =>
      useAIPanel({ onAccept })
    );
    act(() => {
      result.current.openPanel("prompt");
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    act(() => {
      result.current.handleAccept("Accepted text");
    });
    expect(onAccept).toHaveBeenCalledWith("Accepted text");
    expect(result.current.aiPanelOpen).toBe(false);
    expect(result.current.streamingText).toBe("");
  });

  it("should close panel and reset state", async () => {
    global.fetch = mockFetch(MOCK_RESPONSE);
    const { result } = renderHook(() =>
      useAIPanel({ onAccept: jest.fn() })
    );
    act(() => {
      result.current.openPanel("prompt", 2);
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
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
    const firstFetch = mockFetch({ content: "First text" });
    const secondFetch = mockFetch({ content: "Regenerated text" });
    global.fetch = jest
      .fn()
      .mockImplementationOnce(firstFetch)
      .mockImplementationOnce(secondFetch);
    const { result } = renderHook(() =>
      useAIPanel({ onAccept: jest.fn() })
    );
    act(() => {
      result.current.openPanel("prompt");
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(result.current.streamingText).toBe("First text");

    act(() => {
      result.current.handleRegenerate();
    });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.streamingText).toBe("");

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.streamingText).toBe("Regenerated text");
  });

  it("should set aiTargetIdx via openPanel", () => {
    global.fetch = mockFetch(MOCK_RESPONSE);
    const { result } = renderHook(() =>
      useAIPanel({ onAccept: jest.fn() })
    );
    act(() => {
      result.current.openPanel("prompt", 3);
    });
    expect(result.current.aiTargetIdx).toBe(3);
  });

  it("should not set aiTargetIdx when opening without index", () => {
    global.fetch = mockFetch(MOCK_RESPONSE);
    const { result } = renderHook(() =>
      useAIPanel({ onAccept: jest.fn() })
    );
    act(() => {
      result.current.openPanel("prompt");
    });
    expect(result.current.aiTargetIdx).toBeNull();
  });

  it("should handle API error", async () => {
    global.fetch = mockFetch({ error: "Bad request" }, false);
    const { result } = renderHook(() =>
      useAIPanel({ onAccept: jest.fn() })
    );
    act(() => {
      result.current.openPanel("prompt");
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeTruthy();
  });

  it("should call /api/enhance with correct payload", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ content: "result" }),
    });
    global.fetch = fetchMock;
    const { result } = renderHook(() =>
      useAIPanel({ onAccept: jest.fn() })
    );
    act(() => {
      result.current.openPanel("My prompt", 0, "skills context");
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(fetchMock).toHaveBeenCalledWith("/api/enhance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "My prompt",
        context: "skills context",
      }),
      signal: expect.any(AbortSignal),
    });
  });
});
