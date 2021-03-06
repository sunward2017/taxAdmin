import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken,getAccount,setAccount,removeAccount} from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: [],
    roles: [],
    clients:{},
    cId: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_CLIENTS:(state,clients)=>{
      state.clients = clients;
    },
    SET_CID: (state, cId) => {
      state.cId = cId;
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data;
          setToken(data.session);
          setAccount(escape(JSON.stringify(data)));
          commit('SET_TOKEN', data.session);
          commit('SET_CID',data.cId);
          //Promise操作结果作为resolve(value)参数传出,这里应该是没有传出结果
          resolve();
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
          let data = JSON.parse(unescape(getAccount()));
          commit('SET_ROLES', data.type);
          resolve(data);
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
//      logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          removeToken();
          resolve()
//      }).catch(error => {
//        reject(error)
//      })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        removeToken();
        removeAccount();
        resolve()
      })
    },
    setClients({commit},clients){
      return new Promise(resolve =>{
         commit('SET_CLIENTS',clients);
      })
    }
  }
};

export default user
