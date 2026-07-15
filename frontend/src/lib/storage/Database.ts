import { DB_NAME, DB_VERSION } from './schema'
import { initDatabase } from './migrations'

export class Database {
  private db: IDBDatabase | null = null

  async open(): Promise<IDBDatabase> {
    if (this.db) return this.db

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = (event) => {
        const db = request.result
        initDatabase(db, event.oldVersion, event.newVersion ?? DB_VERSION)
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve(request.result)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  close() {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }
}

export const database = new Database()
