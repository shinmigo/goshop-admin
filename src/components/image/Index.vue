<template>
    <a-modal class="model gallery" title="图片库" width="800px" :visible="this.$store.state.model.editType" @cancel="ruleCancel" centered>
        <a-tabs type="card" v-model="tabKey" @change="callback">
            <a-tab-pane key="1" tab="从本地选择图片">
                <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <a-form-item label="选择图片" :label-col="labelCol" :wrapper-col="wrapperCol" style="margin-bottom: 0" required>
                        <div v-if="imageType.type == '1'" class="upload-one">
                            <div class="magnifier">
                                <a-upload name="my_file" list-type="picture-card" class="avatar-uploader" :show-upload-list="false" :action="imageType.action"
                                          :preview-file="previewFile"
                                          :before-upload="beforeUpload" @change="handleChange">
                                    <img :src="imageOne.image_path" v-if="imageOne.image_path" alt="avatar" class="img"/>
                                    <div v-else>
                                        <a-icon :type="loading ? 'loading' : 'plus'"/>
                                        <div class="ant-upload-text">Upload</div>
                                    </div>
                                </a-upload>
                                <span v-if="imageOne.image_path" @click="previewFile(imageOne.image_path)" title="预览文件" class="magnifier-actions">
                                            <i aria-label="图标: eye-o" class="anticon anticon-eye-o">
                                                <svg viewBox="64 64 896 896" data-icon="eye" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"
                                                     class=""><path
                                                d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path></svg>
                                            </i>
                                        </span>
                            </div>
                        </div>
                        <div v-else class="upload-batch">
                            <a-upload name="my_file" list-type="picture-card" :action="imageType.action" :file-list="fileList"
                                      :before-upload="beforeUpload" @change="handleChanges" @preview="handlePreview">
                                <div v-if="fileList.length < 8">
                                    <a-icon type="plus"/>
                                    <div class="ant-upload-text">
                                        Upload
                                    </div>
                                </div>
                            </a-upload>
                        </div>
                    </a-form-item>
                    <!--
                    <a-form-item label="设置标签" :label-col="labelCol" :wrapper-col="wrapperCol">
                        <a-select mode="tags" v-model="newImageTage" :token-separators="[' ']" :open="isOpen1" :filter-option="filterOption" @focus="imageFocus(1)"
                                  @search="imageFocus(1)" @blur="imageBlur(1)" @select="imageBlur(1)" @change="imageChange" class="imageSelect"
                                  placeholder="请输入标签名称(多个标签用空格分隔)，例: 美女 牛奶">
                            <a-select-option v-for="(item,index) in imageTags" :key="index" :value="item.value+'*'+item.label">
                                {{ item.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    -->
                    <div class="margin-button text-center bg-loading">
                        <a-button type="primary" @click.prevent="submitForm($event)" class="margin-right-df text-letter">
                            <a-spin v-show="this.$store.state.loading"/>
                            {{ this.$store.state.loading ? "正在添加中" : "马上添加" }}
                        </a-button>
                        <a-button @click.prevent="ruleCancel()">取消</a-button>
                    </div>
                </a-form>
            </a-tab-pane>
            <!--
            <a-tab-pane key="2" tab="从图片库选择图片">
                <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <a-form-item label="图片标签" :label-col="labelCol" :wrapper-col="wrapperCol">
                        <a-select mode="multiple" :token-separators="[' ']" :open="isOpen2" :filter-option="filterOption" @focus="imageFocus(2)" @search="imageFocus(2)"
                                  @blur="imageBlur(2)" @select="imageBlur(2)" @change="getImageList" class="imageSelect" placeholder="请选择标签名称">
                            <a-select-option v-for="(item,index) in imageTags" :key="index" :value="item.value+'*'+item.label">
                                {{ item.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="图片列表" :label-col="labelCol" :wrapper-col="wrapperCol">
                        <a-spin tip="Loading..." class="spitLoading" v-if="Loadings"></a-spin>
                        <div class="dataList" v-else>
                            <div v-for="(item,index) in imageList" :key="index">
                                <img :src="item.url" v-if="item.url" :class="{ active: item.isFocus }" @click="isFocus(index)">
                            </div>
                        </div>
                        <a-pagination :hideOnSinglePage="true" :total="total" @change="getImageList" class="margin-top-df imagePagin"/>
                    </a-form-item>
                    
                    <div class="margin-button2 text-center bg-loading">
                        <a-button type="primary" v-banClick="" @click.prevent="submitForm($event)" class="margin-right-df text-letter">
                            <a-spin v-show="this.$store.state.loading"/>
                            {{ this.$store.state.loading ? "正在添加中" : "马上添加" }}
                        </a-button>
                        <a-button @click.prevent="ruleCancel()">取消</a-button>
                    </div>
                </a-form>
            </a-tab-pane>
            -->
        </a-tabs>
        
        <!-- 放大镜 -->
        <a-modal class="exhibit" :visible="previewVisible" :footer="null" @cancel="uploadCancel">
            <img alt="example" style="width: 100%" :src="previewImage"/>
        </a-modal>
    </a-modal>

</template>

<script>
    import { GetImageApi } from '../../config/api'
    import {Warning} from "../../common/mixin/Warning"
    
    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    
    /* 放大镜 */
    function getBase65(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    
    export default {
        mixins: [Warning],
        props: ['imageType'],
        data() {
            return {
                form: this.$form.createForm(this, {name: 'edit'}),
                labelCol: {span: 3},
                wrapperCol: {span: 21},
                tabKey: '1',  //页签焦点
                tabKeyNumber: 1,  //切换次数
                
                isOpen1: false,  //设置标签--下拉框是否展示
                isOpen2: false,  //图片标签--下拉框是否展示
                
                loading: false,  //上传图片过度状态
                //单品添加--图片地址
                imageOne: {
                    image_id: '',
                    image_path: '',
                },
                
                //批量添加--图片列表
                fileList: [],
                
                previewVisible: false,  //放大镜--是否展示图片
                previewImage: '',    //放大镜--图片地址
                
                //下拉--图片标签列表
                imageTags: [
                    {value: '1', label: 'Tom123'},
                    {value: '2', label: 'Aju123'},
                    {value: '3', label: 'Jem123'},
                    {value: '4', label: 'Hen123'},
                    {value: '5', label: 'Pin123'},
                    {value: '6', label: 'Omr123'},
                ],
                newImageTage: [],  //设置标签-下拉--选中
                
                //图片列表
                Loadings: false,  //图片列表加载状态
                imageList: [],   //图片列表
                total: 0,   //图片列表总数
            }
        },
        created() {
        },
        mounted() {
        
        },
        destroyed() {
        },
        components: {},
        methods: {
            //下拉--数据格式化
            filterOption(input, option) {
                return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0);
            },
            
            //搜索图片列表
            getImageList() {
                console.log("搜索商品图片");
                let str = [
                    {uid: '1', url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', isFocus: false},
                    {uid: '2', url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', isFocus: false},
                ]
                
                this.Loadings = true;
                let _this = this;
                setTimeout(function () {
                    _this.imageList = str;
                    _this.total = 500;
                    _this.Loadings = false;
                }, 500);
            },
            //商品图片列表--焦点选中
            isFocus(index) {
                if (this.imageType.type == 1) {  //单品
                    for (let item of this.imageList) {
                        item.isFocus = false;
                    }
                }
                this.imageList[index].isFocus = !this.imageList[index].isFocus;
            },
            
            
            //设置图片标签
            async imageChange(value) {
                console.log("value：：", tag);
                let tag = [];
                let tags = [];
                for (let i in value) {
                    if (!value[i].includes('*')) {   //新的商品标签(标签列表中没有的)
                        tag.push(value[i]);
                        continue;
                    }
                    tags.push(value[i]);
                }
                tags = Array.from(new Set(tags));  //去重
                console.log(tag);
                
                let list = await this.getTags(tag);  //创建新的商品标签
                this.newImageTage = tags.concat(list);
                for (let i in list) {
                    let ms = list[i].split('*');
                    let str = {};
                    str.value = ms[0];
                    str.label = ms[1];
                    this.imageTags.push(str);
                }
                
                console.log(this.newImageTage);
            },
            //创建新的商品标签
            getTags(tag) {
                return new Promise((resolve, reject) => {
                    for (let item of this.imageTags) {
                        let index = tag.indexOf(item.label);
                        if (index != -1) {
                            console.log("相同的", item.label);
                            tag.splice(index, 1);
                        }
                    }
                    let list = [];
                    for (let i in tag) {
                        let n = Math.round(Math.random() * 100);
                        list.push("News" + n + "*" + tag[i]);
                    }
                    resolve(list);
                });
            },
            //离开焦点，选中下拉框(1设置标签,2图片标签)
            imageBlur(key) {
                console.log('blur');
                if (key == 1) {
                    this.isOpen1 = false;
                    return false;
                }
                this.isOpen2 = false;
            },
            //焦点所在，输入变化(1设置标签,2图片标签)
            imageFocus(key) {
                console.log('focus');
                if (key == 1) {
                    this.isOpen1 = true;
                    return false;
                }
                this.isOpen2 = true;
            },
            
            //单图片-放大镜-图片预览
            async previewFile(file) {
                if (!file) {
                    file = await getBase65(file);
                }
                this.previewImage = file;
                console.log(this.previewImage);
                this.previewVisible = true;
            },
            //多图片-放大镜-图片预览
            async handlePreview(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase65(file.originFileObj);
                }
                this.previewImage = file.url || file.preview;
                console.log(this.previewImage);
                this.previewVisible = true;
            },
            //关闭放大镜
            uploadCancel() {
                this.previewVisible = false;
            },
            
            //多图片--后端返回
            handleChanges({fileList}) {
                console.log("fileList：：", fileList);
                this.fileList = fileList;
                
                let n = fileList.length - 1;
                console.log("：：",this.fileList);
                if (fileList[n].status === 'error') {
                    this.warningType('上传失败！');
                    this.fileList.splice(n, 1);
                }
                this.loading = false;
            },
            //单图片--后端返回
            handleChange(info) {
                /* 上传中 */
                if (info.file.status === 'uploading') {
                    this.loading = true;
                    return;
                }
                if (info.file.status === 'done') {
    
                    console.log("info：：", info.file.response);
                    let resp = info.file.response;
                    if(resp.code == 1){
                        let url = GetImageApi +"?name="+ resp.data;
                        this.imageOne.image_id = resp.data;
                        this.imageOne.image_path = url;
                    } else {
                        this.warningType(resp.message);
                    }
                }
                if (info.file.status === 'error') {
                    this.warningType('上传失败！');
                }
                this.loading = false;
            },
            //验证拦截
            beforeUpload(file) {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    this.$message.error('You can only upload JPG file!');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('Image must smaller than 2MB!');
                }
                return isJpgOrPng && isLt2M;
            },
            
            //提交
            submitForm(event) {
                let list = [];
                let params = {};
                if (this.tabKey == 1) { //本地选择图片
                    if (this.imageType.type == 1) {  //单品--从本地选择图片
                        if (!this.imageOne.image_path) {
                            this.warningType('请上传图片');
                            return false;
                        }
                        let str = {};
                        str.image_id = this.imageOne.image_id;
                        str.image_path = this.imageOne.image_path;
                        list.push(str);
                        params.image = list;
                    } else if (this.imageType.type == 2) {  //批量--从本地选择图片
                        if (this.fileList.length == 0) {
                            this.warningType('请上传图片');
                            return false;
                        }
                        for (let item of this.fileList) {
                            let img = {};
                            let resp = item.response.data;
                            let url = GetImageApi +"?name="+ resp;
                            img.image_id = resp;
                            img.image_path = url;
                            list.push(img);
                        }
                        params.image = list;
                    }
                    //图片跟标签绑定
                    let newIds = [];
                    if (this.newImageTage.length > 0) {
                        //ajax绑定
                        for (let item of this.newImageTage) {
                            let value = item.split('*');
                            newIds.push(value[0]);
                        }
                    }
                    params.tag_id = newIds.join();
                } else if (this.tabKey == 2) { //图片库选择图片
                    for (let item of this.imageList) {
                        if (item.isFocus) {
                            let str = {};
                            str.image_id = 'jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
                            str.image_path = item.url;
                            list.push(str);
                        }
                    }
                    params.image = list;
                }
                console.log("params：：", params);
    
                console.log('提交');
                this.$store.state.loading = true;
                let tickling = {};
                tickling.status = this.imageType.status?this.imageType.status:1;   //从哪里来的
                tickling.list = list;                      //图片选中
                this.$store.state.loading = false;
                this.$emit('refresh', tickling);
                this.ruleCancel();
            },
            //取消
            ruleCancel() {
                this.tabKey = '1';      //页签焦点
                this.tabKeyNumber = 1;  //tabs切换次数
                this.imageList = [];    //图片列表
                this.imageOne = {image_id: '', image_path: ''};  //本地添加--单个
                this.fileList = [];   //本地添加--批量
                this.newImageTage = [];  //设置标签--选中清空
                this.$store.state.model.editType = false;
            },
            //tabs切换
            callback(key) {
                this.tabKey = key;
                if (key == 2 && this.tabKeyNumber == 1) {
                    this.getImageList();
                    this.tabKeyNumber++;
                }
            },
        },
        watch: {}
    }
</script>

<style scoped>
    /* 图片 */
    .exhibit img {
        padding: 8px;
        border-radius: 10px;
    }
    
    /* 设置标签--搜索输入框 */
    .imageSelect {
        width: calc(100% - 42px);
    }
    
    /* 图片列表 */
    .dataList {
        display: grid;
        grid-template-columns: repeat(auto-fill, 112px);
        gap: 14px;
    }
    
    .dataList img {
        padding: 8px;
        width: 100%;
        cursor: pointer;
        border-radius: 4px;
        border: 1px solid #dddddd;
    }
    
    .dataList .active {
        border: 1px solid #ff0000;
    }
    
    /* 按钮 */
    .margin-button {
        margin: 40px 0px 20px;
    }
    
    .margin-button2 {
        margin: 26px 0px 16px;
    }
    
    /* 图片列表加载状态 */
    .spitLoading {
        margin: 30px 0;
        position: relative;
        left: calc(50% - 50px);
    }

</style>
