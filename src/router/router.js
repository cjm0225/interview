import { defineAsyncComponent } from 'vue'
import { createRouter, createWebHashHistory, } from 'vue-router'

// 引入NProgress进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


// 关闭加载条右下方的小圈圈
NProgress.configure({ showSpinner: false });

const routes = [
    {
        path: '/',
        component: () => import('@/page/three/index.vue')
    },
    {
        path: '/404',
        name: '404',
        component: defineAsyncComponent(() => import('@/page/404/index.vue'))
    },
    {
        path: '/:pathMatch(.*)',//vue3的404页面新写法
        redirect: '/404'
    },


]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})


// 白名单
const whiteRouter = ["/login"];


// 前置路由守卫
router.beforeEach((to, from, next) => {
    NProgress.start()
    next();
});


// 后置路由守卫
router.afterEach(() => {
    NProgress.done()
})

// 动态路由
export function dynamicRouter() {
    let routerList = store.state.app.menuList;

    const createRouter = new VueRouter({
        routes,
    });

    router.matcher = createRouter.matcher;

    if (routerList.length > 0) {
        importComponent(routerList);
        router.addRoute(...routerList);
    }
}

function importComponent(routerList) {
    routerList.forEach((route) => {
        let component = route.menuurl;
        route.meta = {
            en: route.menunameen,
            zh: route.menunamezh,
        }
        route.component = (resolve) =>
            require([`@/views/${component}.vue`], resolve);
        if (route.children && route.children.length) {
            importComponent(route.children);
        }
    });
}

// 路由还原
export function resetRouter() {
    const createRouter = new VueRouter({
        routes,
    });

    router.matcher = createRouter.matcher;
}



export default router
