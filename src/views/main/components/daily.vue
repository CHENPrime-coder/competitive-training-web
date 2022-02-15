<template>
    <div id="daily" v-loading="loading">
        <h1>今天和昨天的日报：</h1>
        <el-card id="daily_card" v-for="(daily,index) in dailys" :key="index">
            <template #header>
                <div id="card_header">
                    <div>
                        <h3>{{daily.dname}}</h3> <br>
                        <span>发布日期: {{daily.ddate.substr(0,10)}}</span>
                    </div>
                    <div id="reporter">
                        日报人:&nbsp;&nbsp;&nbsp;&nbsp;
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
            <div id="dailt_body" v-html="daily.dbody.length>50?daily.dbody.substr(0,50)+'……':daily.dbody">
            </div>
            <div id="card_footer">
                <el-tag type="success" v-if="daily.ddate.substr(0,10)===nowDate">
                    今天的日报
                </el-tag>
                <el-tag v-else>
                    昨天天的日报
                </el-tag>
                <el-button type="primary" @click="onDailyFrame = true;nowDaily = daily;nowUser = users.get(index)">查看具体内容</el-button>
            </div>
        </el-card>
        <el-dialog
            v-model="onDailyFrame"
            v-if="nowDaily != undefined"
        >
            <template #title>
                <div id="taskTitle">
                    <div>
                        <h1 style="margin:0;">{{nowDaily.dname}}</h1>
                        <el-tag type="success" v-if="nowDaily.ddate.substr(0,10)===nowDate">
                            今天的日报
                        </el-tag>
                        <el-tag v-else>
                            昨天天的日报
                        </el-tag>
                    </div>
                    <div id="reporter">
                        日报人:&nbsp;&nbsp;&nbsp;&nbsp;
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

            <div v-html="nowDaily.dbody">
            </div>
            <template #footer>
                <div id="dialog_footer">
                    <span>日报发布日期： {{nowDaily.ddate.substr(0,10)}}</span>
                    <el-button type="primary" @click="onDailyFrame = false">确认</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { ref } from '@vue/reactivity';
import store from "../store/store";

export default {
    name: 'daily',
    mounted: function () {
        this.axios({
            method: "GET",
            url: "https://"+store.state.ip+':'+store.state.port+"/daily"
        })
        .then((response) => {
            for(let i=0;i<response.data.length;i++){
                this.getUserInfo(response.data[i].reporter,i)
                let str = response.data[i].dbody
                str.replace(/\n/g," <br> ")
                str.replace(/\s/g,"&nbsp;")
                response.data[i].dbody = str.replace(/\r\n/g," <br> ")
            }
            this.nowDaily = response.data[0]
            this.dailys = response.data
            this.loading = false
        })
    },
    data: function () {
        return {
            dailys: [],
            loading: true,
            users: ref(new Map()),
            imgBaseUrl: 'http://1.117.145.48/springbootUPLOAD/',
            nowDate: new Date().toISOString().substr(0,10),
            onDailyFrame: false,
            nowDaily: ref(null),
            nowUser: ref(null)
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