type SocketHandler = (message: unknown) => void
type SocketListener = (...args: never[]) => void

type UserInputData = {
  address_lookup: string
  domain_whois: boolean
  dns_records: boolean
  network_whois: boolean
  traceroute: boolean
  service_scan: boolean
  spamdblookup: boolean
}

type MockSocket = {
  sendBuffer: unknown[]
  on(event: string, handler: SocketListener): MockSocket
  connect(): MockSocket
  emit(event: string, message?: unknown): MockSocket
}

function createAddressLookupData(input: string) {
  const firstIp = input === '203.0.113.7' ? '198.51.100.11' : '203.0.113.7'

  return {
    hostname: input,
    domain: input,
    ip: input,
    ptr_name: `${input}.in-addr.arpa`,
    cname: `${input}.example.test`,
    hostnames: [input],
    addresses: [firstIp],
    found: true
  }
}

function createDnsRecord(input: string) {
  return {
    name: input,
    type: 1,
    RRType: 'A',
    address: '203.0.113.7',
    ttl: 300,
    ns_ip: '203.0.113.7'
  }
}

function createTracerouteHop() {
  return {
    hop: 1,
    ip: '203.0.113.7',
    rtt1: '12 ms'
  }
}

function emitMockResponse(
  handlers: Map<string, SocketHandler[]>,
  event: string,
  message: unknown
) {
  const callbacks = handlers.get(event)

  if (!callbacks) {
    return
  }

  for (const callback of callbacks) {
    callback(message)
  }
}

function scheduleMessageResponse(
  handlers: Map<string, SocketHandler[]>,
  payload: UserInputData
) {
  const addressLookupData = createAddressLookupData(payload.address_lookup)
  const hasDnsRecords = payload.dns_records
  const hasTraceroute = payload.traceroute

  window.setTimeout(() => {
    emitMockResponse(handlers, 'address_lookup', {
      state: 'complete',
      data: addressLookupData
    })

    if (payload.domain_whois) {
      emitMockResponse(handlers, 'domain_whois', {
        state: 'complete',
        data: {
          data: `Domain whois for ${payload.address_lookup}`
        }
      })
    }

    if (payload.network_whois) {
      emitMockResponse(handlers, 'network_whois', {
        state: 'complete',
        data: {
          data: `Network whois for ${payload.address_lookup}`
        }
      })
    }

    if (hasDnsRecords) {
      emitMockResponse(handlers, 'dns_records', {
        state: 'complete',
        data: {
          records: [createDnsRecord(payload.address_lookup)]
        }
      })
    }

    if (hasTraceroute) {
      emitMockResponse(handlers, 'traceroute_hop', {
        state: 'working',
        hop: createTracerouteHop()
      })

      emitMockResponse(handlers, 'traceroute', {
        state: 'complete',
        data: {
          domain: payload.address_lookup,
          hostname: payload.address_lookup,
          hostnames: [payload.address_lookup],
          addresses: [addressLookupData.addresses[0]],
          ip: addressLookupData.addresses[0]
        }
      })
    }

    if (payload.service_scan) {
      emitMockResponse(handlers, 'service_scan', {
        state: 'complete',
        data: {
          data: `Service scan for ${payload.address_lookup}`,
          service: 'mock'
        }
      })
    }

    if (payload.spamdblookup) {
      emitMockResponse(handlers, 'spamdblookup', {
        state: 'complete',
        data: {
          domain: payload.address_lookup,
          hostname: payload.address_lookup,
          hostnames: [payload.address_lookup],
          addresses: [addressLookupData.addresses[0]],
          ip: addressLookupData.addresses[0],
          results: []
        }
      })
    }

    emitMockResponse(handlers, 'complete', {
      state: 'complete'
    })
  }, 150)
}

export function createE2EMockSocket(): MockSocket {
  const handlers = new Map<string, SocketHandler[]>()

  return {
    sendBuffer: [],
    on(event: string, handler: SocketListener) {
      const callbacks = handlers.get(event) ?? []
      callbacks.push(handler as SocketHandler)
      handlers.set(event, callbacks)

      return this
    },
    connect() {
      window.setTimeout(() => {
        emitMockResponse(handlers, 'connect', undefined)
      }, 0)

      return this
    },
    emit(event: string, message?: unknown) {
      if (event === 'message') {
        scheduleMessageResponse(handlers, message as UserInputData)
      }

      return this
    }
  }
}
