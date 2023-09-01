<script setup lang="ts">
import ConnectionInfo from "./components/ConnectionInfo.vue";
import "fomantic-ui-css/semantic.min.js";
import "fomantic-ui-css/semantic.min.css";
</script>

<template>
  <div class="ui grid container" id="app">
    <div class="row">
      <div class="column">
        <div class="ui header"><a class="logo" href="#">NetTools</a></div>
        <div class="form">
          <div class="header">
            <span class="name"></span>
            <span class="desc">Investigate Domain/DNS/IP/Services</span>
          </div>
          <div class="ui form">
            <div class="fields">
              <div class="six wide field">
                <div
                  class="ui input"
                  v-bind:class="{ error: state === 'input_error' }"
                >
                  <input
                    v-on:keyup.enter="getData()"
                    v-model="form.address_lookup.input"
                    :disabled="state === 'working'"
                    name="address_lookup"
                    id="address_lookup"
                    placeholder="URL or IP or Domain"
                  />
                </div>
                <br />
                <small
                  class="your-ip"
                  v-on:click="form.address_lookup.input = remoteAddress"
                  >Your IP: {{ remoteAddress }}<i class="arrow up icon"></i
                ></small>
              </div>
              <div class="six wide field">
                <button
                  type="button"
                  v-on:click="getData()"
                  :disabled="state === 'working'"
                  class="ui primary button"
                >
                  GO
                </button>
              </div>
            </div>
            <div class="fields inline">
              <div class="three wide field">
                <div class="ui checkbox">
                  <input
                    v-model="form.domain_whois.active"
                    v-on:click="activeTabUpdate('domain_whois')"
                    :disabled="state === 'working'"
                    type="checkbox"
                    name="domain_whois"
                    id="domain_whois"
                    value="true"
                    tabindex="0"
                    class="hidden"
                  />
                  <label for="domain_whois"> Domain whois</label>
                </div>
              </div>
              <div class="two wide field">
                <div class="ui checkbox">
                  <input
                    v-model="form.dns_records.active"
                    v-on:click="activeTabUpdate('dns_records')"
                    :disabled="state === 'working'"
                    type="checkbox"
                    name="dns_records"
                    id="dns_records"
                    value="true"
                    tabindex="0"
                    class="hidden"
                  />
                  <label for="dns_records"> DNS records</label>
                </div>
              </div>
              <div class="two wide field">
                <div class="ui checkbox">
                  <div class="three wide ficheckbox">
                    <input
                      v-model="form.traceroute.active"
                      v-on:click="activeTabUpdate('traceroute')"
                      :disabled="state === 'working'"
                      type="checkbox"
                      name="traceroute"
                      id="traceroute"
                      value="true"
                      tabindex="0"
                      class="hidden"
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
                    v-model="form.network_whois.active"
                    v-on:click="activeTabUpdate('network_whois')"
                    :disabled="state === 'working'"
                    name="network_whois"
                    type="checkbox"
                    id="network_whois"
                    value="true"
                    tabindex="0"
                    class="hidden"
                  />
                  <label for="network_whois"> Network whois</label>
                </div>
              </div>
              <div class="two wide field">
                <div class="ui checkbox">
                  <input
                    v-model="form.service_scan.active"
                    v-on:click="activeTabUpdate('service_scan')"
                    :disabled="state === 'working'"
                    name="service_scan"
                    type="checkbox"
                    id="service_scan"
                    value="true"
                    tabindex="0"
                    class="hidden"
                  />
                  <label for="service_scan"> Service scan</label>
                </div>
              </div>
              <div class="three wide field">
                <div class="ui checkbox">
                  <input
                    v-model="form.spamdblookup.active"
                    v-on:click="activeTabUpdate('spamdblookup')"
                    :disabled="state === 'working'"
                    name="spamdblookup"
                    type="checkbox"
                    id="spamdblookup"
                    value="true"
                    tabindex="0"
                    class="hidden"
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
              v-bind:class="{ active: activeTab === 'address_lookup' }"
              v-on:click="activeTabSet('address_lookup')"
              data-tab="address_lookup"
              >Address
              <span
                style="margin-left: 10px"
                class="ui inline active mini loader"
                v-bind:class="{
                  hide: form.address_lookup.state !== 'working',
                  'load-failed': !connected,
                }"
              ></span
            ></a>
            <a
              class="item"
              v-bind:class="{
                active: activeTab === 'domain_whois',
                hide: !form.domain_whois.active,
              }"
              v-on:click="activeTabSet('domain_whois')"
              data-tab="domain_whois"
              >Domain whois
              <span
                style="margin-left: 10px"
                class="ui inline active mini loader"
                v-bind:class="{
                  hide: form.domain_whois.state !== 'working',
                  'load-failed': !connected,
                }"
              ></span
            ></a>
            <a
              class="item"
              v-bind:class="{
                active: activeTab === 'network_whois',
                hide: !form.network_whois.active,
              }"
              v-on:click="activeTabSet('network_whois')"
              data-tab="network_whois"
              >Network whois
              <span
                style="margin-left: 10px"
                class="ui inline active mini loader"
                v-bind:class="{
                  hide: form.network_whois.state !== 'working',
                  'load-failed': !connected,
                }"
              ></span
            ></a>
            <a
              class="item"
              v-bind:class="{
                active: activeTab === 'dns_records',
                hide: !form.dns_records.active,
              }"
              v-on:click="activeTabSet('dns_records')"
              data-tab="dns_records"
              >DNS records
              <span
                style="margin-left: 10px"
                class="ui inline active mini loader"
                v-bind:class="{
                  hide: form.dns_records.state !== 'working',
                  'load-failed': !connected,
                }"
              ></span
            ></a>
            <a
              class="item"
              v-bind:class="{
                active: activeTab === 'traceroute',
                hide: !form.traceroute.active,
              }"
              v-on:click="activeTabSet('traceroute')"
              data-tab="traceroute"
              >Traceroute
              <span
                style="margin-left: 10px"
                class="ui inline active mini loader"
                v-bind:class="{
                  hide: form.traceroute.state !== 'working',
                  'load-failed': !connected,
                }"
              ></span
            ></a>
            <a
              class="item"
              v-bind:class="{
                active: activeTab === 'service_scan',
                hide: !form.service_scan.active,
              }"
              v-on:click="activeTabSet('service_scan')"
              data-tab="service_scan"
              >Service scan
              <span
                style="margin-left: 10px"
                class="ui inline active mini loader"
                v-bind:class="{
                  hide: form.service_scan.state !== 'working',
                  'load-failed': !connected,
                }"
              ></span
            ></a>
            <a
              class="item"
              v-bind:class="{
                active: activeTab === 'spamdblookup',
                hide: !form.spamdblookup.active,
              }"
              v-on:click="activeTabSet('spamdblookup')"
              data-tab="spamdblookup"
              >SpamDB Lookup
              <span
                style="margin-left: 10px"
                class="ui inline active mini loader"
                v-bind:class="{
                  hide: form.spamdblookup.state !== 'working',
                  'load-failed': !connected,
                }"
              ></span
            ></a>
          </div>
          <div
            class="ui bottom attached tab segment content-item"
            v-bind:class="{ active: activeTab === 'address_lookup' }"
            data-tab="address_lookup"
          >
            <h3>Address lookup</h3>
            <connection-info v-if="!connected"></connection-info>

            <table
              v-if="form.address_lookup.data && form.address_lookup.data.found"
              class="ui table"
            >
              <tr v-if="form.address_lookup.data.hostname">
                <td>Host name</td>
                <td>
                  <span class="ipaddr">{{
                    form.address_lookup.data.hostname
                  }}</span>
                </td>
              </tr>

              <tr v-if="form.address_lookup.data.domain">
                <td>Domain name</td>
                <td>
                  <span class="ipaddr">{{
                    form.address_lookup.data.domain
                  }}</span>
                </td>
              </tr>

              <tr v-if="form.address_lookup.data.ptr_name">
                <td>PTR domain name (for {{ form.address_lookup.data.ip }})</td>
                <td>
                  <span class="ipaddr">{{
                    form.address_lookup.data.ptr_name
                  }}</span>
                </td>
              </tr>

              <tr v-if="form.address_lookup.data.cname.length">
                <td>CNAME</td>
                <td>
                  <span
                    v-for="address in form.address_lookup.data.cname"
                    class="ipaddr"
                    v-bind:key="address"
                    >{{ address }}</span
                  >;
                </td>
              </tr>

              <tr v-if="form.address_lookup.data.addresses.length">
                <td>IP addresses</td>
                <td>
                  <span
                    v-for="address in form.address_lookup.data.addresses"
                    class="ipaddr"
                    v-bind:key="address"
                    >{{ address }};
                  </span>
                </td>
              </tr>
            </table>
          </div>
          <div
            class="ui bottom attached tab segment content-item"
            v-bind:class="{
              active: activeTab === 'domain_whois',
              hide: !form.domain_whois.active,
            }"
            data-tab="domain_whois"
          >
            <h3>Domain Whois record</h3>
            <connection-info v-if="!connected"></connection-info>
            <pre v-if="form.domain_whois.data.data">{{
              form.domain_whois.data.data
            }}</pre>
          </div>
          <div
            class="ui bottom attached tab segment content-item"
            v-bind:class="{
              active: activeTab === 'network_whois',
              hide: !form.network_whois.active,
            }"
            data-tab="network_whois"
          >
            <h3>Network Whois record</h3>
            <connection-info v-if="!connected"></connection-info>
            <pre v-if="form.network_whois.data.data">{{
              form.network_whois.data.data
            }}</pre>
          </div>
          <div
            class="ui bottom attached tab segment content-item"
            v-bind:class="{
              active: activeTab === 'dns_records',
              hide: !form.dns_records.active,
            }"
            data-tab="dns_records"
          >
            <h3>DNS records</h3>
            <connection-info v-if="!connected"></connection-info>

            <table
              v-if="
                form.dns_records.data.records &&
                form.dns_records.data.records.length
              "
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
                <template
                  v-for="x in form.dns_records.data.records"
                  v-bind:key="x"
                >
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
                    <td>{{ x.data[0] }}</td>
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
                          <i class="caret right icon"></i>
                          <div class="content">exchange: {{ x.exchange }}</div>
                        </div>
                        <div class="item">
                          <i class="caret right icon"></i>
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
                          <i class="caret right icon"></i>
                          <div class="content">primary: {{ x.primary }}</div>
                        </div>
                        <div class="item">
                          <i class="caret right icon"></i>
                          <div class="content">serial: {{ x.serial }}</div>
                        </div>
                        <div class="item">
                          <i class="caret right icon"></i>
                          <div class="content">admin: {{ x.admin }}</div>
                        </div>
                        <div class="item">
                          <i class="caret right icon"></i>
                          <div class="content">refresh: {{ x.refresh }}</div>
                        </div>
                        <div class="item">
                          <i class="caret right icon"></i>
                          <div class="content">retry: {{ x.retry }}</div>
                        </div>
                        <div class="item">
                          <i class="caret right icon"></i>
                          <div class="content">
                            expiration: {{ x.expiration }}
                          </div>
                        </div>
                        <div class="item">
                          <i class="caret right icon"></i>
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
            v-bind:class="{
              active: activeTab === 'traceroute',
              hide: !form.traceroute.active,
            }"
            data-tab="traceroute"
          >
            <h3>Traceroute</h3>
            <connection-info v-if="!connected"></connection-info>

            <template v-if="form.traceroute.data.ip">
              <p>
                Tracing route to
                <span class="ipaddr"
                  >{{ form.traceroute.data.hostname }} [{{
                    form.traceroute.data.ip
                  }}]</span
                >...
              </p>
            </template>

            <table
              class="ui table"
              v-bind:class="{ hide: form.traceroute.hops.length === 0 }"
            >
              <thead>
                <tr>
                  <th>hop</th>
                  <th>rtt</th>
                  <th>ip address</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="hop in form.traceroute.hops" :key="hop">
                  <td style="width: 10%">{{ hop.hop }}</td>
                  <td style="width: 15%">{{ hop.rtt1 }}</td>
                  <td style="width: 25%">{{ hop.ip }}</td>
                  <td style="width: 50%">&nbsp;</td>
                </tr>
              </tbody>
            </table>

            <p v-if="form.traceroute.state === 'complete'">Trace complete.</p>
          </div>
          <div
            class="ui bottom attached tab segment content-item"
            v-bind:class="{
              active: activeTab === 'service_scan',
              hide: !form.service_scan.active,
            }"
            data-tab="service_scan"
          >
            <h3>Service scan</h3>
            <connection-info v-if="!connected"></connection-info>

            <template
              v-if="
                form.service_scan.data.results &&
                form.service_scan.data.results.length
              "
            >
              <p v-for="x in form.service_scan.data.results" :key="x">
                <strong style="min-width: 110px; display: inline-block"
                  >{{ x.service }}:</strong
                >
                <span
                  style="
                    white-space: pre-line;
                    margin-left: 115px;
                    display: block;
                  "
                  >{{ x.data }}</span
                >
              </p>
            </template>
          </div>
          <div
            class="ui bottom attached tab segment content-item"
            v-bind:class="{
              active: activeTab === 'spamdblookup',
              hide: !form.spamdblookup.active,
            }"
            data-tab="spamdblookup"
          >
            <h3>Spam Databases Lookup</h3>
            <connection-info v-if="!connected"></connection-info>

            <table
              v-if="
                form.spamdblookup.data.results &&
                form.spamdblookup.data.results.length
              "
              class="ui table"
            >
              <tr v-for="item in form.spamdblookup.data.results" :key="item">
                <td>
                  <span
                    v-if="item.listed"
                    style="color: #e80000; font-weight: bold"
                    >listed</span
                  >
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
      <div class="ui container">
        &copy; 2017 - {{ year }} «<a href="#">NetTools</a>»
      </div>
    </div>

    <div class="ui modal reconnect">
      <div class="header">Establishing connection...</div>
      <div class="content">
        <p></p>
        <p>
          We detected a problem with connecting to the server w4net.com. Please
          wait a few seconds or try
          <a href="javascript:location.reload();">refreshing</a> the page.
        </p>
        <p></p>
      </div>
    </div>
    <div class="ui modal limit">
      <div class="header">Limit reached</div>
      <div class="content">
        <p></p>
        <p>We are so sorry. But today requests limit is reached.</p>
        <p></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { io } from "socket.io-client";
import $ from "jquery";

export default {
  data() {
    return {
      token: "",
      year: "",
      activeTab: "address_lookup",
      state: "initial",
      connected: true,
      remoteAddress: "",
      form: {
        address_lookup: {
          active: true,
          state: "initial",
          input: "google.com",
          data: {},
        },
        domain_whois: {
          active: true,
          state: "initial",
          data: {},
        },
        dns_records: {
          active: true,
          state: "initial",
          data: {},
        },
        network_whois: {
          active: true,
          state: "initial",
          data: {},
        },
        traceroute: {
          active: true,
          state: "initial",
          data: {},
          hops: [],
        },
        service_scan: {
          active: true,
          state: "initial",
          data: {
            results: [],
          },
        },
        spamdblookup: {
          active: true,
          state: "initial",
          data: {},
        },
      },
      socket: {},
    };
  },
  mounted() {
    fetch("/init")
      .then((response) => response.json())
      .then((data) => {
        this.token = data.token;
        this.year = data.year;
        this.remoteAddress = data.remoteAddress;

        this.init();
      });
  },
  methods: {
    init: function () {
      this.socket = io({
        query: { token: this.token },
      });

      this.socket.on("connect", () => {
        this.socket.sendBuffer = [];
        this.connected = true;
      });

      this.socket.on("disconnect", () => {
        $(".ui.modal.reconnect").modal("show");

        this.connected = false;
      });

      this.socket.on("reconnect", () => {
        this.socket.sendBuffer = [];
        this.state = "initial";

        for (let item of this.form) {
          item.state = "initial";
        }

        for (const [, item] of Object.entries(this.form)) {
          item.state = "initial";
          item.data = {};
        }

        this.form.service_scan.data.results = [];
        this.form.traceroute.hops = [];

        $(".ui.modal.reconnect").modal("hide");

        this.connected = true;
      });

      this.socket.on("message", (msg) => {
        if (msg.type === "complete") {
          this.state = msg.state;

          if (this.state === "limit") {
            $(".ui.modal.limit").modal("show");

            for (let item of this.form) {
              item.state = "complete";
            }
          }

          if (this.state === "input_error") {
            for (let item of this.form) {
              item.state = "complete";
            }
          }
        }

        if (msg.type === "traceroute_hop" && msg.state === "working") {
          this.form["traceroute"].hops.push(msg.hop);
        } else if (msg.type === "service_scan" && msg.state === "working") {
          this.form[msg.type].data.results.push(msg.data);
          this.form[msg.type].state = msg.state;
        } else if (msg.type === "service_scan" && msg.state === "complete") {
          this.form[msg.type].state = msg.state;
        } else {
          if (this.form[msg.type] && msg.data) {
            this.form[msg.type].data = msg.data;
            this.form[msg.type].state = msg.state;
          }
        }
      });
    },
    activeTabSet: function (val) {
      if (this.activeTab === val) {
        this.activeTab = "address_lookup";
      } else {
        this.activeTab = val;
      }
    },
    activeTabUpdate: function (tab: string) {
      this.activeTab = tab;
    },
    getData: function () {
      this.state = "working";

      for (const [, item] of Object.entries(this.form)) {
        item.state = "initial";
        item.data = {};
      }

      this.form.service_scan.data.results = [];
      this.form.traceroute.hops = [];

      if (this.form.domain_whois.active === true) {
        this.form.address_lookup.state = "working";
      }
      if (this.form.dns_records.active === true) {
        this.form.dns_records.state = "working";
      }
      if (this.form.network_whois.active === true) {
        this.form.network_whois.state = "working";
      }
      if (this.form.traceroute.active === true) {
        this.form.traceroute.state = "working";
      }
      if (this.form.service_scan.active === true) {
        this.form.service_scan.state = "working";
      }
      if (this.form.spamdblookup.active === true) {
        this.form.spamdblookup.state = "working";
      }

      let message = {
        address_lookup: this.form.address_lookup.input,
        domain_whois: this.form.domain_whois.active,
        dns_records: this.form.dns_records.active,
        network_whois: this.form.network_whois.active,
        traceroute: this.form.traceroute.active,
        service_scan: this.form.service_scan.active,
        spamdblookup: this.form.spamdblookup.active,
      };

      this.socket.emit("message", message);
    },
  },
};
</script>
