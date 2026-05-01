import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">😵</p>
          <p className="text-gray-600 mb-4">页面出了点问题</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary-600 font-medium"
          >
            刷新页面
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
