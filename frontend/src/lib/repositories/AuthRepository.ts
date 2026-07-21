import type { UserSession } from './SessionPersistence'

export interface AuthRepository {
  getInitialSession(): Promise<UserSession | null>
  login(email: string, password: string): Promise<UserSession>
  signup(name: string, email: string, password: string): Promise<UserSession>
  logout(): Promise<void>
}
