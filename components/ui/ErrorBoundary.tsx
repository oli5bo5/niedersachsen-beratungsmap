'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex items-center justify-center h-full p-4">
          <div className="bg-red-50 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
            <h2 className="font-bold text-lg mb-2">⚠️ Etwas ist schiefgelaufen</h2>
            <p className="text-sm mb-3">
              {this.state.error?.message || 'Ein unerwarteter Fehler ist aufgetreten.'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}



