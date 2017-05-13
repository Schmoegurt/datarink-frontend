<template>
  <div style="height: calc(100% - 32px); position: relative;">
    <h3>Skaters</h3>
    <DataTable style="height: calc(100% - 48px);" :rows="skaters" :columns="columns"></DataTable>
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
      skaters: [],
      columns: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      const self = this;
      const xhr = new XMLHttpRequest();
      const route = '/skaters/?start=20161010&end=20170510&strSits=ev5';
      xhr.open('GET', `${API_URL}${route}`);
      xhr.onload = () => {
        self.skaters = JSON.parse(xhr.responseText).skaters;
        self.columns = Object.keys(self.skaters[0]);
      };
      xhr.send();
    },
  },
};
</script>
