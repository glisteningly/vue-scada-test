import Vue from 'vue'
import Router from 'vue-router'
import Main from './components/Main'
import Entry from './components/Entry'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: Entry
    },
    {
      path: '/scadaeditor/:id',
      name: 'scadaEditor',
      component: Main
    }
  ]
})
