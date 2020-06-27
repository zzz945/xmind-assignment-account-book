import Vue from 'vue'
import App from './App.vue'
import Request from './utils/request'
import QueryManagement from './utils/query-management'
import VueRouter from 'vue-router'
import routes from './routes'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Request)
Vue.use(QueryManagement)

const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
