<template>
  <span>
    <div class="reconnection-info">Complete data may not displayed due to your internet
      connection issue. Please try again.</div>
  </span>
</template>

<script>
export default {
  name: "ConnectionInfo"
}
</script>

<style scoped>
.reconnection-info {
  color: red;
  font-weight: bold;
  margin: 10px 0 10px 0;
}
</style>