import { Transport } from './Transport'
import { parseGameMessage } from '../Utils'
import { action, makeObservable, observable, runInAction } from 'mobx'
import { Pipe } from './Verification'

export enum GameCommand {
  New = 'new',
  Map = 'map',
  Verify = 'verify',
  Rotate = 'rotate'
}

export enum Phase { MainMenu, Game}

export class PlumberGameStore {
  phase: Phase = Phase.MainMenu

  map: Pipe[][] = []

  isBusy: boolean = true

  private transport: Transport

  constructor (url: string) {
    this.transport = new Transport(url)
    makeObservable(this, {
      phase: observable,
      map: observable,
      isBusy: observable,
      handleMessage: action,
      startNewGame: action,
      handleOpenConnection: action,
      close: action
    })
    this.transport.subscribe({ event: 'message', func: this.handleMessage.bind(this) })
    this.transport.subscribe({ event: 'open', func: this.handleOpenConnection.bind(this) })

    this.transport.connect()
  }

  handleOpenConnection (data:{type: string}) {
    if (data.type === 'open') {
      this.isBusy = false
    } else {
      console.error('Error Connection')
    }
  }

  handleMessage (event: { data?: string }) {
    if (!event.data) { return }
    const data = parseGameMessage(event.data)

    runInAction(() => {
      switch (data.command) {
        case GameCommand.New:
          this.isBusy = false
          this.phase = data.result[0] === 'OK' ? Phase.Game : Phase.MainMenu
          break
        case GameCommand.Map:
          this.map = data.result[0].split('\n').map(item => item.split('') as Pipe[])
          break
        case GameCommand.Rotate:
          if (data.result[0] !== 'OK') {
            this.getMap()
          }
          break
        case GameCommand.Verify:
          if (data.result[0] === 'Correct! Password') {
            alert(data.result.join(':'))
            this.close()
          }
          break
        default:
          console.warn('Unhandled Message', event)
      }
    })
  }

  startNewGame (level: string) {
    this.isBusy = true
    this.transport.sendMessage(`${GameCommand.New} ${level}`)
  }

  getMap () {
    this.transport.sendMessage(GameCommand.Map)
  }

  rotate (x:number, y:number) {
    this.transport.sendMessage(`${GameCommand.Rotate} ${x} ${y}`)
  }

  verify () {
    this.transport.sendMessage(GameCommand.Verify)
  }

  close () {
    this.phase = Phase.MainMenu
    this.map = []
    this.isBusy = true
    this.transport.connect()
  }
}
