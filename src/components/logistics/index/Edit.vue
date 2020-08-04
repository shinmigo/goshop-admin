<template>
    <a-modal class="model" :title="styleType.type == 1 ?'新建物流公司':'编辑物流公司'" :width="styleType.width" :visible="this.$store.state.model.editType" @cancel="ruleCancel" centered >
        <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol" @keyup.enter.native="submitForm()">
            <a-form-item label="公司ID" has-feedback class="text-hide">
                <a-input v-decorator="['id',{ initialValue: ruleForm.id }]" placeholder="请输入公司ID"/>
            </a-form-item>
            <a-form-item label="公司名称" has-feedback >
                <a-input v-decorator="['company_name',{ initialValue: ruleForm.company_name, rules:rules.company_name }]" placeholder="请输入公司名称"/>
            </a-form-item>
            <a-form-item label="公司编码" has-feedback >
                <a-input v-decorator="['company_code',{ initialValue: ruleForm.company_code, rules:rules.company_code }]" placeholder="请输入公司编码"/>
            </a-form-item>
            <a-form-item label="排序" has-feedback paramsName="sort">
                <a-input v-decorator="['sort',{ initialValue: ruleForm.sort, rules:rules.sort }]" placeholder="请输入公司排序"/>
            </a-form-item>
            <a-form-item label="状态">
                <a-switch :checked="ruleForm.status" @click="onChange" paramsName="status" checked-children="启用" un-checked-children="禁用" class="switch"/>
            </a-form-item>
    
            <a-form-item :wrapper-col="{ span: 16, offset: 6 }" class="text-left bg-loading">
                <a-button type="primary" @click.prevent="submitForm()" class="margin-right-df text-letter">
                    <a-spin v-show="this.$store.state.loading"/>
                    {{ this.$store.state.loading ? styleType.type == 1 ? "正在创建中":"正在编辑中" : styleType.type == 1 ? "马上创建":"马上编辑" }}
                </a-button>
                <a-button @click.prevent="ruleCancel()">取消</a-button>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
    import { AddCarrierAPI,EditCarrierAPI } from "../../../config/api";

    import {Warning} from "../../../common/mixin/Warning";
    export default {
        mixins: [Warning],
        props: ['styleType','ruleForm'],
        data () {
            return {
                form: this.$form.createForm(this, { name: 'edit' }),
                rules:{
                    company_name:[{required: true,whitespace: true, message: '请输入公司名称!' }],
                    company_code:[{required: true,whitespace: true, message: '请输入公司编码!' }],
                    sort:[{required: true,whitespace: true, message: '请输入公司排序!' },{ validator: this.verifySort }],
                },
                labelCol: {
                    span: 6
                },
                wrapperCol: {
                    span: 16
                },
            }
        },
 
        methods: {
            /* 开关-状态 */
            onChange(){
                this.ruleForm.status = !this.ruleForm.status;
            },
            /* 验证数字 */
            verifySort(rule, value, callback) {
                if (value && !this.validate.isStringI(value,1,4)) {
                    callback('请输入数字！');
                }
                callback();
            },
            /* 提交 */
            submitForm() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        values.status = this.ruleForm.status?1:2;  //状态
                        
                        let text = '编辑成功！';
                        let url = EditCarrierAPI;
                        if(this.styleType.type == 1){
                            url = AddCarrierAPI;
                            text = '创建成功！';
                        }
                        this.$store.state.loading = true;
                        this.$http.post(url, this.$qs.stringify(values)).then(resp => {
                            this.$store.state.loading = false;
                            if (resp.data.code == 1) {
                                this.successType(text);
                                this.ruleCancel();
                                this.$emit('refresh');
                            }
                        }).catch(error =>{
                            this.$store.state.loading = false;
                        });
                    }
                });
            },
            //取消
            ruleCancel(){
                this.$store.state.model.editType = false;
                this.form.resetFields();
            },
        }
    }
</script>

<style scoped>

</style>
