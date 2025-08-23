'use client';

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

export function AnalyticsTabs() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = pathname.startsWith('/analytics/red-teaming')
    ? 'red-teaming'
    : (searchParams.get('tab') || 'overview')

  const items: Array<{ id: string; href: string; label: string }> = [
    { id: 'overview', href: '/analytics?tab=overview', label: 'Overview' },
    { id: 'costs', href: '/analytics?tab=costs', label: 'Costs & Trends' },
    { id: 'deployments', href: '/analytics?tab=deployments', label: 'Deployments' },
    { id: 'security', href: '/analytics?tab=security', label: 'Security & Compliance' },
    { id: 'monitoring', href: '/analytics?tab=monitoring', label: 'Live Monitoring' },
    { id: 'red-teaming', href: '/analytics/red-teaming', label: 'Red Teaming' },
  ]

  return (
    <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto">
      {items.map((it) => (
        <Link
          key={it.id}
          href={it.href}
          className={[
            'px-3 py-2 text-sm whitespace-nowrap',
            currentTab === it.id
              ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          ].join(' ')}
        >
          {it.label}
        </Link>
      ))}
    </div>
  )
}


