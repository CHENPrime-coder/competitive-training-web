// studioInfo
import { createApp } from 'vue'
import studioInfo from './studioInfo.vue'
import element from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import vueRouter from './router'
axios.defaults.withCredentials = true

const Main = createApp(studioInfo)
Main.config.globalProperties.$axios=axios
Main.use(vueRouter)
Main.use(element)
Main.use(VueAxios,axios).mount("#studioInfo")