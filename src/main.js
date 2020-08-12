import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import router from './router'
import mavonEditor from 'mavon-editor'
import store from './store'
import './permission'

import '@/assets/styles/element-ui.css'
import 'element-ui/lib/theme-chalk/index.css';
import 'mavon-editor/dist/css/index.css'
import '@/assets/styles/scrollbar.css'

Vue.config.productionTip = false

Vue.use(mavonEditor)
Vue.use(ElementUI)

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
