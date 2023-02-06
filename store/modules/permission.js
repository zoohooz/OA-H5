import auth from '@/plugins/auth'
import { getRouters } from '@/api/menu'
const permission = {
  state: {
		allRoutes: [],
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: []
  },
  mutations: {
		SET_ALL_ROUTES:(state, routes) =>{
			state.allRoutes = routes
		},
    SET_ROUTES: (state, routes) => {
			state.routes = routes
      state.addRoutes = routes
      // state.routes = constantRoutes.concat(routes)
    },
    SET_DEFAULT_ROUTES: (state, routes) => {
      // state.defaultRoutes = constantRoutes.concat(routes)
    },
    SET_TOPBAR_ROUTES: (state, routes) => {
      state.topbarRouters = routes
    },
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      state.sidebarRouters = routes
    },
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        getRouters().then(res => {
					console.log('store-getRouters->',/* res */)
					// xzh
					const {data} = res
					commit('SET_ALL_ROUTES', data)
					resolve(data)
					// end
        })
      })
    }
  }//actions
}


export default permission