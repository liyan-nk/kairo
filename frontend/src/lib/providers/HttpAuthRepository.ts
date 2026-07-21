import type { AuthRepository } from '../repositories/AuthRepository'
import type { SessionPersistence, UserSession } from '../repositories/SessionPersistence'
import { LocalSessionPersistence } from './LocalSessionPersistence'
import { apiClient } from './apiClient'

export class HttpAuthRepository implements AuthRepository {
  private sessionStore: SessionPersistence

  constructor(sessionStore: SessionPersistence = new LocalSessionPersistence()) {
    this.sessionStore = sessionStore
  }

  async getInitialSession(): Promise<UserSession | null> {
    return this.sessionStore.getSession()
  }

  async login(email: string, password: string): Promise<UserSession> {
    const data = await apiClient.post<{ user: any; accessToken: string; refreshToken: string }>(
      '/auth/login',
      { email, password }
    )

    const session: UserSession = {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
      },
      token: data.accessToken,
      refreshToken: data.refreshToken,
    }

    await this.sessionStore.setSession(session)
    return session
  }

  async signup(name: string, email: string, password: string): Promise<UserSession> {
    const data = await apiClient.post<{ user: any; accessToken: string; refreshToken: string }>(
      '/auth/signup',
      { name, email, password }
    )

    const session: UserSession = {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
      },
      token: data.accessToken,
      refreshToken: data.refreshToken,
    }

    await this.sessionStore.setSession(session)
    return session
  }

  async logout(): Promise<void> {
    const session = await this.sessionStore.getSession()
    if (session?.refreshToken) {
      await apiClient.post('/auth/logout', {
        refreshToken: session.refreshToken,
      }).catch((err) => {
        console.warn('Backend logout revocation request failed', err)
      })
    }
    await this.sessionStore.clearSession()
  }
}

export default HttpAuthRepository
