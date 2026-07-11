"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { RootState } from "lib/redux/store";
import { rootReducer, type Action } from "lib/redux/store";
import { loadStateFromLocalStorage, saveStateToLocalStorage } from "lib/redux/local-storage";
import { initialResumeState, setResume } from "lib/redux/resumeSlice";
import { initialSettings, setSettings } from "lib/redux/settingsSlice";
import { initialUserState, setPremium } from "lib/redux/userSlice";
import { deepMerge } from "lib/deep-merge";
import type { Resume } from "lib/redux/types";
import type { Settings } from "lib/redux/settingsSlice";
import type { UserState } from "lib/redux/userSlice";

const initialState: RootState = {
  resume: initialResumeState,
  settings: initialSettings,
  user: initialUserState,
};

const StateContext = createContext<{
  state: RootState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function StateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  const loaded = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    const saved = loadStateFromLocalStorage();
    if (!saved) return;

    if (saved.resume) {
      const merged = deepMerge(initialResumeState, saved.resume) as Resume;
      dispatch(setResume(merged));
    }
    if (saved.settings) {
      const merged = deepMerge(initialSettings, saved.settings) as Settings;
      dispatch(setSettings(merged));
    }
    if (saved.user?.isPremium) {
      dispatch(setPremium(true));
    }
  }, []);

  // Save to localStorage on every change
  useEffect(() => {
    if (!loaded.current) return;
    saveStateToLocalStorage(state);
  }, [state]);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
}

export function useAppDispatch() {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error("useAppDispatch must be used within StateProvider");
  return ctx.dispatch;
}

export function useAppSelector<T>(selector: (state: RootState) => T): T {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error("useAppSelector must be used within StateProvider");
  return selector(ctx.state);
}
