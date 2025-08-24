import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import BackButton from '@/components/BackButton'

async function getRepo(owner: string, name: string) {
  const hdrs = await headers()
  const host = hdrs.get('x-forwarded-host') || hdrs.get('host') || 'localhost:3000'
  const proto = hdrs.get('x-forwarded-proto') || 'http'
  const baseUrl = `${proto}://${host}`
  const res = await fetch(`${baseUrl}/api/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) return null
  return res.json()
}

export default async function RepoDetailPage({ params }: { params: Promise<{ owner: string; name: string }> }) {
  const { owner, name } = await params
  const repo = await getRepo(owner, name)
  if (!repo) return notFound()

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <BackButton />
      </div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{repo.full_name}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{repo.description || 'No description provided.'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">Visibility</div>
          <div className="text-sm font-medium mt-1">{repo.private ? 'Private' : 'Public'}</div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">Default branch</div>
          <div className="text-sm font-medium mt-1">{repo.default_branch}</div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">Language</div>
          <div className="text-sm font-medium mt-1">{repo.language || 'Unknown'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-sm font-semibold mb-3">Repository info</div>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <li>Stars: {repo.stargazers_count}</li>
            <li>Forks: {repo.forks_count}</li>
            <li>Open issues: {repo.open_issues_count}</li>
            <li>Last updated: {new Date(repo.updated_at).toLocaleString()}</li>
          </ul>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-sm font-semibold mb-3">Actions</div>
          <div className="flex gap-3">
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-md text-sm border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900">View on GitHub</a>
          </div>
        </div>
      </div>
    </div>
  )
}


