'use client';

import { Plus, Github, ExternalLink, GitBranch, Clock, Globe, MoreHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';

// Interface for GitHub repositories
interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  default_branch: string
  private: boolean
  language: string | null
  updated_at: string
  clone_url: string
  created_at: string
  pushed_at: string
  size: number
  stargazers_count: number
  watchers_count: number
  forks_count: number
  open_issues_count: number
  topics: string[]
  archived: boolean
  disabled: boolean
  visibility: string
}

export function ProjectGrid() {
  const [showImportModal, setShowImportModal] = useState(false);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsSync, setNeedsSync] = useState(false);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch('/api/repos');
        if (response.ok) {
          const data = await response.json();
          setRepos(data);
        } else if (response.status === 404) {
          const errorData = await response.json();
          if (errorData.shouldSync) {
            setNeedsSync(true);
          }
        }
      } catch (error) {
        console.error('Error fetching repositories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const getStatusColor = (repo: GitHubRepo) => {
    // Simple status logic based on update time
    const hoursAgo = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60);
    if (hoursAgo < 1) return 'bg-green-100 text-green-800'; // Ready
    if (hoursAgo < 24) return 'bg-yellow-100 text-yellow-800'; // Building
    return 'bg-gray-100 text-gray-800'; // Idle
  };

  const getStatus = (repo: GitHubRepo) => {
    const hoursAgo = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60);
    if (hoursAgo < 1) return 'Ready';
    if (hoursAgo < 24) return 'Building';
    return 'Idle';
  };

  const getFrameworkIcon = (language: string | null) => {
    const iconClass = "w-4 h-4";
    switch (language) {
      case 'TypeScript':
        return <div className={`${iconClass} bg-blue-500 rounded`}></div>;
      case 'JavaScript':
        return <div className={`${iconClass} bg-yellow-500 rounded`}></div>;
      case 'Vue':
        return <div className={`${iconClass} bg-green-500 rounded`}></div>;
      case 'Python':
        return <div className={`${iconClass} bg-green-600 rounded`}></div>;
      default:
        return <div className={`${iconClass} bg-gray-400 rounded`}></div>;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (needsSync) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4H8c-2.21 0-4 1.79-4 4z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6v6H9z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No repositories found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Click the "Sync Repositories" button in the header to fetch your GitHub repositories.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and deploy your GitHub repositories</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Import Project
          </button>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.map((repo) => (
          <div key={repo.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-xl transition-shadow p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{repo.name}</h3>
                  {repo.private && (
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">Private</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">{repo.description || 'No description'}</p>
              </div>
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <MoreHorizontal className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </button>
            </div>

            {/* Status and Framework */}
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(repo)}`}>
                {getStatus(repo)}
              </span>
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                {getFrameworkIcon(repo.language)}
                <span>{repo.language || 'Unknown'}</span>
              </div>
            </div>

            {/* Repository Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Github className="w-4 h-4" />
                <span className="truncate">{repo.full_name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <GitBranch className="w-4 h-4" />
                <span>{repo.default_branch}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Updated {getTimeAgo(repo.updated_at)}</span>
              </div>
            </div>

            {/* Domain */}
            <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white mb-4">
              <Globe className="w-4 h-4" />
              <a href={`https://${repo.name.toLowerCase()}.opspilot.app`} className="truncate hover:underline">
                {repo.name.toLowerCase()}.opspilot.app
              </a>
              <ExternalLink className="w-3 h-3" />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 py-2 px-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors">
                View Details
              </button>
              <button className="py-2 px-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors">
                Visit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Import Git Repository</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Import an existing project from your GitHub repositories to deploy it.
            </p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Repository URL
                </label>
                <input
                  type="text"
                  placeholder="https://github.com/username/repository"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Branch
                </label>
                <input
                  type="text"
                  placeholder="main"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-2 px-4 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
