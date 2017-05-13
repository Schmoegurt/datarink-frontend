<template>
  <div>
    <h3>Foo</h3>
    <p>{{ message }}</p>
  </div>
</template>

<script>
module.exports = {
  name: 'Foo',
  data: () => ({
    message: '',
  }),
  created: function created() {
    this.message = [1, 2, 3].map(d => 2 * d);
  },
};
</script>
