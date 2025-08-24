/* eslint-disable */
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { JWT } from 'next-auth/jwt'

interface ExtendedToken extends JWT {
  accessToken?: string
  login?: string
  id?: string
}

interface ExtendedSession {
  accessToken?: string
  user: {
    id?: string
    login?: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
  expires: string
}

export const authOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'user:email repo',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    // 
    async jwt({ token, account, profile }: { token: ExtendedToken; account?: any; profile?: any }) {
      if (account && profile) {
        token.accessToken = account.access_token
        token.login = profile.login
        token.id = profile.id
      }
      return token
    },
    async session({ session, token }: { session: ExtendedSession; token: ExtendedToken }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken
        session.user.login = token.login
        session.user.id = token.id
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
