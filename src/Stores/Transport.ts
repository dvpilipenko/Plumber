type SubscribeEvent = 'message' | 'error' | 'close' | 'open'
interface ObserverItem {
  func: (data:any) => void,
  event: SubscribeEvent
}

export class Transport {
  url = ''
  private socket: WebSocket | null = null
  private observers:ObserverItem[] = []

  connect = (): void => {
    if (this.socket !== null) {
      this.socket.close()
    }
    this.socket = new WebSocket(this.url)
    this.socket.addEventListener('message', this.messageHandler.bind(this))
    this.socket.addEventListener('error', this.errorHandler.bind(this))
    this.socket.addEventListener('close', this.closeHandler.bind(this))
    this.socket.addEventListener('open', this.openHandler.bind(this))
  }

  subscribe (observer:ObserverItem) {
    this.observers.push(observer)
  }

  unsubscribe (func:(data:any) => void) {
    this.observers = this.observers.filter(subscriber => subscriber.func !== func)
  }

  private broadcast (data:any, event: SubscribeEvent) {
    const filtered = this.observers.filter(item => item.event === event)
    filtered.forEach(subscriber => subscriber.func(data))
  }

  errorHandler (data: any) {
    this.broadcast(data, 'error')
    console.log(data)
  }

  messageHandler (data: any) {
    this.broadcast(data, 'message')
  }

  closeHandler (data: any) {
    console.log(data)
  }

  openHandler (data: any) {
    this.broadcast(data, 'open')
  }

  sendMessage (command: string) {
    this.socket?.send(command)
  }

  constructor (url: string) {
    this.url = url
  }
}
