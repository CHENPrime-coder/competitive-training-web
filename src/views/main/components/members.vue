<template>
    <el-container id="members" v-if="objects!=null">
        <el-tooltip
            effect="dark"
            placement="top-start"
            :content="member.username"
            v-for="(member,index) in objects" 
            :key="index"
        >
            <el-avatar 
                :src="imgBaseUrl+objects[index].headiconURL" 
                id="memberAvatar" 
                :size="60"
                :alt="member.username"
            >
            </el-avatar>
        </el-tooltip>
        
    </el-container>
</template>

<script>
// 可以将设置改为响应式数据
import {watchEffect,reactive,toRefs, getCurrentInstance} from "vue"
import store from '../store/store'

export default {
    name: 'members',
    props: {
        memberStr: String
    },
    data: function () {
        return {
            memberObjects: [],
            imgBaseUrl: 'http://1.117.145.48/springbootUPLOAD/'
        }
    },
    setup: function (props) {
        const state = reactive({
            data: [],
            objects: []
        })
        const instance = getCurrentInstance();
        watchEffect(() => {
            state.data = props.memberStr.split(',')
            sendHttp()
        })
        function sendHttp(){
            state.objects = []
            for(let i=0;i<state.data.length;i++){
                instance.appContext.config.globalProperties.$axios({
                    url: 'https://'+store.state.ip+':'+store.state.port+'/personalname/'+state.data[i]
                })
                .then((response) => {
                    var url = response.data.headiconURL
                    var target = url.includes('\\')?'\\':'/'
                    response.data.headiconURL = url.split(target)[2]
                    state.objects.push(response.data)
                }).catch((err) => {
                    console.log(err)
                });
            }
        }
        return {
            ...toRefs(state)
        }
    }
}
</script>