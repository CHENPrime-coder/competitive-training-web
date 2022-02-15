<template>
    <div id="studio" v-loading="loading">
        <el-card
            id="studio_card"
            v-for="(studio,index) in studios"
            :key="index"
            shadow="hover"
            @click="toStudioInfo(studio.sid)"
        >
            <template #header id="card_header">
                <div id="studio_header">
                    <h3>{{studio.sname}}</h3>
                    <span>现有成员: {{studio.smembers.split(',').length}} 人</span>
                </div>
            </template>
            <div id="studio_icon">
                <el-avatar shape="square" :size="100" :src="imgBaseUrl+studio.sheadicon"></el-avatar>
            </div>
        </el-card>
    </div>
</template>

<script>
import store from '../store/store';

export default {
    name: 'studio',
    mounted: function () {
        this.axios({
            method: "GET",
            url: "https://"+store.state.ip+':'+store.state.port+"/studio"
        })
        .then((response) => {
            this.studios = response.data
            this.loading = false
        })
    },
    data: function () {
        return {
            studios: [],
            loading: true,
            imgBaseUrl: 'http://1.117.145.48/springbootUPLOAD/'
        }
    },
    methods: {
        toStudioInfo: function (sid) {
            window.open('/studioInfo?sid='+sid)
        }
    }
}
</script>

<style scoped>

</style>