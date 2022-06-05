import React, { FC, useCallback } from 'react'
import { MainMenu } from './MainMenu'
import { useGameStore, useResourceStore } from '../Stores/Context'
import { Phase } from '../Stores/PlumberGameStore'
import { PlumberGameGrid } from './PlumberGameGrid'
import { observer } from 'mobx-react'
import { Loader } from './Loader'

const levels = {
  1: 'Easy',
  2: 'Normal',
  3: 'Hard',
  4: 'I can do it whole day',
  5: 'I got vacation in my job, for this level',
  6: 'time is just an abstraction'
}

export const PlumberGame:FC = observer(() => {
  const gameStore = useGameStore()
  const resourceStore = useResourceStore()
  const handleSelectLevel = useCallback((id: string) => {
    gameStore.startNewGame(id)
  }, [gameStore])

  if (resourceStore.isBusy || gameStore.isBusy) {
    return <Loader></Loader>
  }

  switch (gameStore.phase) {
    case Phase.Game:
      return <PlumberGameGrid></PlumberGameGrid>
    case Phase.MainMenu:
      return <MainMenu levels={levels} onSelect={handleSelectLevel}></MainMenu>
  }
})
