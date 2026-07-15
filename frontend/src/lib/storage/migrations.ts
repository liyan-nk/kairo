import { STORES } from './schema'

/**
 * Handles database upgrade migrations.
 * Only manages initial object store creations for Version 1.
 */
export const initDatabase = (db: IDBDatabase, oldVersion: number, _newVersion: number) => {
  if (oldVersion < 1) {
    db.createObjectStore(STORES.today, { keyPath: 'key' })
    db.createObjectStore(STORES.subjects, { keyPath: 'id' })
    db.createObjectStore(STORES.attendance, { keyPath: 'id' })
    db.createObjectStore(STORES.timetable, { keyPath: 'id' })
    db.createObjectStore(STORES.proxyReports, { keyPath: 'id' })
    db.createObjectStore(STORES.lostFound, { keyPath: 'id' })
    db.createObjectStore(STORES.settings, { keyPath: 'key' })
  }
}
