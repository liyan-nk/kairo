import { LocalSessionPersistence } from './LocalSessionPersistence'
import type { UserSession } from '../repositories/SessionPersistence'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

class ApiClient {
  private sessionStore = new LocalSessionPersistence()
  private isRefreshing = false
  private refreshSubscribers: ((token: string) => void)[] = []

  private subscribeTokenRefresh(cb: (token: string) => void) {
    this.refreshSubscribers.push(cb)
  }

  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach((cb) => cb(token))
    this.refreshSubscribers = []
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const session = await this.sessionStore.getSession()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (session?.token) {
      headers['Authorization'] = `Bearer ${session.token}`
    }
    return headers
  }

  async request<T>(
    path: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    const url = `${BASE_URL}${path}`
    const authHeaders = await this.getAuthHeaders()
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...authHeaders,
        ...(options.headers || {}),
      },
    }

    try {
      const response = await fetch(url, config)

      if (response.status === 401 && retryCount < 1) {
        // Attempt token refresh
        const refreshedToken = await this.handleTokenRefresh()
        if (refreshedToken) {
          // Retry the request with the new token
          const retryHeaders = {
            ...config.headers,
            'Authorization': `Bearer ${refreshedToken}`,
          }
          return this.request<T>(path, { ...options, headers: retryHeaders }, retryCount + 1)
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Request failed with status ${response.status}`)
      }

      if (response.status === 204) {
        return {} as T
      }

      return await response.json() as T
    } catch (err: any) {
      throw new Error(err.message || 'Network request failed')
    }
  }

  private async handleTokenRefresh(): Promise<string | null> {
    const session = await this.sessionStore.getSession()
    if (!session?.refreshToken) {
      return null
    }

    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.subscribeTokenRefresh((token) => {
          resolve(token)
        })
      })
    }

    this.isRefreshing = true

    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: session.refreshToken }),
      })

      if (!res.ok) {
        // Refresh token invalid/revoked, logout user
        await this.sessionStore.clearSession()
        window.location.href = '/login'
        throw new Error('Session expired')
      }

      const data = await res.json()
      const updatedSession: UserSession = {
        user: session.user,
        token: data.accessToken,
        refreshToken: data.refreshToken,
      }

      await this.sessionStore.setSession(updatedSession)
      this.isRefreshing = false
      this.onRefreshed(data.accessToken)
      return data.accessToken
    } catch (err) {
      this.isRefreshing = false
      await this.sessionStore.clearSession()
      window.location.href = '/login'
      return null
    }
  }

  get<T>(path: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' })
  }

  post<T>(path: string, body?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  put<T>(path: string, body?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  patch<T>(path: string, body?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  delete<T>(path: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()
