import Vue from 'vue'
import App from './App.vue'
import VueKonva from 'vue-konva'
import store from './store'

Vue.use(VueKonva)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
