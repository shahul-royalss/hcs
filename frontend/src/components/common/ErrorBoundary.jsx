import { Component } from 'react'

/** Catches render errors and shows a friendly fallback with recovery. */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Unhandled UI error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 text-center">
          <h1 className="font-heading text-2xl font-bold text-primary">Something went wrong</h1>
          <p className="mt-2 max-w-md text-ink-light">
            We hit an unexpected error. Please reload the page — or call us at{' '}
            <a href="tel:+919959388374" className="font-semibold text-secondary">
              +91 9959388374
            </a>{' '}
            if you need immediate assistance.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-primary px-6 py-2.5 font-semibold text-white hover:bg-primary-700"
          >
            Reload Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
