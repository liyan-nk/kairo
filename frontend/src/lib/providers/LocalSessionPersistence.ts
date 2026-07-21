import type { SessionPersistence, UserSession } from '../repositories/SessionPersistence'

const SESSION_KEY = 'kairo_user_session_v1'

export class LocalSessionPersistence implements SessionPersistence {
  async getSession(): Promise<UserSession | null> {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      if (!raw) return null
      return JSON.parse(raw) as UserSession
    } catch {
      return null
    }
  }

  async setSession(session: UserSession): Promise<void> {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    } catch (err) {
      console.error('Failed to persist session', err)
    }
  }

  async clearSession(): Promise<void> {
    try {
      localStorage.removeItem(SESSION_KEY)
    } catch (err) {
      console.error('Failed to clear session', err)
    }
  }
}

export default LocalSessionPersistence
