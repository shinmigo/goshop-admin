<template>
    <a-modal class="model" :title="styleType.type == 1 ?'新建商品参数':'编辑商品参数'" :width="styleType.width" :visible="this.$store.state.model.editType" @cancel="ruleCancel" centered >
        <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol" @keyup.enter.native="submitForm">
            <a-form-item label="参数ID" has-feedback class="text-hide">
                <a-input v-decorator="['param_id',{ initialValue: ruleForm.param_id }]" />
            </a-form-item>
            <a-form-item label="参数名称" has-feedback >
                <a-input v-decorator="['name',{ initialValue: ruleForm.name, rules:rules.name }]" placeholder="请输入参数名称"/>
            </a-form-item>
            <a-form-item label="参数类型" >
                <a-radio-group v-decorator="['type',{ initialValue: ruleForm.type, rules:rules.type }]" @change="handChange" class="groupType">
                    <a-radio-button value="1">文本框</a-radio-button>
                    <a-radio-button value="2">单选框</a-radio-button>
                    <a-radio-button value="3">复选框</a-radio-button>
                </a-radio-group>
            </a-form-item>
            <div v-if="ruleForm.type == '2' || ruleForm.type == '3'" v-for="(item,index) in ruleForm.contents" :key="index" >
                <a-form-item label="参数值" v-if="index == 0" class="initValue" required>
                    <a-input v-model="item.content" placeholder="请输入参数值"/>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 16, offset: 6 }" v-else class="initValue" >
                    <div class="initvalues">
                        <a-input v-model="item.content" placeholder="请输入参数值"/>
                        <span class="round" @click="deleteValue(index)"><a-icon type="minus" /></span>
                    </div>
                </a-form-item>
            </div>
            <a-form-item :wrapper-col="{ span: 16, offset: 6 }" class="addInitValue" v-if="ruleForm.type == '2' || ruleForm.type == '3'">
                <a-button type="dashed" icon="plus" @click="addValue" block>添加参数值</a-button>
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
    import { AddProductParamAPI,EditProductParamAPI } from '../../../../config/api'
    import {Warning} from "../../../../common/mixin/Warning";
    
    export default {
        mixins: [Warning],
        props: ['styleType','ruleForm'],
        data () {
            return {
                form: this.$form.createForm(this, { name: 'edit' }),
                rules:{
                    name:[{required: true,whitespace: true, message: '请输入参数名称!' }],
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
            /* 参数类型选择 */
            handChange(e){
                this.ruleForm.type = e.target.value;
                if(this.ruleForm.type == "2" || this.ruleForm.type == "3"){
                    this.ruleForm.contents = [{ param_value_id: 0,content: ""}];
                }
            },
            /* 添加参数值 */
            addValue(){
                let str = { param_value_id: 0,content: ""};
                this.ruleForm.contents.push(str);
            },
            /* 删除参数值 */
            deleteValue(index){
                this.ruleForm.contents.splice(index,1);
            },
            /* 提交 */
            submitForm() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        /* 参数值 */
                        let contents = [];
                        for (let item of this.ruleForm.contents){
                            item.content = this.validate.leftRightBlank(item.content.toString());
                            if(item.content){
                                if(this.styleType.type == 2) {
                                    contents.push(item);
                                } else {
                                    contents.push(item.content);
                                }
                            } else {
                                this.warningType('请输入参数值');
                                return false;
                            }
                        }
                        
                        let params = {
                            name: values.name,
                            type: values.type,
                            contents: JSON.stringify(contents),
                        };
    
                        let url = AddProductParamAPI;
                        let text = '创建成功！';
                        if(this.styleType.type == 2){
                            text = '编辑成功！';
                            url = EditProductParamAPI;
                            params.param_id = values.param_id;
                        }
                        this.$store.state.loading = true;
                        this.$http.post(url, this.$qs.stringify(params)).then(resp => {
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
            }
        }
    }
</script>

<style scoped>
    /* 参数值 */
    .model .initValue{
        margin-bottom: 12px !important;
    }
    .initvalues{
        width: calc(100% - 32px);
        display: grid;
        grid-template-columns: 1fr 30px;
        align-items:center;
    }
    .initvalues .round{
        margin-left: 10px;
        width: 19px;
        height: 19px;
        line-height: 19px;
        text-align: center;
        cursor: pointer;
        color: #ababab;
        border: 1px solid;
    }
    .model .addInitValue{
        margin-top: 10px !important;
    }
    /* 类型 */
    .model .groupType{
        margin-top: 4px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    }
</style>
