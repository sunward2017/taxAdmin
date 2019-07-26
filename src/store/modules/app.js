import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    },
    hotBigTypes:{},
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    SETHOTBIGTYPES:(state,types) =>{
        state.hotBigTypes = types;
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    SetHotBitTypes:({commit},types) =>{
        return new Promise(resolve =>{
         commit('SETHOTBIGTYPES',types);
        })
    }
  }
}

export default app
