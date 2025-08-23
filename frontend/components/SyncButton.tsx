import React, { useState } from 'react';

interface SyncButtonProps {
  onSyncComplete?: () => void;
}

export default function SyncButton({ onSyncComplete }: SyncButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    setIsLoading(true);
    

    try {
      const response = await fetch('/api/sync-repos', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync repositories');
      }

      if (onSyncComplete) {
        onSyncComplete();
      }

      console.log('Sync successful:', data);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSync}
      disabled={isLoading}
      title={isLoading ? 'Syncing…' : 'Sync repositories'}
      aria-label={isLoading ? 'Syncing…' : 'Sync repositories'}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border transition-colors
        ${isLoading
          ? 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-800 cursor-not-allowed'
          : 'bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900'}
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
      <span>{isLoading ? 'Syncing' : 'Sync'}</span>
    </button>
  );
}
