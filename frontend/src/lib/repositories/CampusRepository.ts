import type { ProxyReport, LostAndFoundItem } from '../models'

export interface CampusRepository {
  getProxyReports(): Promise<ProxyReport[]>
  submitProxyReport(report: Omit<ProxyReport, 'id' | 'reportCount' | 'status' | 'createdAt'>): Promise<void>
  confirmProxyReport(reportId: string): Promise<void>
  getLostAndFoundItems(): Promise<LostAndFoundItem[]>
  submitLostAndFoundItem(item: Omit<LostAndFoundItem, 'id' | 'status' | 'createdAt'>): Promise<void>
  claimItem(itemId: string, answer: string): Promise<boolean>
}
