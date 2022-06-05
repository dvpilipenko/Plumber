import React, { FC } from 'react'
import { PlumberButton } from './PlumberButton'
import styles from './MainMenu.module.css'

interface MainMenuProps {
  levels: Record<number, string>
  onSelect: (id: string) => void
}

export const MainMenu:FC<MainMenuProps> = ({ levels, onSelect }) => {
  return <div className={styles.container}>
      <p>Please select Level</p>
      {Object.entries(levels).map(([id, label]) =>
        (<div className={styles.buttonContainer} key={id} >
            <PlumberButton onClick={() => onSelect(id)} label={label}/>
        </div>)
      )}
  </div>
}
