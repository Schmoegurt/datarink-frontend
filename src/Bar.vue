<template>
  <div>
    <h3>Bar</h3>
    <p>{{ message }}</p>
  </div>
</template>

<script>
module.exports = {
  name: 'Bar',
  data: () => ({
    message: 'Hello Bar!',
  }),
};
</script>
