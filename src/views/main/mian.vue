<template>
    <div id="main">
        <el-container id="header">
            <!-- logo -->
            <el-image style="padding:0.6em;width:2.26em;height:2.5em;" src="./img/logo.png"></el-image>  
            <h3>竞 训 系 统</h3>
        </el-container>
        <el-container id="aside">
            <!-- 左边的小头像 -->
            <el-avatar id="userico" style="margin-top:1em" :size="60" :src="HeadUrl+filename"></el-avatar>
            <h4 style="margin-top:0.5em">{{username}}</h4>
            <!-- 侧边栏 -->
            <el-menu
                id="meun"
                default-active="1"
            >
                <el-menu-item index="1" v-on:click='itemClick(0)'>
                    <template #title>
                        <el-icon><home-filled /></el-icon>
                        <span>主 页</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="2" v-on:click='itemClick(1)'>
                    <template #title>
                        <el-icon><list /></el-icon>
                        <span>任 务</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="3" v-on:click='itemClick(2)'>
                    <template #title>
                        <el-icon><promotion /></el-icon>
                        <span>发 布</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="4" v-on:click='itemClick(3)'>
                    <template #title>
                        <el-icon><data-line /></el-icon>
                        <span>日 报</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="5" v-on:click='itemClick(4)'>
                    <template #title>
                        <el-icon><document /></el-icon>
                        <span>计 划</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="6" v-on:click='itemClick(5)'>
                    <template #title>
                        <el-icon><office-building /></el-icon>
                        <span>工作室</span>
                    </template>
                </el-menu-item>
            </el-menu>
        </el-container>
        <!-- vue-router视图位置 -->
        <el-container id="info">
            <router-view></router-view>
        </el-container>
    </div>
</template>

<script>
//导入图标
import { 
  DataLine,
  HomeFilled, List, Promotion, Document, OfficeBuilding
 } from '@element-plus/icons-vue'
import store from './store/store'

export default {
    name: 'main',
    data: function() {
        return {
            HeadUrl: 'http://1.117.145.48/springbootUPLOAD/',
            filename: '',
            username: '',
            //页面的名字，其实这这样写好像没没什么必要
            pageNames: ['/home','/list','/prom','/daily','/plan','/studio']
        }
    },
    mounted: function () {
        //获取个人基本信息
        this.axios.get('https://'+store.state.ip+':'+store.state.port+'/personal')
        .then((response) => {
            var username = response.data.username
            var url = response.data.headiconURL
            console.log(response)
            //win系统和linux系统的文件路径兼容
            var target = url.includes('\\')?'\\':'/'
            //获取url
            this.filename = url.split(target)[2]
            this.username = username
            //初始化个人信息页
            this.itemClick(0)
        })
        //根据分辨率，改变css
        document.getElementById("theme").href = document.body.clientWidth<768?'./css/phone-style.css':'./css/pc-style.css';
        window.onresize = () => {
            return (() => {
                document.getElementById("theme").href = document.body.clientWidth<768?'./css/phone-style.css':'./css/pc-style.css';
            })();
        };
    },
    components: {
        //小图标的导入方式
        'home-filled': HomeFilled,
        'list': List,
        'promotion': Promotion,
        'data-line': DataLine,
        'document': Document,
        'office-building': OfficeBuilding
    },
    methods: {
        //进入响应的选项卡
        itemClick: function(index){
            let url = '/main'+this.pageNames[index]
            //这步判断现在还没有什么必要，debug用
            switch(url){
                case '/main/home':
                    console.log(this.HeadUrl)
                    this.$router.push({
                        path: url
                    })
                    break;
                default:
                    this.$router.push(url)
            }
            console.log(url)
        }
    }
}
</script>

<style>
</style>