import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App'
import router from './router' //引入router
import store from './store'  //引入Store
import '@/icons' // icon
import '@/permission' // 权限

Vue.use(ElementUI);

Vue.config.productionTip = false ;//关闭productions模式提示

//实例化vue对象，使用store
new Vue({
  el: '#app',
  router,  //使用router
  store, //使用Store
  //使用App.vue
  template: '<App/>',
  components: { App }
});
