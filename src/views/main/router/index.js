import { createRouter,createWebHistory } from "vue-router";
import home from '../components/home.vue'
import daily from '../components/daily.vue'
import plan from '../components/plan.vue'
import prom from '../components/prom.vue'
import list from '../components/list.vue'
import studio from '../components/studio.vue'

const routerHistory = createWebHistory();

export default createRouter({
    history: routerHistory,
    routes: [
        {
            path: '/main/home',      //家目录
            component: home
        },
        {
            path: '/main/daily',     //日报
            component: daily
        },
        {
            path: '/main/plan',      //计划
            component: plan
        },
        {
            path: '/main/prom',      //发布
            component: prom
        },
        {
            path: '/main/list',      //任务
            component: list
        },
        {
            path: '/main/studio',    //工作室页
            component: studio
        }
    ]
})