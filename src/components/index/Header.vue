<template>
    <div class="leaguer">
        <div class="user margin-right-lg">
            <img v-if="this.$store.state.users.headImg" :src="this.$store.state.users.headImg" class="round margin-right-sm"/>
            <img v-else :src="headImage" class="round margin-right-sm"/>
            <span>{{ this.$store.state.users.account }}</span>
            <span class="logout" @click="logout()" title="退出"><a-icon type="logout" /></span>
        </div>
        <div class="cue">
            <a-badge :count="count">
                <a-icon type="bell" />
            </a-badge>
        </div>
    </div>
</template>

<script>
    import { LogoutAPI } from '../../config/api'
    export default {
        name: "Header",
        props:['count'],
        data(){
            return {
                headImage: './static/image/headImage.png',
            }
        },
        methods:{
            logout(){
                this.$http.get(LogoutAPI).then(resp => {
                    if(resp.data.code == 1){
                        this.$router.push('/');
                    }
                });
            }
        },
    }
</script>

<style scoped>
    .leaguer>div{
        float: right;
        color: #656565;
        position: relative;
        display: inline-block;
    }
   
    .leaguer .cue{
        margin-right: 40px;
        padding-top: 6px;
    }
    .leaguer .cue i{
        font-size: 24px;
        color: #909090;
    }

    .leaguer .user{
    }
    .leaguer .user img{
        width: 34px;
        height: 34px;
    }
    .logout{
        margin: 1px 0 0 18px;
        cursor: pointer;
        font-size: 22px;
        float: right;
    }
</style>