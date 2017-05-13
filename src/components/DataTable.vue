<template>
  <div>
    <p>{{ size }} skaters</p>
  </div>
</template>

<script>
module.exports = {
  name: 'DataTable',
  props: {
    tableData: Array,
  },
  computed: {
    size() {
      return this.tableData.length;
    },
  },
};
</script>
