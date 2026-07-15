import { database } from './Database'
import type { StoreName } from './schema'

export async function getFromStore<T>(storeName: StoreName, key: string | number): Promise<T | null> {
  const db = await database.open()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.get(key)

    request.onsuccess = () => {
      resolve((request.result as T) ?? null)
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

export async function getAllFromStore<T>(storeName: StoreName): Promise<T[]> {
  const db = await database.open()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.getAll()

    request.onsuccess = () => {
      resolve((request.result as T[]) ?? [])
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

export async function putToStore<T>(storeName: StoreName, item: T): Promise<void> {
  const db = await database.open()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.put(item)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

export async function deleteFromStore(storeName: StoreName, key: string | number): Promise<void> {
  const db = await database.open()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.delete(key)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

export async function clearStore(storeName: StoreName): Promise<void> {
  const db = await database.open()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.clear()

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}
