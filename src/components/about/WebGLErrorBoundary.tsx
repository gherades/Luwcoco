"use client";

import { Component, type ReactNode } from "react";

// Canvas creation (WebGL context, GPU driver quirks) can throw at runtime in a
// way plain try/catch can't reach since it happens inside R3F's render tree.
// Falls back to a flat, static hero rather than taking the page down with it.
export class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
