import {
  loadStateFromLocalStorage,
  saveStateToLocalStorage,
  getHasUsedAppBefore,
} from "lib/redux/local-storage";

const STORAGE_KEY = "open-resume-state";

beforeEach(() => {
  localStorage.clear();
});

describe("saveStateToLocalStorage", () => {
  it("should save state to localStorage", () => {
    const state = {
      resume: { profile: { name: "Test" } },
    } as any;
    saveStateToLocalStorage(state);
    const saved = localStorage.getItem(STORAGE_KEY);
    expect(saved).toBeTruthy();
    expect(JSON.parse(saved!)).toEqual(state);
  });
});

describe("loadStateFromLocalStorage", () => {
  it("should return null when nothing is saved", () => {
    expect(loadStateFromLocalStorage()).toBeUndefined();
  });

  it("should load previously saved state", () => {
    const state = { resume: { profile: { name: "Test" } } };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    expect(loadStateFromLocalStorage()).toEqual(state);
  });

  it("should handle corrupted data gracefully", () => {
    localStorage.setItem(STORAGE_KEY, "invalid json{{{");
    expect(loadStateFromLocalStorage()).toBeUndefined();
  });
});

describe("getHasUsedAppBefore", () => {
  it("should return false if no state saved", () => {
    expect(getHasUsedAppBefore()).toBe(false);
  });

  it("should return true if state was saved before", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ resume: {} }));
    expect(getHasUsedAppBefore()).toBe(true);
  });
});
