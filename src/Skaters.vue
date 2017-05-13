<template>
  <div>
    <h3>Skaters</h3>
    <DataTable :tableData="skaters"></DataTable>
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
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      const self = this;
      const xhr = new XMLHttpRequest();
      const route = '/skaters/?start=20151010&end=20160510&strSits=ev5';
      xhr.open('GET', `${API_URL}${route}`);
      xhr.onload = () => (self.skaters = JSON.parse(xhr.responseText).skaters);
      xhr.send();
    },
  },
};
</script>
