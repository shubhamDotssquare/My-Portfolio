"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface Props {
  appName: string;
  /** Changing this key clears the error (e.g. navigating to another route). */
  resetKey: string;
  children: ReactNode;
}

interface State {
  error: Error | null;
  keyAtError: string | null;
}

/**
 * Keeps the OS alive when an app's content throws: the window stays, the
 * crash is contained to the content area, and the visitor can retry or go
 * back. (React still needs a class for componentDidCatch.)
 */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null, keyAtError: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ keyAtError: this.props.resetKey });
    if (process.env.NODE_ENV !== "production") console.error(`[${this.props.appName}]`, error, info.componentStack);
  }

  componentDidUpdate(prev: Props) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.reset();
  }

  reset = () => this.setState({ error: null, keyAtError: null });

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" className="flex flex-col items-center gap-4 pt-16 text-center">
        <AlertTriangle className="h-8 w-8 text-os-warning" aria-hidden />
        <div>
          <h1 className="os-heading text-[1.4rem] text-os-text-primary">{this.props.appName} hit a snag</h1>
          <p className="mt-1 text-[14px] text-os-text-secondary">
            Something went wrong rendering this screen. The rest of the OS is fine.
          </p>
        </div>
        <Button variant="secondary" icon={RotateCcw} onClick={this.reset}>
          Try again
        </Button>
        {process.env.NODE_ENV !== "production" && (
          <pre className="mt-4 max-w-full overflow-x-auto rounded-2xl os-glass px-4 py-3 text-left font-mono text-[11px] text-os-text-tertiary">
            {this.state.error.message}
          </pre>
        )}
      </div>
    );
  }
}
