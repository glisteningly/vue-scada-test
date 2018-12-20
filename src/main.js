import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import ScadaComps from './components/Scada'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.scss'

Vue.use(Element, { size: 'mini', zIndex: 3000 })

Vue.use(ScadaComps)

import { MQTTService } from 'as-utils'
import VueMqtt from 'vue-mqtt'
import uuidv4 from 'uuid/v4'

const mqttConnInfo = {
  url: MQTTService.getURL('10.0.0.11'),
  userInfo: MQTTService.getCertificate()
}

// console.log(mqttConnInfo)

Vue.use(VueMqtt, mqttConnInfo.url, {
  clientId: 'ScadaPreviewer-' + uuidv4(),
  username: mqttConnInfo.userInfo.username,
  password: mqttConnInfo.userInfo.password
})

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
