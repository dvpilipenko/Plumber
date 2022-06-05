import styles from './PlumberButton.module.css'
import React, { FC } from 'react'

interface PlumberButtonProps {
  label: string,
  onClick: ()=> void
}

export const PlumberButton: FC<PlumberButtonProps> = ({ label, onClick }) => {
  return <button className={styles.plumberButton} onClick={onClick}> {label} </button>
}
