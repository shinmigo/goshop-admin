<template>
    <div class="footer text-center">
        <div>
            <router-link :to="{ path:`/notice/help` }" tag="a" >帮助</router-link>
            <router-link :to="{ path:`/notice/secret` }" tag="a" >隐私</router-link>
            <router-link :to="{ path:`/notice/clause` }" tag="a" >条款</router-link>
        </div>
        <div class="footer-wrap">copyright<img :src="footImg" /><span>2020</span> ShinmiGo技术部出品</div>
    </div>
</template>

<script>
    export default {
        name: "Footer",
        data () {
            return {
                footImg: "./static/image/u11.png",
            }
        },
    }
</script>

<style scoped>
    .footer{
        width: 100%;
        line-height: 26px;
        color: rgba(0, 0, 0, 0.447058823529412);
    }
    .footer a{
        margin: 0 10px;
        color: rgba(0, 0, 0, 0.447058823529412);
    }
    .footer .footer-wrap img{
        margin: 0 4px 0 2px;
        width: 14px;
    }
    .footer .footer-wrap span{
        font-family: 'Arial Normal', 'Arial';
    }
</style>