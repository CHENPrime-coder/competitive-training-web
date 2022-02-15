<template>
    <div id="prom">
        <el-tabs v-model="activeName" id="prom_tabs" label-width="90vw">
            <el-tab-pane name="task">
                <template #label>
                    <el-icon><list /></el-icon>
                    <span>发布任务</span>
                </template>
                <el-form :model="taskPromForm" :rules="taskRules" ref="taskPromFormRef">
                    <el-form-item label="任务名称:" prop="tname">
                        <el-input placeholder="最多20个字" v-model="taskPromForm.tname"></el-input>
                    </el-form-item>
                    <el-form-item label="任务内容:" prop="tbody">
                        <el-input placeholder="任务内容……" 
                        type="textarea" v-model="taskPromForm.tbody"
                        size="large"
                        :autosize="{minRows:5}"
                        id="taskBodyFormFrame"></el-input>
                    </el-form-item>
                    <el-form-item label="任务附带文件（只可以选一个）:" prop="tfiles">
                        <!-- 因为下面的action用不到所以随便填一点就好了 -->
                        <el-upload
                            action="111"
                            :before-upload="getFileNewName"
                        >
                            <el-button id="taskFilebutton" style="width:50vw">
                                <el-icon><plus/></el-icon>
                                {{taskPromForm.tfiles}}
                            </el-button>
                        </el-upload>
                    </el-form-item>
                    <el-row>
                        <el-form-item label="任务开始时间:" prop="startdate">
                            <el-date-picker value-format="YYYY-MM-DD" v-model="taskPromForm.startdate">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="任务结束时间:" prop="startdate" id="enddateForm">
                            <el-date-picker value-format="YYYY-MM-DD" v-model="taskPromForm.enddate">
                            </el-date-picker>
                        </el-form-item>
                    </el-row>

                    <el-form-item label="任务成员:" prop="tmembers">
                        <div id="studentsAvatarForm">
                            <div id="studentsAvatarDiv" v-for="studnet,index in students" :key="index">
                                <div id="avatarDiv" @click="selectStudent(index)">
                                    <el-avatar 
                                        id="studentsAvatar" 
                                        :size="80"
                                        :alt="studnet.username"
                                        :src="imgBaseUrl+studnet.headicon"
                                    >
                                    </el-avatar>
                                </div>
                                <h4 style="margin-top:0em;text-align:center;margin-button:0em">{{studnet.username}}</h4>
                            </div>
                        </div>
                        您选择了(点击头像选择)：<el-input readonly="true" v-model="taskPromForm.tmembers" :value="selectStudents.toString()"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <!--  -->
                        <el-button type="primary" @click="submitTaskForm">确 定 发 布</el-button>
                        <el-button @click="resetForm('taskPromFormRef')">重 置</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane name="plan">
                <template #label>
                    <el-icon><data-line /></el-icon>
                    <span>发布计划</span>
                </template>
                <!-- TODO -->
                <el-form :model="planPromForm" :rules="planRules" ref="planPromFormRef">
                    <el-form-item label="计划标题" prop="pname">
                        <el-input placeholder="最多20个字" v-model="planPromForm.pname"></el-input>
                    </el-form-item>
                    <el-form-item label="计划内容" prop="pbody">
                        <el-input placeholder="计划内容……" 
                        type="textarea" v-model="planPromForm.pbody"
                        size="large"
                        :autosize="{minRows:5}"
                        id="planBodyFormFrame"></el-input>
                    </el-form-item>
                    <el-form-item label="计划类型" prop="ptype">
                        <el-radio-group v-model="planPromForm.ptype">
                            <el-radio label="周计划" size="large">周计划</el-radio>
                            <el-radio label="月计划" size="large">月计划</el-radio>
                            <el-radio label="学期计划" size="large">学期计划</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <!--  -->
                        <el-button type="primary" @click="submitPlanForm">确 定 发 布</el-button>
                        <el-button @click="resetForm('planPromFormRef')">重 置</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane name="daily">
                <template #label>
                    <el-icon><document /></el-icon>
                    <span>发布日报</span>
                </template>
                <!-- TODO -->
                <el-form :model="dailyPromForm" :rules="dailyRules" ref="dailyPromFormRef">
                    <el-form-item label="日报标题" prop="dname">
                        <el-input placeholder="最多20个字" v-model="dailyPromForm.dname"></el-input>
                    </el-form-item>
                    <el-form-item label="日报内容" prop="dbody">
                        <el-input placeholder="日报内容……" 
                        type="textarea" v-model="dailyPromForm.dbody"
                        size="large"
                        :autosize="{minRows:5}"
                        id="dailyBodyFormFrame"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <!--  -->
                        <el-button type="primary" @click="submitDailyForm">确 定 发 布</el-button>
                        <el-button @click="resetForm('dailyPromFormRef')">重 置</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { DataLine, List ,Document, Plus } from '@element-plus/icons-vue'
import store from '../store/store'
import { ElMessage } from 'element-plus'

export default {
    name: 'prom',
    data: function () {
        return {
            dailyRules: reactive({
                dname: [
                    {
                        required: true,
                        message: "请输入日报名称",
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        max: 20,
                        message: "日报名称的长度在3-20之间" ,
                        trigger: 'blur'
                    }
                ],
                dbody: [
                    {
                        required: true,
                        message: "请输入日报内容",
                        trigger: 'blur'
                    }
                ] 
            }),
            dailyPromForm: {
                dname: ref(''),
                dbody: ref('')
            },
            planRules: reactive({
                pname: [
                    {
                        required: true,
                        message: "请输入计划名称",
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        max: 20,
                        message: "计划名称的长度在3-20之间" ,
                        trigger: 'blur'
                    }
                ],
                pbody: [
                    {
                        required: true,
                        message: "请输入计划内容",
                        trigger: 'blur'
                    }
                ],
                ptype: [
                    {
                        required: true,
                        message: "请选择计划类型",
                        trigger: 'change'
                    }
                ]
            }),
            planPromForm: {
                pname: ref(''),
                pbody: ref(''),
                ptype: ref('周计划')
            },
            imgBaseUrl: 'http://1.117.145.48/springbootUPLOAD/',
            selectStudents: [],
            students: [],
            taskPromForm: {
                tbody: ref(''),
                tname: ref(''),
                tfiles: ref(''),
                progress: ref(0),
                startdate: ref(''),
                enddate: ref(''),
                tmembers: ref('')
            },
            realFile: null,
            activeName: ref('task'),
            // 表单规则
            taskRules: reactive({
                tname: [
                    {
                        required: true,
                        message: "请输入任务名称",
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        max: 20,
                        message: "任务名称的长度在3-20之间" ,
                        trigger: 'blur'
                    }
                ],
                tbody: [
                    {
                        required: true,
                        message: "请输入任务内容",
                        trigger: 'blur'
                    }
                ],
                enddate: [
                    {
                        type: 'date',
                        required: true,
                        message: "请选择任务开始时间",
                        trigger: 'blur'
                    }
                ],
                startdate: [
                    {
                        type: 'date',
                        required: true,
                        message: "请选择任务结束时间",
                        trigger: 'blur'
                    }
                ]
            })
        }
    },
    components: {
        "list": List,
        "data-line": DataLine,
        "document": Document,
        "plus": Plus
    },
    methods: {
        getFileNewName: function (file) {
            this.realFile = file
            this.taskPromForm.tfiles = file.name
            return false
        },
        selectStudent: function (index) {
            let element = document.querySelector("#studentsAvatarDiv:nth-child("+(index+1)+")").childNodes[0].childNodes[0]
            let chooseName = element.childNodes[0].alt
            if(element.classList.contains('selectStudent')){
                element.classList.remove('selectStudent')
                this.selectStudents.forEach((item,index,arr) => {
                    if(item===chooseName){
                        arr.splice(index,1)
                    }
                })
            }else{
                element.classList.add('selectStudent')
                this.selectStudents.push(chooseName)
                this.taskPromForm.tmembers = this.selectStudents.toString()
            }
        },
        submitTaskForm: function () {
            this.$refs['taskPromFormRef'].validate((valid) => {
                if(valid && this.taskPromForm.tmembers != ''){
                    console.log("表单验证成功")
                    // 发布任务请求 返回文件名
                    this.promTask()
                }else{
                    ElMessage({
                        message: '请确认填写完整,不要忘了任务成员',
                        type: "error"
                    })
                    return false
                }
            })
        },
        submitPlanForm: function () {
            this.$refs['planPromFormRef'].validate((valid) => {
                if(valid){
                    console.log("表单验证成功")
                    this.promPlan()
                }else{
                    ElMessage({
                        message: '请确认填写完整',
                        type: "error"
                    })
                    return false
                }
            })
        },
        submitDailyForm: function () {
            this.$refs['dailyPromFormRef'].validate((valid) => {
                if(valid){
                    console.log("表单验证成功")
                    this.promDaily()
                }else{
                    ElMessage({
                        message: '请确认填写完整',
                        type: "error"
                    })
                    return false
                }
            })
        },
        promDaily: function () {
            let formData = new FormData()
            formData.append("dname",this.dailyPromForm.dname)
            formData.append("dbody",this.dailyPromForm.dbody)

            this.axios({
                method: "POST",
                url: 'https://'+store.state.ip+":"+store.state.port+"/daily",
                data: formData
            })
            .then((response) => {
                if(response.data.code==='200'){
                    ElMessage({
                        message: "日报发布成功",
                        type: "success"
                    })
                }else{
                    ElMessage({
                        message: "日报发布失败",
                        type: "error"
                    })
                }            
            })
        },
        promPlan: function () {
            let formData = new FormData()
            formData.append("pname",this.planPromForm.pname)
            formData.append("pbody",this.planPromForm.pbody)
            formData.append("ptype",this.planPromForm.ptype)

            this.axios({
                method: "POST",
                url: 'https://'+store.state.ip+":"+store.state.port+"/plan",
                data: formData
            })
            .then((response) => {
                if(response.data.code==='200'){
                    ElMessage({
                        message: "计划发布成功",
                        type: "success"
                    })
                }else{
                    ElMessage({
                        message: "计划发布失败",
                        type: "error"
                    })
                }
            })
        },
        promTask: function () {
            let formData = new FormData()
            formData.append("tbody",this.taskPromForm.tbody)
            formData.append("tname",this.taskPromForm.tname)
            if(this.taskPromForm.tfiles!=''){
                formData.append("tfiles",this.taskPromForm.tfiles)
            }
            formData.append("progress",0)
            formData.append("startdate",this.taskPromForm.startdate)
            formData.append("enddate",this.taskPromForm.enddate)
            formData.append("tmembers",this.taskPromForm.tmembers)

            this.axios({
                method: 'POST',
                url: 'https://'+store.state.ip+":"+store.state.port+"/task",
                data: formData
            })
            .then((response) => {
                if(response.data.code==='200'){
                    ElMessage({
                        message: "任务发布成功",
                        type: "success"
                    })
                }else{
                    ElMessage({
                        message: "任务发布失败",
                        type: "error"
                    })
                }
                if(response.data.filename!=null||response.data.filename!=undefined){
                    this.upload(response)
                } 
            })
            .catch((err) => {
                    ElMessage({
                        message: "任务发布失败"+err,
                        type: "error"
                    })
            })
        },
        upload: function (response) {
            let fileFormData = new FormData()
            
            fileFormData.append("filebody",this.realFile)
            fileFormData.append("filename",response.data.filename)
            console.log(fileFormData.get("filebody"))
            console.log(fileFormData.get("filename"))
            //文件上传
            this.axios({
                method: 'POST',
                url: 'https://'+store.state.ip+":"+store.state.port+'/file',
                headers: {
                    'Content-Type':'multipart/form-data'
                },
                transformRequest: [function(){
                    return fileFormData;
                }],
                data: fileFormData,
                param: fileFormData
            })
            .then((response) => {
                if(response.data.code==='200'){
                    ElMessage({
                        message: "文件上传成功",
                        type: "success"
                    })
                    this.$refs['taskPromFormRef'].resetFields();
                }else{
                    ElMessage({
                        message: "文件上传失败",
                        type: "error"
                    })
                }
            })
            .catch((err) => {
                    ElMessage({
                        message: "文件上传失败"+err,
                        type: "error"
                    })
            })
        },
        resetForm: function (formRef) {
            this.$refs[formRef].resetFields();
        }
    },
    mounted: function () {
        this.students = []
        this.axios({
            method: "GET",
            url: 'https://'+store.state.ip+':'+store.state.port+'/students'
        })
        .then((response) => {
            this.students = response.data
        })
    }
}
</script>

<style scoped>

</style>