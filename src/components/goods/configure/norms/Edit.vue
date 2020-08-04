<template>
    <a-modal class="model" :title="styleType.type == 1 ?'新建商品规格':'编辑商品规格'" :width="styleType.width" :visible="this.$store.state.model.editType" @cancel="ruleCancel" centered >
        <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol" @keyup.enter.native="submitForm()">
            <a-form-item label="参数ID" has-feedback class="text-hide">
                <a-input v-decorator="['id',{ initialValue: ruleForm.id }]" />
            </a-form-item>
            <a-form-item label="规格名称" has-feedback >
                <a-input v-decorator="['name',{ initialValue: ruleForm.name, rules:rules.name }]" placeholder="请输入规格名称"/>
            </a-form-item>
            <a-form-item label="排序" has-feedback >
                <a-input v-decorator="['sort',{ initialValue: ruleForm.sort, rules:rules.sort }]" placeholder="请输入规格排序"/>
            </a-form-item>
            <div v-for="(item,index) in ruleForm.value" :key="index" >
                <a-form-item label="规格值" v-if="index == 0" class="initValue"  required>
                    <a-input v-model="item.content" placeholder="请输入规格值"/>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 16, offset: 6 }" v-else class="initValue" has-feedback>
                    <div class="initvalues">
                        <a-input v-model="item.content" placeholder="请输入规格值"/>
                        <span class="round" @click="deleteValue(index)"><a-icon type="minus" /></span>
                    </div>
                </a-form-item>
            </div>
            <a-form-item :wrapper-col="{ span: 16, offset: 6 }" class="addInitValue">
                <a-button type="dashed" icon="plus" @click="addValue" block>添加规格值</a-button>
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
    import { AddProductSpecAPI,EditProductSpecAPI } from '../../../../config/api'
    import {Warning} from "../../../../common/mixin/Warning";
    
    export default {
        mixins: [Warning],
        props: ['styleType','ruleForm'],
        data () {
            return {
                form: this.$form.createForm(this, { name: 'edit' }),
                rules:{
                    name:[{required: true,whitespace: true, message: '请输入规格名称!' }],
                    sort:[{required: true,whitespace: true, message: '请输入规格排序!' },{ validator: this.verifySort }],
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
            /* 验证数字 */
            verifySort(rule, value, callback) {
                if (value && !this.validate.isStringI(value,1,4)) {
                    callback('请输入数字！');
                }
                callback();
            },
            
            /* 添加规格值 */
            addValue(){
                let str = {spec_value_id:0,content:''};
                this.ruleForm.value.push(str);
            },
            /* 删除规格值 */
            deleteValue(index){
                console.log(this.ruleForm.value,index);
                this.ruleForm.value.splice(index,1);
            },
            /* 提交 */
            submitForm() {
                this.form.validateFields((err, values) => {
                    if (!err) {
        
                        /* 规格值 */
                        let contents = [];
                        
                        for (let item of this.ruleForm.value){
                            item.content = this.validate.leftRightBlank(item.content.toString());
                            if(item.content){
                                if(this.styleType.type == 2) {
                                    contents.push(item);
                                } else {
                                    contents.push(item.content);
                                }
                            } else {
                                this.warningType('请输入规格值');
                                return false;
                            }
                        }
                        
                        
                        let params = {
                            name: values.name,
                            sort: values.sort,
                        };
    
                        let text = '创建成功！';
                        let url = AddProductSpecAPI;
                        if(this.styleType.type == 2){
                            params.values = JSON.stringify(contents);
                            
                            text = '编辑成功！';
                            url = EditProductSpecAPI;
                            params.id = values.id;
                        } else {
                            params.values = contents.join();
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
</style>
