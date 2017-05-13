<template>
  <div>
    <h3>Skaters</h3>
    <p>{{ message }}</p>
  </div>
</template>

<script>
module.exports = {
  name: 'Skaters',
  data: () => ({
    message: '',
  }),
  created: function created() {
    this.message = [1, 2, 3].map(d => 2 * d);
  },
};
</script>
