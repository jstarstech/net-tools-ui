<script setup lang="ts">
import 'fomantic-ui-css/semantic.min.css'
import 'fomantic-ui-css/semantic.min.js'
import ConnectionInfo from './components/ConnectionInfo.vue'
</script>

<template>
              <div id="app" class="ui grid container">
                <div class="row">
                  <div class="column">
                    <div class="ui header">
                      <a class="logo" href="#">NetTools</a>
                    </div>
                    <div class="form">
                      <div class="header">
                          <span class="name" />
                          <span class="desc">Investigate Domain/DNS/IP/Services</span>
                        </div>
                        <div class="ui form">
                          <div class="fields">
                            <div class="six wide field">
                              <div class="ui input" :class="{ error: state === 'input_error' }">
                                <input
                                  id="address_lookup"
                                  v-model="form.address_lookup.input"
                                  placeholder="URL or IP or Domain"
                                  name="address_lookup"
                                  :disabled="state === 'working'"
                                  @keyup.enter="getData()"
                                />
                              </div>
                              <br />
                              <small class="your-ip" @click="form.address_lookup.input = remoteAddress"
                                >Your IP: {{ remoteAddress }}<i class="arrow up icon"
                              /></small>
                            </div>
                            <div class="six wide field">
                              <button
                                type="button"
                                :disabled="state === 'working'"
                                class="ui primary button"
                                @click="getData()"
                            >
                              GO
                            </button>
                          </div>
                        </div>
                        <div class="fields inline">
                          <div class="three wide field">
                            <div class="ui checkbox">
                              <input
                                        id="domain_whois"
                                        v-model="form.domain_whois.active"
                                        :disabled="state === 'working'"
                                        type="checkbox"
                                        name="domain_whois"
                                        value="true"
                                        tabindex="0"
                                        class="hidden"
                                        @click="activeTabUpdate('domain_whois')"
                                      />
                                      <label for="domain_whois"> Domain whois</label>
                                    </div>
                                  </div>
                                  <div class="two wide field">
                                    <div class="ui checkbox">
                                      <input
                                        id="dns_records"
                                        v-model="form.dns_records.active"
                                        :disabled="state === 'working'"
                                        type="checkbox"
                                        name="dns_records"
                                        value="true"
                                        tabindex="0"
                                        class="hidden"
                                        @click="activeTabUpdate('dns_records')"
                                    />
                                    <label for="dns_records"> DNS records</label>
                                  </div>
                                </div>
                                <div class="two wide field">
                                  <div class="ui checkbox">
                                    <div class="three wide ficheckbox">
                                      <input
                                          id="traceroute"
                                          v-model="form.traceroute.active"
                                          :disabled="state === 'working'"
                                          type="checkbox"
                                          name="traceroute"
                                          value="true"
                                          tabindex="0"
                                          class="hidden"
                                          @click="activeTabUpdate('traceroute')"
                                        />
                                        <label for="traceroute"> Traceroute</label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="fields inline">
                                  <div class="three wide field">
                                    <div class="ui checkbox">
                                      <input
                                        id="network_whois"
                                        v-model="form.network_whois.active"
                                        class="hidden"
                                        :disabled="state === 'working'"
                                        name="network_whois"
                                        type="checkbox"
                                        value="true"
                                        tabindex="0"
                                        @click="activeTabUpdate('network_whois')"
                                  />
                                  <label for="network_whois"> Network whois</label>
                                </div>
                              </div>
                              <div class="two wide field">
                                <div class="ui checkbox">
                                  <input
                                        id="service_scan"
                                        v-model="form.service_scan.active"
                                        :disabled="state === 'working'"
                                        name="service_scan"
                                        type="checkbox"
                                        value="true"
                                        tabindex="0"
                                        class="hidden"
                                        @click="activeTabUpdate('service_scan')"
                                      />
                                      <label for="service_scan"> Service scan</label>
                                    </div>
                                  </div>
                                  <div class="three wide field">
                                    <div class="ui checkbox">
                                      <input
                                        id="spamdblookup"
                                        v-model="form.spamdblookup.active"
                                        :disabled="state === 'working'"
                                        name="spamdblookup"
                                        type="checkbox"
                                        value="true"
                                        tabindex="0"
                                        class="hidden"
                                        @click="activeTabUpdate('spamdblookup')"
                                    />
                                    <label for="spamdblookup"> SpamDB Lookup</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="tabs">
                            <div class="ui top attached tabular menu">
                              <a
                                class="item"
                                  :class="{ active: activeTab === 'address_lookup' }"
                                  data-tab="address_lookup"
                                  @click="activeTabSet('address_lookup')"
                                  >Address
                                  <span
                                    style="margin-left: 10px"
                                    class="ui inline active mini loader"
                                    :class="{
                                      hide: form.address_lookup.state !== 'working',
                                      'load-failed': !connected
                                    }"
                                /></a>
                                <a
                                  class="item"
                                  :class="{
                                    active: activeTab === 'domain_whois',
                                    hide: !form.domain_whois.active
                                  }"
                            data-tab="domain_whois"
                                  @click="activeTabSet('domain_whois')"
                                  >Domain whois
                                  <span
                                    style="margin-left: 10px"
                                    class="ui inline active mini loader"
                                    :class="{
                                      hide: form.domain_whois.state !== 'working',
                                      'load-failed': !connected
                                    }"
                                /></a>
                                <a
                                  class="item"
                                  :class="{
                                    active: activeTab === 'network_whois',
                                    hide: !form.network_whois.active
                                  }"
                                  data-tab="network_whois"
                                  @click="activeTabSet('network_whois')"
                                >Network whois
                                <span
                                  style="margin-left: 10px"
                                  class="ui inline active mini loader"
                                    :class="{
                                      hide: form.network_whois.state !== 'working',
                                      'load-failed': !connected
                                    }"
                                /></a>
                                <a
                                  class="item"
                                  :class="{
                                    active: activeTab === 'dns_records',
                                    hide: !form.dns_records.active
                                  }"
                                  data-tab="dns_records"
                                  @click="activeTabSet('dns_records')"
                                  >DNS records
                                  <span
                                    style="margin-left: 10px"
                                    class="ui inline active mini loader"
                                    :class="{
                                      hide: form.dns_records.state !== 'working',
                                      'load-failed': !connected
                                    }"
                                /></a>
                                <a
                                  class="item"
                                  :class="{
                                    active: activeTab === 'traceroute',
                                    hide: !form.traceroute.active
                                  }"
                                  data-tab="traceroute"
                                  @click="activeTabSet('traceroute')"
                                  >Traceroute
                                  <span
                                    style="margin-left: 10px"
                                    class="ui inline active mini loader"
                                    :class="{
                                      hide: form.traceroute.state !== 'working',
                                      'load-failed': !connected
                                    }"
                                /></a>
                                <a
                                  class="item"
                                  :class="{
                                    active: activeTab === 'service_scan',
                                    hide: !form.service_scan.active
                                  }"
                                  data-tab="service_scan"
                                  @click="activeTabSet('service_scan')"
                                  >Service scan
                                  <span
                                    style="margin-left: 10px"
                                    class="ui inline active mini loader"
                                    :class="{
                                      hide: form.service_scan.state !== 'working',
                                      'load-failed': !connected
                                    }"
                                /></a>
                        <a
                          class="item"
                                :class="{
                                  active: activeTab === 'spamdblookup',
                                  hide: !form.spamdblookup.active
                                }"
                                data-tab="spamdblookup"
                                @click="activeTabSet('spamdblookup')"
                                >SpamDB Lookup
                                <span
                                  style="margin-left: 10px"
                                  class="ui inline active mini loader"
                                  :class="{
                                    hide: form.spamdblookup.state !== 'working',
                                    'load-failed': !connected
                                  }"
                              /></a>
                            </div>
                            <div
                              class="ui bottom attached tab segment content-item"
                              :class="{ active: activeTab === 'address_lookup' }"
                            data-tab="address_lookup"
                          >
                            <h3>Address lookup</h3>
                              <connection-info v-if="!connected" />

                              <table
                                v-if="form.address_lookup.data && form.address_lookup.data.found"
                                class="ui table"
                              >
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
                                  >{{ address }};
                                </span>
                              </td>
                            </tr>
                          </table>
                        </div>
                        <div
                          class="ui bottom attached tab segment content-item"
                              :class="{
                                active: activeTab === 'domain_whois',
                                hide: !form.domain_whois.active
                              }"
                              data-tab="domain_whois"
                            >
                              <h3>Domain Whois record</h3>
                              <connection-info v-if="!connected" />
                              <pre v-if="form.domain_whois.data.data">{{ form.domain_whois.data.data }}</pre>
                            </div>
                            <div
                              class="ui bottom attached tab segment content-item"
                              :class="{
                                active: activeTab === 'network_whois',
                                hide: !form.network_whois.active
                              }"
                              data-tab="network_whois"
                            >
                              <h3>Network Whois record</h3>
                              <connection-info v-if="!connected" />
                              <pre v-if="form.network_whois.data.data">{{ form.network_whois.data.data }}</pre>
                            </div>
                            <div
                              class="ui bottom attached tab segment content-item"
                              :class="{
                                active: activeTab === 'dns_records',
                                hide: !form.dns_records.active
                              }"
                            data-tab="dns_records"
                          >
                            <h3>DNS records</h3>
                              <connection-info v-if="!connected" />

                              <table
                                v-if="form.dns_records.data.records && form.dns_records.data.records.length"
                                class="ui celled striped padded table"
                              >
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
                            </table>
                          </div>
                          <div
                            class="ui bottom attached tab segment content-item"
                            :class="{
                              active: activeTab === 'traceroute',
                              hide: !form.traceroute.active
                            }"
                            data-tab="traceroute"
                          >
                            <h3>Traceroute</h3>
                            <connection-info v-if="!connected" />

                          <template v-if="form.traceroute.data.ip">
                            <p>
                              Tracing route to
                              <span class="ipaddr"
                                  >{{ form.traceroute.data.hostname }} [{{ form.traceroute.data.ip }}]</span
                                >...
                              </p>
                            </template>

                            <table class="ui table" :class="{ hide: form.traceroute.hops.length === 0 }">
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
                          </table>

                          <p v-if="form.traceroute.state === 'complete'">Trace c omplete.</p>
                        </div>
                        <div
                          c
                          lass="ui bottom attached tab segment content-item"
                          :class="{
                            active: activeTab === 'service_scan',
                            hide: !form.service_scan.active
                          }"
                          data-tab="service_scan"
                        >
                          <h3>Service scan</h3>
                          <connection-info v-if="!connected" />

                          <template
                            v-if="form.service_scan.data.results && form.service_scan.data.results.length"
                        >
                            <p v-for="x in form.service_scan.data.results" :key="x.service">
                              <strong style="min-width: 1 10px; display: inline-block">{{ x.service }}:</strong>
                              <span style="white-space: pre-line; margin-left: 115px; display: block">{{
                                x.data
                              }}</span>
                            </p>
                          </template>
                        </div>
                        <div
                          class="ui bottom attached tab segment content-item"
                          :class="{
                            active: activeTab === 'spamdblookup',
                            hide: !form.spamdblookup.active
                          }"
                          data-tab="spamdblookup"
                        >
                          <h3>Spam Databases Lookup</h3>
                          <connection-info v-if="!connected" />

                        <table
                          v-if="form.spamdblookup.data.results && form.spamdblookup.data.results.length"
                          class="ui table"
                        >
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
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="ui vertical footer segment form-page">
                  <div class="ui container">&copy; 2017 - {{ year }} «<a href="#">NetTools</a>»</div>
                </div>

                <div class="ui modal reconnect">
                  <div class="header">Establishing connection ...</div>
                  <div class="content">
                    <p>&nbsp;</p>
                    <p>
                      We detected a problem with connecting to the server w4net.com. Please wait a few seconds
                      or try
                      <a href="javascript:location.reload();">refreshing</a> the page.
                    </p>
                    <!-- <p>&nbsp;</p> -->
                  </div>
                </div>
                <div class="ui modal limit">
                  <div class="header">Limit reached</div>
                  <div class="content">
                    <p />
                    <p>We are so sorry. But today requests limit is reached.</p>
                    <p />
                  </div>
                </div>
              </div>
</template>

<script lang="ts">
import * as $ from 'jquery';
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
        $('.ui.modal.reconnect').modal('show')

        this.connected = false
      })

      this.socket.on('reconnect', () => {
        this.socket.sendBuffer = []
        this.state = 'initial'

        for (const [key, item] of Object.entries(this.form)) {
          item.state = 'initial'

          if (key === 'service_scan') {
            ;      (item as ServiceScanState).data = { results: [] }
          } else if (key === 'spamdblookup') {
            ;      (item as SpamDblookupState).data = { results: [] }
          } else if (key === 'traceroute') {
            ;      (item as TracerouteState).data = { ip: '', hostname: '' }
                             ; (item as TracerouteState).hops = []
          }
        }

        this.form.service_scan.data.results = []
        this.form.traceroute.hops = []

        $('.ui.modal.reconnect').modal('hide')

        this.connected = true
      })

      this.socket.on(
        'message',
        (msg: {
          type: string
          state: string
          data: AddressLookupData | ServiceScan | DnsRecord[]
          hop?: TracerouteHop
        }): void => {
          if (msg.type === 'complete') {
            this.state = msg.state

            if (this.state === 'limit') {
              $('.ui.modal.limit').modal('show')

              for (const [, item] of Object.entries(this.form)) {
                item.state = 'complete'
              }
            }

            if (this.state === 'input_error') {
              for (const [, item] of Object.entries(this.form)) {
                item.state = 'complete'
              }
            }
          }

          if (msg.type === 'traceroute_hop' && msg.state === 'working' && msg.hop) {
            this.form['traceroute'].hops.push(msg.hop)
          } else if (msg.type === 'service_scan' && msg.state === 'working') {
            this.form[msg.type].data.results.push(msg.data as ServiceScan)
            this.form[msg.type].state = msg.state
          } else if (msg.type === 'service_scan' && msg.state === 'complete') {
            this.form[msg.type].state = msg.state
          } else if (msg.type === 'address_lookup' && msg.state === 'complete') {
            this.form[msg.type].state = msg.state
            this.form[msg.type].data = msg.data as AddressLookupData
          } else if (msg.type === 'dns_records' && msg.state === 'complete') {
            this.form[msg.type].state = msg.state
            this.form[msg.type].data.records = msg.data as DnsRecord[]
          }
        }
      )
    },
    activeTabSet: function (val: string) {
      if (this.activeTab === val) {
        this.activeTab = 'address_lookup'
      } else {
        this.activeTab = val
      }
    },
    activeTabUpdate: function (tab: string) {
      this.activeTab = tab
    },
    getData: function () {
      this.state = 'working'

      for (const [key, item] of Object.entries(this.form)) {
        item.state = 'initial'

        if (key === 'service_scan') {
          ;      (item as ServiceScanState).data.results = []
        }
      }

      this.form.service_scan.data.results = []
      this.form.traceroute.hops = []

      if (this.form.domain_whois.active === true) {
        this.form.address_lookup.state = 'working'
      }
      if (this.form.dns_records.active === true) {
        this.form.dns_records.state = 'working'
      }
      if (this.form.network_whois.active === true) {
        this.form.network_whois.state = 'working'
      }
      if (this.form.traceroute.active === true) {
        this.form.traceroute.state = 'working'
      }
      if (this.form.service_scan.active === true) {
        this.form.service_scan.state = 'working'
      }
      if (this.form.spamdblookup.active === true) {
        this.form.spamdblookup.state = 'working'
      }

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
