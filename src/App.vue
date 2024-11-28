<script setup lang="ts">
import './assets/main.css'
import ConnectionInfo from './components/ConnectionInfo.vue'
</script>

<template id="app">
  <v-container>
    <h1 class="text-h2 text-grey-darken-4">NetTools</h1>

    <v-row>
      <v-col sm="10" md="8" lg="6" class="d-flex align-center pb-0">
        <v-text-field
          label="URL or IP or Domain"
          density="compact"
          hide-details
          :error="state === 'input_error'"
          v-model="service.address_lookup.input"
        />
        <v-btn
          class="ma-2"
          size="large"
          color="#2185d0"
          :disabled="!isConnected || state === 'working'"
          @click="getData()"
        >
          GO
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="10" md="8" lg="6" class="d-flex align-center pt-0">
        <span
          class="text-blue-grey-darken-1 your-ip"
          @click="service.address_lookup.input = remoteAddress"
        >
          Your IP: {{ remoteAddress }} <v-icon icon="mdi:mdi-arrow-up" />
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col xs="12" sm="10" md="8" lg="6">
        <v-row>
          <v-col md="4" class="d-flex align-center pt-0 pb-0 px-0 px-sm-3">
            <v-checkbox
              label="Domain whois"
              color="blue-grey-darken-1"
              density="compact"
              hide-details
              v-model="service.domain_whois.active"
              :disabled="state === 'working'"
              @click="activeTabSet('domain_whois')"
            />
          </v-col>
          <v-col md="4" class="d-flex align-center pt-0 pb-0 px-0 px-sm-3">
            <v-checkbox
              label="DNS Records"
              color="blue-grey-darken-1"
              density="compact"
              hide-details
              v-model="service.dns_records.active"
              :disabled="state === 'working'"
              @click="activeTabSet('dns_records')"
            />
          </v-col>
          <v-col md="4" class="d-flex align-center pt-0 pb-0 px-0 px-sm-3">
            <v-checkbox
              label="Traceroute"
              color="blue-grey-darken-1"
              density="compact"
              hide-details
              v-model="service.traceroute.active"
              :disabled="state === 'working'"
              @click="activeTabSet('traceroute')"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col md="4" class="d-flex align-center pt-0 pb-0 px-0 px-sm-3">
            <v-checkbox
              label="Network whois"
              color="blue-grey-darken-1"
              density="compact"
              hide-details
              v-model="service.network_whois.active"
              :disabled="state === 'working'"
              @click="activeTabSet('network_whois')"
            />
          </v-col>
          <v-col md="4" class="d-flex align-center pt-0 pb-0 px-0 px-sm-3">
            <v-checkbox
              label="Service scan"
              color="blue-grey-darken-1"
              density="compact"
              hide-details
              v-model="service.service_scan.active"
              :disabled="state === 'working'"
              @click="activeTabSet('service_scan')"
            />
          </v-col>
          <v-col md="4" class="d-flex align-center pt-0 pb-0 px-0 px-sm-3">
            <v-checkbox
              label="SpamDB Lookup"
              color="blue-grey-darken-1"
              density="compact"
              hide-details
              v-model="service.spamdblookup.active"
              :disabled="state === 'working'"
              @click="activeTabSet('spamdblookup')"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <v-tabs v-model="activeTab" show-arrows class="text-grey-darken-1">
          <v-tab value="address_lookup">
            Address
            <v-progress-circular
              v-if="!connected || service.address_lookup.state === 'working'"
              class="ml-2"
              size="14"
              width="1"
              :color="!connected ? 'error' : ''"
              indeterminate
            />
          </v-tab>
          <v-tab v-if="service.domain_whois.active" value="domain_whois">
            Domain whois
            <v-progress-circular
              v-if="!connected || service.domain_whois.state === 'working'"
              class="ml-2"
              size="14"
              width="1"
              :color="!connected ? 'error' : ''"
              indeterminate
            />
          </v-tab>
          <v-tab v-if="service.network_whois.active" value="network_whois">
            Network whois
            <v-progress-circular
              v-if="!connected || service.network_whois.state === 'working'"
              class="ml-2"
              size="14"
              width="1"
              :color="!connected ? 'error' : ''"
              indeterminate
            />
          </v-tab>
          <v-tab v-if="service.dns_records.active" value="dns_records">
            DNS records
            <v-progress-circular
              v-if="!connected || service.dns_records.state === 'working'"
              class="ml-2"
              size="14"
              width="1"
              :color="!connected ? 'error' : ''"
              indeterminate
            />
          </v-tab>
          <v-tab v-if="service.traceroute.active" value="traceroute">
            Traceroute
            <v-progress-circular
              v-if="!connected || service.traceroute.state === 'working'"
              class="ml-2"
              size="14"
              width="1"
              :color="!connected ? 'error' : ''"
              indeterminate
            />
          </v-tab>
          <v-tab v-if="service.service_scan.active" value="service_scan">
            Service scan
            <v-progress-circular
              v-if="!connected || service.service_scan.state === 'working'"
              class="ml-2"
              size="14"
              width="1"
              :color="!connected ? 'error' : ''"
              indeterminate
            />
          </v-tab>
          <v-tab v-if="service.spamdblookup.active" value="spamdblookup">
            SpamDB Lookup
            <v-progress-circular
              v-if="!connected || service.spamdblookup.state === 'working'"
              class="ml-2"
              size="14"
              width="1"
              :color="!connected ? 'error' : ''"
              indeterminate
            />
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col md="12">
        <v-window v-model="activeTab" style="min-height: 40vh" class="text-grey-darken-2">
          <v-window-item value="address_lookup">
            <h3 class="text-h5">Address lookup</h3>
            <v-divider class="mb-6" />
            <connection-info v-if="!isConnected" />

            <v-table v-if="service.address_lookup.data && service.address_lookup.data.found">
              <tbody>
                <tr v-if="service.address_lookup.data.hostname">
                  <td>Host name</td>
                  <td>
                    <span class="ipaddr">{{ service.address_lookup.data.hostname }}</span>
                  </td>
                </tr>

                <tr v-if="service.address_lookup.data.domain">
                  <td>Domain name</td>
                  <td>
                    <span class="ipaddr">{{ service.address_lookup.data.domain }}</span>
                  </td>
                </tr>

                <tr v-if="service.address_lookup.data.ptr_name">
                  <td>PTR domain name (for {{ service.address_lookup.data.ip }})</td>
                  <td>
                    <span class="ipaddr">{{ service.address_lookup.data.ptr_name }}</span>
                  </td>
                </tr>

                <tr v-if="service.address_lookup.data.cname">
                  <td>CNAME</td>
                  <td>
                    <span class="ipaddr">{{ service.address_lookup.data.cname }}</span>
                  </td>
                </tr>

                <tr v-if="service.address_lookup.data.addresses.length">
                  <td>IP addresses</td>
                  <td>
                    <span
                      v-for="address in service.address_lookup.data.addresses"
                      :key="address"
                      class="ipaddr"
                    >
                      {{ address }};
                    </span>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-window-item>

          <v-window-item value="domain_whois">
            <h3 class="text-h5">Domain Whois record</h3>
            <v-divider class="mb-6" />
            <connection-info v-if="!isConnected" />
            <pre v-if="service.domain_whois.data.data">{{ service.domain_whois.data.data }}</pre>
          </v-window-item>

          <v-window-item value="network_whois">
            <h3 class="text-h5">Network Whois record</h3>
            <v-divider class="mb-6" />
            <connection-info v-if="!isConnected" />
            <pre v-if="service.network_whois.data.data">{{ service.network_whois.data.data }}</pre>
          </v-window-item>

          <v-window-item value="dns_records">
            <h3 class="text-h5">DNS records</h3>
            <v-divider class="mb-6" />
            <connection-info v-if="!isConnected" />

            <v-table
              v-if="service.dns_records.data.records && service.dns_records.data.records.length"
              class="dnsRecordsTable"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Value</th>
                  <th>TTL</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="x in service.dns_records.data.records" :key="x.name">
                  <tr v-if="x.RRType === 'AAAA'">
                    <td>{{ x.name }}</td>
                    <td>{{ x.RRType }}</td>
                    <td>{{ x.address }}</td>
                    <td>{{ x.ttl }}s</td>
                  </tr>

                  <tr v-if="x.RRType === 'A'">
                    <td>{{ x.name }}</td>
                    <td>{{ x.RRType }}</td>
                    <td>{{ x.address }}</td>
                    <td>{{ x.ttl }}s</td>
                  </tr>

                  <tr v-if="x.RRType === 'CNAME'">
                    <td>{{ x.name }}</td>
                    <td>{{ x.RRType }}</td>
                    <td>{{ x.data }}</td>
                    <td>{{ x.ttl }}s</td>
                  </tr>

                  <tr v-if="x.RRType === 'PTR'">
                    <td>{{ x.name }}</td>
                    <td>{{ x.RRType }}</td>
                    <td>{{ x.address }}</td>
                    <td>{{ x.ttl }}s</td>
                  </tr>

                  <tr v-if="x.RRType === 'TXT'">
                    <td>{{ x.name }}</td>
                    <td>{{ x.RRType }}</td>
                    <td>{{ x.data && x.data.length ? x.data[0] : '=' }}</td>
                    <td>{{ x.ttl }}s</td>
                  </tr>

                  <tr v-if="x.RRType === 'NS'">
                    <td>{{ x.name }}</td>
                    <td>{{ x.RRType }}</td>
                    <td>{{ x.address }}</td>
                    <td>{{ x.ttl }}s</td>
                  </tr>

                  <tr v-if="x.RRType === 'MX'">
                    <td>{{ x.name }}</td>
                    <td>{{ x.RRType }}</td>
                    <td>
                      <div><v-icon icon="mdi:mdi-menu-right" /> exchange: {{ x.exchange }}</div>
                      <div><v-icon icon="mdi:mdi-menu-right" /> priority: {{ x.priority }}</div>
                    </td>
                    <td>{{ x.ttl }}s</td>
                  </tr>

                  <tr v-if="x.RRType === 'SOA'">
                    <td>{{ x.name }}</td>
                    <td>SOA</td>
                    <td>
                      <div><v-icon icon="mdi:mdi-menu-right" /> exchange: {{ x.primary }}</div>
                      <v-divider />
                      <div><v-icon icon="mdi:mdi-menu-right" /> primary: {{ x.primary }}</div>
                      <v-divider />
                      <div><v-icon icon="mdi:mdi-menu-right" /> serial: {{ x.serial }}</div>
                      <v-divider />
                      <div><v-icon icon="mdi:mdi-menu-right" /> admin: {{ x.admin }}</div>
                      <v-divider />
                      <div><v-icon icon="mdi:mdi-menu-right" /> refresh: {{ x.refresh }}</div>
                      <v-divider />
                      <div><v-icon icon="mdi:mdi-menu-right" /> retry: {{ x.retry }}</div>
                      <v-divider />
                      <div><v-icon icon="mdi:mdi-menu-right" /> expiration: {{ x.expiration }}</div>
                      <v-divider />
                      <div><v-icon icon="mdi:mdi-menu-right" /> minimum: {{ x.minimum }}</div>
                    </td>
                    <td>{{ x.ttl }}s</td>
                  </tr>
                </template>
              </tbody>
            </v-table>
          </v-window-item>

          <v-window-item value="traceroute">
            <h3 class="text-h5">Traceroute</h3>
            <v-divider class="mb-6" />
            <connection-info v-if="!isConnected" />
            <template v-if="service.traceroute.data.ip">
              <p>
                Tracing route to
                <span class="ipaddr">
                  {{ service.traceroute.data.hostname }} [{{ service.traceroute.data.ip }}]
                </span>
                ...
              </p>
            </template>

            <v-table :class="{ hide: service.traceroute.hops.length === 0 }">
              <thead>
                <tr>
                  <th>hop</th>
                  <th>rtt</th>
                  <th>ip address</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="hop in service.traceroute.hops" :key="hop.hop">
                  <td style="width: 10%">
                    {{ hop.hop }}
                  </td>
                  <td style="width: 15%">
                    {{ hop.rtt1 }}
                  </td>
                  <td style="width: 25%">
                    {{ hop.ip }}
                  </td>
                  <td style="width: 50%">&nbsp;</td>
                </tr>
              </tbody>
            </v-table>

            <p v-if="service.traceroute.state === 'complete'">Trace complete.</p>
          </v-window-item>

          <v-window-item value="service_scan">
            <h3 class="text-h5">Service scan</h3>
            <v-divider class="mb-6" />
            <connection-info v-if="!isConnected" />

            <template
              v-if="service.service_scan.data.results && service.service_scan.data.results.length"
            >
              <v-table density="compact">
                <tbody>
                  <tr v-for="x in service.service_scan.data.results" :key="x.service">
                    <td style="min-width: 160px">{{ x.service }}:</td>
                    <td>
                      <span class="response-pre">{{ x.data }}</span>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </template>
          </v-window-item>

          <v-window-item value="spamdblookup">
            <h3 class="text-h5">Spam Databases Lookup</h3>
            <v-divider class="mb-6" />
            <connection-info v-if="!isConnected" />

            <v-table
              v-if="service.spamdblookup.data.results && service.spamdblookup.data.results.length"
            >
              <tbody>
                <tr v-for="item in service.spamdblookup.data.results" :key="item.blacklistInfo.key">
                  <td>
                    <span v-if="item.listed" class="text-red-lighten-1 font-weight-medium">
                      listed
                    </span>
                    <span v-else class="text-light-green-accent-4"> not listed </span>
                  </td>
                  <td>{{ item.address }}</td>
                  <td>
                    <template v-if="item.blacklistInfo.url">
                      <a
                        :href="item.blacklistInfo.url"
                        class="text-blue-grey-darken-1"
                        target="_blank"
                      >
                        {{ item.blacklistInfo.name }}
                      </a>
                    </template>

                    <template v-else-if="item.blacklistInfo.name">
                      {{ item.blacklistInfo.name }}
                    </template>

                    <template v-else>
                      {{ item.blacklistInfo.key }}
                    </template>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-window-item>
        </v-window>

        <v-divider class="mt-6 mb-4"></v-divider>

        <span class="text-grey-darken-2">
          &copy; 2017 - {{ year }} «<a class="text-blue-grey-darken-1" href="#">NetTools</a>»
        </span>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="reconnectDialog" width="auto" max-width="600">
    <v-card>
      <v-card-text>
        We have detected a problem with the connection to the server. Please wait a few seconds or
        <a class="text-blue-grey-darken-1" href="javascript:location.reload();">refresh</a> the page
        for a retry.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" block @click="reconnectDialog = false">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="limitReachedDialog" width="auto" max-width="600">
    <v-card>
      <v-card-text>We are so sorry. But today requests limit is reached.</v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="limitReachedDialog = false">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { io, Socket } from 'socket.io-client'

const API_URL = import.meta.env.VITE_DEV_PROXY === 'false' ? import.meta.env.VITE_API_URL : ''
const WS_URL = import.meta.env.VITE_DEV_PROXY === 'false' ? import.meta.env.VITE_WS_URL : ''

type TabState = {
  active: boolean
  state: string
  data: object
}

type TracerouteHop = {
  ip: string
  hostname: string
  hop: string
  rtt1: string
}

type TracerouteData = {
  hostname: string
  domain: string
  ip: string
  hostnames: string[]
  addresses: string[]
}

type TracerouteState = Omit<TabState, 'data'> & {
  data: TracerouteData
  hops: TracerouteHop[]
}

type ServiceScan = {
  service: string
  data: string
}

type ServiceScanState = Omit<TabState, 'data'> & {
  data: {
    results: ServiceScan[]
  }
}

type DnsRecord = {
  name: string
  type: number
  RRType: string
  address?: string
  ttl: number
  ns_ip: string
  priority?: string
  exchange?: string
  primary?: string
  admin?: string
  serial?: number
  refresh?: number
  retry?: number
  expiration?: number
  minimum?: number
  data?: string[] | string
}

type DnsRecordsState = Omit<TabState, 'data'> & {
  data: {
    records: DnsRecord[]
  }
}

type SpamDblookup = {
  listed: string
  address: string
  blacklistInfo: {
    url: string
    name: string
    key: string
  }
}

type SpamDblookupState = Omit<TabState, 'data'> & {
  data: { results: SpamDblookup[] }
}

type AddressLookupData = {
  domain: string
  hostname: string
  cname: string
  ptr_name: string
  ip: string
  found: string
  addresses: string[]
}

type AddressLookupState = Omit<TabState, 'data'> & {
  input: string
  data: AddressLookupData
}

type NetworkWhois = Omit<TabState, 'data'> & { data: { data: string } }

type ServerToClientEvents = {
  message: (message: Message) => void
}

type MessagePayload = {
  address_lookup: string
  domain_whois: boolean
  dns_records: boolean
  network_whois: boolean
  traceroute: boolean
  service_scan: boolean
  spamdblookup: boolean
}

type ClientToServerEvents = {
  message: (message: MessagePayload) => void
}

type Data = {
  token: string
  year: string
  reconnectDialog: boolean
  limitReachedDialog: boolean
  activeTab: string
  state: string
  connected: 'initial' | 'connected' | 'disconnected' | 'reconnecting'
  remoteAddress: string
  socket: Socket<ServerToClientEvents, ClientToServerEvents>
  service: {
    address_lookup: AddressLookupState
    domain_whois: Omit<TabState, 'data'> & { data: { data: string } }
    dns_records: DnsRecordsState
    network_whois: NetworkWhois
    traceroute: TracerouteState
    service_scan: ServiceScanState
    spamdblookup: SpamDblookupState
  }
}

interface Message {
  type:
    | 'address_lookup'
    | 'domain_whois'
    | 'dns_records'
    | 'network_whois'
    | 'traceroute'
    | 'service_scan'
    | 'spamdblookup'
    | 'complete'
    | 'traceroute_hop'
  state: string
  data:
    | AddressLookupData
    | ServiceScan
    | { records: DnsRecord[] }
    | { results: SpamDblookup[] }
    | { ip: string; hostname: string }
    | { data: string }
  hop?: TracerouteHop
}

export default {
  data(): Data {
    return {
      token: '',
      socket: io(WS_URL),
      year: '',
      reconnectDialog: false,
      limitReachedDialog: false,
      activeTab: 'address_lookup',
      state: 'initial',
      connected: 'initial',
      remoteAddress: '',
      service: {
        address_lookup: {
          active: true,
          state: 'initial',
          input: 'google.com',
          data: {
            domain: '',
            hostname: '',
            cname: '',
            ptr_name: '',
            ip: '',
            found: '',
            addresses: []
          }
        },
        domain_whois: {
          active: true,
          state: 'initial',
          data: {
            data: ''
          }
        },
        dns_records: {
          active: true,
          state: 'initial',
          data: {
            records: []
          }
        },
        network_whois: {
          active: true,
          state: 'initial',
          data: {
            data: ''
          }
        },
        traceroute: {
          active: true,
          state: 'initial',
          data: {
            ip: '',
            hostname: '',
            domain: '',
            hostnames: [],
            addresses: []
          },
          hops: []
        },
        service_scan: {
          active: true,
          state: 'initial',
          data: {
            results: []
          }
        },
        spamdblookup: {
          active: true,
          state: 'initial',
          data: { results: [] }
        }
      }
    }
  },
  computed: {
    isConnected() {
      return this.connected === 'connected'
    }
  },
  mounted() {
    fetch(API_URL + '/init')
      .then((response) => response.json())
      .then((data) => {
        this.token = data.token
        this.year = data.year
        this.remoteAddress = data.remoteAddress

        this.init()
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  },
  methods: {
    init() {
      this.initializeSocket()
      this.setupSocketEvents()
    },

    initializeSocket() {
      this.socket = io(WS_URL, {
        query: { token: this.token }
      })
    },

    setupSocketEvents() {
      this.socket.on('connect', () => this.onSocketConnect())
      this.socket.on('disconnect', () => this.onSocketDisconnect())
      this.socket.on('message', (msg: Message) => this.onSocketMessage(msg))
    },
    onSocketConnect() {
      this.socket.sendBuffer = []

      if (this.connected === 'reconnecting') {
        this.connected = 'reconnecting'
        this.reconnectDialog = false

        this.resetServiceData('initial')
      }

      this.connected = 'connected'
    },

    onSocketDisconnect() {
      this.reconnectDialog = true

      if (this.connected === 'connected') {
        this.connected = 'reconnecting'
      }
    },

    onSocketMessage(msg: Message): void {
      switch (msg.type) {
        case 'complete':
          this.handleCompleteMessage(msg)
          break
        case 'service_scan':
          this.handleServiceScanMessage(msg)
          break
        case 'traceroute_hop':
          this.handleTracerouteHopMessage(msg)
          break
        case 'traceroute':
          this.handleTracerouteMessage(msg)
          break
        case 'address_lookup':
          this.handleAddressLookupMessage(msg)
          break
        case 'domain_whois':
          this.handleDomainWhoisMessage(msg)
          break
        case 'network_whois':
          this.handleNetworkWhoisMessage(msg)
          break
        case 'dns_records':
          this.handleDnsRecordsMessage(msg)
          break
        case 'spamdblookup':
          this.handleSpamDblookupMessage(msg)
          break
      }
    },

    handleCompleteMessage(msg: Message) {
      this.state = msg.state

      if (this.state === 'limit') {
        this.limitReachedDialog = true

        for (const [, item] of Object.entries(this.service)) {
          item.state = 'complete'
        }
      }

      if (this.state === 'input_error') {
        for (const [, item] of Object.entries(this.service)) {
          item.state = 'complete'
        }
      }
    },

    handleServiceScanMessage(msg: Message) {
      this.service['service_scan'].state = msg.state

      if (msg.state === 'working') {
        ;(this.service['service_scan'] as ServiceScanState).data.results.push(
          msg.data as ServiceScan
        )
      }
    },

    handleTracerouteHopMessage(msg: Message) {
      if (msg.state === 'working' && msg.hop) {
        this.service['traceroute'].hops.push(msg.hop)
      }

      this.service['traceroute'].state = msg.state
    },

    handleTracerouteMessage(msg: Message) {
      this.service['traceroute'].state = msg.state

      if (msg.state === 'complete') {
        this.service['traceroute'].data = msg.data as TracerouteData
      }
    },

    handleAddressLookupMessage(msg: Message) {
      if (msg.state === 'complete') {
        this.service['address_lookup'].data = msg.data as AddressLookupData
      }

      this.service['address_lookup'].state = msg.state
    },

    handleDomainWhoisMessage(msg: Message) {
      if (msg.state === 'complete') {
        this.service['domain_whois'].data = msg.data as { data: string }
      }

      this.service['domain_whois'].state = msg.state
    },

    handleNetworkWhoisMessage(msg: Message) {
      if (msg.state === 'complete') {
        this.service['network_whois'].data = msg.data as { data: string }
      }

      this.service['network_whois'].state = msg.state
    },

    handleDnsRecordsMessage(msg: Message) {
      if (msg.state === 'complete') {
        if ((msg.data as { records: DnsRecord[] }).records) {
          this.service['dns_records'].data.records = (msg.data as { records: DnsRecord[] }).records
        }
      }

      this.service['dns_records'].state = msg.state
    },

    handleSpamDblookupMessage(msg: Message) {
      if (msg.state === 'complete') {
        this.service['spamdblookup'].data.results = (
          msg.data as { results: SpamDblookup[] }
        ).results
      }

      this.service['spamdblookup'].state = msg.state
    },
    resetServiceData(state: string = 'initial') {
      this.state = state

      for (const [, item] of Object.entries(this.service)) {
        item.state = state
      }

      this.service.address_lookup.data = {
        domain: '',
        hostname: '',
        cname: '',
        ptr_name: '',
        ip: '',
        found: '',
        addresses: []
      }
      this.service.domain_whois.data = { data: '' }
      this.service.network_whois.data = { data: '' }
      this.service.traceroute.data = {
        ip: '',
        hostname: '',
        domain: '',
        hostnames: [],
        addresses: []
      }
      this.service.traceroute.hops = []
      this.service.service_scan.data.results = []
      this.service.spamdblookup.data = { results: [] }
    },
    activeTabSet(tab: string) {
      if (this.activeTab === tab) {
        this.activeTab = 'address_lookup'
      }
    },
    getData() {
      this.resetServiceData('working')

      const message = {
        address_lookup: this.service.address_lookup.input,
        domain_whois: this.service.domain_whois.active,
        dns_records: this.service.dns_records.active,
        network_whois: this.service.network_whois.active,
        traceroute: this.service.traceroute.active,
        service_scan: this.service.service_scan.active,
        spamdblookup: this.service.spamdblookup.active
      }

      this.socket.emit('message', message)
    }
  }
}
</script>

<style>
.dnsRecordsTable th:first-child,
.dnsRecordsTable td:first-child {
  max-width: 200px;
  word-wrap: break-word;
}
.ipaddr {
  color: #576e7b;
  font-weight: 500;
  letter-spacing: 1px;
}
</style>
