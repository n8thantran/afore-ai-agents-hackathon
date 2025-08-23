import { Octokit } from '@octokit/rest'

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  default_branch: string
  private: boolean
  language: string | null
  updated_at: string
  clone_url: string
}

export class GitHubService {
  private octokit: Octokit

  constructor(accessToken?: string) {
    this.octokit = new Octokit({
      auth: accessToken,
    })
  }

  async getUserRepos(username: string): Promise<GitHubRepo[]> {
    try {
      const { data } = await this.octokit.repos.listForUser({
        username,
        sort: 'updated',
        per_page: 50,
      })
      
      return data as GitHubRepo[]
    } catch (error) {
      console.error('Error fetching GitHub repos:', error)
      return []
    }
  }

  async getAuthenticatedUserRepos(): Promise<GitHubRepo[]> {
    try {
      const { data } = await this.octokit.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 50,
      })
      
      return data as GitHubRepo[]
    } catch (error) {
      console.error('Error fetching authenticated user repos:', error)
      return []
    }
  }

  async getUser() {
    try {
      const { data } = await this.octokit.users.getAuthenticated()
      return data
    } catch (error) {
      console.error('Error fetching GitHub user:', error)
      return null
    }
  }
}
