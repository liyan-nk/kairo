import type { CampusRepository } from '../repositories/CampusRepository'
import type { ProxyReport, LostAndFoundItem } from '../models'
import { getFromStore, putToStore, getAllFromStore } from '../storage/stores'
import { STORES } from '../storage/schema'

export class IndexedDbCampusRepository implements CampusRepository {
  async getProxyReports(): Promise<ProxyReport[]> {
    return getAllFromStore<ProxyReport>(STORES.proxyReports)
  }

  async submitProxyReport(report: Omit<ProxyReport, 'id' | 'reportCount' | 'status' | 'createdAt'>): Promise<void> {
    const id = `report_${Date.now()}`
    const newReport: ProxyReport = {
      ...report,
      id,
      reportCount: 1,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    }
    await putToStore(STORES.proxyReports, newReport)
  }

  async confirmProxyReport(reportId: string): Promise<void> {
    const report = await getFromStore<ProxyReport>(STORES.proxyReports, reportId)
    if (!report) return
    const newCount = report.reportCount + 1
    let status = report.status
    if (newCount >= 10) status = 'Auto Accepted'
    else if (newCount >= 5) status = 'Verified'
    else if (newCount >= 3) status = 'Likely'

    const updated: ProxyReport = {
      ...report,
      reportCount: newCount,
      status,
    }
    await putToStore(STORES.proxyReports, updated)
  }

  async getLostAndFoundItems(): Promise<LostAndFoundItem[]> {
    return getAllFromStore<LostAndFoundItem>(STORES.lostFound)
  }

  async submitLostAndFoundItem(item: Omit<LostAndFoundItem, 'id' | 'status' | 'createdAt'>): Promise<void> {
    const id = `lf_${Date.now()}`
    const newItem: LostAndFoundItem = {
      ...item,
      id,
      status: 'Lost',
      createdAt: new Date().toISOString(),
    }
    await putToStore(STORES.lostFound, newItem)
  }

  async claimItem(itemId: string, answer: string): Promise<boolean> {
    const item = await getFromStore<LostAndFoundItem>(STORES.lostFound, itemId)
    if (!item || !answer.trim()) return false
    const updated: LostAndFoundItem = {
      ...item,
      status: 'Claimed',
    }
    await putToStore(STORES.lostFound, updated)
    return true
  }
}
