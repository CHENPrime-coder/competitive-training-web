<template>
    <div id="list" v-loading="loading">
        <h1>全部任务：</h1> 
        <el-card v-for="(item,index) in tasks" :key="item.pid" id="onelist">
            <template #header>
                <div id="card_header">
                    <span>{{item.tname}}</span>
                    <span>任务发布日期: {{item.tdate}}</span>
                </div>
            </template>
            <span v-html="item.tbody.length>50?item.tbody.substr(0,50)+'……':item.tbody"></span>
            <div id="card_footer">
                <span>任务发布人：{{item.publisher}}</span>
                <div id="card_footer_buttons">
                    <el-popconfirm
                        confirm-button-text="确定"
                        confirm-button-type="danger"
                        cancel-button-text="取消"
                        title="你确定要删除这个任务吗？"
                        @confirm="delTask(item.tid)"
                    >
                        <template #reference>
                            <el-button type="danger">删除任务</el-button>
                        </template>
                    </el-popconfirm>
                    <el-button type="primary" @click="openTaskDetail(index)">查看具体内容</el-button>
                </div>
            </div>
        </el-card>
        <el-dialog
            v-model="taskFrameVisable"
            width="80%"
        >
            <template #title>
                <div id="taskTitle">
                    <h1 style="margin:0;">{{nowTask.tname}}</h1>
                </div>
            </template>
            <el-container id="taskMembers">
                任务成员：
                <members :memberStr="nowTask.tmembers"/>
            </el-container>
            <!-- {{nowTask}} -->
            <div id="taskBody" v-html="nowTask.tbody">
            </div>
            <br>
            <span>任务附带文件:</span>
            <el-link :href="TaskFileUrl+nowTask.tfiles" type="primary" v-if="nowTask.tfiles">{{nowTask.tfiles}}</el-link>
            <span v-else>无</span>
            <br>
            <br>
            任务进度:
            <el-progress
                v-if="nowTask.progress<=40"
                status="exception"
                :text-inside="true"
                :stroke-width="25"
                :percentage="nowTask.progress"
            >
            </el-progress>
            <el-progress
                v-else-if="nowTask.progress<90"
                :text-inside="true"
                :stroke-width="25"
                :percentage="nowTask.progress"
            >
            </el-progress>
            <el-progress
                v-else-if="nowTask.progress>=90"
                status="success"
                :text-inside="true"
                :stroke-width="25"
                :percentage="nowTask.progress"
            >
            </el-progress>
            <br>
            <el-descriptions
                title="任务时间规定"
                :column="1"
                border
            >
                <template #extra>
                    <el-button @click="changeProgress">修改任务进度</el-button>
                </template>
                <el-descriptions-item>
                    <template #label>
                        <div class="cells">
                            <el-icon><calendar /></el-icon>
                        任务开始时间
                        </div>
                    </template>
                    {{nowTask.startdate.substr(0,10)}}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cells">
                            <el-icon><calendar /></el-icon>
                        任务结束时间
                        </div>
                    </template>
                    {{nowTask.enddate.substr(0,10)}}
                </el-descriptions-item>
            </el-descriptions>
            <el-dialog
                v-model="changeProgressFrame"
                width="50%"
                draggable
            >
                <template #title>
                    <div id="taskTitle">
                        <h1 style="margin:0;">修改进度</h1>
                    </div>
                </template>
                <el-slider v-model="nowTask.progress" show-input> </el-slider>
                <template #footer>
                <div id="dialog_footer">
                    <el-button type="primary" 
                    @click="uploadProgress(nowTask.progress,nowTask.tid)">确认</el-button>
                </div>
            </template>
            </el-dialog>
            <template #footer>
                <div id="dialog_footer">
                    <span>任务发布日期： {{nowTask.tdate}}</span>
                    <el-button type="primary" @click="taskFrameVisable = false">确认</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { ref } from 'vue'
import store from '../store/store'
import members from './members.vue'
import { Calendar } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

export default {
    name: 'list',
    data: function () {
        return {
            tasks: [],
            taskFrameVisable: ref(false),
            nowTask: {
                tid: 0,
                publisher: "",
                tbody: "",
                tname: "",
                tfiles: "",
                progress: "",
                startdate: "",
                enddate: "",
                tmembers: "",
                tdate: ""
            },
            TaskFileUrl: 'http://1.117.145.48/springbootUPLOAD/',
            changeProgressFrame: ref(false),
            oldProgress: ref(0),
            loading: true
        }
    },
    mounted: function () {
        this.axios({
            method: "GET",
            url: 'https://'+store.state.ip+':'+store.state.port+'/task'
        })
        .then((repsonse) => {
            let data = repsonse.data
            for(let i=0;i<data.length;i++){
                let str = data[i].tbody
                str.replace(/\n/g," <br> ")
                str.replace(/\s/g,"&nbsp;")
                data[i].tbody = str.replace(/\r\n/g," <br> ")
            }
            this.$data.tasks = data
            this.$data.nowTask = data[0]
            this.loading = false
        })
    },
    methods: {
        openTaskDetail: function (index) {
            this.nowTask = this.tasks[index]
            this.taskFrameVisable = true
        },
        changeProgress: function () {
            this.oldProgress=this.nowTask.progress
            this.changeProgressFrame = true
        },
        uploadProgress: function (prgress,target) {
            this.axios({
                method: 'PUT',
                url: 'https://'+store.state.ip+':'+store.state.port+'/task',
                params: {
                    progress: prgress,
                    tid: target
                }
            })
            .then((response) => {
                if(response.data.code==='403'){
                    ElMessage({
                        message: '老师不可以修改任务进度，更新失败',
                        type: "error"
                    })
                    this.nowTask.progress = this.oldProgress
                }else if(response.data.code==='200'){
                    ElMessage({
                        message: '更新成功',
                        type: "success"
                    })
                }else{
                    ElMessage({
                        message: '更新失败',
                        type: "error"
                    })
                    this.nowTask.progress = this.oldProgress
                }
                this.changeProgressFrame = false;
            })
        },
        delTask: function (tid) {
            this.axios({
                method: 'DELETE',
                url: 'https://'+store.state.ip+':'+store.state.port+'/task',
                params: {
                    tid: tid
                }
            })
            .then((response) => {
                if(response.data.code==='403'){
                    ElMessage({
                        message: '学生不可以删除任务，删除任务失败',
                        type: "error"
                    })
                }else if(response.data.code==='200'){
                    ElMessage({
                        message: '删除任务成功',
                        type: "success"
                    })
                    window.location.reload()
                }else{
                    ElMessage({
                        message: '删除任务失败',
                        type: "error"
                    })
                }
            })
        }
    },
    components: {
        members,
        "calendar": Calendar
    }
}
</script>

<style scoped>

</style>