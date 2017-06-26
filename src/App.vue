<template>
  <div class="container-fluid" id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Open Sans', sans-serif;
  color: #2c3e50;
  font-size: 12px;
  margin-top: 10px;
}
</style>
