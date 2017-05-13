<template>
  <div>
    <h3>Skaters</h3>
    <p>{{ skaters }}</p>
  </div>
</template>

<script>
module.exports = {
  name: 'Skaters',
  data: function () {
    return {
      skaters: ['empty'],
    };
  },
  created: function() {
    this.fetchData();
  },
  methods: {
    fetchData: function () {
      const self = this;
      const xhr = new XMLHttpRequest();
      const route = '/skaters/?start=20151010&end=20160510&strSits=ev5';
      xhr.open('GET', `${API_URL}${route}`);
      xhr.onload = function () {
        self.skaters = JSON.parse(xhr.responseText).skaters;
      }
      xhr.send();
    }
  },
};
</script>
