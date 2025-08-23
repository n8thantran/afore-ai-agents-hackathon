import { ProjectGrid } from '@/components/ProjectGrid'
import { Suspense } from 'react'
import { headers } from 'next/headers'

export default function RepoContent() {
  // This component is server-side by default in app dir
  const hdrs = headers()
  const url = new URL(hdrs.get('x-url') || 'http://localhost')
  const search = url.searchParams.get('search') || ''

  return (
    <div>
      <ProjectGrid key={search} />
    </div>
  )
}


