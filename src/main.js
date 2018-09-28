import Vue from 'vue'
import App from './App.vue'
import store from './store'
import ScadaComps from './components/Scada'

Vue.use(ScadaComps)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
