import { Pipe } from './Stores/Verification'
export enum NodePosition {
  top='top',
  right ='right',
  bottom = 'bottom',
  left ='left',
}

export const rotateMap:Record<Pipe, Pipe> = {
  '╋': '╋',

  '┫': '┻',
  '┣': '┳',
  '┻': '┣',
  '┳': '┫',

  '╹': '╺',
  '╺': '╻',
  '╻': '╸',
  '╸': '╹',

  '┓': '┛',
  '┏': '┓',
  '┗': '┏',
  '┛': '┗',

  '━': '┃',
  '┃': '━'

}

export const mapConnections: Record<Pipe, Record<string, boolean>> = {
  '╋': {
    [NodePosition.left]: true,
    [NodePosition.bottom]: true,
    [NodePosition.right]: true,
    [NodePosition.top]: true
  },
  '┫': {
    [NodePosition.bottom]: true,
    [NodePosition.left]: true,
    [NodePosition.top]: true

  },
  '┣': {
    [NodePosition.bottom]: true,
    [NodePosition.right]: true,
    [NodePosition.top]: true
  },
  '┻': {
    [NodePosition.right]: true,
    [NodePosition.top]: true,
    [NodePosition.left]: true
  },
  '┳': {
    [NodePosition.bottom]: true,
    [NodePosition.left]: true,
    [NodePosition.right]: true
  },
  '╹': {
    [NodePosition.top]: true
  },
  '╺': {
    [NodePosition.right]: true
  },
  '╻': {
    [NodePosition.bottom]: true
  },
  '╸': {
    [NodePosition.left]: true
  },
  '┓': {
    [NodePosition.left]: true,
    [NodePosition.bottom]: true
  },
  '┏': {
    [NodePosition.bottom]: true,
    [NodePosition.right]: true
  },
  '┗': {
    [NodePosition.right]: true,
    [NodePosition.top]: true
  },
  '┛': {
    [NodePosition.left]: true,
    [NodePosition.top]: true
  },
  '━': {
    [NodePosition.right]: true,
    [NodePosition.left]: true
  },
  '┃': {
    [NodePosition.top]: true,
    [NodePosition.bottom]: true
  }
}
