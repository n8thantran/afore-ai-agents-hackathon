import { NextResponse } from 'next/server'
import { RepoDatabase } from '@/lib/database'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ owner: string; name: string }> }
) {
  try {
    const { owner, name } = await params
    const fullName = `${owner}/${name}`.toLowerCase()
    const repos = RepoDatabase.getAllRepos()
    const repo = repos.find((r) => r.full_name.toLowerCase() === fullName)
    if (!repo) {
      return NextResponse.json({ error: 'Repo not found' }, { status: 404 })
    }
    return NextResponse.json(repo)
  } catch (err) {
    console.error('repo detail error', err)
    return NextResponse.json({ error: 'Failed to fetch repo' }, { status: 500 })
  }
}


