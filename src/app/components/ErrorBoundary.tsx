"use client";
import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: unknown[];
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: Readonly<ErrorBoundaryProps>) {
    if (
      this.state.hasError &&
      this.props.resetKeys &&
      prevProps.resetKeys &&
      this.props.resetKeys.length === prevProps.resetKeys.length
    ) {
      const changed = this.props.resetKeys.some(
        (key, i) => key !== prevProps.resetKeys![i]
      );
      if (changed) this.reset();
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === "function") {
        return this.props.fallback(this.state.error, this.reset);
      }
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <DefaultFallback error={this.state.error} reset={this.reset} />;
    }
    return this.props.children;
  }
}

function DefaultFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div
      className="rounded-lg border p-4 text-center"
      style={{
        backgroundColor: "var(--canvas)",
        borderColor: "var(--border)",
      }}
    >
      <p className="text-sm font-medium" style={{ color: "var(--fg)" }}>
        Something went wrong
      </p>
      <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
        {error.message || "An unexpected error occurred"}
      </p>
      <button
        onClick={reset}
        className="mt-3 rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors"
        style={{ backgroundColor: "var(--accent)" }}
      >
        Try Again
      </button>
    </div>
  );
}
