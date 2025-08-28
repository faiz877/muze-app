'use client';

import React from 'react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'error' | 'empty' | 'offline';
  className?: string;
}

const getErrorIcon = (variant: string) => {
  switch (variant) {
    case 'error':
      return (
        <svg className="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      );
    case 'empty':
      return (
        <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      );
    case 'offline':
      return (
        <svg className="h-12 w-12 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
        </svg>
      );
    default:
      return null;
  }
};

const getDefaultContent = (variant: string) => {
  switch (variant) {
    case 'error':
      return {
        title: 'Something went wrong',
        message: 'We encountered an error while loading your content. Please try again.'
      };
    case 'empty':
      return {
        title: 'No posts yet',
        message: 'Be the first to share something interesting!'
      };
    case 'offline':
      return {
        title: 'You\'re offline',
        message: 'Check your internet connection and try again.'
      };
    default:
      return {
        title: 'Error',
        message: 'Something unexpected happened.'
      };
  }
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  action,
  variant = 'error',
  className = ''
}) => {
  const defaultContent = getDefaultContent(variant);
  const icon = getErrorIcon(variant);
  
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="mb-4">
        {icon}
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title || defaultContent.title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message || defaultContent.message}
      </p>
      
      {action && (
        <Button 
          onClick={action.onClick}
          variant="primary"
          className="min-w-[120px]"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

// Empty feed state
export const EmptyFeed: React.FC<{ onNewPost?: () => void }> = ({ onNewPost }) => (
  <ErrorState
    variant="empty"
    title="Your feed is empty"
    message="Follow some people or create your first post to get started!"
    action={onNewPost ? {
      label: 'Create Post',
      onClick: onNewPost
    } : undefined}
  />
);

// Network error state  
export const NetworkError: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <ErrorState
    variant="offline"
    action={{
      label: 'Try Again',
      onClick: onRetry
    }}
  />
);

// Generic API error state
export const APIError: React.FC<{ onRetry: () => void; message?: string }> = ({ onRetry, message }) => (
  <ErrorState
    variant="error"
    message={message}
    action={{
      label: 'Retry',
      onClick: onRetry
    }}
  />
);

// React Error Boundary component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallback?: React.ComponentType<{ error: Error | null; reset: () => void }> }>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{ fallback?: React.ComponentType<{ error: Error | null; reset: () => void }> }>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;
      
      if (Fallback) {
        return (
          <Fallback 
            error={this.state.error} 
            reset={() => this.setState({ hasError: false, error: null })} 
          />
        );
      }
      
      return (
        <ErrorState
          variant="error"
          title="Application Error"
          message="Something went wrong in the application. Please refresh the page."
          action={{
            label: 'Refresh Page',
            onClick: () => window.location.reload()
          }}
        />
      );
    }

    return this.props.children;
  }
}
