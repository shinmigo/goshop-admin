<template>
    <a-modal class="model" :title="styleType.type == 1 ?'新建商品标签':'编辑商品标签'" :width="styleType.width" :visible="this.$store.state.model.editType" @cancel="ruleCancel" centered >
        <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol" @keyup.enter.native="submitForm()">
            <a-form-item label="标签ID" has-feedback class="text-hide">
                <a-input v-decorator="['id',{ initialValue: ruleForm.id }]" placeholder="请输入标签名称"/>
            </a-form-item>
            <a-form-item label="标签名称" has-feedback >
                <a-input v-decorator="['name',{ initialValue: ruleForm.name, rules:name }]" placeholder="请输入标签名称"/>
            </a-form-item>
    
            <a-form-item :wrapper-col="{ span: 14, offset: 6 }" class="text-left bg-loading">
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
    import { AddProductTagAPI,EditProductTagAPI } from '../../../../config/api'
    import {Warning} from "../../../../common/mixin/Warning";
    
    export default {
        mixins: [Warning],
        props: ['styleType','ruleForm'],
        data () {
            return {
                form: this.$form.createForm(this, { name: 'edit' }),
                name:[{required: true,whitespace: true, message: '请输入标签名称!' }],
                labelCol: {
                    span: 6
                },
                wrapperCol: {
                    span: 16
                },
            }
        },
 
        methods: {
            submitForm() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        this.$store.state.loading = true;
                        console.log(values);
    
                        let text = '编辑成功！';
                        let url = EditProductTagAPI;
                        if(this.styleType.type == 1){
                            url = AddProductTagAPI;
                            text = '创建成功！';
                        }
                        this.$store.state.loading = true;
                        this.$http.post(url, this.$qs.stringify(values)).then(resp => {
                            this.$store.state.loading = false;
                            if (resp.data.code == 1) {
                                console.log('44444')
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
                this.$store.state.loading = false;
                this.$store.state.model.editType = false;
                this.form.resetFields();
            },
        }
    }
</script>

<style scoped>

</style>
