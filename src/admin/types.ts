export interface AdminSession {
  authenticated: boolean
  authorized: boolean
  subject?: string
}

export interface AdminProvider {
  getSession(): Promise<AdminSession | null>
}
