import { createApp } from 'vue'
import App from './App.vue'
import element from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'

axios.defaults.withCredentials = true
const app = createApp(App)

app.use(VueAxios,axios)
app.use(element).mount('#app')
