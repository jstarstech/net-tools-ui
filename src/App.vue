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
          v-model="form.address_lookup.input"
        />
        <v-btn
          class="ma-2"
          size="large"
          color="#2185d0"
          :disabled="state === 'working'"
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
          @click="form.address_lookup.input = remoteAddress"
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
              v-model="form.domain_whois.active"
              :disabled="state === 'working'"
              @click="activeTabSet('domain_whois')"
            />
          </v-col>
          <v-col md="4" class="d-flex align-center pt-0 pb-0 px-0 px-sm-3">
            <v-checkbox
              label="DNS records"
              color="blue-grey-darken-1"
              density="compact"
              hide-details
              v-model="form.dns_records.active"
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
              v-model="form.traceroute.active"
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
              v-model="form.network_whois.active"
              :disabled="state === 'working'"
              @click="activeTabSet('network_whois')"
            ></v-checkbox>
          </v-col>
          <v-col md="4" class="d-flex align-center pt-0 pb-0 px-0 px-sm-3">
            <v-checkbox
              label="Service scan"
              color="blue-grey-darken-1"
              density="compact"
              hide-details
              v-model="form.service_scan.active"
              :disabled="state === 'working'"
              @click="activeTabSet('service_scan')"
            ></v-checkbox>
          </v-col>
          <v-col md="4" class="d-flex align-center pt-0 pb-0 px-0 px-sm-3">
            <v-checkbox
              label="SpamDB Lookup"
              color="blue-grey-darken-1"
              density="compact"
              hide-details
              v-model="form.spamdblookup.active"
              :disabled="state === 'working'"
              @click="activeTabSet('spamdblookup')"
            ></v-checkbox>
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
              v-if="!connected || form.address_lookup.state === 'working'"
              class="ml-2"
              size="14"
              width="1"
              :color="!connected ? 'error' : ''"
              indeterminate
            />
          </v-tab>
          <v-tab v-if="form.domain_whois.active" value="domain_whois">
            Domain whois
            <v-progress-circular
              v-if="!connected || form.domain_whois.state === 'working'"
              class="ml-2"
              size="14"
              width="1"
              :color="!connected ? 'error' : ''"
              indeterminate
            />
          </v-tab>
          <v-tab v-if="form.network_whois.active" value="network_whois">
            Network whois
            <v-progress-circular
              v-if="!connected || form.network_whois.state === 'working'"
              class="ml-2"
              size="14"
              width="1"
              :color="!connected ? 'error' : ''"
              indeterminate
            />
          </v-tab>
          <v-tab v-if="form.dns_records.active" value="dns_records">
            DNS records
            <v-progress-circular
              v-if="!connected || form.dns_records.state === 'working'"
              class="ml-2"
              size="14"
              width="1"
              :color="!connected ? 'error' : ''"
              indeterminate
            />
          </v-tab>
          <v-tab v-if="form.traceroute.active" value="traceroute">
            Traceroute
            <v-progress-circular
              v-if="!connected || form.traceroute.state === 'working'"
              class="ml-2"
              size="14"
              width="1"
              :color="!connected ? 'error' : ''"
              indeterminate
            />
          </v-tab>
          <v-tab v-if="form.service_scan.active" value="service_scan">
            Service scan
            <v-progress-circular
              v-if="!connected || form.service_scan.state === 'working'"
              class="ml-2"
              size="14"
              width="1"
              :color="!connected ? 'error' : ''"
              indeterminate
            />
          </v-tab>
          <v-tab v-if="form.spamdblookup.active" value="spamdblookup">
            SpamDB Lookup
            <v-progress-circular
              v-if="!connected || form.spamdblookup.state === 'working'"
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
            <connection-info v-if="!connected" />

            <v-table v-if="form.address_lookup.data && form.address_lookup.data.found">
              <tbody>
                <tr v-if="form.address_lookup.data.hostname">
                  <td>Host name</td>
                  <td>
                    <span class="ipaddr">{{ form.address_lookup.data.hostname }}</span>
                  </td>
                </tr>

                <tr v-if="form.address_lookup.data.domain">
                  <td>Domain name</td>
                  <td>
                    <span class="ipaddr">{{ form.address_lookup.data.domain }}</span>
                  </td>
                </tr>

                <tr v-if="form.address_lookup.data.ptr_name">
                  <td>PTR domain name (for {{ form.address_lookup.data.ip }})</td>
                  <td>
                    <span class="ipaddr">{{ form.address_lookup.data.ptr_name }}</span>
                  </td>
                </tr>

                <tr v-if="form.address_lookup.data.cname.length">
                  <td>CNAME</td>
                  <td>
                    <span
                      v-for="address in form.address_lookup.data.cname"
                      :key="address"
                      class="ipaddr"
                      >{{ address }}</span
                    >;
                  </td>
                </tr>

                <tr v-if="form.address_lookup.data.addresses.length">
                  <td>IP addresses</td>
                  <td>
                    <span
                      v-for="address in form.address_lookup.data.addresses"
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
            <connection-info v-if="!connected" />
            <pre v-if="form.domain_whois.data.data">{{ form.domain_whois.data.data }}</pre>
          </v-window-item>

          <v-window-item value="network_whois">
            <h3 class="text-h5">Network Whois record</h3>
            <v-divider class="mb-6" />
            <connection-info v-if="!connected" />
            <pre v-if="form.network_whois.data.data">{{ form.network_whois.data.data }}</pre>
          </v-window-item>

          <v-window-item value="dns_records">
            <h3 class="text-h5">DNS records</h3>
            <v-divider class="mb-6" />
            <connection-info v-if="!connected" />

            <v-table v-if="form.dns_records.data.records && form.dns_records.data.records.length">
              <thead>
                <tr>
                  <th class="six wide">Name</th>
                  <th class="one wide">Type</th>
                  <th class="six wide">Value</th>
                  <th class="two wide">TTL</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="x in form.dns_records.data.records" :key="x.name">
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
                    <td>{{ x.data }}</td>
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
                    <td>{{ x.data }}</td>
                    <td>{{ x.ttl }}s</td>
                  </tr>

                  <tr v-if="x.RRType === 'MX'">
                    <td>{{ x.name }}</td>
                    <td>{{ x.RRType }}</td>
                    <td>
                      <div class="ui celled list">
                        <div class="item">
                          <i class="caret right icon" />
                          <div class="content">exchange: {{ x.exchange }}</div>
                        </div>
                        <div class="item">
                          <i class="caret right icon" />
                          <div class="content">priority: {{ x.priority }}</div>
                        </div>
                      </div>
                    </td>
                    <td>{{ x.ttl }}s</td>
                  </tr>

                  <tr v-if="x.RRType === 'SOA'">
                    <td>{{ x.name }}</td>
                    <td>SOA</td>
                    <td>
                      <div class="ui celled list">
                        <div class="item">
                          <i class="caret right icon" />
                          <div class="content">primary: {{ x.primary }}</div>
                        </div>
                        <div class="item">
                          <i class="caret right icon" />
                          <div class="content">serial: {{ x.serial }}</div>
                        </div>
                        <div class="item">
                          <i class="caret right icon" />
                          <div class="content">admin: {{ x.admin }}</div>
                        </div>
                        <div class="item">
                          <i class="caret right icon" />
                          <div class="content">refresh: {{ x.refresh }}</div>
                        </div>
                        <div class="item">
                          <i class="caret righ t icon" />
                          <div class="content">retry: {{ x.retry }}</div>
                        </div>
                        <div class="item">
                          <i class="caret right icon" />
                          <div class="content">expiration: {{ x.expiration }}</div>
                        </div>
                        <div class="item">
                          <i class="caret right icon" />
                          <div class="content">minimum: {{ x.minimum }}</div>
                        </div>
                      </div>
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
            <connection-info v-if="!connected" />
            <template v-if="form.traceroute.data.ip">
              <p>
                Tracing route to
                <span class="ipaddr">
                  {{ form.traceroute.data.hostname }} [{{ form.traceroute.data.ip }}]
                </span>
                ...
              </p>
            </template>

            <v-table :class="{ hide: form.traceroute.hops.length === 0 }">
              <thead>
                <tr>
                  <th>hop</th>
                  <th>rtt</th>
                  <th>ip address</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="hop in form.traceroute.hops" :key="hop.hop">
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

            <p v-if="form.traceroute.state === 'complete'">Trace complete.</p>
          </v-window-item>

          <v-window-item value="service_scan">
            <h3 class="text-h5">Service scan</h3>
            <v-divider class="mb-6" />
            <connection-info v-if="!connected" />

            <template
              v-if="form.service_scan.data.results && form.service_scan.data.results.length"
            >
              <v-table density="compact">
                <tbody>
                  <tr v-for="x in form.service_scan.data.results" :key="x.service">
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
            <connection-info v-if="!connected" />

            <v-table v-if="form.spamdblookup.data.results && form.spamdblookup.data.results.length">
              <tbody>
                <tr v-for="item in form.spamdblookup.data.results" :key="item.blacklistInfo.key">
                  <td>
                    <span v-if="item.listed" style="color: #e80000; font-weight: bold">listed</span>
                    <span v-else style="color: #00d700">not listed</span>
                  </td>
                  <td>{{ item.address }}</td>
                  <td>
                    <template v-if="item.blacklistInfo.url">
                      <a :href="item.blacklistInfo.url" target="_blank">{{
                        item.blacklistInfo.name
                      }}</a>
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

type TracerouteState = Omit<TabState, 'data'> & {
  data: { ip: string; hostname: string }
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

type Data = {
  token: string
  year: string
  reconnectDialog: boolean
  limitReachedDialog: boolean
  activeTab: string
  state: string
  connected: boolean
  remoteAddress: string
  socket: Socket
  form: {
    address_lookup: AddressLookupState
    domain_whois: Omit<TabState, 'data'> & { data: { data: string } }
    dns_records: DnsRecordsState
    network_whois: NetworkWhois
    traceroute: TracerouteState
    service_scan: ServiceScanState
    spamdblookup: SpamDblookupState
  }
}

export default {
  data(): Data {
    return {
      token: '',
      year: '',
      reconnectDialog: false,
      limitReachedDialog: false,
      activeTab: 'address_lookup',
      state: 'initial',
      connected: true,
      remoteAddress: '',
      form: {
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
          data: { ip: '', hostname: '' },
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
      },
      socket: io()
    }
  },
  mounted() {
    fetch('/init')
      .then((response) => response.json())
      .then((data) => {
        this.token = data.token
        this.year = data.year
        this.remoteAddress = data.remoteAddress

        this.init()
      })
  },
  methods: {
    init: function () {
      this.socket = io({
        query: { token: this.token }
      })

      this.socket.on('connect', () => {
        this.socket.sendBuffer = []
        this.connected = true
      })

      this.socket.on('disconnect', () => {
        this.reconnectDialog = true
        this.connected = false
      })

      this.socket.on('reconnect', () => {
        this.socket.sendBuffer = []
        this.state = 'initial'

        for (const [key, item] of Object.entries(this.form)) {
          item.state = 'initial'

          if (key === 'service_scan') {
            ;(item as ServiceScanState).data = { results: [] }
          } else if (key === 'spamdblookup') {
            ;(item as SpamDblookupState).data = { results: [] }
          } else if (key === 'traceroute') {
            ;(item as TracerouteState).data = { ip: '', hostname: '' }
            ;(item as TracerouteState).hops = []
          }
        }

        this.form.service_scan.data.results = []
        this.form.traceroute.hops = []

        this.reconnectDialog = false

        this.connected = true
      })

      this.socket.on(
        'message',
        (msg: {
          type: string
          state: string
          data:
            | AddressLookupData
            | ServiceScan
            | { records: DnsRecord[] }
            | { results: SpamDblookup[] }
            | { data: string }
          hop?: TracerouteHop
        }): void => {
          switch (msg.type) {
            case 'complete':
              this.state = msg.state

              if (this.state === 'limit') {
                this.limitReachedDialog = true

                for (const [, item] of Object.entries(this.form)) {
                  item.state = 'complete'
                }
              }

              if (this.state === 'input_error') {
                for (const [, item] of Object.entries(this.form)) {
                  item.state = 'complete'
                }
              }
              break
            case 'service_scan':
              if (msg.state === 'working') {
                this.form[msg.type].data.results.push(msg.data as ServiceScan)
              }

              this.form[msg.type].state = msg.state
              break
            case 'traceroute_hop': {
              if (msg.state === 'working' && msg.hop) {
                this.form['traceroute'].hops.push(msg.hop)
              }

              this.form['traceroute'].state = msg.state
              break
            }
            case 'traceroute': {
              this.form[msg.type].state = msg.state
              break
            }
            case 'address_lookup': {
              if (msg.state === 'complete') {
                this.form[msg.type].data = msg.data as AddressLookupData
              }

              this.form[msg.type].state = msg.state
              break
            }
            case 'domain_whois': {
              if (msg.state === 'complete') {
                this.form[msg.type].data = msg.data as { data: string }
              }

              this.form[msg.type].state = msg.state
              break
            }
            case 'network_whois': {
              if (msg.state === 'complete') {
                this.form[msg.type].data = msg.data as { data: string }
              }

              this.form[msg.type].state = msg.state
              break
            }
            case 'dns_records': {
              if (msg.state === 'complete') {
                this.form[msg.type].data.records = (msg.data as { records: DnsRecord[] }).records
              }

              this.form[msg.type].state = msg.state
              break
            }
            case 'spamdblookup': {
              if (msg.state === 'complete') {
                this.form[msg.type].data.results = (msg.data as { results: SpamDblookup[] }).results
              }

              this.form[msg.type].state = msg.state
              break
            }
          }
        }
      )
    },
    activeTabSet: function (tab: string) {
      if (this.activeTab === tab) {
        this.activeTab = 'address_lookup'
      }
    },
    getData: function () {
      this.state = 'working'

      for (const [, item] of Object.entries(this.form)) {
        if (item.active) {
          item.state = 'working'
        }
      }

      this.form.service_scan.data.results = []
      this.form.traceroute.hops = []

      const message = {
        address_lookup: this.form.address_lookup.input,
        domain_whois: this.form.domain_whois.active,
        dns_records: this.form.dns_records.active,
        network_whois: this.form.network_whois.active,
        traceroute: this.form.traceroute.active,
        service_scan: this.form.service_scan.active,
        spamdblookup: this.form.spamdblookup.active
      }

      this.socket.emit('message', message)
    }
  }
}
</script>
