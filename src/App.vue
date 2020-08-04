<template>
    <div id="app" @mousemove="myMove">
        <a-config-provider :locale="locale">
            <router-view/>
        </a-config-provider>
    </div>
</template>

<script>
    import { constant } from './store/state'  //常量
    
    import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
    import moment from "moment";
    import "moment/locale/zh-cn";
    moment.locale("zh-cn");
    
    export default {
        name: 'App',
        data() {
            return {
                locale: zh_CN,
                number: 1,
            };
        },
        methods: {
            //判断token和更新token有效时间
            myMove() {
                let name = window.location.hash;    //路由地址
                let host = window.location.host;    //服务器(计算机)域名
           
                if(name != '#/') {
                    if (!this.authority.isValidToken()) {
                        if(this.number == 1) {
                            this.number++;
                            this.$notification.warning({
                                message: '警告',
                                duration: 3,
                                description: '您的Token过期或已失效，请重新登录！'
                            });
                            
                            let condition = constant.condition;
                            let _this = this;
                            setTimeout(function () {
                                _this.authority.judgeMenu(host,condition);
                            },1000);
                        }
                    }
                }
            }
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: left;
        color: #2c3e50;
        margin: 0;
        padding: 0;
    }
</style>
