"use client";
import { useState, useEffect, useRef } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";

export const AutoSaveIndicator = () => {
  const [show, setShow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const resume = useAppSelector(selectResume);
  const prevResumeRef = useRef(JSON.stringify(resume));

  useEffect(() => {
    const serialized = JSON.stringify(resume);
    if (serialized !== prevResumeRef.current) {
      prevResumeRef.current = serialized;
      setShow(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setShow(false), 1500);
    }
  }, [resume]);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div
      className="fixed bottom-6 right-6 z-40 rounded-lg px-3 py-1.5 text-sm font-medium shadow-lg"
      style={{
        backgroundColor: "#1A1A26",
        color: "#22c55e",
        border: "1px solid rgba(255,255,255,0.1)",
        opacity: show ? 1 : 0,
        transition: "opacity 200ms ease",
        pointerEvents: "none",
      }}
    >
      Saved ✓
    </div>
  );
};
