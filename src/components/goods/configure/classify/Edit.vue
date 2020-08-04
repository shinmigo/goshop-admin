<template>
    <a-modal class="model" :title="styleType.type == 1 ?'新建商品分类':'编辑商品分类'" :width="styleType.width" :visible="this.$store.state.model.editType" @cancel="ruleCancel" centered >
        <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol" @keyup.enter.native="submitForm">
            <a-form-item label="分类ID" has-feedback class="text-hide">
                <a-input v-decorator="['id',{ initialValue: ruleForm.id }]" />
            </a-form-item>
            <a-form-item label="所属分类" has-feedback >
                <a-cascader :options="classifyList" change-on-select v-decorator="['parent_id',{ initialValue: ruleForm.parent_id, rules:rules.parent_id }]" placeholder="请选择所属分类"  />
            </a-form-item>
            <a-form-item label="分类名称" has-feedback >
                <a-input v-decorator="['name',{ initialValue: ruleForm.name, rules:rules.name }]" placeholder="请输入分类名称"/>
            </a-form-item>
            <a-form-item label="排序" has-feedback >
                <a-input v-decorator="['sort',{ initialValue: ruleForm.sort, rules:rules.sort }]" placeholder="请输入分类排序"/>
            </a-form-item>
            <a-form-item label="状态" >
                <a-switch :checked="ruleForm.status" @click="onChange" checked-children="启用" un-checked-children="禁用" class="switch"/>
            </a-form-item>
            <a-form-item label="图标" required >
                <a-upload :name="upload.name" :headers="upload.headers" :show-upload-list="false" :action="upload.action" :before-upload="beforeUpload" @change="handleChange" :list-type="upload.classType" class="upload-img">
                    <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" />
                    <div v-else>
                        <a-icon :type="loading ? 'loading' : 'plus'" />
                        <div class="ant-upload-text">
                            Upload
                        </div>
                    </div>
                </a-upload>
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
    import { ImagesAPI,AddProductCategoryAPI,EditProductCategoryAPI } from "../../../../config/api";
    import {Warning} from "../../../../common/mixin/Warning";

    export default {
        mixins: [Warning],
        props: ['styleType','ruleForm'],
        data () {
            return {
                form: this.$form.createForm(this, { name: 'edit' }),
                rules:{
                    parent_id:[{required: true,whitespace: true,type: 'array', message: '请选择所属分类!' }],
                    name:[{required: true,whitespace: true, message: '请输入分类名称!' }],
                    sort:[{required: true,whitespace: true, message: '请输入分类排序!' },{ validator: this.verifySort }],
                },
                labelCol: {
                    span: 6
                },
                wrapperCol: {
                    span: 16
                },
                //上传图片参数
                upload: {
                    name: 'file',     //上传文件名称
                    method: 'post',   //提交类型
                    action: ImagesAPI,   //上传地址
                    classType: 'picture-card',          //样式
                    headers:{  //头部
                        Authorization: "Bearer 58458695465465dfee",
                    },
                    data:{   //参数
                        lengt:'SUNJUNFA',
                    }
                },
                //图片上传状态
                loading: false,
    
                classifyList:[],
            }
        },
        methods: {
            /* 所属分类中添加顶级分类 */
            addClassify(){
                this.classifyList = JSON.parse(JSON.stringify(this.$store.state.classifyList));
                let str = { value:'',label:'顶级分类' };
                this.classifyList.splice(0,0,str);
            },
            
            /* 开关-状态 */
            onChange(){
                this.ruleForm.status = !this.ruleForm.status;
            },
    
            /* 上传文件之后的钩子 */
            handleChange(item){
                console.log("状态：",item);
            },
            /* 上传文件之前的钩子 */
            beforeUpload(file, fileList){
                console.log("钩子:",file, fileList);
            },
            
            /* 验证数字 */
            verifySort(rule, value, callback) {
                if (value && !this.validate.isStringI(value,1,4)) {
                    callback('请输入数字！');
                }
                callback();
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
                       // console.log(values);
                        this.$store.state.loading = true;
                        
                        let parent = values.parent_id;
                        let parent_id = parent[parent.length-1];
                        
                        let params = {
                            parent_id: parent_id,
                            name: values.name,
                            sort: values.sort,
                            status: this.ruleForm.status?1:0,
                            icon: this.ruleForm.imageUrl?'2F9a504fc2d56285352d7d584290ef76c6a7ef6330':'2F9a504fc2d56285352d7d584290ef76c6a7ef6330',
                        };
    
                        let url = AddProductCategoryAPI;
                        let text = '创建成功！';
                        if(this.styleType.type == 2){
                            text = '编辑成功！';
                            url = EditProductCategoryAPI;
                            params.id = values.id;
                            
                            if(parent.includes(values.id)){
                                this.warningType('所属分类不能选择自身以及自身的下级！');
                                return false;
                            }
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

</style>
