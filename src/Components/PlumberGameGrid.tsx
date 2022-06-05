import React, { FC, useEffect } from 'react'
import { observer } from 'mobx-react'
import { useGameStore } from '../Stores/Context'
import { CanvasWrapper } from './CanvasWrapper'
import { PlumberButton } from './PlumberButton'
import styles from './PlumberGameGrid.module.css'
import { Loader } from './Loader'

export const PlumberGameGrid:FC = observer(() => {
  const store = useGameStore()
  useEffect(() => {
    store.getMap()
  }, [])

  if (!store.map.length) {
    return <Loader/>
  }

  const countColumn = store.map[0].length
  const countRow = store.map.length

  return <div className={styles.gameContainer}>
    <div className={styles.menuContainer}>
      <PlumberButton label={'Exit'} onClick={() => store.close()}/>
    </div>
    <div className={styles.canvasContainer}>
      <CanvasWrapper map={store.map} countColumn={countColumn} countRow={countRow}/>
    </div>
  </div>
})
