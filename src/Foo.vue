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
    this.message = 'Hi';
  },
};
</script>
