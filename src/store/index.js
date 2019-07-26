import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import getters from './getters'

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    user,
    permission
  },
  getters
});

//store是状态，在下面是app,user,permission和getters状态 Vuex.Store  下面是把状态暴露出去，在main.js中使用store

export default store
