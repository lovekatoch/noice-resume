"use client";

import { useEffect } from "react";

interface StructuredDataProps {
  schemas: Record<string, unknown>[];
}

export default function StructuredData({ schemas }: StructuredDataProps) {
  useEffect(() => {
    const scripts = schemas.map((schema) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
      return script;
    });
    return () => {
      scripts.forEach((script) => script.remove());
    };
  }, [schemas]);

  return null;
}
