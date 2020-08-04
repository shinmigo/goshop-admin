<template>
    <a-modal class="model" :title="styleType.type == 1 ?'新建权限':'编辑权限'" :width="styleType.width" :visible="this.$store.state.model.editType" @cancel="ruleCancel" centered >
        <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol" @keyup.enter.native="submitForm">
            <a-form-item label="权限/菜单ID" class="text-hide">
                <a-input v-decorator="['id',{ initialValue: ruleForm.id }]" />
            </a-form-item>
            <a-form-item label="是否菜单" required>
                <a-select v-model="ruleForm.isType" paramsName="member_level_id" class="extent">
                    <a-select-option :key="index" :value="item.value" v-for="(item,index) in menuList">
                        {{ item.label }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="ruleForm.isType==1?'菜单名称':'权限名称'" has-feedback >
                <a-input v-decorator="['name',{ initialValue: ruleForm.name, rules:rules.name }]" :placeholder="ruleForm.isType==1?'请输入菜单名称':'请输入权限名称'"/>
            </a-form-item>
            <a-form-item label="菜单排序" v-if="ruleForm.isType==1" has-feedback >
                <a-input v-decorator="['sort',{ initialValue: ruleForm.sort, rules:rules.sort }]" placeholder="请输入菜单排序"/>
            </a-form-item>
            <a-form-item label="菜单图标" v-if="ruleForm.isType==1" class="initValue" has-feedback >
                <div class="initvalues initvalued">
                    <a-input v-decorator="['icon',{ initialValue: ruleForm.icon, rules:rules.icon }]" placeholder="请输入菜单图标"/>
                    <a href="https://www.antdv.com/components/icon-cn/" target="_blank">图标库</a>
                </div>
            </a-form-item>
            <a-form-item label="菜单URL" v-if="ruleForm.isType==1" has-feedback >
                <a-input v-decorator="['menuUrl',{ initialValue: ruleForm.menuUrl, rules:rules.menuUrl }]" placeholder="请输入菜单URL"/>
            </a-form-item>
            <div v-for="(item,index) in ruleForm.rights" :key="index" >
                <a-form-item label="权限URL" v-if="index == 0" class="initValue" has-feedback>
                    <a-input v-decorator="['value'+index,{ initialValue: ruleForm.rights[index], rules:rules.rights }]" placeholder="请输入权限URL"/>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 16, offset: 6 }" v-else class="initValue" has-feedback>
                    <div class="initvalues">
                        <a-input v-decorator="['value'+index,{ initialValue: ruleForm.rights[index], rules:rules.rights }]" placeholder="请输入权限URL"/>
                        <span class="round" @click="deleteValue(index)"><a-icon type="minus" /></span>
                    </div>
                </a-form-item>
            </div>
            <a-form-item :wrapper-col="{ span: 16, offset: 6 }" class="addInitValue">
                <a-button type="dashed" icon="plus" @click="addValue" block>添加权限URL</a-button>
            </a-form-item>
            
            
            <a-form-item label="状态" >
                <a-switch :checked="ruleForm.status" @change="onChange" checked-children="开" un-checked-children="关" default-checked class="switch"/>
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
                    name:[{required: true,whitespace: true, message: '请输入名称!'}],
                    menuUrl:[{required: true,whitespace: true, message: '请输入菜单URL!'}],
                    sort: [{required: true,whitespace: true, message: '请输入菜单排序!'},{ validator: this.verifySort }],
                    icon: [{required: true,whitespace: true, message: '请输入菜单图标!'}],
                    rights: [{required: true,whitespace: true, message: '请输入权限URL!'}],
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
               /* 是否菜单列表 */
                menuList:[
                    { value: '0', label: '权限' },
                    { value: '1', label: '菜单' },
                ],
            }
        },
 
        methods: {
            /* 添加权限URL */
            addValue(){
                let str = '';
                this.ruleForm.rights.push(str);
            },
            /* 删除权限URL */
            deleteValue(index){
                this.ruleForm.rights.splice(index,1);
            },
            
            
            /* 开关按钮 */
            onChange(value){
                console.log("开关：",value);
                this.ruleForm.status = !this.ruleForm.status
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
                        console.log(values);
                        this.$store.state.loading = true;
                        
                        let _this = this;
                        setTimeout(function () {
                            _this.$store.state.loading = false;
                        },1000)
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
    .initvalued{
        grid-template-columns: 1fr 42px !important;
        column-gap: 6px;
    }
    
    .model .initValue{
        margin-bottom: 12px !important;
    }
    .initvalues{
        width: calc(100% - 32px);
        display: grid;
        grid-template-columns: 1fr 32px;
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
