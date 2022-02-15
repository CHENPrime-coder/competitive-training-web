<template>
    <div id="studioInfo" v-if="studio != null">
        <!-- {{$route.query.smembers}} -->
        <div id="studioInfo_header">
            <el-avatar id="sheadicon" :size="250" :src="imgBaseUrl+studio.sheadicon"></el-avatar>
        </div>
        <div id="studioInfo_body">
            <h1>{{studio.sname}}</h1> 
            <div id="studioInfo_info">
                <h1>工作室成员(点击查看成员信息)：</h1>
                <members :memberStr="studio.smembers"/>
            </div>
            <div id="studio_operation">
                <h1>工作室操作：</h1>
                <div id="operation">
                    修改工作室图标：<el-button style="width:50vw" @click="onUploadStudio = true">开始修改</el-button>
                </div>
            </div>
        </div>
        <el-dialog
            v-model="onUploadStudio"
            title="修改工作室图标"
        >
            <el-form :model="filefrom">
                <el-form-item label="选择文件:" id="chooseImgFile">
                    <div id="imgFile">
                        <!-- 因为下面的action用不到所以随便填一点就好了 -->
                        <el-upload
                            action="111"
                            accept=".png, .jpg"
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
        <el-dialog
            v-model="onUserDetailInfo"
            title="学生信息"
            id="studentInfoFrame"
            width="80%"
        >  
            <!-- home页的页首 -->
        <div id="home_head">
            <el-descriptions
            :column="1" 
            id="description"
            border
            >
                <el-descriptions-item>
                    <template #label>
                        <div id="cells">
                            <el-icon><user-filled /></el-icon>
                            用户名:
                        </div>
                    </template>
                    {{nowUser.username}}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div id="cells">
                            <el-icon><office-building /></el-icon>
                            工作室名:
                        </div>
                    </template>
                    {{nowUser.sname}}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div id="cells">
                            <el-icon><notebook /></el-icon>
                            成绩:
                        </div>
                    </template>
                    <el-button @click="onPFMList">查看成绩</el-button>
                    <el-button @click="onUploadPFM" type="primary">录入成绩</el-button>
                </el-descriptions-item>
            </el-descriptions>
            <el-avatar id="rightHead" :size="100" :src="imgBaseUrl+nowUser.headiconURL" ></el-avatar>
        </div>
        
        <!-- 横向的侧边栏选项卡 -->
        <el-menu
            mode='horizontal'
            default-active='1'
        >
            <el-menu-item index="1" v-on:click="getMy('daily')">我 的 日 报</el-menu-item>
            <el-menu-item index="2" v-on:click="getMy('plan')">我 的 计 划</el-menu-item>
        </el-menu>
        <div id="out_planDailyDetail">
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
                <el-container v-if="type==='daily'" id="objectContainer">
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
            </el-container>
        </div>
            
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
        <el-dialog
            v-model="onUploadPFMVisable"
            title="录入成绩"
        >
            <el-form >
                <el-form-item v-for="(item,index) in greadForm" :key="index" label="科目名与成绩:">
                    <div id="onegread">
                        <el-input v-model="item.key" placeholder="科目名"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
                        <el-input v-model.number="item.value" placeholder="科目成绩"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
                        <el-button type="primary" @click="addGread">添加数据</el-button>
                        <el-button type="danger" @click="delGread(index)">删除一行</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="成绩说明:">
                    <el-input v-model="greadinfo" type="textarea" :size="large" 
                    :autosize="{minRows:2}" placeholder="成绩说明（第XXX次考试）……" id="greadinfo"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button type="primary" @click="uploadGread">确定</el-button>
            </template>
        </el-dialog>
        </el-dialog>
    </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import store from './store/store'
import members from '../../components/members.vue'
import qs from 'qs'
import { ElMessage } from 'element-plus'
import { Notebook, OfficeBuilding, Plus, UserFilled } from '@element-plus/icons-vue'

export default {
    name: 'studioInfo',
    data: function () {
        return {
            imgBaseUrl:'http://1.117.145.48/springbootUPLOAD/',
            sid: ref(''),
            studio: ref(null),
            onUploadStudio: ref(false),
            filefrom: {
                name: ref(''),
                globalFile: ref(null),
                file: ref(null)
            },
            onUserDetailInfo: false,
            nowUser: ref(null),
            plans: [],
            dailys: [],
            nowObject: ref(null),
            type: 'daily',
            PFMs: null,
            onPFMListVisable: false,
            onUploadPFMVisable: false,
            greadForm: [
                {
                    key: '',
                    value: ''
                }
            ],
            dialogVisible: ref(false),
            greadinfo: ''
        }
    },
    mounted: function() {
        let url = decodeURI(document.location)
        this.sid = url.substr(url.indexOf('?')+1).split('=')[1]
        this.axios({
            method: "GET",
            url: "https://"+store.state.ip+':'+store.state.port+"/studio/"+this.sid
        })
        .then((response) => {
            this.studio = response.data
        })
    },
    methods: {
        uploadGread: function () {
            for(let i=0;i<this.greadForm.length;i++){
                if(this.greadForm[i].value<'0'||this.greadForm[i].value>'100'){
                    ElMessage({
                        message: "成绩必须在100-0之间",
                        type: "error"
                    })
                    return
                }
            }
            let res = '{'
            for(let i=0;i<this.greadForm.length;i++){
                if(i==this.greadForm.length-1){
                    res = res+"\""+this.greadForm[i].key+"\":"+this.greadForm[i].value+"}"
                }else{
                    res = res+"\""+this.greadForm[i].key+"\":"+this.greadForm[i].value+","
                }
            }
            let param = qs.stringify({
                uid: this.nowUser.uid,
                score: res,
                info: this.greadinfo
            })
            this.axios({
                method: "POST",
                url: "https://"+store.state.ip+':'+store.state.port+"/pfm?"+param
            })
            .then((response) => {
                if(response.data.code==='200'){
                    ElMessage({
                        type: "success",
                        message: "录入成功"
                    })
                }else if(response.data.code==='403'){
                    ElMessage({
                        type: "error",
                        message: "录入失败，学生无法录入成绩"
                    })
                }
            })
        },
        delGread: function (index) {
            if(this.greadForm.length!=1){
                this.greadForm.splice(index,1)
            }else{
                ElMessage({
                    type: "error",
                    message: "至少要有一个"
                })
            }
        },
        addGread: function () {
            this.greadForm.push({
                name: '',
                value: ''
            })
        },
        submitFileUpload: function () {
            let param = qs.stringify({
                filename: this.filefrom.name,
                sname: this.studio.sname
            })
            //获取后端处理过的文件名
            this.axios.post('https://'+store.state.ip+':'+store.state.port+'/studio?'+param)
            .then((response) => {
                this.upload(response)
            })
        },
        onDialog: function (index,type) {
            this.dialogVisible = true;
            if(type==='daily'){
                this.nowObject = this.dailys[index]
            }else if(type==='plan'){
                this.nowObject = this.plans[index]
            }
        },
        upload: function (response) {
            let formData = new FormData()

            //TODO
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
        },       //文件上传之前的钩子函数
        beforeAvatarUpload: function (file) {
            if(file.type==='image/jpg'||file.type==='image/png'){
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
                    message: "文件类型必须是png或jpg",
                    type: "error"
                })
                this.filefrom.globalFile=null
            }
            return false
        },
        openUserDetailInfo: function (uid) {
            this.onUserDetailInfo = true
            this.axios({
                method: "GET",
                url: 'https://'+store.state.ip+":"+store.state.port+'/personal/'+uid
            })
            .then((response) => {
                response.data.headiconURL = response.data.headiconURL.split('/')[2]
                this.nowUser = response.data
                this.getMy('daily',response.data.username)
            })
        },
        getMy: function (type,username = this.nowUser.username) {
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
        onPFMList: function () {
            this.axios({
                method: 'GET',
                url: 'https://'+store.state.ip+":"+store.state.port+'/pfm/'+this.nowUser.uid
            })
            .then((response) => {
                this.PFMs = response.data
            })
            this.onPFMListVisable = true
        },
        onUploadPFM: function() {
            this.onUploadPFMVisable = true
        }
    },
    components: {
        members,
        'plus': Plus,
        'user-filled': UserFilled,
        'office-building': OfficeBuilding,
        'notebook': Notebook,
    }
}
</script>