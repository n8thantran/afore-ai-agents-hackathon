import { Suspense } from 'react'
import RepoContent from './repo-content'

export default function RepoPage() {
  return (
    <div className="p-6">
      <Suspense>
        <RepoContent />
      </Suspense>
    </div>
  )
}


