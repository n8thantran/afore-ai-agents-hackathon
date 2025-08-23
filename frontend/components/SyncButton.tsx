import React, { useState } from 'react';

interface SyncButtonProps {
  onSyncComplete?: () => void;
}

export default function SyncButton({ onSyncComplete }: SyncButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/sync-repos', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync repositories');
      }

      setLastSync(new Date().toLocaleString());
      
      if (onSyncComplete) {
        onSyncComplete();
      }

      console.log('Sync successful:', data);
    } catch (error) {
      console.error('Sync failed:', error);
      setError(error instanceof Error ? error.message : 'Sync failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start space-y-2 w-full">
      <button
        onClick={handleSync}
        disabled={isLoading}
        className={`
          w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm
          ${isLoading 
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
            : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 hover:shadow-md hover:scale-105'
          }
        `}
      >
        <svg 
          className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
          />
        </svg>
        <span className="text-sm">{isLoading ? 'Syncing...' : 'Sync Repositories'}</span>
      </button>

      {lastSync && (
        <p className="text-xs text-gray-500 dark:text-gray-400 w-full text-center">
          Last synced: {lastSync}
        </p>
      )}

      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 w-full text-center">
          Error: {error}
        </p>
      )}
    </div>
  );
}
