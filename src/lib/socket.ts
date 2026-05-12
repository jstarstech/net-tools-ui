import { io } from 'socket.io-client'
import { createE2EMockSocket } from './e2eMockSocket'

const WS_URL = import.meta.env.VITE_DEV_PROXY === 'false' ? import.meta.env.VITE_WS_URL : ''

let token = ''

const isE2EMock = import.meta.env.VITE_E2E_MOCK === 'true'

export function setSocketToken(nextToken: string) {
  token = nextToken
}

export const socket = isE2EMock
  ? createE2EMockSocket()
  : io(WS_URL, {
      autoConnect: false,
      auth: (callback) => {
        callback({ token })
      }
    })
