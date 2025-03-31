import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// use 安装库
app.use(ElementPlus)



// iconfont
import "@assets/iconfont/iconfont.css";

// 全部css
import '@/assets/css/index.less' // global css

import axios from '@axios/request'
// 全局ctx(this) 上挂载 $axios
// app.config.globalProperties.$api = axios
app.provide('$api', axios)


// router
import router from "@/router/router.js";
app.use(router)


// pinia
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(
    createPersistedState({
        auto: true,
        storage: sessionStorage,
    })
)

app.use(pinia)


// 挂载到html上
app.mount('#app')
