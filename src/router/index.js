import Vue from 'vue'
import Router from 'vue-router'
import ShowMap from '@/components/ShowMap'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ShowMap',
      component: ShowMap
    }
  ]
})
