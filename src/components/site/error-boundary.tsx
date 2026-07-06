'use client';

import { Component, type ReactNode, type ErrorInfo } from "react";

/**
 * ErrorBoundary — catches errors from child components and renders a fallback.
 *
 * Used to wrap each section so that a failure in one section (e.g., 3D
 * rendering, API error) doesn't crash the entire page.
 */

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
  /** Called when an error is caught — useful for logging. */
  onError?: (error: Error, info: ErrorInfo) => void;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(_error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, info);
    this.props.onError?.(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
            <p className="text-sm text-destructive mb-2">
              This section could not be loaded.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="text-xs font-semibold text-xavier-dark hover:underline"
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
