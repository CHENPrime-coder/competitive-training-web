<template>
  <div id="app">
    <el-row>
      <el-card class="bodys">
        <template #header>
          <div class="card-header">
            <span>竞训系统登陆</span>
          </div>
        </template>
        <el-row class="rows">
          <el-input placeholder="账号" clearable v-model="account"></el-input>
        </el-row>
        <el-row class="rows">
          <el-input placeholder="密码" clearable v-model="password" show-password></el-input>
        </el-row>
        <el-row class="rows">
          <el-button id="loginBtn" type="primary" v-on:click="login" v-loading="loginLoading">登 陆</el-button>
        </el-row>
      </el-card>
    </el-row>
  </div>
  
</template>

<script>
import qs from 'qs'
import store from './views/main/store/store'
import { ElMessage } from 'element-plus'

export default {
  name: 'App',
  data : function () {
    return{
      account: "",
      password: "",
      loginstatus: "",
      loginLoading: false
    }
  },
  mounted() {
    //检查算是否是手机端，如果是就用手机端样式
    document.getElementById("theme").href = document.body.clientWidth<768?'../css/phone-style.css':'../css/pc-style.css';
    window.onresize = () => {
      return (() => {
        document.getElementById("theme").href = document.body.clientWidth<768?'../css/phone-style.css':'../css/pc-style.css';
      })();
    };
  },
  methods: {
    login: function () {
      this.loginLoading=true;
      var param = qs.stringify({
        username: this.account,
        password: this.password
      })
      this.axios.post('https://'+store.state.ip+':'+store.state.port+'/login?'+param)
      .then((response) => {
        if(response.data.code==='200'){
          ElMessage({
            message: "登陆成功",
            type: "success"
          })
          //由vue-router实现跳转
          window.location='/main'
        }else{
          ElMessage({
            message: "登陆失败",
            type: "error"
          })
        }
        this.setLoginStatus(response.data.code)
        this.setLoginLoading(false)
      })
    },
    setLoginStatus: function (status) {
      this.loginstatus=status
    },
    setLoginLoading: function (value) {
      this.loginLoading=value
    }
  },
  computed: {
  }
}
</script>

<style>
.rows:nth-child(3){
  display: flex;
}
.rows{
  margin-top: 0.5em;
}
#app {
  display: flex;
  justify-content: space-around;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 5em;
}
.bodys{
  width: 25em;
}
#loginBtn{
  width: 100vw;
}
</style>
