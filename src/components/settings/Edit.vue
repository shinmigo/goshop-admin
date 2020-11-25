<template>
    <a-modal class="model" :title="styleType.type == 1 ?'新建广告位':'编辑广告位'" :width="styleType.width" :visible="this.$store.state.model.addType" @cancel="ruleCancel" centered >
        <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol" @keyup.enter.native="submitForm">
            <a-form-item label="广告ID" has-feedback class="text-hide">
                <a-input v-decorator="['id',{ initialValue: ruleForm.id }]" />
            </a-form-item>
            <a-form-item label="广告位类型" has-feedback required>
                <a-select v-model="ruleForm.type" placeholder="请选择广告位类型">
                    <a-select-option v-for="(value,key) in menuUp4" :key="key" :value="value.value">
                        {{ value.label }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="广告位名称" has-feedback >
                <a-input v-decorator="['name',{ initialValue: ruleForm.name , rules:rules.name }]" placeholder="请输入广告位名称"/>
            </a-form-item>
            <a-form-item label="广告位图片" has-feedback required>
                <div class="image" v-for="(item,index) in ruleForm.ele_info" :key="index">
                    <div class="img">
                        <span @click="addImg(index)">
                        <img v-if="item.image_url" :src="ruleForm.url + '?name=' + item.image_url" />
                        <div v-else>
                            <a-icon type="camera" />
                        </div>
                        </span>
                        <span class="minus" @click="deleted(index)"><a-icon type="close-circle" /></span>
                    </div>
                    <div>
                        <a-input v-model="item.redirect_url" placeholder="请输入跳转链接" class="img-input"/>
                        <a-input v-model="item.sort" placeholder="请输入排序" style="width: 120px"></a-input>
                    </div>
                </div>
                <a-button class="addButton" @click="addImage" v-if="ruleForm.type == 1" block>添加</a-button>
            </a-form-item>
            <a-form-item label="广告位状态" has-feedback >
                <a-switch :checked="ruleForm.status" @click="onChange" checked-children="启用" un-checked-children="禁用" class="switch"/>
            </a-form-item>
            
            <a-form-item :wrapper-col="{ span: 16, offset: 6 }" class="text-left bg-loading">
                <a-button type="primary" @click.prevent="submitForm()" class="margin-right-df text-letter">
                    <a-spin v-show="this.$store.state.loading"/>
                    {{ this.$store.state.loading ? styleType.type == 1 ? "正在创建中":"正在编辑中" : styleType.type == 1 ? "马上创建":"马上编辑" }}
                </a-button>
                <a-button @click.prevent="ruleCancel()">取消</a-button>
            </a-form-item>
        </a-form>
        <!-- 图片库 -->
        <images-library :imageType="imageType" @refresh="imageTickling"></images-library>
    </a-modal>
</template>

<script>
    import { AddBannerAPI,EditBannerAPI,ImagesAPI } from '../../config/api'
    import {Warning} from "../../common/mixin/Warning";
    import Menu from '../../config/menu'

    import imagesLibrary from '../image/Index'   //图片库
    
    export default {
        mixins: [Warning],
        props: ['styleType','ruleForm'],
        data () {
            return {
                form: this.$form.createForm(this, { name: 'edit' }),
                menuUp4: Menu.menuUp4,
    
                /* 图片库 */
                imageType:{
                    status: 1,     //状态(1商品轮播图片)
                    type: 2,       //上传图片状态1单品，2批量
                    action: ImagesAPI,     //图片上传接口
                },
                
                rules:{
                    name:[{required: true,whitespace: true, message: '请输入广告位名称!' }],
                },
                labelCol: {
                    span: 6
                },
                wrapperCol: {
                    span: 16
                },
            }
        },
        components:{
            imagesLibrary
        },
        methods: {
            /* 添加广告图片 循环 */
            addImage(){
                let str = { image_url:'',redirect_url:'' };
                this.ruleForm.ele_info.push(str);
            },
            /* 删除广告图片 循环 */
            deleted(index){
                this.ruleForm.ele_info.splice(index,1);
            },
            /* 打开图片库 */
            addImg(index){
                this.imageType = {
                    status: 2,     //状态(1商品轮播图，2商品规格图片)
                    type: 1,       //上传图片状态1单品，2批量
                    index: index,     //key键
                    action: ImagesAPI,     //图片上传接口
                };
                this.$store.state.model.editType = true;
            },
            /* 图片库反馈 */
            imageTickling(list) {
                console.log('图片反馈:', list);
                if (!list.status) {
                    this.warningType('参数错误！');
                    return false;
                }
                let image_id = list.list ? list.list[0].image_id:'';
                this.ruleForm.ele_info[this.imageType.index].image_url = image_id;
            },
            /* 开关-状态 */
            onChange(){
                this.ruleForm.status = !this.ruleForm.status;
            },
            /* 提交 */
            submitForm() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        
                        let params = {};
                        params.type = Number(this.ruleForm.type);
                        params.name = values.name.toString();
                        for (let item of this.ruleForm.ele_info){
                            if(!item.image_url){
                                this.warningType('请选择图片');
                                return false;
                            }
                            if(!item.redirect_url || !this.validate.leftRightBlank(item.redirect_url)){
                                this.warningType('请选择图片链接');
                                return false;
                            }
                            item.sort = Number(item.sort);
                        }
                        
                        params.ele_info = JSON.stringify(this.ruleForm.ele_info);
                        params.status = this.ruleForm.status?1:2;
    
                        let url = AddBannerAPI;
                        let text = '创建成功！';
                        if(this.styleType.type == 2){
                            params.id = Number(values.id);
                            text = '编辑成功！';
                            url = EditBannerAPI;
                        }
                        
                        console.log(params);
                        
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
                this.$store.state.model.addType = false;
                this.form.resetFields();
            }
        }
    }
</script>

<style scoped>
    .image{
        margin-top: 10px;
        width: 100%;
        height: 96px;
        display: grid;
        grid-template-columns: 96px auto;
        column-gap: 10px;
    }
    .image .img{
        width: 96px;
        height: 96px;
        cursor: pointer;
        position: relative;
        text-align: center;
        line-height: 96px;
        border-radius: 4px;
        border: 1px solid #dddddd;
    }
    .image .img img{
        width: 94px;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 4px;
    }
    .image .img i{
        font-size: 22px;
        color: #b3b3b3;
    }
    .image .img-input{
        margin-top: 24px;
    }
    .image .img .minus{
        position: absolute;
        top: -30px;
        right: -244px;
        cursor: pointer;
    }
    .image .img .minus i{
        font-size: 18px;
        color: #ef7878;
    }
    .addButton{
        margin-top: 20px;
    }
</style>
