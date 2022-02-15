<template>
    <div id="home">
        <!-- home页的页首 -->
        <div id="home_head">
            <!-- 秒数个人信息的表格 -->
            <el-descriptions
            :column="1" 
            id="description"
            title="个人信息"
            border
            >
                <el-descriptions-item>
                    <template #label>
                        <div id="cells">
                            <el-icon><user-filled /></el-icon>
                            用户名:
                        </div>
                    </template>
                    {{username}}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div id="cells">
                            <el-icon><office-building /></el-icon>
                            工作室名:
                        </div>
                    </template>
                    {{sname}}
                </el-descriptions-item>
                            <el-descriptions-item>
                    <template #label>
                        <div id="cells">
                            <el-icon><picture-filled /></el-icon>
                            修改头像:
                        </div>
                    </template>
                    <el-button @click="onFileUploadDialog">上传文件</el-button>
                </el-descriptions-item>
                            <el-descriptions-item>
                    <template #label>
                        <div id="cells">
                            <el-icon><notebook /></el-icon>
                            查看成绩:
                        </div>
                    </template>
                    <el-button @click="onPFMList">成绩</el-button>
                </el-descriptions-item>
            </el-descriptions>
            <!-- 右边的大头像 -->
            <el-avatar id="rightHead" :size="100" :src="HeadUrl+filename" ></el-avatar>
        </div>
        
        <!-- 横向的侧边栏选项卡 -->
        <el-menu
            mode='horizontal'
            default-active='1'
        >
            <el-menu-item index="1" v-on:click="getMy('daily')">我 的 日 报</el-menu-item>
            <el-menu-item index="2" v-on:click="getMy('plan')">我 的 计 划</el-menu-item>
        </el-menu>
        <!-- 计划和日报展示的地方 -->
        <el-container id="planDailyDetail">
            <!-- 判断是不是什么东西都没有 -->
            <el-image
                style="width: auto; height: 20em"
                src="./img/nothing.png"
                :fit="cover"
                v-if="(type==='daily'&dailys.length==0)||(type==='plan'&plans.length==0)"
            ></el-image>
            <!-- 根据选项卡的状态(日报，计划)v-for自动生成对应的el-card -->
            <!-- 如果是日报 -->
            <el-container v-else-if="type==='daily'" id="objectContainer">
                <el-card v-for="(item,index) in dailys" :key="item.did" id="item" @click="onDialog(index,'daily')">
                    <template #header>
                        <div id="card_header">
                            <span>{{item.dname}}</span>
                            <span>日报发布日期: {{item.ddate}}</span>
                        </div>
                    </template>
                    <span v-html="item.dbody"></span>
                    <div id="card_footer">
                        <span>日报人: {{item.reporter}}</span>
                    </div>
                </el-card>
            </el-container>
            <!-- 如果是计划 -->
            <el-container v-else-if="type==='plan'" id="objectContainer">
                <el-card v-for="(item,index) in plans" :key="item.pid" id="item" @click="onDialog(index,'plan')">
                    <template #header>
                        <div id="card_header">
                            <span>{{item.pname}}</span>
                            <span>计划发布日期: {{item.pdate}}</span>
                        </div>
                    </template>
                    <span v-html="item.pbody"></span>
                    <div id="card_footer">
                        <span>计划人: {{item.planner}}</span>
                        <span>计划类型: 
                            <el-tag v-if="item.ptype==='周计划'" type="warning  ">{{item.ptype}}</el-tag>
                            <el-tag v-else-if="item.ptype==='月计划'" type="">{{item.ptype}}</el-tag>
                            <el-tag v-else-if="item.ptype==='学期计划'" type="success">{{item.ptype}}</el-tag>
                        </span>
                    </div>
                </el-card>
            </el-container>
            <!-- 日报和计划信息的弹窗 -->
            <!-- 如果是日报 -->
            <el-dialog
                v-if="type==='daily'&&nowObject!=null"
                v-model="dialogVisible"
                width="50%"
            >
                <template #title>
                    <div id="dialog_title">
                        <span>{{nowObject.dname}}</span>
                        <span style="margin-right:1em">日报人:{{nowObject.reporter}}</span>
                    </div>
                </template>
                <span v-html="nowObject.dbody"></span>
                <template #footer>
                    <div id="dialog_footer">
                        <span>日报日期:{{nowObject.ddate}}</span>
                        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
                    </div>
                </template>
            </el-dialog>
            <!-- 如果是计划 -->
            <el-dialog
                v-if="type==='plan'&&nowObject!=null"
                v-model="dialogVisible"
                width="50%"
            >
                <template #title>
                    <div id="dialog_title">
                        <span>{{nowObject.pname}}</span>
                        <span style="margin-right:1em">计划人:{{nowObject.planner}}</span>
                    </div>
                </template>
                <span v-html="nowObject.pbody"></span>
                <template #footer>
                    <div id="dialog_footer">
                        <span>计划日期:{{nowObject.pdate}}</span>
                        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
                    </div>
                </template>
            </el-dialog>
            <!-- 头像文件上传的弹窗 -->
            <el-dialog
                v-model="fileuploadDialog"
                width="50%"
                id="headImgDialog"
            >
                <template #title>
                    修改头像
                </template>
                <el-form :model="filefrom">
                    <el-form-item label="选择文件:" id="chooseImgFile">
                        <div id="imgFile">
                            <!-- 因为下面的action用不到所以随便填一点就好了 -->
                            <el-upload
                                action="111"
                                accept=".png, .jpge"
                                :before-upload="beforeAvatarUpload"
                            >
                                <el-button id="headImgbutton" style="margin-right:1em;position: absolute;top:5em">
                                    <el-icon><plus/></el-icon>
                                    {{filefrom.name}}
                                </el-button>
                            </el-upload>
                            <div id="previewHead">
                                预览：
                                <el-avatar :size="100" :src="filefrom.file" shape="square"></el-avatar>
                                <el-avatar :size="100" :src="filefrom.file" style="margin-left:1em"></el-avatar>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <div id="dialog_footer">
                        <el-button type="primary" @click="fileuploadDialog = false;submitFileUpload()">确认</el-button>
                        <el-button @click="fileuploadDialog = false">取消</el-button>
                    </div>
                </template>
            </el-dialog>
        </el-container>
        <el-dialog
            v-model="onPFMListVisable"
            width="50%"
        >
            <template #title>
                我的成绩
            </template>
            <div id="PFMbodys">
                <el-card v-for="pfm in PFMs" :key="pfm.uid">
                    <template #header>
                        <div id="card_header">
                            <span>成绩说明: {{pfm.info}}</span>
                        </div>
                    </template>
                    <span v-for="(value,name,index) in JSON.parse(pfm.score)" :key="index">
                        <h4>{{name}}:</h4>
                        <el-progress :percentage="value" v-if="value>='90'" status="success">
                            {{value}}分
                        </el-progress>
                        <el-progress :percentage="value" v-else-if="value>='70'">
                            {{value}}分
                        </el-progress>
                        <el-progress :percentage="value" v-else-if="value>='60'" status="warning">
                            {{value}}分
                        </el-progress>
                        <el-progress :percentage="value" v-else-if="value<'60'" status="exception">
                            {{value}}分
                        </el-progress>
                    </span>
                    <div id="card_footer">
                        <span>成绩日期: {{pfm.date}}</span>
                    </div>
                </el-card>
            </div>
            <template #footer>
                <div id="dialog_footer">
                    <el-button type="primary" @click="onPFMListVisable = false">确认</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import qs from 'qs'
// 不知道什么东西
import { ref } from 'vue'
import store from '../store/store'
import { ElMessage } from 'element-plus'
// 导入小图标
import { Notebook, OfficeBuilding, PictureFilled, Plus, UserFilled } from '@element-plus/icons-vue'

export default {
    name: 'home',
    data: function () {
        return {
            HeadUrl: 'http://'+store.state.ip+'/springbootUPLOAD/',
            filename: '',
            username: '',
            sname: '',
            uid: '',
            // 如果选择计划的话plans里面就会有东西，dailys里面就是空的，反之就倒一下
            plans: [],
            dailys: [],
            // 用户选择查看的类型（plan或daily）
            type: '',
            // 弹窗是否可见
            fileuploadDialog: ref(false),
            dialogVisible: ref(false),
            // 当前点开消息框plan或dailys
            nowObject: null,
            // 用户修改头像的file表单
            filefrom: {
                // file的本地缓存
                file: null,
                name: '',
                globalFile: null
            },
            responseInfo: {
                newFileName: ''
            },
            // 成绩列表dialog
            onPFMListVisable: ref(false),
            PFMs: null
        }
    },
    mounted: function () {
        // 获取个人基本信息
        this.axios.get('https://'+store.state.ip+':'+store.state.port+'/personal')
        .then((response) => {
            var username = response.data.username
            var url = response.data.headiconURL
            var target = url.includes('\\')?'\\':'/'
            this.filename = url.split(target)[2]
            this.username = username
            this.uid = response.data.uid
            this.sname = response.data.sname
            // 初始化日报内容（默认的）
            this.getMy('daily',username)
        })
    },
    components: {
        // 图标
        'user-filled': UserFilled,
        'office-building': OfficeBuilding,
        'picture-filled': PictureFilled,
        'notebook': Notebook,
        'plus': Plus
    },
    methods: {
        getMy: function (type,username = this.username) {
            const url = '/'+type+'/'+username
            this.type = type
            // 获取日报或计划
            this.axios.get('https://'+store.state.ip+':'+store.state.port+''+url)
            .then((response) =>{
                if(type==='daily'){
                    let data = response.data
                    for(let i=0;i<data.length;i++){
                        let str = data[i].dbody
                        // 格式化
                        str.replace(/\n/g," <br> ")
                        str.replace(/\s/g,"&nbsp;")
                        data[i].dbody = str.replace(/\r\n/g," <br> ")
                    }
                    this.dailys=response.data
                }else if(type==='plan') {
                    let data = response.data
                    for(let i=0;i<data.length;i++){
                        let str = data[i].pbody
                        str.replace(/\n/g," <br> ")
                        str.replace(/\s/g,"&nbsp;")
                        data[i].pbody = str.replace(/\r\n/g," <br> ")
                    }
                    this.plans=response.data
                }
            })
        },
        // 决定开启的dialog的类型
        onDialog: function (index,type) {
            this.dialogVisible = true;
            if(type==='daily'){
                this.nowObject = this.dailys[index]
            }else if(type==='plan'){
                this.nowObject = this.plans[index]
            }
        },
        onFileUploadDialog() {
            this.fileuploadDialog = true
        },
        submitFileUpload: function () {
            let param = qs.stringify({
                filename: this.filefrom.name
            })
            //获取后端处理过的文件名
            this.axios.post('https://'+store.state.ip+':'+store.state.port+'/userimg?'+param)
            .then((response) => {
                this.upload(response)
            })
        },
        upload: function (response) {
            let formData = new FormData()
            formData.append("filebody",this.filefrom.globalFile)
            formData.append("filename",response.data.filename)
            
            this.axios({
                method: "POST",
                url: 'https://'+store.state.ip+":"+store.state.port+'/file',
                headers: {
                    'Content-Type':'multipart/form-data'
                },
                transformRequest: [function(){
                    return formData;
                }],
                data: formData,
                param: formData
            })
            .then((response) => {
                console.log(response)
                if(response.data.code==='200'){
                    ElMessage({
                        message: "修改成功",
                        type: "success"
                    })
                    window.location.reload()
                }else{
                    ElMessage({
                        message: "修改失败",
                        type: "error"
                    })
                }
            })
            .catch(function(err) {
                console.log("请求错误"+err)
            })
        },
        //文件上传之前的钩子函数
        beforeAvatarUpload: function (file) {
            if(file.type==='image/jpge'||file.type==='image/png'){
                var _this = this
                this.filefrom.name = file.name
                var reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = function () {
                    _this.$data.filefrom.file = this.result
                }
                this.filefrom.globalFile = file
            }else{
                ElMessage({
                    message: "文件类型必须是png或jpge",
                    type: "error"
                })
                this.filefrom.file=null
            }
            return false
        },
        onPFMList: function () {
            this.axios({
                method: 'GET',
                url: 'https://'+store.state.ip+":"+store.state.port+'/pfm/'+this.uid
            })
            .then((response) => {
                this.PFMs = response.data
            })
            this.onPFMListVisable = true
        }
    }
}
</script>

<style scoped>

</style>