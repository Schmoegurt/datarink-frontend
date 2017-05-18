<template>
  <div style="height: 100%; position: relative;">
    <h3>Skaters</h3>
    <div>
      <div class="form-group">
        <label>Name</label>
        <input type="text" v-model="nameDebounced" style="width: 94px;">
      </div
      ><div class="form-group">
        <label>Pos</label>
        <div class="select-container">
          <select v-model="posQuery">
            <option value="">Any</option>
            <option value="f">F</option>
            <option value="d">D</option>
            <option value="c">C</option>
            <option value="l">L</option>
            <option value="r">R</option>
          </select>
        </div>
      </div
      ><div class="form-group">
        <label>Team</label>
        <div class="select-container">
          <select v-model="teamQuery">
            <option value="">Any</option>
            <option v-for="t in teams" :value="t">{{ t.toUpperCase() }}</option>
          </select>
        </div>
      </div
      ><div class="form-group">
        <label>GP</label>
        <input type="number" style="width: 46px;" v-model.number="gpDebounced">
      </div
      ><div class="form-group">
        <label>Minutes</label>
        <input type="number" style="width: 70px;" v-model.number="toiDebounced">
      </div
      ><div class="form-group">
        <div class="checkbox-group">
          <input id="rates" type="checkbox"
            v-model="showRates" :checked="{ 'toggle-button-checked': showRates }">
          <label for="rates" class="checkbox-container">
            <span class="checkbox-checkmark"></span>
          </label
          ><label for="rates" class="checkbox-text">Per 60 min</label>
        </div>
      </div>
    </div>
    <DataTable :rows="filteredRows" :columns="columns"></DataTable>
  </div>
</template>

<script>
const _ = require('lodash');
const DataTable = require('./components/DataTable.vue');

module.exports = {
  name: 'Skaters',
  components: {
    DataTable,
  },
  data() {
    return {
      nameDebounced: '',
      nameQuery: '',
      toiDebounced: '',
      toiQuery: '',
      gpDebounced: '',
      gpQuery: '',
      posQuery: '',
      teamQuery: '',
      showRates: false,
      rows: [],
      columns: [
        { id: 'name', display: 'Name', leftAligned: true },
        { id: 'posString', display: 'Pos', leftAligned: true },
        { id: 'teamString', display: 'Team', leftAligned: true },
        { id: 'gp', display: 'GP' },
        { id: 'mins', display: 'Min' },
        { id: 'minsPerGp', display: 'Min/GP' },
        { id: 'ig', display: 'G' },
        { id: 'ia1', display: 'A1' },
        { id: 'ia2', display: 'A2' },
        { id: 'ip', display: 'Pts' },
        { id: 'ic', display: 'Own C' },
        { id: 'iShPct', display: 'Own Sh%' },
        { id: 'i_eff_pen_drawn', display: 'Pen drawn' },
        { id: 'i_eff_pen_taken', display: 'Pen taken' },
        { id: 'penDiff', display: 'Pen diff' },
        { id: 'iFoWinPct', display: 'FO win%' },
        { id: 'i_fo_won', display: 'FO won' },
        { id: 'i_fo_lost', display: 'FO lost' },
        { id: 'i_blocked', display: 'Blocked' },
        { id: 'gf', display: 'GF' },
        { id: 'ga', display: 'GA' },
        { id: 'gDiff', display: 'G diff' },
        { id: 'gfPct', display: 'GF%' },
        { id: 'cf', display: 'CF' },
        { id: 'ca', display: 'CA' },
        { id: 'cDiff', display: 'C diff' },
        { id: 'cfPct', display: 'CF%' },
        { id: 'adj_cf', display: 'CF adj' },
        { id: 'adj_ca', display: 'CA adj' },
        { id: 'cDiffAdj', display: 'C diff adj' },
        { id: 'cfPctAdj', display: 'CF% adj' },
        { id: 'shPct', display: 'Sh%' },
        { id: 'svPct', display: 'Sv%' },
        { id: 'pdo', display: 'PDO' },
        { id: 'ofoPct', display: 'OFO%' },
        { id: 'dfoPct', display: 'DFO%' },
        { id: 'ofo', display: 'OFO' },
        { id: 'dfo', display: 'DFO' },
        { id: 'nfo', display: 'NFO' },
        { id: 'otf', display: 'OTF' },
      ],
    };
  },
  created() {
    this.fetchData();
  },
  watch: {
    nameDebounced: _.debounce(function setNameQuery() { this.nameQuery = this.nameDebounced; }, 250),
    toiDebounced: _.debounce(function setToiQuery() { this.toiQuery = this.toiDebounced; }, 250),
    gpDebounced: _.debounce(function setGpQuery() { this.gpQuery = this.gpDebounced; }, 250),
  },
  computed: {
    teams() {
      const uniqTeams = this.rows.reduce((result, cur) => {
        cur.teams.forEach((team) => {
          if (result.indexOf(team) < 0) {
            result.push(team);
          }
        });
        return result;
      }, []);
      return uniqTeams.sort();
    },
    filteredRows() {
      const self = this;
      return this.rows.filter((r) => {
        let returned = true;
        if (self.nameQuery) {
          returned = r.name.toLowerCase().indexOf(self.nameQuery) >= 0 ? true : false;
        }
        if (returned && self.toiQuery) {
          returned = r.mins >= self.toiQuery ? true : false;
        }
        if (returned && self.gpQuery) {
          returned = r.gp >= self.gpQuery ? true : false;
        }
        if (self.teamQuery) {
          returned = r.teams.indexOf(self.teamQuery) >= 0 ? true : false;
        }
        if (returned && self.posQuery) {
          if (self.posQuery === 'f') {
            returned = r.positions.indexOf('c') >= 0
              || r.positions.indexOf('l') >= 0
              || r.positions.indexOf('r') >= 0
              ? true : false;
          } else {
            returned = r.positions.indexOf(self.posQuery) >= 0 ? true : false;
          }
        }
        return returned;
      });
    },
  },
  methods: {
    fetchData() {
      const self = this;
      const xhr = new XMLHttpRequest();
      const route = '/skaters/?start=20161010&end=20170510&strSits=ev5';
      xhr.open('GET', `${API_URL}${route}`);
      xhr.onload = () => {
        self.rows = JSON.parse(xhr.responseText).skaters
          .filter((r) => {
            // Remove players who played less than 1 minute
            r.mins = Math.round(r.toi / 60);
            return r.mins > 0;
          })
          .map((r) => {
            /* eslint-disable no-param-reassign */
            r.name = `${r.first_name} ${r.last_name}`.replace(/\./g, '');
            r.posString = r.positions.toString()
              .toUpperCase()
              .replace(/,/g, ', ');
            r.teamString = r.teams.toString()
              .toUpperCase()
              .replace(/,/g, ', ');
            r.minsPerGp = Math.round((r.toi / 60) / r.gp);
            r.ip = r.ig + r.ia1 + r.ia2;
            r.iShPct = r.isog === 0 ? 0 : Math.round(100 * (r.ig / r.isog));
            r.penDiff = r.i_eff_pen_drawn - r.i_eff_pen_taken;
            r.iFoWinPct = r.i_fo_won + r.i_fo_lost === 0 ? 0
              : Math.round(100 * (r.i_fo_won / (r.i_fo_won + r.i_fo_lost)));
            r.gfPct = r.gf + r.ga === 0 ? 0 : Math.round(100 * (r.gf / (r.gf + r.ga)));
            r.gDiff = r.gf - r.ga;
            r.cDiff = r.cf - r.ca;
            r.cfPct = r.cf + r.ca === 0 ? 0 : Math.round(100 * (r.cf / (r.cf + r.ca)));
            r.cDiffAdj = Math.round(r.adj_cf - r.adj_ca);
            r.cfPctAdj = r.adj_cf + r.adj_ca === 0 ? 0
              : Math.round(100 * (r.adj_cf / (r.adj_cf + r.adj_ca)));
            r.shPct = r.sf === 0 ? 0 : 100 * (r.gf / r.sf);
            r.svPct = r.sa === 0 ? 0 : 100 * (1 - (r.ga / r.sa));
            r.pdo = Math.round(r.shPct + r.svPct);
            r.ofoPct = Math.round(100 * (r.ofo / (r.ofo + r.dfo + r.nfo + r.otf)));
            r.dfoPct = Math.round(100 * (r.dfo / (r.ofo + r.dfo + r.nfo + r.otf)));

            // Round values that were previously used to calculate other stats
            r.shPct = Math.round(r.shPct);
            r.svPct = Math.round(r.svPct);
            r.adj_cf = Math.round(r.adj_cf);
            r.adj_ca = Math.round(r.adj_ca);
            /* eslint-enable */
            return r;
          });
      };
      xhr.send();
    },
  },
};
</script>
