<template>
    <a-modal class="model" :title="styleType.type == 1 ?'新建角色':'编辑角色'" :width="styleType.width" :visible="this.$store.state.model.editType" @cancel="ruleCancel" centered >
        <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol" @keyup.enter.native="submitForm">
            <a-form-item label="角色ID" class="text-hide">
                <a-input v-decorator="['id',{ initialValue: ruleForm.id }]" />
            </a-form-item>
            
            <a-form-item label="角色名称" has-feedback >
                <a-input v-decorator="['name',{ initialValue: ruleForm.name, rules:rules.name }]" placeholder="请输入角色名称"/>
            </a-form-item>
            <a-form-item label="状态" >
                <a-switch v-model="ruleForm.status" checked-children="开" un-checked-children="关" default-checked class="switch"/>
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
    import { ImagesAPI } from "../../../config/api";
    
    export default {
        props: ['styleType','ruleForm'],
        data () {
            return {
                form: this.$form.createForm(this, { name: 'edit' }),
                rules:{
                    name:[{required: true,whitespace: true, message: '请输入角色名称!' }],
                },
                labelCol: {
                    span: 6
                },
                wrapperCol: {
                    span: 16
                },
                /* 性别列表 */
                sexList:[
                    { value:'1', label:'男' },
                    { value:'2', label:'女' },
                ],
               /* 等级列表 */
                classifyList:[],
            }
        },
 
        methods: {
            /* 开关按钮 */
            onChange(value){
                console.log("开关：",value);
                this.ruleForm.status = !this.ruleForm.status
            },
            
            /* 验证数字 */
            verifySort(rule, value, callback) {
                const form = this.form;
                let str = form.getFieldValue('sort');
                if (!this.validate.isStringI(str,1,4)) {
                    callback('请输入数字！');
                } else {
                    callback();
                }
            },
            /* 所属分类 */
            handChange(value){
                console.log(value);
            },
            /* 下拉--搜索 */
            filterOption(input, option) {
                return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0);
            },
            /* 提交 */
            submitForm() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        console.log(values);
                        this.$store.state.loading = true;
                    }
                });
            },
            //取消
            ruleCancel(){
                this.$store.state.loading = false;
                this.$store.state.model.editType = false;
                this.form.resetFields();
            }
        }
    }
</script>

<style scoped>

</style>
