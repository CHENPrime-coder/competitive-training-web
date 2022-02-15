<template>
    <div id="plan" v-loading="loading">
        <h1>全部计划：</h1>
        <el-card id="plan_card" v-for="(plan,index) in plans" :key="index">
            <template #header>
                <div id="card_header">
                    <div>
                        <h3>{{plan.pname}}</h3> <br>
                        <span>发布日期: {{plan.pdate.substr(0,10)}}</span>
                    </div>
                    <div id="reporter">
                        计划发布者:&nbsp;&nbsp;&nbsp;&nbsp;
                        <el-tooltip
                            effect="dark"
                            placement="top-start"
                            v-if="users.get(index) != undefined "
                            :content="users.get(index).username"
                        >
                            <el-avatar v-if="users.get(index) != undefined " :size="60" shape="square" :src="imgBaseUrl+users.get(index).headiconURL"></el-avatar>
                        </el-tooltip>
                    </div>
                </div>
            </template>
            <div id="dailt_body" v-html="plan.pbody.length>50?plan.pbody.substr(0,50)+'……':plan.pbody">
            </div>
            <div id="card_footer">
                <el-tag v-if="plan.ptype==='周计划'" type="warning  ">{{plan.ptype}}</el-tag>
                <el-tag v-else-if="plan.ptype==='月计划'" type="">{{plan.ptype}}</el-tag>
                <el-tag v-else-if="plan.ptype==='学期计划'" type="success">{{plan.ptype}}</el-tag>
                <el-button type="primary" @click="onPlanFrame = true;nowPlan = plan;nowUser = users.get(index)">查看具体内容</el-button>
            </div>
        </el-card>
        <el-dialog
            v-model="onPlanFrame"
            v-if="nowPlan != undefined"
        >
            <template #title>
                <div id="taskTitle">
                    <div>
                        <h1 style="margin:0;">{{nowPlan.pname}}</h1>
                        <el-tag v-if="nowPlan.ptype==='周计划'" type="warning  ">{{nowPlan.ptype}}</el-tag>
                        <el-tag v-else-if="nowPlan.ptype==='月计划'" type="">{{nowPlan.ptype}}</el-tag>
                        <el-tag v-else-if="nowPlan.ptype==='学期计划'" type="success">{{nowPlan.ptype}}</el-tag>
                    </div>
                    <div id="reporter">
                        计划发布者:&nbsp;&nbsp;&nbsp;&nbsp;
                        <el-tooltip
                            effect="dark"
                            placement="top-start"
                            v-if="nowUser != undefined "
                            :content="nowUser.username"
                        >
                            <el-avatar v-if="nowUser != undefined " :size="60" shape="square" :src="imgBaseUrl+nowUser.headiconURL"></el-avatar>
                        </el-tooltip>
                    </div>
                </div>
            </template>

            <div v-html="nowPlan.pbody">
            </div>
            <template #footer>
                <div id="dialog_footer">
                    <span>计划发布日期： {{nowPlan.pdate.substr(0,10)}}</span>
                    <el-button type="primary" @click="onPlanFrame = false">确认</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { ref } from '@vue/reactivity';
import store from "../store/store";

export default {
    name: 'plan',
    mounted: function () {
        this.axios({
            method: "GET",
            url: "https://"+store.state.ip+':'+store.state.port+"/plan"
        })
        .then((response) => {
            for(let i=0;i<response.data.length;i++){
                this.getUserInfo(response.data[i].planner,i)
                this.getUserInfo(response.data.planner,i)
                let str = response.data[i].pbody
                str.replace(/\n/g," <br> ")
                str.replace(/\s/g,"&nbsp;")
                response.data[i].pbody = str.replace(/\r\n/g," <br> ")
            }
            this.plans = response.data
            this.loading = false
        })
    },
    data: function () {
        return {
            plans: [],
            loading: true,
            onPlanFrame: false,
            nowPlan: ref(null),
            imgBaseUrl: 'http://1.117.145.48/springbootUPLOAD/',
            nowUser: ref(null),
            users: ref(new Map())
        }
    },
    methods: {
        getUserInfo: function (username,key) {
            this.axios({
                method: "GET",
                url: "https://"+store.state.ip+':'+store.state.port+"/personalname/"+username
            })
            .then((response) => {
                let url = response.data.headiconURL
                response.data.headiconURL = url.split('/')[2]
                this.users.set(key,response.data)
            })
        }
    }
}
</script>

<style scoped>

</style>