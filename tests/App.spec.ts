import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import App from '@/App.vue'

const socketMock = vi.hoisted(() => {
  type SocketHandler = (...args: any[]) => void
  const handlers = new Map<string, SocketHandler[]>()
  const socket = {
    sendBuffer: [] as unknown[],
    handlers,
    on: vi.fn((event: string, handler: SocketHandler) => {
      const callbacks = handlers.get(event) ?? []
      callbacks.push(handler)
      handlers.set(event, callbacks)

      return socket
    }),
    connect: vi.fn(),
    emit: vi.fn()
  }

  socket.connect.mockReturnValue(socket)
  socket.emit.mockReturnValue(socket)

  return socket
})

vi.mock('@/lib/socket', () => ({
  socket: socketMock,
  setSocketToken: vi.fn()
}))

const initResponse = {
  token: 'test-token',
  year: '2026',
  remoteAddress: '198.51.100.24'
}

async function mountApp() {
  const wrapper = mount(App, {
    attachTo: document.body,
    global: {}
  })

  await flushPromises()
  emitSocketEvent('connect')
  await wrapper.vm.$nextTick()

  return wrapper
}

function emitSocketEvent(event: string, ...args: unknown[]) {
  const callbacks = socketMock.handlers.get(event) ?? []

  for (const callback of callbacks) {
    callback(...args)
  }
}

async function prepareLookupState(wrapper: Awaited<ReturnType<typeof mountApp>>) {
  emitSocketEvent('address_lookup', {
    state: 'complete',
    data: {
      hostname: 'example.test',
      domain: 'example.test',
      ip: 'example.test',
      ptr_name: 'example.test',
      cname: 'example.test',
      hostnames: ['example.test'],
      addresses: ['203.0.113.7'],
      found: true
    }
  })
  emitSocketEvent('complete', { state: 'complete' })

  await wrapper.vm.$nextTick()
}

beforeEach(() => {
  vi.restoreAllMocks()
  socketMock.sendBuffer = []
  socketMock.handlers.clear()
  vi.clearAllMocks()
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      json: async () => initResponse
    }))
  )
  vi.spyOn(window, 'confirm').mockReturnValue(true)
})

describe('App.vue lookup shortcuts', () => {
  it('confirms address lookup IP click and runs lookup immediately', async () => {
    const wrapper = await mountApp()
    await prepareLookupState(wrapper)

    await wrapper.get('[data-testid="address-lookup-ip"]').trigger('click')

    expect(window.confirm).toHaveBeenCalledWith(
      'Do you want to use 203.0.113.7 in the main input field?'
    )
    expect(socketMock.emit).toHaveBeenCalledTimes(1)
    expect(socketMock.emit).toHaveBeenCalledWith(
      'message',
      expect.objectContaining({
        address_lookup: '203.0.113.7'
      })
    )
  })

  it('does not change the input or start lookup when confirm is cancelled', async () => {
    window.confirm.mockReturnValueOnce(false)

    const wrapper = await mountApp()
    await prepareLookupState(wrapper)

    await wrapper.get('[data-testid="address-lookup-ip"]').trigger('click')

    expect(window.confirm).toHaveBeenCalled()
    expect(socketMock.emit).not.toHaveBeenCalled()
  })

  it.each(['A', 'AAAA', 'PTR', 'NS'] as const)(
    'makes %s DNS record values clickable and runs lookup',
    async (rrType) => {
      const wrapper = await mountApp()

      emitSocketEvent('dns_records', {
        state: 'complete',
        data: {
          records: [
            {
              name: 'example.test',
              RRType: rrType,
              address: '203.0.113.7',
              ttl: 300,
              type: 1,
              ns_ip: '203.0.113.7'
            }
          ]
        }
      })
      emitSocketEvent('complete', { state: 'complete' })

      await wrapper.vm.$nextTick()

      await wrapper.get('[data-testid="dns-record-ip"]').trigger('click')

      expect(window.confirm).toHaveBeenCalledWith(
        'Do you want to use 203.0.113.7 in the main input field?'
      )
      expect(socketMock.emit).toHaveBeenCalledWith(
        'message',
        expect.objectContaining({ address_lookup: '203.0.113.7' })
      )
    }
  )

  it('keeps traceroute star plain text and makes real hop IP clickable', async () => {
    const wrapper = await mountApp()

    emitSocketEvent('traceroute', {
      state: 'complete',
      data: {
        ip: '203.0.113.7',
        hostname: 'example.test',
        domain: 'example.test',
        hostnames: ['example.test'],
        addresses: ['203.0.113.7']
      }
    })
    emitSocketEvent('traceroute_hop', {
      state: 'working',
      hop: { hop: 1, ip: '*', rtt1: '*' }
    })
    emitSocketEvent('traceroute_hop', {
      state: 'working',
      hop: { hop: 2, ip: '203.0.113.9', rtt1: '12 ms' }
    })
    emitSocketEvent('complete', { state: 'complete' })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('*')
    expect(wrapper.find('[data-testid="traceroute-hop-ip"]').exists()).toBe(true)

    await wrapper.get('[data-testid="traceroute-hop-ip"]').trigger('click')

    expect(window.confirm).toHaveBeenCalledWith(
      'Do you want to use 203.0.113.9 in the main input field?'
    )
    expect(socketMock.emit).toHaveBeenCalledWith(
      'message',
      expect.objectContaining({ address_lookup: '203.0.113.9' })
    )
  })
})
