import React, { FC, useCallback } from 'react'
import { useGameStore } from '../Stores/Context'
import { Phase } from '../Stores/PlumberGameStore'
import { PlumberGameGrid } from './PlumberGameGrid'
import { MainMenu } from './MainMenu'

const levels = {
  1: 'Easy',
  2: 'Normal',
  3: 'Hard',
  4: 'I can do it whole day',
  5: 'I got vacation in my job, for this level',
  6: 'time is just an abstraction'
}

export const PlumberGameLayout: FC = () => {
  const store = useGameStore()
  const handleSelectLevel = useCallback((id: string) => {
    store.startNewGame(id)
  }, [store])

  switch (store.phase) {
    case Phase.Game:
      return <PlumberGameGrid></PlumberGameGrid>
    case Phase.MainMenu:
      return <MainMenu levels={levels} onSelect={handleSelectLevel}></MainMenu>
  }
}
