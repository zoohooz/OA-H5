import Vue from 'vue'
import App from './App'
import store from './store' // store
import plugins from './plugins' // plugins
import './permission' // permission

import { getDicts } from "@/api/system/dict/data";
import {getDictsList} from "@/utils/dict_self.js"

import {  addDateRange,handleTree } from "@/utils/ycyy";

import uView from "uview-ui";
Vue.use(uView);

Vue.use(plugins)
// router
import {router,RouterMount} from './router/index.js'  //路径换成自己的
Vue.use(router)

import  globlComponents from '@/components/globalComponents.js'
let componentNames = Object.keys(globlComponents);
componentNames.forEach(ele => {
  Vue.component(ele, globlComponents[ele])
})

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$getDicts = getDicts
Vue.prototype.$getDictsList = getDictsList
Vue.prototype.addDateRange = addDateRange
Vue.prototype.handleTree = handleTree

App.mpType = 'app'
const app = new Vue({
  ...App
})
RouterMount(app,router,'#app')
app.$mount()
