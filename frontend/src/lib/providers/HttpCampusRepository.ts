import type { CampusRepository } from '../repositories/CampusRepository'
import type { ProxyReport, LostAndFoundItem, ConsensusStatus, LostAndFoundStatus } from '../models'
import { IndexedDbCampusRepository } from './IndexedDbCampusRepository'
import { apiClient } from './apiClient'

export class HttpCampusRepository implements CampusRepository {
  private local = new IndexedDbCampusRepository()

  async getProxyReports(): Promise<ProxyReport[]> {
    try {
      const data = await apiClient.get<any[]>('/campus/proxy-reports')
      const reports = data.map((r) => this.mapToProxyReport(r))
      
      // Save/sync into local IndexedDB
      for (const report of reports) {
        await this.local.submitProxyReport(report)
      }
      
      return reports
    } catch (err) {
      console.warn('Failed to fetch proxy reports online, returning cached version', err)
      return this.local.getProxyReports()
    }
  }

  async submitProxyReport(report: Omit<ProxyReport, 'id' | 'reportCount' | 'status' | 'createdAt'>): Promise<void> {
    try {
      await apiClient.post('/campus/proxy-reports', {
        timetableSlotId: report.timetableSlotId,
        actualSubject: report.actualSubject,
        room: report.room,
        date: report.date,
      })
      // Clear cache to trigger reload
    } catch (err) {
      await this.local.submitProxyReport(report)
      throw err
    }
  }

  async confirmProxyReport(reportId: string): Promise<void> {
    try {
      await apiClient.post(`/campus/proxy-reports/${reportId}/confirm`)
      await this.local.confirmProxyReport(reportId)
    } catch (err) {
      await this.local.confirmProxyReport(reportId)
      throw err
    }
  }

  async getLostAndFoundItems(): Promise<LostAndFoundItem[]> {
    try {
      const data = await apiClient.get<any[]>('/campus/lost-found')
      const items = data.map((item) => this.mapToLostAndFoundItem(item))

      // Save/sync into local IndexedDB
      for (const item of items) {
        await this.local.submitLostAndFoundItem(item)
      }

      return items
    } catch (err) {
      console.warn('Failed to fetch lost and found items online, returning cached version', err)
      return this.local.getLostAndFoundItems()
    }
  }

  async submitLostAndFoundItem(
    item: Omit<LostAndFoundItem, 'id' | 'status' | 'createdAt'> & { answer?: string }
  ): Promise<void> {
    try {
      await apiClient.post('/campus/lost-found', {
        title: item.title,
        description: item.description || '',
        category: item.category,
        location: item.location,
        date: item.date,
        question: item.question,
        answer: item.answer || '',
        contactInfo: item.contactInfo || '',
      })
    } catch (err) {
      await this.local.submitLostAndFoundItem(item)
      throw err
    }
  }

  async claimItem(itemId: string, answer: string): Promise<boolean> {
    try {
      await apiClient.patch<any>(`/campus/lost-found/${itemId}/claim`, {
        answer,
      })
      await this.local.claimItem(itemId, answer)
      return true
    } catch (err) {
      console.error('Failed to claim lost & found item', err)
      return false
    }
  }

  private mapToProxyReport(data: any): ProxyReport {
    let status: ConsensusStatus = 'Pending'
    if (data.status === 'LIKELY') status = 'Likely'
    else if (data.status === 'VERIFIED') status = 'Verified'
    else if (data.status === 'AUTO_ACCEPTED') status = 'Auto Accepted'

    return {
      id: data.id,
      subjectId: data.actualCourseId || '',
      timetableSlotId: data.timetableSlotId,
      expectedSubject: data.expectedSubject,
      actualSubject: data.actualSubject,
      room: data.room || '',
      faculty: data.faculty || '',
      reportCount: data.reportCount,
      status,
      date: data.reportDate,
      createdAt: data.createdAt,
    }
  }

  private mapToLostAndFoundItem(data: any): LostAndFoundItem {
    let status: LostAndFoundStatus = 'Lost'
    if (data.status === 'FOUND') status = 'Found'
    else if (data.status === 'CLAIMED') status = 'Claimed'

    return {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      category: data.category,
      location: data.location,
      date: data.date,
      status,
      question: data.question,
      contactInfo: data.contactInfo || undefined,
      createdAt: data.createdAt,
    }
  }
}

export default HttpCampusRepository
