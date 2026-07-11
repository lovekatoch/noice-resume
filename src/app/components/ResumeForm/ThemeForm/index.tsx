"use client";
import { useState } from "react";
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
import { Cog6ToothIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

export const ThemeForm = () => {
  const settings = useAppSelector(selectSettings);
  const { fontSize, fontFamily, documentSize } = settings;
  const themeColor = settings.themeColor || DEFAULT_THEME_COLOR;
  const dispatch = useAppDispatch();
  const [collapsed, setCollapsed] = useState(true);

  const handleSettingsChange = (field: GeneralSetting, value: string) => {
    dispatch(changeSettings({ field, value }));
  };

  return (
    <BaseForm>
      <div className="flex flex-col gap-0">
        {/* Collapsible Header */}
        <button
          type="button"
          onClick={() => {
            setCollapsed(!collapsed);
          }}
          className="flex w-full items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-[var(--border)]"
          aria-expanded={!collapsed}
        >
          <div className="flex items-center gap-2">
            <Cog6ToothIcon className="h-5 w-5" style={{ color: "var(--muted)" }} aria-hidden="true" />
            <h1 className="text-base font-semibold" style={{ color: "var(--fg)" }}>
              Resume Settings
            </h1>
          </div>
          {collapsed ? (
            <ChevronDownIcon className="h-4 w-4" style={{ color: "var(--muted)" }} />
          ) : (
            <ChevronUpIcon className="h-4 w-4" style={{ color: "var(--muted)" }} />
          )}
        </button>

        {/* Collapsible Content */}
        {!collapsed && (
          <div className="flex flex-col gap-5 px-3 pb-3">
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
        )}
      </div>
    </BaseForm>
  );
};
