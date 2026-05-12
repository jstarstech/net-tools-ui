import { beforeEach, afterEach, vi } from 'vitest'
import { config } from '@vue/test-utils'

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const matchMedia = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn()
}))

vi.stubGlobal('ResizeObserver', MockResizeObserver)
vi.stubGlobal('matchMedia', matchMedia)

const passthroughStub = {
  template: '<div><slot /></div>'
}

config.global.stubs = {
  'connection-info': true,
  'v-container': passthroughStub,
  'v-row': passthroughStub,
  'v-col': passthroughStub,
  'v-tabs': passthroughStub,
  'v-tab': passthroughStub,
  'v-window': passthroughStub,
  'v-window-item': passthroughStub,
  'v-table': passthroughStub,
  'v-divider': passthroughStub,
  'v-card': passthroughStub,
  'v-card-text': passthroughStub,
  'v-card-actions': passthroughStub,
  'v-spacer': passthroughStub,
  'v-progress-circular': passthroughStub,
  'v-checkbox': passthroughStub,
  'v-text-field': {
    props: ['modelValue'],
    template: '<input :value="modelValue" />'
  },
  'v-btn': {
    template: '<button type="button"><slot /></button>'
  },
  'v-icon': {
    template: '<i><slot /></i>'
  }
}

beforeEach(() => {
  vi.restoreAllMocks()
})

afterEach(() => {
  document.body.innerHTML = ''
  vi.clearAllTimers()
})
