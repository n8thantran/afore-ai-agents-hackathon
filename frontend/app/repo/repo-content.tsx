import { ProjectGrid } from '@/components/ProjectGrid'
import { headers } from 'next/headers'

export default async function RepoContent() {
  // This component is server-side by default in app dir
  const hdrs = await headers()
  const url = new URL(hdrs.get('x-url') || 'http://localhost')
  const search = url.searchParams.get('search') || ''

  return (
    <div>
      <ProjectGrid key={search} />
    </div>
  )
}


