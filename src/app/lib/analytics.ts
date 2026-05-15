"use client";

import posthog from "posthog-js";

export function captureDownload(opts: {
  template: string;
  fileName: string;
  fileType: string;
}) {
  posthog.capture("resume_downloaded", {
    template: opts.template,
    fileName: opts.fileName,
    fileType: opts.fileType,
    $current_url: window.location.href,
  });
}
