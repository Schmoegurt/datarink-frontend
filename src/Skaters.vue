<template>
  <div style="height: calc(100% - 48px); padding-top: 16px; box-sizing: border-box; position: relative;">
    <h3>Skaters</h3>
    <div v-show="rows && rows.length > 0">
      <div class="form-group">
        <label>Name</label>
        <input type="text" v-model="nameDebounced" style="width: 78px;">
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
        <input type="number" style="width: 62px;" v-model.number="toiDebounced">
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
    <DataTable v-show="rows && rows.length > 0" @thClick="setSort"
      :rows="filteredRows" :columns="columns"
      :sortMarker="{ col: sortCol, order: sortOrder }"></DataTable>
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
      toiDebounced: 120,
      toiQuery: 120,
      gpDebounced: '',
      gpQuery: '',
      posQuery: '',
      teamQuery: '',

      showRates: false,

      sortOrder: -1,
      sortCol: 'mins',

      rows: [],
      columns: [
        { id: 'name', display: 'Name', leftAligned: true },
        { id: 'posString', display: 'Pos', leftAligned: true },
        { id: 'teamString', display: 'Team', leftAligned: true },
        { id: 'gp', display: 'GP' },
        { id: 'mins', display: 'Min' },
        { id: 'minsPerGp', display: 'Min/GP' },
        { id: 'ig', display: 'G', hasRate: true },
        { id: 'ia1', display: 'A1', hasRate: true },
        { id: 'ia2', display: 'A2', hasRate: true },
        { id: 'ip', display: 'Pts', hasRate: true },
        { id: 'ic', display: 'Own C', hasRate: true },
        { id: 'iShPct', display: 'Own Sh%' },
        { id: 'i_eff_pen_drawn', display: 'Pen drawn', hasRate: true },
        { id: 'i_eff_pen_taken', display: 'Pen taken', hasRate: true },
        { id: 'penDiff', display: 'Pen diff', hasRate: true, isDiff: true },
        { id: 'iFoWinPct', display: 'FO W%' },
        { id: 'i_fo_won', display: 'FO W', hasRate: true },
        { id: 'i_fo_lost', display: 'FO L', hasRate: true },
        { id: 'i_blocked', display: 'Blocked', hasRate: true },
        { id: 'gf', display: 'GF', hasRate: true },
        { id: 'ga', display: 'GA', hasRate: true },
        { id: 'gDiff', display: 'G diff', hasRate: true, isDiff: true },
        { id: 'gfPct', display: 'GF%' },
        { id: 'cf', display: 'CF', hasRate: true },
        { id: 'ca', display: 'CA', hasRate: true },
        { id: 'cDiff', display: 'C diff', hasRate: true, isDiff: true },
        { id: 'cfPct', display: 'CF%' },
        { id: 'adj_cf', display: 'CF adj', hasRate: true },
        { id: 'adj_ca', display: 'CA adj', hasRate: true },
        { id: 'cDiffAdj', display: 'C diff adj', hasRate: true, isDiff: true },
        { id: 'cfPctAdj', display: 'CF% adj' },
        { id: 'shPct', display: 'Sh%' },
        { id: 'svPct', display: 'Sv%' },
        { id: 'pdo', display: 'PDO' },
        { id: 'ofoPct', display: 'OFO%' },
        { id: 'dfoPct', display: 'DFO%' },
        { id: 'ofo', display: 'OFO', hasRate: true },
        { id: 'dfo', display: 'DFO', hasRate: true },
        { id: 'nfo', display: 'NFO', hasRate: true },
        { id: 'otf', display: 'OTF', hasRate: true },
      ],
    };
  },
  created() {
    this.fetchData();
  },
  watch: {
    nameDebounced: _.debounce(function setNameQuery() {
      this.nameQuery = this.nameDebounced;
    }, 250),
    toiDebounced: _.debounce(function setToiQuery() { this.toiQuery = this.toiDebounced; }, 250),
    gpDebounced: _.debounce(function setGpQuery() { this.gpQuery = this.gpDebounced; }, 250),
    showRates() {
      this.toggleRates();
    },
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
      return this.rows.filter((r) => {
        let returned = true;
        if (this.nameQuery) {
          returned = r.name.toLowerCase().indexOf(this.nameQuery) >= 0;
        }

        if (returned && this.toiQuery) {
          returned = r.mins >= this.toiQuery;
        }

        if (returned && this.gpQuery) {
          returned = r.gp >= this.gpQuery;
        }

        if (this.teamQuery) {
          returned = r.teams.indexOf(this.teamQuery) >= 0;
        }

        if (returned && this.posQuery) {
          if (this.posQuery === 'f') {
            returned = r.positions.indexOf('c') >= 0
              || r.positions.indexOf('l') >= 0
              || r.positions.indexOf('r') >= 0;
          } else {
            returned = r.positions.indexOf(this.posQuery) >= 0;
          }
        }
        return returned;
      });
    },
  },
  methods: {
    fetchData() {
      const xhr = new XMLHttpRequest();
      const route = '/skaters/?start=20161010&end=20170510&strSits=ev5';
      xhr.open('GET', `${API_URL}${route}`);
      xhr.onload = () => {
        this.rows = JSON.parse(xhr.responseText).skaters
          .filter((r) => {
            // Remove players who played less than 1 minute
            // eslint-disable-next-line no-param-reassign
            r.mins = r.toi / 60;
            return Math.round(r.mins) > 0;
          })
          .map(r => this.initRow(r));

        // By default, rates are not shown, so set decimal places to 0
        this.columns.forEach((c) => {
          if (typeof this.rows[0][c.id] === 'number') {
            // eslint-disable-next-line no-param-reassign
            c.decimals = 0;
          }
        });

        this.sortRows();
      };
      xhr.send();
    },

    // Convert stats between counts and rates
    toggleRates() {
      this.rows = this.rows.map((r) => {
        this.columns.filter(c => c.hasRate)
          .forEach((c) => {
            /* eslint-disable no-param-reassign */
            r[c.id] = this.showRates ?
              (60 * 60) * (r[c.id] / r.toi) :
              (r[c.id] * r.toi) / (60 * 60);
            c.decimals = this.showRates ? 1 : 0;
            /* eslint-enable */
          });
        return r;
      });
      this.sortRows();
    },

    // Set sort order
    setSort(col) {
      this.sortOrder = col.id === this.sortCol ? -this.sortOrder : -1;
      this.sortCol = col.id;
      this.sortRows();
    },

    // Sort rows by the specified column
    sortRows() {
      if (typeof this.rows[0][this.sortCol] === 'string') {
        this.rows.sort((a, b) => {
          const aVal = a[this.sortCol].toLowerCase();
          const bVal = b[this.sortCol].toLowerCase();
          if (aVal > bVal) {
            return -1 * this.sortOrder;
          } else if (aVal < bVal) {
            return 1 * this.sortOrder;
          }

          return 0;
        });
      } else {
        // Sort numbers
        this.rows.sort((a, b) => this.sortOrder * (a[this.sortCol] - b[this.sortCol]));
      }
    },

    // Initialize the given row: format strings, calculate stats
    initRow(r) {
      /* eslint-disable no-param-reassign */
      r.name = `${r.first_name} ${r.last_name}`.replace(/\./g, '');
      r.posString = r.positions.toString()
        .toUpperCase()
        .replace(/,/g, ', ');
      r.teamString = r.teams.toString()
        .toUpperCase()
        .replace(/,/g, ', ');
      r.minsPerGp = (r.toi / 60) / r.gp;
      r.ip = r.ig + r.ia1 + r.ia2;
      r.iShPct = r.isog === 0 ? 0 : 100 * (r.ig / r.isog);
      r.penDiff = r.i_eff_pen_drawn - r.i_eff_pen_taken;
      r.iFoWinPct = r.i_fo_won + r.i_fo_lost === 0 ? 0
        : 100 * (r.i_fo_won / (r.i_fo_won + r.i_fo_lost));
      r.gfPct = r.gf + r.ga === 0 ? 0 : 100 * (r.gf / (r.gf + r.ga));
      r.gDiff = r.gf - r.ga;
      r.cDiff = r.cf - r.ca;
      r.cfPct = r.cf + r.ca === 0 ? 0 : 100 * (r.cf / (r.cf + r.ca));
      r.cDiffAdj = r.adj_cf - r.adj_ca;
      r.cfPctAdj = r.adj_cf + r.adj_ca === 0 ? 0
        : 100 * (r.adj_cf / (r.adj_cf + r.adj_ca));
      r.shPct = r.sf === 0 ? 0 : 100 * (r.gf / r.sf);
      r.svPct = r.sa === 0 ? 0 : 100 * (1 - (r.ga / r.sa));
      r.pdo = r.shPct + r.svPct;
      r.ofoPct = 100 * (r.ofo / (r.ofo + r.dfo + r.nfo + r.otf));
      r.dfoPct = 100 * (r.dfo / (r.ofo + r.dfo + r.nfo + r.otf));
      /* eslint-enable */
      return r;
    },
  },
};
</script>
