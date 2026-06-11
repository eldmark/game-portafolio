import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isWebGL = this.state.error?.message.includes('WebGL') || 
                     this.state.error?.message.includes('context');

      return (
        <div className="loading-screen" style={{ textAlign: 'center', padding: '40px' }}>
          <div className="entry-copy" style={{ margin: '0 auto' }}>
            <h1>Oops! Something went wrong</h1>
            {isWebGL ? (
              <>
                <p>
                  It looks like your browser or device is having trouble with WebGL (3D graphics).
                  This can happen if you have too many tabs open or if your GPU is busy.
                </p>
                <div className="entry-actions" style={{ justifyContent: 'center', marginTop: '20px' }}>
                  <button 
                    className="primary-button" 
                    onClick={() => window.location.reload()}
                    type="button"
                  >
                    Try Refreshing
                  </button>
                  <a href="/#/recruiter" className="secondary-button">
                    Use 2D Recruiter Mode
                  </a>
                </div>
              </>
            ) : (
              <>
                <p>An unexpected error occurred while loading the experience.</p>
                <button 
                  className="primary-button" 
                  onClick={() => window.location.reload()}
                  style={{ marginTop: '20px' }}
                  type="button"
                >
                  Reload Page
                </button>
              </>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
