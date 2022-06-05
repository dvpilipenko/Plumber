import { ResourceStore } from './ResourceStore'
import { Pipe } from './Verification'

export interface RenderMargin {
    left: number,
    top: number,
    maxLeft: number,
    maxTop: number
}

export const RECT_SIZE = 45

export class CanvasStore {
  private isDrawScheduled: boolean = false
  private readonly canvasContext: CanvasRenderingContext2D
  private readonly invisibleCanvas:HTMLCanvasElement = document.createElement('canvas')
  private readonly invisibleContext: CanvasRenderingContext2D
  map: Pipe[][]

  canvasMargins: RenderMargin = {
    left: 0,
    top: 0,
    maxLeft: 0,
    maxTop: 0
  }

  constructor (private readonly canvasElement: HTMLCanvasElement,
               private readonly countRow: number,
               private readonly countColumn: number,
               map: Pipe[][],
               private readonly resourceStore: Pick<ResourceStore, 'mapImages'>) {
    this.map = JSON.parse(JSON.stringify(map))
    this.canvasContext = canvasElement.getContext('2d')!
    this.invisibleContext = this.invisibleCanvas.getContext('2d')!
    this.canvasContext.imageSmoothingEnabled = false
    this.invisibleContext.imageSmoothingEnabled = false
    this.resize()
  }

  clear = () => {
    this.canvasContext.clearRect(0, 0, this.canvasElement.height, this.canvasElement.height)
  }

  draw = () => {
    this.clear()

    const countForRenderRow = Math.round((-this.canvasMargins.top + this.canvasElement.height + RECT_SIZE) / RECT_SIZE)
    const countForRenderCol = Math.round((-this.canvasMargins.left + this.canvasElement.width + RECT_SIZE) / RECT_SIZE)

    const startRow = this.canvasMargins.top > 0 ? 0 : Math.floor(-this.canvasMargins.top / RECT_SIZE)
    const startColumn = this.canvasMargins.left > 0 ? 0 : Math.floor(-this.canvasMargins.left / RECT_SIZE)

    for (let row = startRow; (row < countForRenderRow) && (row < this.countRow); row++) {
      for (let col = startColumn; (col < countForRenderCol) && (col < this.countColumn); col++) {
        const image = this.resourceStore.mapImages[this.map[row][col]]
        const x = this.canvasMargins.left + (col * RECT_SIZE)
        const y = this.canvasMargins.top + (row * RECT_SIZE)
        if (image) {
          this.invisibleContext.drawImage(image, x, y, RECT_SIZE, RECT_SIZE)
        } else {
          this.canvasContext.fillRect(x, y, RECT_SIZE, RECT_SIZE)
        }
      }
    }

    const imageData = this.invisibleContext.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height)
    this.canvasContext.putImageData(imageData, 0, 0)
  }

  get isForbiddenHorizontalDrag (): boolean {
    return this.canvasElement.width > RECT_SIZE * this.countColumn
  }

  get isForbiddenVerticalDrag (): boolean {
    return this.canvasElement.height > RECT_SIZE * this.countRow
  }

  resize = () => {
    const height = window.getComputedStyle(this.canvasElement).height.slice(0, -2)
    const width = window.getComputedStyle(this.canvasElement).width.slice(0, -2)

    this.canvasElement.width = Math.floor(Number(width))
    this.canvasElement.height = Math.floor(Number(height))

    this.invisibleCanvas.width = Math.floor(Number(width))
    this.invisibleCanvas.height = Math.floor(Number(height))

    if (this.isForbiddenHorizontalDrag) {
      this.canvasMargins.left = (this.canvasElement.width - (RECT_SIZE * this.countColumn)) / 2
    }

    if (this.isForbiddenVerticalDrag) {
      this.canvasMargins.top = (this.canvasElement.height - (RECT_SIZE * this.countRow)) / 2
    }

    this.canvasMargins.maxLeft = (RECT_SIZE * this.countColumn) - this.canvasElement.width
    this.canvasMargins.maxTop = (RECT_SIZE * this.countRow) - this.canvasElement.height

    this.scheduleDraw()
  }

  scheduleDraw (): void {
    if (this.isDrawScheduled) {
      return
    }
    this.isDrawScheduled = true
    window.requestAnimationFrame(() => {
      this.isDrawScheduled = false
      this.draw()
    })
  }
}
