import React, { FC, useEffect, useRef } from 'react'
import styles from './CanvasWrapper.module.css'
import { useGameStore, useResourceStore } from '../Stores/Context'
import { Pipe, validate } from '../Stores/Verification'
import { CanvasStore, RECT_SIZE } from '../Stores/CanvasStore'

import { checkMarginMinMax } from '../Utils'
import { rotateMap } from '../Maps.tx'

const CLICK_DELAY = 300

const touchAdapter = (event: TouchEvent): MouseEvent => {
  return { clientX: event.touches[0].clientX, clientY: event.touches[0].clientY } as MouseEvent
}

interface CanvasWrapperProps {
  countRow: number,
  countColumn: number,
  map: Pipe[][]
}

export const CanvasWrapper:FC<CanvasWrapperProps> = ({ countRow, countColumn, map }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const store = useGameStore()
  const resourceStore = useResourceStore()

  useEffect(() => {
    if (!canvasRef.current || !map.length) {
      return
    }
    const canvasStore = new CanvasStore(canvasRef.current, countRow, countColumn, map, resourceStore)

    let dragging = false
    let lastX = 0
    let lastY = 0
    let curMilliseconds = 0

    const mouseUp = () => {
      dragging = false
    }

    const mouseClick = (event:MouseEvent) => {
      if (window.performance.now() - curMilliseconds > CLICK_DELAY) {
        return
      }
      const colIndex = Math.floor((-canvasStore.canvasMargins.left + event.offsetX) / RECT_SIZE)
      const rowIndex = Math.floor((-canvasStore.canvasMargins.top + event.offsetY) / RECT_SIZE)
      store.rotate(colIndex, rowIndex)

      const currentSymbol = canvasStore.map[rowIndex][colIndex]
      canvasStore.map[rowIndex][colIndex] = rotateMap[currentSymbol]

      const isValid = validate(canvasStore.map, { row: rowIndex, col: colIndex })
      if (isValid) {
        store.verify()
      }

      canvasStore.scheduleDraw()
    }

    const mouseDown = (event: MouseEvent) => {
      dragging = true
      lastX = event.clientX
      lastY = event.clientY
      curMilliseconds = window.performance.now()
    }

    const mouseMove = (event: MouseEvent) => {
      if (!dragging) {
        return
      }
      let left = canvasStore.canvasMargins.left
      let top = canvasStore.canvasMargins.top
      const deltaX = event.clientX - lastX
      const deltaY = event.clientY - lastY
      lastX = event.clientX
      lastY = event.clientY
      if (!canvasStore.isForbiddenHorizontalDrag) {
        left = Math.floor(checkMarginMinMax(canvasStore.canvasMargins.left + deltaX, -canvasStore.canvasMargins.maxLeft, 0))
      }
      if (!canvasStore.isForbiddenVerticalDrag) {
        top = Math.floor(checkMarginMinMax(canvasStore.canvasMargins.top + deltaY, -canvasStore.canvasMargins.maxTop, 0))
      }

      if (canvasStore.canvasMargins.left !== left || canvasStore.canvasMargins.top !== top) {
        canvasStore.canvasMargins.left = left
        canvasStore.canvasMargins.top = top
        canvasStore.scheduleDraw()
      }
    }

    const touchStart = (e: TouchEvent) => {
      mouseDown(touchAdapter(e))
    }

    const touchMove = (e: TouchEvent) => {
      mouseMove(touchAdapter(e))
    }

    window.addEventListener('touchmove', touchMove)
    window.addEventListener('touchstart', touchStart)
    window.addEventListener('touchend', mouseUp)

    canvasRef.current.addEventListener('mousedown', mouseDown)
    canvasRef.current.addEventListener('click', mouseClick)
    window.addEventListener('mousemove', mouseMove)
    window.addEventListener('mouseup', mouseUp)
    window.addEventListener('resize', canvasStore.resize)

    return () => {
      window.removeEventListener('touchmove', touchMove)
      window.removeEventListener('touchstart', touchStart)
      window.removeEventListener('touchend', mouseUp)

      canvasRef.current?.removeEventListener('mousedown', mouseDown)
      canvasRef.current?.removeEventListener('click', mouseClick)

      window.removeEventListener('mousemove', mouseMove)
      window.removeEventListener('mouseup', mouseUp)
      window.removeEventListener('resize', canvasStore.resize)
    }
  }, [map])
  return (
      <canvas className={styles.canvasContainer} ref={canvasRef}></canvas>
  )
}
