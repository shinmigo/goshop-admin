<template>
    <div class="main">
        <a-spin class="loading" tip="正在加载中..." v-if="dataLoading"></a-spin>
        <div class="margin-top-df" v-else>
            <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol" >
                <a-form-item label="姓名">
                    <a-input v-model="ruleForm.name" paramsName="name" class="extent" disabled/>
                </a-form-item>
                <a-form-item label="昵称">
                    <a-input v-model="ruleForm.nickname" paramsName="nickname" class="extent" disabled/>
                </a-form-item>
                <a-form-item label="手机号码">
                    <a-input v-model="ruleForm.mobile" paramsName="mobile" class="extent" disabled/>
                </a-form-item>
                <a-form-item label="性别">
                    <a-radio-group :options="sexList" v-model="ruleForm.gender" paramsName="gender" class="extent" disabled/>
                </a-form-item>
                <a-form-item label="等级">
                    <a-select v-model="ruleForm.member_level_id" paramsName="member_level_id" class="extent" disabled>
                        <a-select-option :key="index" :value="item.value" v-for="(item,index) in classifyList">
                            {{ item.label }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="Emaill">
                    <a-input v-model="ruleForm.email" paramsName="email" class="extent" disabled/>
                </a-form-item>
                <a-form-item label="状态">
                    <a-switch :checked="ruleForm.status" paramsName="status" checked-children="开" class="switch" un-checked-children="关" disabled/>
                </a-form-item>
                <a-form-item label="最后登录时间">
                    <a-input v-model="ruleForm.last_login_time" paramsName="last_login_time" class="extent" disabled/>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 16, offset: 6 }" class="text-left bg-loading">
                    <a-button type="primary" class="button" @click.prevent="ruleCancel()">取消</a-button>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>

<script>
    import { UserDetailAPI } from '../../config/api'
    export default {
        data() {
            return {
                dataLoading: false,
                
                form: this.$form.createForm(this, {name: 'edit'}),
                ruleForm: {},
                labelCol: {
                    span: 6
                },
                wrapperCol: {
                    span: 16
                },
                
                /* 性别列表 */
                sexList: [
                    {value: '1', label: '男'},
                    {value: '2', label: '女'},
                ],
                /* 等级列表 */
                classifyList: [
                    {value: '100', label: '青铜'},
                    {value: '1', label: '黄金'},
                ],
            }
        },
        created() {
            /* 面包屑 */
            this.$store.state.breadList = [
                {value: "会员管理", url: ""},
                {value: "会员列表", url: "/home/user"},
                {value: "会员详情", url: ""},
            ];
            this.$store.state.breadValue = '会员详情';
        },
        mounted(){
            this.loadData();   //初始化
        },
        methods: {
            /* 商品列表 */
            loadData() {
                let params = {
                    member_id : this.$route.params.id,
                };
                this.dataLoading = true;
                this.$http.get(UserDetailAPI, {params}).then(resp => {
                    this.dataLoading = false;
                    if (resp.data.code == 1) {
                        let list = resp.data.data;
                        for (let i in list){
                            this.ruleForm[i] = list[i].toString();
                        }
                    }
                }).catch(error => {
                    this.dataLoading = false;
                });
            },
            //取消
            ruleCancel() {
               this.$router.push('/home/user')
            },
        }
    }
</script>

<style scoped>
    .button{
        padding: 5px 28px;
    }
</style>
