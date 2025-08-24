"use client";

import { useState } from 'react'

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [loading, setLoading] = useState(false)

  const send = async () => {
    const msg = input.trim()
    if (!msg) return
    setMessages((m) => [...m, { role: 'user', content: msg }])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: msg }) })
      const data = await res.json()
      setMessages((m) => [...m, { role: 'assistant', content: data.reply || 'No reply' }])
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Failed to reach chat endpoint' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">Composio quick-wire demo. Configure COMPOSIO_API_KEY to enable tool calls.</div>
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 h-[56vh] overflow-y-auto bg-white dark:bg-gray-900">
        {messages.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 text-sm">Say hi to start.</div>
        ) : (
          <div className="space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block px-3 py-2 rounded-md text-sm ${m.role === 'user' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100'}`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask Composio…"
          className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200"
        />
        <button
          onClick={send}
          disabled={loading}
          className={`px-4 py-2 rounded-md text-sm border ${loading ? 'bg-gray-50 dark:bg-gray-900 text-gray-400 border-gray-200 dark:border-gray-800' : 'bg-black dark:bg-white text-white dark:text-black'}`}
        >
          {loading ? 'Sending…' : 'Send'}
        </button>
      </div>
    </div>
  )
}


