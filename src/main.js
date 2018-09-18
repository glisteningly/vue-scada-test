import Vue from 'vue'
import App from './App.vue'
import VueKonva from 'vue-konva'
import store from './store'
import CompWrapper from './components/compWrapper'

Vue.use(VueKonva)
Vue.component('CompWrapper', CompWrapper)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
