import { Analytics } from '@/components/Analytics'
import { AnalyticsTabs } from '@/components/AnalyticsTabs'
import { Suspense } from 'react'

export default function AnalyticsPage() {
  return (
    <div className="p-6">
      <AnalyticsTabs />
      <Suspense>
        <Analytics />
      </Suspense>
    </div>
  )
}


