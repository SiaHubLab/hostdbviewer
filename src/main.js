/* jshint esversion: 6 */
/* jshint asi: true */

import Vue from 'vue'
import App from './App'
import router from './router'

window.axios = require('axios')

window.axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest'
}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
