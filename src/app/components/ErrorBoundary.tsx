"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";
import { AIErrorFallback } from "./AIErrorFallback";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  fallbackRender?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
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

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const { fallback, fallbackRender } = this.props;
      if (fallbackRender) {
        return fallbackRender(this.state.error!, this.handleReset);
      }
      if (typeof fallback === "function") {
        return (fallback as (error: Error, reset: () => void) => ReactNode)(this.state.error!, this.handleReset);
      }
      if (fallback) {
        return fallback;
      }
      return (
        <AIErrorFallback
          error={this.state.error!}
          reset={this.handleReset}
        />
      );
    }
    return this.props.children;
  }
}
