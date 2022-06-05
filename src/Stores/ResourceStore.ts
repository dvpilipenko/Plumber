
import { createImage } from '../Utils'
import { action, makeAutoObservable, runInAction } from 'mobx'

const DEFAULT_IMAGE_SIZE = 132

export class ResourceStore {
  mapImages:Record<string, HTMLImageElement>
  countImages: number
  isBusy:Boolean = false

  constructor (resources:string[]) {
    this.countImages = resources.length
    if (resources.length > 0) {
      this.isBusy = true
    }

    this.mapImages = resources.reduce((acc, cur) => {
      const fileName = cur.substring(0, cur.lastIndexOf('.'))
      acc[fileName] = createImage({
        url: cur,
        onLoad: this.onLoad,
        width: DEFAULT_IMAGE_SIZE,
        height: DEFAULT_IMAGE_SIZE
      })
      return acc
    }, {} as Record<string, HTMLImageElement>)

    makeAutoObservable(this, { onLoad: action })
  }

  onLoad = () => {
    this.countImages--
    if (this.countImages === 0) {
      runInAction(() => {
        this.isBusy = false
      })
    }
  }
}
