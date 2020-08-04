<template>
    <a-modal class="model" :title="styleType.type == 1 ?'关联参数':'关联规格'" :width="styleType.width" :visible="this.$store.state.model.nexus" @cancel="ruleCancel" centered >
        <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol" >
            <a-form-item label="类型ID" has-feedback class="text-hide">
                <a-input v-decorator="['kind_id',{ initialValue: ruleForm.kind_id }]" />
            </a-form-item>
            <a-form-item label="类型名称" required>
                {{ ruleForm.name }}
            </a-form-item>
            <a-form-item :label="styleType.type == 1 ?'关联参数':'关联规格'" has-feedback >
                <a-select mode="multiple"  v-decorator="['value',{ initialValue: ruleForm.value, rules:rules.value }]" class="response" >
                    <a-select-option v-for="(item,index) in relevancyList" :key="item.label+'*'+item.value" v-if="styleType.type == 1">
                        {{ item.label }}
                    </a-select-option>
                    <a-select-option v-for="(item,index) in relevancySpecsList" :key="item.label+'*'+item.value" v-if="styleType.type == 2">
                        {{ item.label }}
                    </a-select-option>
                </a-select>
            </a-form-item>
    
            <a-form-item :wrapper-col="{ span: 16, offset: 6 }" class="text-left bg-loading">
                <a-button type="primary" @click.prevent="submitForm()"  class="margin-right-df text-letter">
                    <a-spin v-show="this.$store.state.loading"/>
                    {{ this.$store.state.loading ? styleType.type == 1 ? "正在创建中":"正在编辑中" : styleType.type == 1 ? "马上创建":"马上编辑" }}
                </a-button>
                <a-button @click.prevent="ruleCancel()">取消</a-button>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
    import { ProductSpecBindableAPI,ProductParamBindableAPI,ParamByProductKindAPI,SpecByProductKindAPI } from '../../../../config/api'
    import {Warning} from "../../../../common/mixin/Warning";
    
    export default {
        mixins: [Warning],
        props: ['styleType','ruleForm'],
        data () {
            return {
                fetching: false,
                
                form: this.$form.createForm(this, { name: 'edit' }),
                rules:{
                    value:[{required: true,type: 'array', whitespace: true, message: '请选择关联数据!' }],
                },
                labelCol: {
                    span: 6
                },
                wrapperCol: {
                    span: 16
                },
    
                /* 关联数据列表--参数 */
                relevancyList:[],
                /* 关联数据列表--规格 */
                relevancySpecsList:[],
            }
        },
        methods: {
            /* 提交(1参数，2规格) */
            submitForm() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        console.log(JSON.stringify(values));
                        //this.$store.state.loading = true;
                        
                        let str = [];
                        for (let item of values.value){
                            let key = item.split('*')[1];
                            str.push(key);
                        }
                        
                        
                        let params = {
                            kind_id: values.kind_id,
                            spec_ids: str.join(),
                        };
                        let text = '商品类型关联商品规格成功！';
                        let url = SpecByProductKindAPI;
                        if(this.styleType.type == 1){
                            url = ParamByProductKindAPI;
                            text = '商品类型关联商品参数成功！';
                            params.param_ids = str.join();
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
                this.$store.state.model.nexus = false;
                this.form.resetFields();
            },
            /* 关联1参数/2规格--列表 */
            getLoadData(type){
                
                let params = {
                   /* page_size: 999,
                    page: 1,*/
                    name:'',
                };
                let url = ProductSpecBindableAPI;
                if(type == 1){
                    url = ProductParamBindableAPI;
                }
                this.fetching = true;
                this.$http.get(url,{ params }).then(resp => {
                    this.dataLoading = false;
                    if (resp.data.code == 1) {
                        let list = resp.data.data;
                        if(!list){
                            return false;
                        }
                        
                        if(type == 1){  //参数
                            this.relevancyList = [];
                            for (let item of list.data){
                                let str = {};
                                str.value = item.param_id.toString();
                                str.label = item.name;
                                this.relevancyList.push(str);
                            }
                        } else {  //规格
                            this.relevancySpecsList = [];
                            for (let item of list.data){
                                let str = {};
                                str.value = item.spec_id.toString();
                                str.label = item.name;
                                this.relevancySpecsList.push(str);
                            }
                        }
                        this.fetching = false;
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
