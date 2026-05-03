import { BaseForm } from "components/ResumeForm/Form";
import { InputGroupWrapper } from "components/ResumeForm/Form/InputGroup";
import { THEME_COLORS } from "components/ResumeForm/ThemeForm/constants";
import {
  DocumentSizeSelections,
  FontFamilySelectionsCSR,
  FontSizeSelections,
} from "components/ResumeForm/ThemeForm/Selection";
import {
  changeSettings,
  DEFAULT_THEME_COLOR,
  selectSettings,
  type GeneralSetting,
} from "lib/redux/settingsSlice";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import type { FontFamily } from "components/fonts/constants";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

export const ThemeForm = () => {
  const settings = useAppSelector(selectSettings);
  const { fontSize, fontFamily, documentSize } = settings;
  const themeColor = settings.themeColor || DEFAULT_THEME_COLOR;
  const dispatch = useAppDispatch();

  const handleSettingsChange = (field: GeneralSetting, value: string) => {
    dispatch(changeSettings({ field, value }));
  };

  return (
    <BaseForm>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <Cog6ToothIcon className="h-5 w-5" style={{ color: "var(--muted)" }} aria-hidden="true" />
          <h1 className="text-base font-semibold" style={{ color: "var(--fg)" }}>
            Resume Settings
          </h1>
        </div>
        <div>
          <p className="text-sm font-medium mb-2" style={{ color: "var(--muted)" }}>
            Theme Color
          </p>
          <div className="flex items-center gap-3">
            {THEME_COLORS.map((color, idx) => (
              <div
                key={idx}
                className="cursor-pointer rounded-full"
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: color,
                  outline: settings.themeColor === color ? `2px solid ${color}` : "none",
                  outlineOffset: 2,
                  boxShadow:
                    settings.themeColor === color
                      ? `0 0 0 2px var(--surface), 0 0 0 4px ${color}`
                      : "none",
                }}
                onClick={() => handleSettingsChange("themeColor", color)}
                onKeyDown={(e) => {
                  if (["Enter", " "].includes(e.key))
                    handleSettingsChange("themeColor", color);
                }}
                tabIndex={0}
                role="button"
                aria-label={`Theme color ${color}`}
              />
            ))}
            <input
              type="text"
              name="themeColor"
              value={settings.themeColor || ""}
              placeholder={DEFAULT_THEME_COLOR}
              onChange={(e) => handleSettingsChange("themeColor", e.target.value)}
              className="ml-1 w-20 border-b text-sm font-medium outline-none"
              style={{
                borderColor: "var(--border)",
                color: themeColor,
              }}
            />
          </div>
        </div>
        <div>
          <InputGroupWrapper label="Font Family" />
          <FontFamilySelectionsCSR
            selectedFontFamily={fontFamily}
            themeColor={themeColor}
            handleSettingsChange={handleSettingsChange}
          />
        </div>
        <div>
          <p className="text-sm font-medium mb-2" style={{ color: "var(--muted)" }}>
            Font Size
          </p>
          <FontSizeSelections
            fontFamily={fontFamily as FontFamily}
            themeColor={themeColor}
            selectedFontSize={fontSize}
            handleSettingsChange={handleSettingsChange}
          />
        </div>
        <div>
          <InputGroupWrapper label="Document Size" />
          <DocumentSizeSelections
            themeColor={themeColor}
            selectedDocumentSize={documentSize}
            handleSettingsChange={handleSettingsChange}
          />
        </div>
      </div>
    </BaseForm>
  );
};
