import React, { FC } from 'react'

import './App.css'
import { StoreContext } from './Stores/Context'
import { PlumberGame } from './Components/PlumberGame'
import { CreatePlumberStores } from './Stores/CreatePlumberStores'

const SOCKET_URL = 'wss://hometask.eg1236.com/game-pipes/'
type GameType = 'Plumber' | 'CuberPunk2077' | 'GAT VI'

interface AppProps {
  gameType: GameType
}

const App:FC<AppProps> = ({ gameType }) => {
  let component

  switch (gameType) {
    case 'Plumber':
      component = <StoreContext.Provider value={CreatePlumberStores(SOCKET_URL)}><PlumberGame/></StoreContext.Provider>
      break
    case 'CuberPunk2077':
      component = <span>Coming Soon</span>
      break
    case 'GAT VI':
      component = <span>Coming Soon</span>
      break
  }

  return component
}

export default App
