<template>
    <div class="login bg-img">
        <div v-title>GoShop-登录</div>
        <div class="main radius-xs text-center">
            <h2 class="name margin-top-lg">商品管理系统</h2>
            <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol" class="text-left" @keyup.enter.native="submitForm">
                <a-form-item label="账号" has-feedback >
                    <a-input v-decorator="['username',{ initialValue: customForm.username,rules:rules.username }]" v-focus="true" placeholder="请输入账号"/>
                </a-form-item>
                <a-form-item label="密码">
                    <a-input type="password" v-decorator="['password',{ initialValue: customForm.password,rules:rules.password }]" placeholder="请输入密码"/>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 14, offset: 6 }" class="text-left bg-loading">
                    <a-button type="primary" @click.prevent="submitForm()" class="margin-right-df text-letter"><a-spin v-show="this.$store.state.loading"/>{{ this.$store.state.loading ? "正在登录中" : "马上登录" }}</a-button>
                    <a-button @click.prevent="resetForm()">重置</a-button>
                </a-form-item>
            </a-form>
        </div>
        <div class="footers">
            <footerType-item></footerType-item>
        </div>
    </div>
</template>

<script>
    import {LoginAPI} from '../config/api'
    import footerType from './index/Footer'
    
    export default {
        data() {
            return {
                lagType: 'text',
    
                form: this.$form.createForm(this, { name: 'login' }),
                rules:{
                    username: [{required: true, message: '请输入账号!' },{ whitespace: true, message: '请输入账号!' }],
                    password: [{required: true, message: '请输入密码!' },{ whitespace: true, message: '请输入密码!' }],
                },
                customForm: {
                    username: 'test',
                    password: '123456',
                },
                labelCol: {
                    span: 6
                },
                wrapperCol: {
                    span: 14
                },
            }
        },
        created() {
            this.authority.cleanAuthList();
        },
        components:{
            'footerType-item': footerType,
        },
        methods: {
            //重置form
            resetForm() {
                this.form.resetFields();
            },
            //提交form
            submitForm() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        this.$store.state.loading = true;
                        console.log(values);
                        let params = values;
                        
                        this.$http.post(LoginAPI, this.$qs.stringify(params)).then(resp => {
                            this.$store.state.loading = false;
                            if (resp.data.code == 1) {
                                let list = resp.data.data;
                                /* 用户信息 */
                                let user = this.$store.state.users;
                                user.headImg = list.headImg ? list.headImg:'';
                                user.account = list.name ? list.name:'';
                                localStorage.setItem("UserInfo", JSON.stringify(user));
    
                                /* token和有效期 */
                                localStorage.setItem("AccessToken", list.token);
                                let time = new Date().getTime() + 3600 * 1000 * 8;
                                localStorage.setItem("Expires",time);
    
                                this.$router.push('/home/index');
                            }
                        }).catch(e => {
                            this.$store.state.loading = false;
                        });
                    }
                });
            },
        },
    }
</script>

<style scoped>
    .login {
        width: 100vw;
        height: 100vh;
        position: relative;
        background-image: url("../../static/image/login.jpg");
    }
    .login .main {
        width: 480px;
        height: 320px;
        position: absolute;
        top: calc(50% - 190px);
        left: calc(50% - 240px);
        background-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    }
    .login .main:before,
    .login .main:after {
        position: absolute;
        content: "";
        top: 2px;
        bottom: 3px;
        left: 2px;
        width: 50%;
        box-shadow: 0 3px 2px rgba(0, 0, 0, 0.5);
        transform: rotate(-3deg);
        z-index: -1;
    }
    .login .main:after {
        right: 2px;
        left: auto;
        transform: rotate(3deg);
    }
    .login .main .name{
        width: 100%;
        height: 50px;
    }
    
    .login .footers{
        padding: 24px 50px 10px;
        width: 100%;
        position: absolute;
        bottom: 10px;
        color: #000000 !important;
    }
    .login .footers a{
        color: #000000 !important;
    }
</style>
