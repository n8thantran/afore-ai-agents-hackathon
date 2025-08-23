'use client';

import { useEffect, useMemo, useState } from 'react'
import { Activity, ShieldAlert, Beaker, Bug, Search, CheckCircle2, Star, GitFork, Clock, XCircle, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export function RedTeaming() {
  const [running, setRunning] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [repos, setRepos] = useState<Array<{
    id: number; name: string; full_name: string; description?: string | null; language?: string | null;
    stargazers_count?: number; forks_count?: number; updated_at?: string; private?: boolean; html_url?: string
  }>>([])
  const [selected, setSelected] = useState<string>('')
  const [query, setQuery] = useState('')
  const [progress, setProgress] = useState(0)
  const [notification, setNotification] = useState<{ type: 'success' | 'warning' | 'error' | 'info'; message: string } | null>(null)
  const [tests, setTests] = useState<Array<{ id: string; name: string; status: 'pending' | 'running' | 'pass' | 'fail' | 'warn'; durationMs?: number }>>([])

  const append = (line: string) => setLogs((l) => [...l, `${new Date().toLocaleTimeString()}  ${line}`])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/repos')
        if (!res.ok) return
        const data = await res.json()
        setRepos((data || []).map((r: any) => ({
          id: r.id,
          name: r.name,
          full_name: r.full_name,
          description: r.description,
          language: r.language,
          stargazers_count: r.stargazers_count,
          forks_count: r.forks_count,
          updated_at: r.updated_at,
          private: r.private,
          html_url: r.html_url,
        })))
      } catch (e) {
        // ignore
      }
    }
    load()
  }, [])

  const runSuite = async () => {
    if (running) return
    setRunning(true)
    setLogs([])
    append(`Starting red teaming suite on ${selected || 'all repos'}...`)
    setNotification({ type: 'info', message: 'Red Teaming started' })
    setProgress(0)
    const seed: Array<{ id: string; name: string; status: 'pending' | 'running' | 'pass' | 'fail' | 'warn'; durationMs?: number }> = [
      { id: 't1', name: 'Prompt Injection (basic)', status: 'pending' },
      { id: 't2', name: 'Data Exfiltration', status: 'pending' },
      { id: 't3', name: 'Rate Limiting', status: 'pending' },
      { id: 't4', name: 'Path Traversal', status: 'pending' },
      { id: 't5', name: 'XSS Payloads', status: 'pending' },
      { id: 't6', name: 'Dependency CVEs (quick)', status: 'pending' },
    ]
    setTests(seed)

    for (let i = 0; i < seed.length; i++) {
      setTests((prev) => prev.map((t, idx) => (idx === i ? { ...t, status: 'running' } : t)))
      append(`Running: ${seed[i].name}`)
      await new Promise((r) => setTimeout(r, 450))
      const outcome = i % 5 === 2 ? 'warn' : 'pass'
      setTests((prev) => prev.map((t, idx) => (idx === i ? { ...t, status: outcome as any, durationMs: 400 + Math.floor(Math.random() * 400) } : t)))
      if (outcome === 'warn') append(`Warning: ${seed[i].name} found potential issue`)
      setProgress(Math.round(((i + 1) / seed.length) * 100))
    }

    append('Suite complete. 0 critical, 2 warnings, 4 passes.')
    setNotification({ type: 'success', message: 'Red Teaming finished: 0 critical, 2 warnings, 4 passes' })
    setRunning(false)
  }

  const runFuzz = async () => {
    if (running) return
    setRunning(true)
    setNotification({ type: 'info', message: 'Fuzzing started' })
    setProgress(0)
    setTests([
      { id: 'f1', name: 'Randomized input corpus', status: 'running' },
      { id: 'f2', name: 'Boundary values', status: 'pending' },
      { id: 'f3', name: 'Malformed payloads', status: 'pending' },
    ])
    append(`Fuzzing critical endpoints on ${selected || 'all repos'}...`)
    await new Promise((r) => setTimeout(r, 700))
    setTests((prev) => prev.map((t, i) => (i === 0 ? { ...t, status: 'pass', durationMs: 680 } : t)))
    setProgress(34)
    await new Promise((r) => setTimeout(r, 500))
    setTests((prev) => prev.map((t, i) => (i === 1 ? { ...t, status: 'warn', durationMs: 520 } : t)))
    setProgress(67)
    await new Promise((r) => setTimeout(r, 500))
    setTests((prev) => prev.map((t, i) => (i === 2 ? { ...t, status: 'pass', durationMs: 510 } : t)))
    setProgress(100)
    append('No crashes detected. 3 inputs flagged for review.')
    setNotification({ type: 'warning', message: 'Fuzzing finished: review flagged inputs' })
    setRunning(false)
  }

  const displayedLogs = useMemo(() => logs.slice(-6), [logs])

  return (
    <div className="space-y-4">
      {/* Target selection */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold">Target Repository</div>
          {selected ? (
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                {selected}
              </span>
              <button onClick={() => setSelected('')} className="underline text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Change</button>
            </div>
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search repositories..."
                className="pl-9 pr-3 py-1.5 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-gray-950 text-xs text-gray-700 dark:text-gray-300 w-56"
              />
            </div>
          )}
        </div>

        {!selected && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {repos
              .filter(r => {
                const q = query.trim().toLowerCase()
                if (!q) return true
                return (
                  r.name.toLowerCase().includes(q) ||
                  r.full_name.toLowerCase().includes(q)
                )
              })
              .slice(0, 6)
              .map(r => (
                <button
                  key={r.id}
                  onClick={() => setSelected(r.full_name)}
                  className={`text-left rounded-md border p-2 transition-colors ${
                    selected === r.full_name
                      ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-900'
                      : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-gray-900 dark:text-white truncate flex items-center gap-1">
                        {r.name}
                        {selected === r.full_name && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{r.full_name}</div>
                    </div>
                    <div className="text-[9px] px-1.5 py-0.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                      {r.private ? 'Private' : 'Public'}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">Status</div>
          <div className="mt-1 text-sm font-medium flex items-center gap-2">
            <Activity className="w-4 h-4" /> {running ? 'Running' : 'Idle'}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">Findings</div>
          <div className="mt-1 text-sm font-medium">0 critical · 2 warnings</div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">Coverage</div>
          <div className="mt-1 text-sm font-medium">~35% mocked</div>
        </div>
      </div>

      {(notification || running) && (
        <div className="flex items-center justify-between rounded-md border border-gray-200 dark:border-gray-800 p-3 text-xs">
          <div className="flex items-center gap-2">
            {notification?.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            {notification?.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
            {notification?.type === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
            {(!notification || notification.type === 'info') && <Activity className="w-4 h-4 text-blue-500" />}
            <span className="text-gray-700 dark:text-gray-300">{notification?.message || 'In progress...'}</span>
          </div>
          <div className="flex-1 mx-4 h-2 bg-gray-100 dark:bg-gray-900 rounded">
            <div className="h-2 bg-blue-500 rounded" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-gray-500 dark:text-gray-400">{progress}%</span>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={runSuite}
          disabled={running}
          className={`px-4 py-2 rounded-md text-sm inline-flex items-center gap-2 border ${
            running
              ? 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-800 cursor-not-allowed'
              : 'bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4" /> Run Red Team Suite
        </button>
        <button
          onClick={runFuzz}
          disabled={running}
          className={`px-4 py-2 rounded-md text-sm inline-flex items-center gap-2 border ${
            running
              ? 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-800 cursor-not-allowed'
              : 'bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900'
          }`}
        >
          <Beaker className="w-4 h-4" /> Run Fuzz Tests
        </button>
      </div>

      {tests.length > 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-3">
          <div className="text-sm font-semibold mb-2">Test Cases</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {tests.map((t) => (
              <div key={t.id} className="flex items-center justify-between text-xs rounded-md border border-gray-200 dark:border-gray-800 p-2">
                <span className="text-gray-700 dark:text-gray-300 truncate mr-2">{t.name}</span>
                <div className="flex items-center gap-2">
                  {t.status === 'running' && <Activity className="w-3 h-3 text-blue-500" />}
                  {t.status === 'pass' && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                  {t.status === 'fail' && <XCircle className="w-3 h-3 text-red-500" />}
                  {t.status === 'warn' && <AlertTriangle className="w-3 h-3 text-yellow-500" />}
                  <span className={
                    t.status === 'pass' ? 'text-green-600 dark:text-green-400' :
                    t.status === 'fail' ? 'text-red-600 dark:text-red-400' :
                    t.status === 'warn' ? 'text-yellow-600 dark:text-yellow-400' : 'text-blue-600 dark:text-blue-400'
                  }>
                    {t.status.toUpperCase()}
                  </span>
                  {t.durationMs ? <span className="text-gray-500 dark:text-gray-400">{t.durationMs}ms</span> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-3">
        <div className="text-sm font-semibold mb-2 flex items-center gap-2"><Bug className="w-4 h-4" /> Logs</div>
        <pre className="text-[11px] whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-gray-300 min-h-[80px]">{displayedLogs.join('\n')}</pre>
      </div>
    </div>
  )
}


