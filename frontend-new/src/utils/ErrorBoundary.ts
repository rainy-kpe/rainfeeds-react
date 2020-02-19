import React from "react"

interface ErrorBoundaryProps {
  fallback: any
}

interface ErrorBoundaryState {
  hasError: boolean
  error: any
}

// Error boundaries currently have to be classes.
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = { hasError: false, error: null }
  static getDerivedStateFromError(error: any) {
    console.log("getDerivedStateFromError")
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error, errorInfo)
  }

  render() {
    console.log(this.state)
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

export default ErrorBoundary
