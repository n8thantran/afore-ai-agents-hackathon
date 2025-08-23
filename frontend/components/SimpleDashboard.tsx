'use client';

import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { LoginScreen } from './LoginScreen'
import { Activity, CheckCircle2, Timer, FolderGit2, Clock } from 'lucide-react'
import SyncButton from './SyncButton'

interface AnalyticsData {
  deployments: {
    total: number
    successful: number
    failed: number
    pending: number
    successRate: number
  }
  performance: {
    avgDeployTime: number
  }
  recentDeployments: Array<{ id: string; project: string; status: string; duration: string; timestamp: string }>
}

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  updated_at: string
  stargazers_count: number
  forks_count: number
  private: boolean
  archived: boolean
  language: string | null
}

export function SimpleDashboard() {
  const { data: session, status } = useSession()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [a, r] = await Promise.all([
          fetch('/api/analytics').then((res) => res.json()).catch(() => null),
          fetch('/api/repos').then(async (res) => (res.ok ? res.json() : [])),
        ])
        setAnalytics(a)
        setRepos(r || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const topRepos = useMemo(() => repos.slice(0, 6), [repos])

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return <LoginScreen />

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Overview</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">CI/CD and repositories at a glance</p>
        </div>
        <SyncButton />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-gray-950">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Deployments</span>
            <Activity className="w-4 h-4 text-gray-400" />
          </div>
          <div className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">{analytics?.deployments.total ?? '—'}</div>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-gray-950">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Success rate</span>
            <CheckCircle2 className="w-4 h-4 text-gray-400" />
          </div>
          <div className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">{analytics?.deployments.successRate ? `${analytics.deployments.successRate}%` : '—'}</div>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-gray-950">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Avg deploy time</span>
            <Timer className="w-4 h-4 text-gray-400" />
          </div>
          <div className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">{analytics?.performance.avgDeployTime ? `${analytics.performance.avgDeployTime}m` : '—'}</div>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-gray-950">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Repositories</span>
            <FolderGit2 className="w-4 h-4 text-gray-400" />
          </div>
          <div className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">{repos.length}</div>
        </div>
      </div>

      {/* Two-column content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent deployments */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent deployments</h2>
          </div>
          <div className="p-5">
            {loading ? (
              <div className="h-32 flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
              </div>
            ) : analytics?.recentDeployments?.length ? (
              <ul className="space-y-4">
                {analytics.recentDeployments.slice(0, 5).map((d) => (
                  <li key={d.id} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{d.project}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(d.timestamp).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        d.status === 'success'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                          : d.status === 'failed'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}>{d.status}</span>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{d.duration}</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-600 dark:text-gray-400">No recent deployments</div>
            )}
          </div>
        </div>

        {/* Repositories */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Repositories</h2>
          </div>
          <div className="p-5">
            {loading ? (
              <div className="h-32 flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
              </div>
            ) : topRepos.length ? (
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {topRepos.map((r) => (
                  <li key={r.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{r.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>Updated {getTimeAgo(r.updated_at)}</span>
                      </div>
                    </div>
                    <a href={r.html_url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      View
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-600 dark:text-gray-400">No repositories</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


