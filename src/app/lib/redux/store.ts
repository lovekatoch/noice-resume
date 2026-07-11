import type { Resume } from "lib/redux/types";
import type { Settings } from "lib/redux/settingsSlice";
import type { UserState } from "lib/redux/userSlice";
import {
  initialResumeState,
  resumeReducer,
  type ResumeAction,
} from "lib/redux/resumeSlice";
import {
  initialSettings,
  settingsReducer,
  type SettingsAction,
} from "lib/redux/settingsSlice";
import {
  initialUserState,
  userReducer,
  type UserAction,
} from "lib/redux/userSlice";

export interface RootState {
  resume: Resume;
  settings: Settings;
  user: UserState;
}

export type Action = ResumeAction | SettingsAction | UserAction;

export function rootReducer(state: RootState, action: Action): RootState {
  return {
    resume: resumeReducer(state.resume, action as ResumeAction),
    settings: settingsReducer(state.settings, action as SettingsAction),
    user: userReducer(state.user, action as UserAction),
  };
}
