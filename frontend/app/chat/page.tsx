"use client";

import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle, XCircle, Rocket, GitBranch, Play, AlertTriangle } from 'lucide-react'

type Role = 'user' | 'assistant'
type Msg = { role: Role; content: string }

type DeployState = {
  status: 'idle' | 'planning' | 'deploying' | 'success' | 'failed'
  progress: number
  env?: 'preview' | 'staging' | 'production'
  service?: string
  startedAt?: Date
}

type RepoScanState = {
  status: 'idle' | 'scanning' | 'done'
  total?: number
  repos: Array<{ name: string; stars: number; updatedAt: string }>
}

type ActionRun = {
  id: string
  name: string
  status: 'queued' | 'in_progress' | 'completed'
  conclusion?: 'success' | 'failure' | 'cancelled'
  url?: string
  startedAt: Date
}

type LogEntry = { id: string; ts: Date; level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS'; msg: string }

type Toast = { id: string; title: string; description?: string; tone: 'success' | 'error' | 'info' }

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: "Hey! I can deploy, check repos, and manage PRs. What do you need?" },
  ])
  const [input, setInput] = useState('')
  const [deploy, setDeploy] = useState<DeployState>({ status: 'idle', progress: 0 })
  const [scan, setScan] = useState<RepoScanState>({ status: 'idle', repos: [] })
  const [runs, setRuns] = useState<ActionRun[]>([])
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [live, setLive] = useState(true)
  const [typing, setTyping] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const pushToast = useMemo(() => pushToastFactory(setToasts), [])

  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9e9 })
  }, [messages])

  useEffect(() => {
    if (!live) return
    const interval = setInterval(() => addLogRandom(), 1500)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live])

  function addLog(entry: LogEntry) {
    setLogs(prev => [entry, ...prev].slice(0, 60))
  }

  function addLogRandom() {
    const levels: LogEntry['level'][] = ['INFO', 'SUCCESS', 'WARN', 'ERROR']
    const msgs = [
      'Checked out repo',
      'Running build step',
      'Cache hit',
      'Workflow queued',
      'Deployment artifact uploaded',
      'Security scan passed',
      'Rate limit near threshold',
      'Retrying step',
    ]
    addLog({ id: `${Date.now()}`, ts: new Date(), level: levels[Math.floor(Math.random() * levels.length)], msg: msgs[Math.floor(Math.random() * msgs.length)] })
  }

  function simulateDeploy(env: DeployState['env'] = 'preview', service = 'web-app') {
    setDeploy({ status: 'planning', progress: 5, env, service, startedAt: new Date() })
    addLog({ id: `${Date.now()}`, ts: new Date(), level: 'INFO', msg: `Planning deployment for ${service} → ${env}` })
    setTimeout(() => setDeploy(d => ({ ...d!, status: 'deploying', progress: 25 })), 800)
    setTimeout(() => setDeploy(d => ({ ...d!, progress: 55 })), 1600)
    setTimeout(() => setDeploy(d => ({ ...d!, progress: 80 })), 2400)
    setTimeout(() => {
      const ok = Math.random() > 0.1
      setDeploy(d => ({ ...d!, status: ok ? 'success' : 'failed', progress: 100 }))
      addLog({ id: `${Date.now()}`, ts: new Date(), level: ok ? 'SUCCESS' : 'ERROR', msg: ok ? `Deploy succeeded for ${service}` : `Deploy failed for ${service}` })
      const run: ActionRun = {
        id: `${Date.now()}`,
        name: `deploy_${service}_${env}`,
        status: 'completed',
        conclusion: ok ? 'success' : 'failure',
        url: '#',
        startedAt: new Date(),
      }
      setRuns(prev => [run, ...prev].slice(0, 10))
      pushToast({
        title: ok ? 'Deployment success' : 'Deployment failed',
        description: `${service} → ${env}`,
        tone: ok ? 'success' : 'error',
      })
    }, 3200)
  }

  function simulateRepoScan() {
    setScan({ status: 'scanning', repos: [] })
    addLog({ id: `${Date.now()}`, ts: new Date(), level: 'INFO', msg: 'Scanning repositories…' })
    setTimeout(() => {
      const repos = mockRepos()
      setScan({ status: 'done', total: repos.length, repos })
      addLog({ id: `${Date.now()}`, ts: new Date(), level: 'SUCCESS', msg: `Found ${repos.length} repositories` })
    }, 1200)
  }

  function mockRepos() {
    const names = ['web-app', 'api-server', 'infra', 'design-system', 'mobile', 'docs']
    return names.map(n => ({ name: n, stars: Math.floor(Math.random() * 2000), updatedAt: new Date(Date.now() - Math.random() * 1e8).toISOString() }))
  }

  function intentFrom(text: string) {
    const t = text.toLowerCase()
    if (/(deploy|release|promote)/.test(t)) return 'deploy'
    if (/(repo|repos|repository|repositories|list)/.test(t)) return 'list_repos'
    if (/(issue|bug|ticket)/.test(t)) return 'create_issue'
    if (/(pr|pull request)/.test(t)) return 'create_pr'
    if (/(workflow|action|dispatch|run)/.test(t)) return 'workflow'
    return 'chat'
  }

  function assistantReply(text: string) {
    const intent = intentFrom(text)
    switch (intent) {
      case 'deploy':
        simulateDeploy('preview', 'web-app')
        return [
          'Plan: deploy web-app → preview.',
          'Executing deployment…',
          'I will post status updates below.',
        ].join('\n')
      case 'list_repos':
        simulateRepoScan()
        return 'Fetching repositories… I will summarize when ready.'
      case 'create_issue':
        addLog({ id: `${Date.now()}`, ts: new Date(), level: 'INFO', msg: 'Creating issue in repository (mock)' })
        setTimeout(() => addLog({ id: `${Date.now()}`, ts: new Date(), level: 'SUCCESS', msg: 'Issue #124 opened: "Sample bug"' }), 800)
        return 'Drafting an issue (mock). What title and body would you like?'
      case 'create_pr':
        addLog({ id: `${Date.now()}`, ts: new Date(), level: 'INFO', msg: 'Opening PR from feature branch (mock)' })
        setTimeout(() => addLog({ id: `${Date.now()}`, ts: new Date(), level: 'SUCCESS', msg: 'PR #58 opened: "Update README with deployment notes"' }), 900)
        return 'Preparing a PR (mock). Which repo and base branch should I use?'
      case 'workflow':
        const run: ActionRun = { id: `${Date.now()}`, name: 'ci.yml', status: 'completed', conclusion: 'success', url: '#', startedAt: new Date() }
        setRuns(prev => [run, ...prev].slice(0, 10))
        addLog({ id: `${Date.now()}`, ts: new Date(), level: 'SUCCESS', msg: 'Workflow ci.yml dispatched (mock)' })
        return 'Triggered workflow (mock). See recent runs.'
      default:
        return 'Got it. I can deploy, list repos, create issues/PRs, or run workflows. What should I do?'
    }
  }

  function send() {
    const text = input.trim()
    if (!text) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setTimeout(() => {
      const reply = assistantReply(text)
      streamAssistant(reply)
    }, 200)
  }

  function streamAssistant(text: string) {
    setTyping(true)
    // ensure a placeholder assistant message exists to update
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])
    let ptr = 0
    const step = () => Math.max(1, Math.floor(Math.random() * 3))
    const tick = () => {
      ptr = Math.min(text.length, ptr + step())
      const slice = text.slice(0, ptr)
      setMessages(prev => {
        const next = [...prev]
        for (let i = next.length - 1; i >= 0; i--) {
          if (next[i].role === 'assistant') {
            next[i] = { role: 'assistant', content: slice }
            break
          }
        }
        return next
      })
      if (ptr < text.length) {
        setTimeout(tick, 25 + Math.random() * 40)
      } else {
        setTyping(false)
      }
    }
    setTimeout(tick, 200)
  }

  const deployBadge = useMemo(() => {
    switch (deploy.status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800'
      case 'deploying': return 'bg-blue-100 text-blue-800'
      case 'success': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }, [deploy.status])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className={`shadow-lg rounded-md px-4 py-3 border text-sm flex items-start gap-2 transition-all ${
            t.tone === 'success' ? 'bg-green-50 border-green-200 text-green-900' :
            t.tone === 'error' ? 'bg-red-50 border-red-200 text-red-900' :
            'bg-gray-50 border-gray-200 text-gray-900'
          }`}>
            {t.tone === 'success' ? <CheckCircle className="w-4 h-4 mt-0.5" /> : t.tone === 'error' ? <XCircle className="w-4 h-4 mt-0.5" /> : <AlertTriangle className="w-4 h-4 mt-0.5" />}
            <div>
              <div className="font-semibold">{t.title}</div>
              {t.description && <div className="text-xs opacity-80">{t.description}</div>}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat panel */}
        <div className="lg:col-span-2 border rounded flex flex-col h-[70vh] bg-white">
          <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-3 bg-white">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block rounded-2xl px-3 py-2 whitespace-pre-wrap ring-1 ${m.role === 'user' ? 'bg-black text-white ring-black' : 'bg-gray-50 ring-gray-200'}`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Ask anything… e.g., Deploy staging, List repos, Create issue"
              className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/50"
            />
            <button onClick={send} className="px-4 py-2 bg-black text-white rounded inline-flex items-center gap-2"><Play className="w-4 h-4" /> Send</button>
          </div>
          {typing && (
            <div className="px-4 pb-3 text-left">
              <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                Assistant is typing
                <span className="inline-block w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="inline-block w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="inline-block w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
              </span>
            </div>
          )}
        </div>

        {/* Telemetry / modules */}
        <div className="space-y-4">
          {/* Deploy status */}
          <div className={`border rounded p-4 ${
            deploy.status === 'success' ? 'border-green-300 bg-green-50' :
            deploy.status === 'failed' ? 'border-red-300 bg-red-50' :
            'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 font-semibold">
                <Rocket className="w-4 h-4" /> Deployment
              </div>
              <span className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${deployBadge}`}>
                {deploy.status === 'success' ? <CheckCircle className="w-3 h-3" /> : deploy.status === 'failed' ? <XCircle className="w-3 h-3" /> : <GitBranch className="w-3 h-3" />}
                {deploy.status}
              </span>
            </div>
            <div className="text-sm text-gray-700 mb-2">{deploy.service || '—'} <span className="opacity-50">→</span> {deploy.env || '—'}</div>
            <div className="h-2 bg-gray-100 rounded mt-2 overflow-hidden">
              <div className={`h-2 transition-all ${deploy.status === 'failed' ? 'bg-red-500' : deploy.status === 'success' ? 'bg-green-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`} style={{ width: `${deploy.progress}%` }} />
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => simulateDeploy('preview', 'web-app')} className="text-xs border rounded px-2 py-1">Deploy preview</button>
              <button onClick={() => simulateDeploy('staging', 'api-server')} className="text-xs border rounded px-2 py-1">Deploy staging</button>
            </div>
          </div>

          {/* Repo scan */}
          <div className="border rounded p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Repositories</div>
              <span className="text-xs text-gray-500">{scan.status === 'scanning' ? 'scanning…' : scan.status === 'done' ? `${scan.total} found` : 'idle'}</span>
            </div>
            <div className="space-y-2">
              {scan.repos.slice(0, 6).map((r) => (
                <div key={r.name} className="flex items-center justify-between text-sm">
                  <div className="font-mono">{r.name}</div>
                  <div className="text-gray-500">★ {r.stars} · {new Date(r.updatedAt).toLocaleDateString()}</div>
                </div>
              ))}
              {scan.repos.length === 0 && (
                <div className="text-sm text-gray-500">No data. Click scan.</div>
              )}
            </div>
            <div className="mt-3">
              <button onClick={simulateRepoScan} className="text-xs border rounded px-2 py-1">Scan repos</button>
            </div>
          </div>

          {/* Actions runs */}
          <div className="border rounded p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">GitHub Actions</div>
              <span className="text-xs text-gray-500">{runs.length} recent</span>
            </div>
            <div className="space-y-2">
              {runs.slice(0, 6).map(r => (
                <div key={r.id} className="text-sm flex items-center justify-between">
                  <div className="font-mono">{r.name}</div>
                  <div className={`text-xs ${r.conclusion === 'success' ? 'text-green-600' : r.conclusion === 'failure' ? 'text-red-600' : 'text-gray-600'}`}>{r.conclusion || r.status}</div>
                </div>
              ))}
              {runs.length === 0 && <div className="text-sm text-gray-500">No runs yet.</div>}
            </div>
          </div>

          {/* Live logs */}
          <div className="border rounded p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Live Logs</div>
              <button onClick={() => setLive(v => !v)} className={`text-xs px-2 py-1 rounded border ${live ? 'bg-green-50 border-green-300' : ''}`}>{live ? 'Live' : 'Paused'}</button>
            </div>
            <div className="h-40 overflow-auto text-xs font-mono bg-white border rounded p-2">
              {logs.map(l => (
                <div key={l.id} className="flex gap-2">
                  <span className="text-gray-500">{l.ts.toLocaleTimeString()}</span>
                  <span className={l.level === 'ERROR' ? 'text-red-600' : l.level === 'SUCCESS' ? 'text-green-600' : l.level === 'WARN' ? 'text-yellow-700' : 'text-gray-800'}>{l.level}</span>
                  <span>{l.msg}</span>
                </div>
              ))}
              {logs.length === 0 && <div className="text-gray-500">No logs yet.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function pushToastFactory(setter: (fn: (prev: Toast[]) => Toast[]) => void) {
  return (t: Omit<Toast, 'id'>) => {
    const toast: Toast = { id: `${Date.now()}-${Math.random()}`, ...t }
    setter(prev => [toast, ...prev].slice(0, 4))
    setTimeout(() => setter(prev => prev.filter(x => x.id !== toast.id)), 4200)
  }
}
 
