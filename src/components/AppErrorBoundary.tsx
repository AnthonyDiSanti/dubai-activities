import { Component, type ErrorInfo, type ReactNode } from 'react';

type AppErrorBoundaryProps = {
  readonly children: ReactNode;
};

type AppErrorBoundaryState = {
  readonly failed: boolean;
};

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // A static site cannot report remotely, but a useful local trace still aids diagnosis.
    console.error('Dubai guide failed to render', error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <main className="fatal-error">
        <p className="fatal-error__eyebrow">The guide hit a snag</p>
        <h1 className="fatal-error__title">This page could not finish loading.</h1>
        <p className="fatal-error__copy">Reload it once; all saved favorites stay on this device.</p>
        <button
          className="pill-button pill-button--primary fatal-error__reload"
          onClick={() => window.location.reload()}
          type="button"
        >
          Reload the guide
        </button>
      </main>
    );
  }
}

