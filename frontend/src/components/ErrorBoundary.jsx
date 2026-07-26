import React, { Component } from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-card">
            <div className="error-icon">⚠️</div>
            <h2>Oops! Something went wrong</h2>
            <p>We encountered a temporary technical glitch. Please refresh the page or try going back to safety.</p>
            <div className="actions">
              <button className="btn-primary" onClick={() => window.location.reload()}>Refresh Page</button>
              <button className="btn-secondary" onClick={this.handleReset}>Go Home</button>
            </div>
            {this.state.error && (
              <details className="error-details">
                <summary>Technical Details</summary>
                <pre>{this.state.error.toString()}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
