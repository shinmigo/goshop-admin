<template>
    <div class="main">
        <a-spin tip="正在加载中..." v-if="dataLoading" class="loading"></a-spin>
        <div v-else>
            <a-tabs v-model="tabsKey" @change="callback">
                <a-tab-pane key="tabs1" tab="基础信息"></a-tab-pane>
                <a-tab-pane key="tabs2" tab="商品详情"></a-tab-pane>
            </a-tabs>
        
            <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol" @submit="submitForm" class="margin-tb-lg formCol">
                <div v-show="tabsKey == 'tabs1'">
                    <a-form-item label="商品分类" has-feedback >
                        <a-cascader :options="classifyList" v-decorator="['category_id',{ initialValue: customForm.category_id, rules:rules.category_id }]" class="extent" paramsName="category_id" placeholder="请选择所属分类" />
                    </a-form-item>
                    <a-form-item label="商品类型" has-feedback >
                        <a-select v-decorator="['kind_id',{ initialValue: customForm.kind_id, rules:rules.kind_id }]" @change="setParams" paramsName="kind_id" class="extent" placeholder="请选择所属类型" >
                            <a-select-option v-for="(item,index) in kindList" :key="index" :value="item.kind_id" >
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    
                    <a-form-item label="商品名称" has-feedback >
                        <a-input v-decorator="['name',{ initialValue: customForm.name, rules:rules.name }]" paramsName="name" class="extent" placeholder="请输入商品名称"/>
                    </a-form-item>
                    <a-form-item label="商品单位" has-feedback >
                        <a-input v-decorator="['unit',{ initialValue: customForm.unit, rules:rules.unit }]" paramsName="unit" class="extent" placeholder="请输入商品单位"/>
                    </a-form-item>
                    <a-form-item label="商品简介" required>
                        <textarea-type :ruleForm="textarea" paramsName="short_description" ></textarea-type>
                    </a-form-item>
                    <a-form-item label="商品轮播图">
                        <div class="carousel">
                            <div v-for="(item,index) in carousel" :key="index">
                                <div class="img-album cursor radius-xs" >
                                    <img :src="customForm.url + '?name=' + item">
                                    <span v-if="index == 0" class="first">宝贝主图</span>
                                    <div class="img-action" v-if="carousel.length > 0">
                                        <div @click="aboutImg('left',index)"><a-icon type="left" /></div>
                                        <div @click="aboutImg('delete',index)"><a-icon type="delete" /></div>
                                        <div @click="aboutImg('right',index)"><a-icon type="right" /></div>
                                    </div>
                                </div>
                            </div>
                            <div class="addImage" v-if="carousel.length < 7" @click="imageChange">
                                <span class="img-content">
                                    <a-icon :type="loading ? 'loading' : 'plus'" />
                                    <span class="img-text">Upload</span>
                                </span>
                            </div>
                        </div>
                    </a-form-item>
    
                    
                    <a-form-item label="商品规格" required>
                        
                        <div class="norms">
                            <!-- 规格列表 -->
                            <div v-show="Object.keys(normsData).length > 0" class="normsMeter">
                                <div class="meterList" v-for="(item,index) in normsData" :key="index">
                                    <div class="meterName">{{ index }}：</div>
                                    <div class="normsText">
                                        <a-checkbox v-for="(value,index1) in item" :key="index1" :checked="value.check" @change="checkChange(index,index1)">{{ value.title }}</a-checkbox>
                                    </div>
                                </div>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th v-for="(item,index) in columns" :key="index" >
                                            <span class="text-red" v-show="item.need">*</span>{{ item.title }}
                                        </th>
                                    </tr>
                                </thead>
    
                                <tbody>
                                    <tr v-for="(item,index) in manyNormsList" :key="index">
                                        <td v-for="(value,index1) in columns" :key="index1" class="text-cut">
                                             <span v-if="value.label == 'image'" @click="handleChangeFocus(index)"><!-- 多规格-图片 -->
                                                <div class="upload-table">
                                                    <img v-if="item.image" :src="customForm.url + '?name=' + item.image" />
                                                    <div v-else>
                                                        <a-icon type="camera" />
                                                    </div>
                                                </div>
                                            </span>
                                            <a-input v-model="item.price" v-else-if="value.label == 'price'" /><!-- 售价 -->
                                            <a-input v-model="item.cost_price" v-else-if="value.label == 'cost_price'" /><!-- 成本价 -->
                                            <a-input v-model="item.old_price" v-else-if="value.label == 'old_price'" /><!-- 原价 -->
                                            <a-input v-model="item.stock" v-else-if="value.label == 'stock'" /><!-- 库存 -->
                                            <a-input v-model="item.sku" v-else-if="value.label == 'sku'" /><!-- 编号 -->
                                            <a-input v-model="item.weight" v-else-if="value.label == 'weight'" /><!-- 重量 -->
                                            <a-input v-model="item.volume" v-else-if="value.label == 'volume'" /><!-- 体积 -->
                                            <span v-else-if="value.label == 'action'">
                                                <span @click="deleteManyNorms(index)" class="text-blue cursor"> 删除 </span>
                                            </span><!-- 操作 -->
                                            <span v-else>
                                                {{ item[value.label] }}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </a-form-item>
                    
    
                    <a-form-item label="商品状态" >
                        <a-radio-group v-decorator="['status',{ initialValue: customForm.status }]">
                            <a-radio :value="1">上架</a-radio>
                            <a-radio :value="2">下架</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="商品标签" >
                        <a-select mode="multiple" v-decorator="['tags',{ initialValue: customForm.tags }]" paramsName="tags" placeholder="请选择商品标签">
                            <a-select-option v-for="(item,index) in labelList" :key="index" :value="item.value">
                                {{ item.label }}
                            </a-select-option>
                        </a-select>
                        
                    </a-form-item>
                </div>
                <div v-show="tabsKey == 'tabs2'">
                    <a-row :gutter="24">
                        <a-col :span="12" v-for="(item,index) in paramterData" :key="index">
                            
                            <a-form-item :label="item.label" v-if="item.type == 1" > <!-- 文本框 -->
                                <a-input v-model="item.value" placeholder="placeholder" class="extent"/>
                            </a-form-item>
                            <a-form-item :label="item.label" v-else-if="item.type == 2"> <!-- 单选框 -->
    
                                <a-radio-group name="radioNorms" v-model="item.value">
                                    <a-radio v-for="(value,key) in item.children" :key="key" :value="value.value" >{{ value.label }}</a-radio>
                                </a-radio-group>
                                
                            </a-form-item>
                            <a-form-item :label="item.label" v-else-if="item.type == 3" > <!-- 复选框 -->
                                <a-checkbox-group :options="item.children" v-model="item.value" />
                            </a-form-item>
                        </a-col>
                        
                    </a-row>
    
                    <a-form-item label="手机端描述" has-feedback class="phoneBewrite" :label-col="{ span: 22 }" :wrapper-col="{ span: 22 }" >
                        <div class="bewrite">
                            <div class="phones radius-xs">
                                <div class="text">
                                    <div v-for="(item,index) in phoneList" :key="index">
                                        <div v-if="item.type == 1" class="cursor radius-xs">
                                            <div v-if="item.status == 2" v-html="item.text" @click="textChange(index,item)" class="htmlText" :class="{ textBlack: item.focus }"></div>
                                            <div v-else>
                                                <a-textarea v-model="item.text" :auto-size="{ minRows: 3, maxRows: 6 }"/>
                                                <a-button type="primary" @click="editText(2,item,index)">确定</a-button>
                                                <a-button @click="editText(3,item,index)">取消</a-button>
                                            </div>
                                            <div v-if="item.status == 2 && item.focus" class="fixed radius-xs">
                                                <span v-if="phoneList.length > 1 && index > 0" @click="moveText('top',index)">上移</span>
                                                <span v-if="phoneList.length > 1 && index < phoneList.length-1" @click="moveText('bottom',index)">下移</span>
                                                <span @click="editText(1,item,index)">编辑</span>
                                                <span @click="deleteText(index)">删除</span>
                                            </div>
                                        </div>
                                        <div v-else class="cursor radius-xs text-center">
                                            <img :src="customForm.url + '?name=' + item.text" @click="textChange(index,item)" />
                                            <div class="imgMongolia" :class="{ imgBlack: item.focus }" ></div>
                                            <div v-if="item.focus" class="fixed radius-xs">
                                                <span v-if="phoneList.length > 1 && index > 0" @click="moveText('top',index)">上移</span>
                                                <span v-if="phoneList.length > 1 && index < phoneList.length-1" @click="moveText('bottom',index)">下移</span>
                                                
                                                <span @click="imgChange(2)">替换</span>
                                                <span @click="deleteText(index)">删除</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="footer">
                                    <span @click="imgChange(1)">
                                        <a-icon type="picture" class="icon"/><br/>图片
                                    </span>
                                    <span @click="addWriting"><span class="icon">T</span><br/>文字</span>
                                </div>
                            </div>
                        </div>
                    </a-form-item>
                </div>
                
                <a-form-item :wrapper-col="{ span: 16, offset: 6 }" class="subButton" >
                    <a-button type="primary" v-show="tabsKey == 'tabs2'" v-banClick="" @click="submitForm($event)" class="margin-right-sm">
                        <a-spin v-show="this.$store.state.loading"/>
                        {{ this.$store.state.loading ? "正在保存中" : "马上保存" }}
                    </a-button>
                    <a-button type="primary" v-show="tabsKey == 'tabs1'" @click="nextTab()" class="margin-right-sm">下一步</a-button>
                    <a-button @click="cancelTab()" >取消</a-button>
                </a-form-item>
            </a-form>
        </div>
        <!-- 图片库 -->
        <images-library :imageType="imageType" @refresh="imageTickling"></images-library>
    </div>
</template>

<script>
    import { ProductListAPI,ProductCategoryListAPI,ProductKindListAPI,ProductTagListAPI,AddProductAPI,EditProductAPI,ImagesAPI,GetImageApi } from '../../../config/api'
    
    import { Warning } from "../../../common/mixin/Warning";  //公共类-警告
    import { Goods,SpecsParam } from "../../../common/mixin/EditGoods";  //公共类-商品详情
    import TextareaType from '../../common/Textarea'      //文本框
    import imagesLibrary from '../../image/Index'   //图片库

    import { mapState } from 'vuex'
    export default {
        mixins: [Warning,Goods,SpecsParam],
        name: "Edit",
        data() {
            return {
                dataLoading: true,      //loading加载状态
                tabsKey: 'tabs1',           //tabs页切换
                form: this.$form.createForm(this, { name: 'editGoods' }),
                labelCol: { span: 6 },
                wrapperCol: { span: 16 },
                /* 数据 */
                customForm:{
                    url: GetImageApi,     //图片路径
                    category_id: [],  //商品分类
                    kind_id: '',   //商品类型
                    name: '',  //商品名称
                    unit: '',  //商品单位
                    spec_type: '1',    //商品规格
                    status: 2,   //商品状态
                },
                /* 商品简介--文本框-数据 */
                textarea:{
                    text: '',
                    limitInput: 0,  //输入框限制
                    total: 100,  //文本输入最大长度
                    disabled: false,  //(true不可编辑，false:可以编辑)
                    isEmpty: false,   //是否为空（true是，false不是）
                },
    
                /* 验证 */
                rules:{
                    category_id:[{required: true,whitespace: true,type: 'array', message: '请选择所属分类!' }],
                    kind_id:[{required: true,whitespace: true, message: '请选择所属类型!' }],
                    name:[{required: true,whitespace: true, message: '请输入商品名称!' }],
                    unit:[{required: true,whitespace: true, message: '请输入商品单位!' }],
                    textarea: [{required: true,whitespace: true, message: '请输入商品简介!' }],
                },
                
                /* 图片库 */
                imageType:{
                    status: 1,     //状态(1商品轮播图片)
                    type: 2,       //上传图片状态1单品，2批量
                    action: ImagesAPI,     //图片上传接口
                },
    
                kindList:[],   //商品类型列表
                labelList:[],   //商品标签列表
            }
        },
        created () {
            let text = "创建商品";
            if(this.$route.params.id > 0){
                text = "编辑商品";
            }
            /* 面包屑 */
            this.$store.state.breadList = [
                {value: "商品管理", url: ""},
                {value: "商品列表", url: "/goods/index"},
                {value: text, url: ""},
            ];
            this.$store.state.breadValue = text;
        },
        computed: {
            ...mapState({
                classifyList: 'classifyList',  //分类列表
            })
        },
        mounted(){
            this.asyncFunc();   //初始化
        },
        components:{
            TextareaType,imagesLibrary
        },
        methods: {
            /* 规格图片-图片库打开 */
            handleChangeFocus(index){
                this.imageType = {
                    status: 2,     //状态(1商品轮播图，2商品规格图片)
                    type: 1,       //上传图片状态1单品，2批量
                    index: index,     //key键
                    action: ImagesAPI,     //图片上传接口
                };
                this.$store.state.model.editType = true;
            },
            /* 轮播图片--图片库打开 */
            imageChange(){
                this.imageType = {
                    status: 1,     //状态(1商品轮播图片)
                    type: 2,       //上传图片状态1单品，2批量
                    action: ImagesAPI,     //图片上传接口
                };
                this.$store.state.model.editType = true;
            },
            /* 手机端描述-图片库打开 */
            imgChange(type){
                console.log("图片1上传或2替换:",type)
                this.imageType = {
                    status: 3,     //状态(1商品轮播图，2商品规格图片，3手机端描述)
                    type: 1,       //上传图片状态1单品，2批量
                    phoneType: type,  //手机端描述类型(1上传或2替换)
                    action: ImagesAPI,     //图片上传接口
                };
                this.$store.state.model.editType = true;
            },
            /* 图片库反馈 */
            imageTickling(list){
                console.log('图片反馈:',list,this.carousel);
                if(!list.status){
                    this.warningType('参数错误！');
                    return false;
                }
                switch (list.status) {
                    case 1:  //图片轮播图
                        for(let value of list.list){
                            console.log(value);
                            this.carousel.push(value.image_id);
                        }
                        break;
                    case 2:   //商品规格图片
                        let image_id = list.list ? list.list[0].image_id:'';
        
                        console.log('商品规格图片',list,image_id);
                        this.manyNormsList[this.imageType.index].image = image_id;
                        break;
                    case 3:
                        let str = list.list ? list.list[0].image_id:'';
                        console.log('手机描述图片',list,str);
                        if(this.imageType.phoneType == 1){  //上传
                            let n = this.phoneFocus?this.phoneFocus + 1:this.phoneList.length;
                            let list = {
                                type: 2,
                                status: 1,
                                focus: false,
                                text: str,
                            };
                            this.phoneList.splice(n,0,list);
                        } else {  //替换
                            this.phoneList[this.phoneFocus].text = str;
                        }
                        
                        break;
                }
            },
            
            /* tabs切换页 */
            callback(key){
                console.log('切换:',key);
                this.tabsKey = key;
            },
            /* 下一个 */
            nextTab(){
                console.log('下一个');
                this.tabsKey = 'tabs2';
            },
            /* 取消 */
            cancelTab(){
                this.$router.push("/goods/index");
            },
            /* 提交 */
            submitForm(event){
                this.form.validateFields((err, values) => {
                    if (!err) {
                        /* 商品分类 */
                        values.category_id = values.category_id[values.category_id.length-1];
                
                        let textarea = this.textarea.text.toString();
                        values.short_description = this.validate.leftRightBlank(textarea)?this.validate.leftRightBlank(textarea):'';   //商品简介
                        if(!values.short_description){
                            this.textarea.isEmpty = true;
                            this.warningType("请输入商品简介");
                            this.onlyRead(event);   //防止按钮多次点击--解除禁止点击事件
                            return false;
                        }
                        
                        /* 轮播图片 */
                        values.images = this.carousel.join();
                        /* 商品标签 */
                        values.tags = JSON.stringify(values.tags);
    
                        let list = [];
                        /* 商品规格 2多规格，1单规格 */
                        values.spec_type = '2';
                        for (let item of this.manyNormsList){
                            for (let i in item) {
                                if(i == 'spec_value_id'){
                                    continue;
                                }
                                if(i == 'image'){
                                    item[i] = item[i]?item[i]:'';
                                }
                                let key = item[i] = this.validate.leftRightBlank(item[i].toString());
                                let name = '';
                                switch (i) {
                                 case 'image':
                                     name = '图片';
                                     break;
                                    case 'price':
                                        name = '售价';
                                        break;
                                    case 'old_price':
                                        name = '原价';
                                        break;
                                    case 'stock':
                                        name = '库存';
                                        break;
                                }
                                if (name.length > 0 && (!this.validate.isBlank(key) || key == 0)) {
                                    this.warningType('商品' + name + '数据不能为空或零！');
                                    this.onlyRead(event);   //防止按钮多次点击--解除禁止点击事件
                                    return false;
                                }
                            }
                            let str = {
                                'image': item.image?item.image:'sun54654sd6f4ds65f3ew',
                                'price': parseFloat(item.price),
                                'cost_price': parseFloat(item.cost_price),
                                'old_price': parseFloat(item.old_price),
                                'stock': parseFloat(item.stock),
                                'sku': item.sku,
                                'weight': parseFloat(item.weight),
                                'volume': parseFloat(item.volume),
                                'spec_value_id': [],
                                'product_spec_id': item.product_spec_id?parseFloat(item.product_spec_id):parseFloat(0),
                            };
                            for (let value of this.normsDataList){
                                if(item[value.parent_id] == value.title){
                                    str.spec_value_id.push(value.id);
                                }
                            }
                            list.push(str);
                        }
                        
                        if(list.length == 0){
                            this.warningType("请选择商品规格");
                            this.onlyRead(event);   //防止按钮多次点击--解除禁止点击事件
                            return false;
                        }
                        values.spec = JSON.stringify(list);
    
                        /* 商品参数 */
                        let paramter = [];
                        if(this.paramterData.length > 0) {
                            for (let item of this.paramterData) {
                                if (item.type == 1 || item.type == 2) {  //输入框 /单选框
                                    let str = {};
                                    str.param_id = item.param_id;
                                    str.value = item.value.toString();
                                    paramter.push(str);
                                } else if (item.type == 3) {  //复选框
                                    if(item.value && item.value.length == 0){
                                        this.warningType("请选择商品参数值");
                                        this.onlyRead(event);   //防止按钮多次点击--解除禁止点击事件
                                        return false;
                                    }
                                    for (let n of item.value) {
                                        let str = {};
                                        str.param_id = item.param_id;
                                        str.value = n.toString();
                                        paramter.push(str);
                                    }
                                }
                            }
                            
                            if (paramter.length == 0) {
                                this.warningType("请选择商品参数");
                                this.onlyRead(event);   //防止按钮多次点击--解除禁止点击事件
                                return false;
                            }
                            for (let item of paramter) {
                                if (!this.validate.leftRightBlank(item.value.toString())) {
                                    this.warningType("请选择商品参数值");
                                    this.onlyRead(event);   //防止按钮多次点击--解除禁止点击事件
                                    return false;
                                }
                            }
                        }
                        values.param = JSON.stringify(paramter);
                        
                        /* 手机端描述 */
                        let description = [];
                        for (let item of this.phoneList){
                            let str = {
                                type: item.type,
                                text: item.text,
                            };
                            description.push(str);
                        }
                        values.description =  JSON.stringify(description);
                
                        let url = AddProductAPI;
                        let text = '创建商品成功';
                        if(this.$route.params.id > 0){ //编辑
                            url = EditProductAPI;
                            text = '编辑商品成功';
                            values.id = this.$route.params.id;
                        }
    
                        this.$store.state.loading = true;
                        this.$http.post(url, this.$qs.stringify(values)).then(resp => {
                            this.$store.state.loading = false;
                            this.onlyRead(event);   //防止按钮多次点击--解除禁止点击事件
                            
                            if (resp.data.code == 1) {
                                this.successType(text);
                                if(this.$route.params.id == 0){
                                    this.$router.push('/goods/index')
                                }
                            }
                        }).catch(error =>{
                            this.$store.state.loading = false;
                            this.onlyRead(event);   //防止按钮多次点击--解除禁止点击事件
                        });
                    } else {
                        for (let i in err){
                            this.warningType(err[i]['errors'][0].message);
                            break;
                        }
                        this.onlyRead(event);   //防止按钮多次点击--解除禁止点击事件
                        this.$store.state.loading = false;
                    }
                });
            },
            
            /* 初始化 */
            async asyncFunc(){
                this.dataLoading = true;
                await this.getClassify();  //商品分类列表
                await this.getKind();       //商品类型列表
                await this.getLabel();      //商品标签列表
                if(this.$route.params.id > 0){
                    this.loadData();  //商品详情
                } else {
                    this.gitSpecs();
                }
                
                this.dataLoading = false;
            },
            /* 商品类型--列表 */
            getKind(){
                return new Promise((resolve, reject) => {
                    let params = {
                        page_size: 999,
                        page: 1,
                    };
                    this.$http.get(ProductKindListAPI, {params}).then(resp => {
                        this.dataLoading = false;
                        if (resp.data.code == 1) {
                            let list = resp.data.data;
                            for (let item of list.kinds){
                                item.kind_id = item.kind_id.toString();
                            }
                            this.kindList = list.kinds;
                            resolve(true);
                        }
                    });
                });
            },
            /* 商品分类--列表 */
            getClassify(){
                return new Promise((resolve, reject) => {
                    if (this.classifyList.length > 0) {
                        resolve(true);
                        return false;
                    }
                    let params = {
                        page_size: 999,
                        page: 1,
                    };
                    this.$http.get(ProductCategoryListAPI, {params}).then(resp => {
                        this.dataLoading = false;
                        if (resp.data.code == 1) {
                           
                            let list = resp.data.data;
                            for (let item of list.categories) {
                                item.value = item.category_id;
                                item.label = item.name;
                            }
                            let array = this.authority.recursion(list.categories);
                            for (let item of array) {
                                if (item.type == 1) {
                                    this.classifyList.push(item);
                                }
                            }
                            resolve(true);
                        }
                    });
                });
            },
            /* 商品标签--列表 */
            getLabel(){
                return new Promise((resolve, reject) => {
                    let params = {
                        page_size: 999,
                        page: 1,
                    };
                    this.$http.get(ProductTagListAPI, {params}).then(resp => {
                        this.dataLoading = false;
                        if (resp.data.code == 1) {
                            this.labelList = [];
                            let list = resp.data.data;
                            for (let item of list.tags) {
                                let str = {};
                                str.value = item.tag_id;
                                str.label = item.name;
                                this.labelList.push(str);
                            }
                            resolve(true);
                        }
                    });
                });
            },
            /* 商品详情--数据 */
            loadData(){
                let params = {
                    page_size: 1,
                    page: 1,
                    product_id: this.$route.params.id,     //商品ID
                };
                this.$http.get(ProductListAPI, {params}).then(resp => {
                    if (resp.data.code == 1) {
                        let list = resp.data.data;
                        if(!list.products){
                            return false;
                        }
                        this.normsDataList = [];
                        let product = list.products[0];
                        this.customForm.category_id =  product.category_path.map(Number);  //商品分类
                        
                        let kind_id = '';
                        for (let item of this.kindList){
                            if(product.kind_id == item.kind_id){
                                kind_id = product.kind_id.toString();
                            }
                        }
                        this.customForm.kind_id = kind_id;   //商品类型
                        if(kind_id){
                            this.setParams(this.customForm.kind_id);
                        } else {
                            this.form.validateFields(['kind_id',this.rules.kind_id],(errors, values)=>{});
                        }
                        this.customForm.name = product.name;  //商品名称
                        this.customForm.unit = product.unit;  //商品单位
                        this.customForm.status = product.status;  //商品状态
                        
                        /* 商品简介 */
                        this.textarea.text = product.short_description;   //商品简介
                        this.textarea.limitInput = product.short_description.length;  //商品简介长度
                        
                        /* 商品标签 */
                        this.customForm.tags = product.tags?product.tags:[];
                        
                        /* 商品轮播 */
                        this.carousel = product.images?product.images:[];
                        
                        /* 商品规格 */
                        this.customForm.spec_type = product.spec_type.toString();    //商品规格
                       
                        let spec = product.spec?product.spec:[];
                        let specFocus = [];
                        for (let item of spec) {
                            specFocus = specFocus.concat(item.spec_value_id);
                        }
                        specFocus = Array.from(new Set(specFocus));
                        
                        /* 计算商品规格选中 */
                        for (let i in this.normsData){
                            for (let t in this.normsData[i]){
                                if(specFocus.includes(this.normsData[i][t].id)){
                                    this.checkChange(i,t);
                                }
                            }
                        }
                        
                       // console.log("多规格-商家列表：",JSON.stringify(this.normsData),JSON.stringify(this.normsDataList),JSON.stringify(this.manyNormsList),JSON.stringify(spec));
                        /* 计算商品规格列表--数据 */
                        let many = [];
                        console.log(spec[0].spec_value_id,spec[0].spec_value_id[0]);
                        if(spec.length == 1 && spec[0].spec_value_id[0] == 0){
                            many.push(spec[0]);
                        } else {
                            for (let value of spec) {
                                for (let item of this.manyNormsList) {
                                    let sen = value.spec_value_id.reduce((num, value) => {
                                        if (item.spec_value_id.includes(value)) {
                                            num++;
                                        }
                                        return num;
                                    }, 0);
                                    if (item.spec_value_id.length == sen) {
                                        let str = Object.assign(item, value);
                                        many.push(str);
                                    }
                                }
                            }
                        }
                        this.manyNormsList = many;
                        
                        /* 商品参数 */
                        let params = product.param;
                        for(let item of this.paramterData){
                            if(item.type == 1){
                                for (let value of params){
                                    if (item.param_id == value.param_id){
                                        item.value = value.value;
                                    }
                                }
                            } else {
                                let param = params.reduce((array, value) => { array.push(value.value);return array; }, []);
                               
                                for (let value of item.children) {
                                    if (param.includes(value.value.toString()) && item.type == 2) {    //单选
                                        item.value = value.value;
                                    } else if (param.includes(value.value.toString()) && item.type == 3) {  //复选
                                        item.value.push(value.value);
                                    }
                                }
                            }
                        }
                        
                        /* 手机端描述 */
                        this.phoneList = [];
                        for (let item of JSON.parse(product.description)){
                            let str = {
                                type: item.type, //类型(1文字,2图片)
                                status: 2,
                                focus: false,
                                text: item.text,
                            };
                            this.phoneList.push(str)
                        }
                    }
                })
            },
        }
    }
</script>

<style scoped>
    /* 手机端描述--start */
    .bewrite{
        width: 100%;
        height: 686px;
        position: relative;
        background-color: #656565;
    }
    .bewrite .phones{
        margin: auto;
        width: 375px;
        height: 667px;
        position: relative;
        top: 8px;
        background-color: #ffffff;
    }
    /** 文本 */
    .bewrite .phones .text{
        padding: 2px 12px 12px;
        width: 100%;
        height: 600px;
        line-height: 24px;
        overflow: auto;
    }
    .bewrite .phones .text .cursor{
        margin-top: 10px;
        position: relative;
    }
    .bewrite .phones .text .cursor .htmlText{
        padding: 4px 6px;
    }
    .bewrite .phones .text .cursor img{
        max-width: 100%;
    }
    /*** 图片蒙层 */
    .imgMongolia{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        background-color: #00000046;
    }
    .bewrite .phones .text .imgBlack{
        z-index: 10;
    }
    /*** 文本背景色 */
    .bewrite .phones .text .textBlack{
        background-color: #00000046;
    }
    
    /** 定位--操作 */
    .bewrite .phones .text .cursor .fixed{
        padding: 0 3px;
        position: absolute;
        top: 0;
        right: 0;
        z-index: -1;
        line-height: 20px;
        background-color: #ffffff;
        border: 1px solid #dddddd;
    }
    .bewrite .phones .text .cursor:hover .fixed{
        z-index: 10;
    }
    .bewrite .phones .text .cursor .fixed>span{
        padding: 4px 12px;
        float: left;
        border-right: 1px solid #dddddd;
    }
    .bewrite .phones .text .cursor .fixed>span:nth-last-child(1){
        border-right: 0;
    }
    
    /** 底部 */
    .bewrite .phones .footer{
        width: 100%;
        height: 67px;
        position: absolute;
        bottom: 0px;
        display: grid;
        line-height: 22px;
        grid-template-columns: 1fr 1fr;
        justify-items: center;
        align-items: center;
        text-align: center;
        cursor: pointer;
        background-color: #c7c7c7;
    }
    .bewrite .phones .footer>span>i>svg{
        border-radius: 6px;
    }
    .bewrite .phones .footer>span .icon{
        font-size: 26px;
        font-family: 'Bell MT';
        
    }
    /* 手机端描述--end */
    
    /* 规格--start */
    .norms{
        width: 100%;
        min-height: 100px;
        overflow-x: auto;
    }
    .norms .normsMeter{
        margin: 10px 0 20px;
        padding: 10px 0;
        width: 100%;
        background-color: #acc1e00d;
    }
    .normsMeter .meterList{
        width: 100%;
        display: grid;
        grid-template-columns: 90px auto;
        column-gap: 20px;
    }
    .meterList .meterName{
        text-align: right;
    }
    .meterList .normsText{
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill,minmax(70px,118px));
        grid-template-rows: auto;
        column-gap: 10px;
    }
    .meterList .normsText label{
        white-space: nowrap;
        word-break: keep-all;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .norms table{
        min-width: calc(100% - 4px);
    }
    .norms>table thead{
        background-color: rgba(193, 193, 193, 0.24);
    }
    .norms>table td,.norms>table th{
        padding: 14px 10px 6px;
        line-height: 24px;
        border: 1px solid #dddddd;
    }
    /* 规格--end */
    
    /* 轮播图--start */
    .carousel{
        width: 100%;
        display: grid;
        grid-template-columns: repeat(5,100px);
        gap: 8px;
    }
    .carousel .img-album{
        padding: 4px;
        position: relative;
        width: 104px;
        height: 104px;
        border-radius: 4px;
        border: 1px dashed #d6c5c5;
    }
    .carousel .img-album img{
        width: 100%;
        height: 100%;
        border-radius: 4px;
    }
    .carousel .img-album .first{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        width: 100%;
        height: 22px;
        line-height: 22px;
        text-align: center;
        display: inline-block;
        color: #f9f9f9;
        font-size: 12px;
        background-color: #5656569e;
    }
    .carousel .img-album .first:before{
        content: '*';
        margin-right: 4px;
        color: red;
    }
    .carousel .img-album .img-action{
        width: 100%;
        height: 24px;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: -1;
        display: grid;
        grid-template-columns: repeat(3,1fr);
        column-gap: 20px;
        justify-items: center;
        color: #f9f9f9;
        line-height: 24px;
        background-color: #5656569e;
    }
    .carousel .img-album:hover .img-action{
        z-index: 1;
    }
    /* 轮播图--end */
    
    /* 提交按钮 */
    .subButton{
        margin-top: 50px;
    }
</style>
