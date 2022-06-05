import { mapConnections, NodePosition } from '../Maps.tx'

export type Pipe = '╋'| '┫'| '┣'| '┻'| '┳'| '╹'| '╺'| '╻'| '╸'| '┓'| '┏'| '┗'| '┛'| '━'| '┃'
interface Node {
  value: Pipe,
  isVisited: boolean
}

export const validate = (map: Pipe[][], startPos: { row: number, col: number }): boolean => {
  const nodeMap: Node[][] = map.map(item => item.map((value) => ({ value, isVisited: false })))

  const countColumn = nodeMap[0].length
  const countRow = nodeMap.length

  const queue:Array<{row: number, col: number}> = [startPos]
  let countConnectors = 0
  while (queue.length !== 0) {
    const current = queue.shift()
    if (!current) {
      break
    }

    const node = nodeMap[current.row][current.col]
    const nodeConnectors = mapConnections[node.value]
    node.isVisited = true
    countConnectors++
    const neighborTop = current.row > 0 ? nodeMap[current.row - 1][current.col] : undefined
    const neighborLeft = current.col > 0 ? nodeMap[current.row][current.col - 1] : undefined
    const neighborBottom = current.row < countRow - 1 ? nodeMap[current.row + 1][current.col] : undefined
    const neighborRight = current.col < countColumn - 1 ? nodeMap[current.row][current.col + 1] : undefined

    if (nodeConnectors[NodePosition.top] && neighborTop && !neighborTop.isVisited && mapConnections[neighborTop.value][NodePosition.bottom]) {
      queue.push({ row: current.row - 1, col: current.col })
    }

    if (nodeConnectors[NodePosition.left] && neighborLeft && !neighborLeft.isVisited && mapConnections[neighborLeft.value][NodePosition.right]) {
      queue.push({ row: current.row, col: current.col - 1 })
    }

    if (nodeConnectors[NodePosition.bottom] && neighborBottom && !neighborBottom.isVisited && mapConnections[neighborBottom.value][NodePosition.top]) {
      queue.push({ row: current.row + 1, col: current.col })
    }

    if (nodeConnectors[NodePosition.right] && neighborRight && !neighborRight.isVisited && mapConnections[neighborRight.value][NodePosition.left]) {
      queue.push({ row: current.row, col: current.col + 1 })
    }
  }

  return countConnectors === countColumn * countRow
}
