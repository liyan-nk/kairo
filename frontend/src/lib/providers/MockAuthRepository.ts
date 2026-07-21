import type { AuthRepository } from '../repositories/AuthRepository'
import type { SessionPersistence, UserSession } from '../repositories/SessionPersistence'
import { LocalSessionPersistence } from './LocalSessionPersistence'

export class MockAuthRepository implements AuthRepository {
  private sessionStore: SessionPersistence

  constructor(sessionStore: SessionPersistence = new LocalSessionPersistence()) {
    this.sessionStore = sessionStore
  }

  async getInitialSession(): Promise<UserSession | null> {
    return this.sessionStore.getSession()
  }

  async login(email: string, password: string): Promise<UserSession> {
    if (!email || !password) {
      throw new Error('Email and password are required')
    }
    const session: UserSession = {
      user: {
        id: 'user_1',
        email,
        name: email.split('@')[0] || 'Student',
      },
      token: `mock_jwt_token_${Date.now()}`,
    }
    await this.sessionStore.setSession(session)
    return session
  }

  async signup(name: string, email: string, password: string): Promise<UserSession> {
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required')
    }
    const session: UserSession = {
      user: {
        id: `user_${Date.now()}`,
        email,
        name,
      },
      token: `mock_jwt_token_${Date.now()}`,
    }
    await this.sessionStore.setSession(session)
    return session
  }

  async logout(): Promise<void> {
    await this.sessionStore.clearSession()
  }
}

export default MockAuthRepository
