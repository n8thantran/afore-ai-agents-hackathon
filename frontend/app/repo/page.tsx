import { ProjectGrid } from '@/components/ProjectGrid'
import { Suspense } from 'react'
import RepoContent from './repo-content'

export default function RepoPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Repositories</h1>
      <Suspense>
        <RepoContent />
      </Suspense>
    </div>
  )
}


