import { createContext, useContext } from 'react'
import { ResourceStore } from './ResourceStore'
import { PlumberGameStore } from './PlumberGameStore'

export interface PlumberStores {
  gameStore: PlumberGameStore,
  resourceStore: ResourceStore
}

export const StoreContext = createContext<PlumberStores | null>(null)

export const useGameStore = () => {
  const store = useContext(StoreContext)?.gameStore

  if (!store) {
    throw new Error('Store is null!')
  }

  return store
}

export const useResourceStore = () => {
  const store = useContext(StoreContext)?.resourceStore

  if (!store) {
    throw new Error('Store is null!')
  }

  return store
}
