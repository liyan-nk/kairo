export interface UserSession {
  user: {
    id: string
    email: string
    name: string
  }
  token: string
}

export interface SessionPersistence {
  getSession(): Promise<UserSession | null>
  setSession(session: UserSession): Promise<void>
  clearSession(): Promise<void>
}
