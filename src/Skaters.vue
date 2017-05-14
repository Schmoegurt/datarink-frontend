<template>
  <div style="height: calc(100% - 32px); position: relative;">
    <h3>Skaters</h3>
    <input type="text" style="margin-bottom: 16px;" v-model="search"></input>
    <DataTable style="height: calc(100% - 48px);" :rows="filteredRows" :columns="columns"></DataTable>
  </div>
</template>

<script>
const DataTable = require('./components/DataTable.vue');

module.exports = {
  name: 'Skaters',
  components: {
    DataTable,
  },
  data() {
    return {
      search: '',
      rows: [],
      columns: [
        { id: 'name', display: 'Name', leftAligned: true },
        { id: 'position', display: 'Pos', leftAligned: true },
        { id: 'teamString', display: 'Teams' },
        { id: 'gp', display: 'GP' },
        { id: 'mins', display: 'Mins' },
        { id: 'ig', display: 'G' },
        { id: 'ia1', display: 'A1' },
        { id: 'ia2', display: 'A2' },
        { id: 'ip', display: 'Pts' },
        { id: 'ic', display: 'Corsi' },
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
        { id: 'gfPct', display: 'GF%' },
        { id: 'cf', display: 'CF' },
        { id: 'ca', display: 'CA' },
        { id: 'cfPct', display: 'CF%' },
        { id: 'adj_cf', display: 'CF adj' },
        { id: 'adj_ca', display: 'CA adj' },
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
  computed: {
    filteredRows() {
      const self = this;
      if (!self.search) {
        return this.rows;
      } else {
        return this.rows.filter(r => r.name.toLowerCase().indexOf(self.search) >= 0);
      }
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
          .map((r) => {
            /* eslint-disable no-param-reassign */
            r.name = `${r.first_name} ${r.last_name}`.replace(/\./g, '');
            r.teamString = r.teams.toString()
              .toUpperCase()
              .replace(/\,/g, ', ');
            r.mins = Math.round(r.toi / 60);
            r.ip = r.ig + r.ia1 + r.ia2;
            r.iShPct = r.isog === 0 ? 0 : Math.round(1000 * (r.ig / r.isog)) / 10;
            r.penDiff = r.i_eff_pen_drawn - r.i_eff_pen_taken;
            r.iFoWinPct = r.i_fo_won + r.i_fo_lost === 0 ? 0
              : Math.round(1000 * (r.i_fo_won / (r.i_fo_won + r.i_fo_lost))) / 10;
            r.gfPct = r.gf + r.ga === 0 ? 0 : Math.round(1000 * (r.gf / (r.gf + r.ga))) / 10;
            r.cfPct = r.cf + r.ca === 0 ? 0 : Math.round(1000 * (r.cf / (r.cf + r.ca))) / 10;
            r.cfPctAdj = r.adj_cf + r.adj_ca === 0 ? 0
              : Math.round(1000 * (r.adj_cf / (r.adj_cf + r.adj_ca))) / 10;
            r.shPct = r.sf === 0 ? 0 : Math.round(1000 * (r.gf / r.sf)) / 10;
            r.svPct = r.sa === 0 ? 0 : Math.round(1000 * (1 - (r.ga / r.sa))) / 10;
            r.pdo = Math.round(10 * (r.shPct + r.svPct)) / 10;
            r.ofoPct = Math.round(1000 * (r.ofo / (r.ofo + r.dfo + r.nfo + r.otf))) / 10;
            r.dfoPct = Math.round(1000 * (r.dfo / (r.ofo + r.dfo + r.nfo + r.otf))) / 10;

            // Round adjusted corsi after calculating adjusted cfPct
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
