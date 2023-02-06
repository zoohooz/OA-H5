// router.js
import {
	RouterMount,
	createRouter
} from 'uni-simple-router';
import store from '@/store/index.js'
import {
	getToken
} from '@/utils/auth'

const router = createRouter({
	h5: {
		vueRouterDev: false,
	},
	APP: {
		holdTabbar: false //默认true 
	},
	platform: process.env.VUE_APP_PLATFORM,
	routes: [
		...ROUTES
	]
});
router.beforeEach((to, from, next) => {
	let {
		allRoutes
	} = store.state.permission
	if (allRoutes.length == 0) {
		if (getToken()) {
		  store.dispatch('GenerateRoutes')
		}
	}
	next();
});
// 全局路由后置守卫
router.afterEach((to, from) => {
	console.log('router-跳转结束')
})

export {
	router,
	RouterMount
}
