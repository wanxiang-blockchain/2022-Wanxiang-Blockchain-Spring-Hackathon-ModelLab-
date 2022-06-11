import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

import store from './store'
import router from './router'

import './assets/AliIcon/iconfont'
import './assets/AliIcon/iconfont.css'
Vue.use(ElementUI)
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
})
Vue.config.productionTip = false

new Vue({

  render: h => h(App),
  store,
  router
}).$mount('#app')
