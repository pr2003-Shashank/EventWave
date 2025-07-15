import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center
          bg-gradient-to-br from-[#f3d1ff] via-[#e9cbf0] to-[#ffffff] p-6
          font-RobotoSlab"
        >
          {/* Animated Error Icon */}
          <h1 className="text-[8rem] font-extrabold text-[#712681] mb-4 animate-bounce drop-shadow-lg">
            ⚠️
          </h1>

          {/* Subheading with pulse animation */}
          <h2 className="text-3xl font-bold text-gray-800 mb-4 animate-pulse">
            Something Went Wrong
          </h2>

          <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
            {this.state.error?.toString()}
          </p>

          <button
            onClick={this.handleReload}
            className="bg-[#712681] text-white px-6 py-3 rounded-lg shadow-md 
            hover:bg-[#5e1c6a] transition transform hover:scale-110 hover:animate-pulse"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
