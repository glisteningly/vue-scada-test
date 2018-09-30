import Vue from 'vue'
import App from './App.vue'
import store from './store'
import ScadaComps from './components/Scada'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Element, { size: 'mini', zIndex: 3000 })

Vue.use(ScadaComps)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
