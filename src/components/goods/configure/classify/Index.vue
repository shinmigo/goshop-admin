<template>
    <div class="main">
        <div class="fewSearch">
            <div class="search-input margin-right-df">
                <div class="text-row">
                    <label>分类名称：</label>
                    <a-input v-model="searchText" placeholder="请输入分类名称"></a-input>
                </div>
            </div>
            <div class="search-button text-right padding-right-sm">
                <a-button type="primary" @click="search">查&nbsp;询</a-button>
                <a-button type="primary" icon="plus" @click="add()" class="margin-lr-sm">新建分类</a-button>
                <batch-type :batchList="batchList" @refresh="refreshBatch"></batch-type>
            </div>
        </div>
        <div class="pitchNumber margin-top-sm radius-xs"><span>i</span>已选<span>{{ rowKeys.length }}</span>个商品<span @click="emptyCheck">清空已选</span></div>
        
        
        <a-table :columns="columns" :data-source="dataList" :row-key="record => record.category_id" :loading="dataLoading"
                 :row-selection="{selectedRowKeys:rowKeys, onChange:onRowChange }" :pagination="false"
                 @change="asyncFunc" class="table classify-padding margin-top-df">
            <a slot="name" slot-scope="text">{{ text }}</a>
            <span slot="icon" slot-scope="text"><img :src="image_path+'?name='+text" class="img"></span>
            <span slot="status" slot-scope="text,record,index">
                <a-switch :checked="text==1?true:false" @click="onChange(1,record.status,record.category_id)" checked-children="启用" un-checked-children="禁用" class="switch"/>
            </span>
            <span slot="action" slot-scope="text,record,index" class="text-blue cursor action">
                <span @click="edit(record)">编辑</span>
                <span @click="deleted(record)">删除</span>
            </span>
        </a-table>
        
        <edit-type ref="editClassify" :styleType="styleType" :ruleForm="ruleForm" @refresh="refreshTable"></edit-type>
        <hint-type :styleType="styleType" @refresh="deletePath"></hint-type>
    </div>
</template>

<script>
    import {ProductCategoryListAPI, EditStatusProductCategoryAPI, DeleteProductCategoryAPI,GetImageApi,ImagesAPI } from '../../../../config/api'
    
    import Menu from '../../../../config/menu'
    import {Warning} from "../../../../common/mixin/Warning";
    import {Tables} from '../../../../common/mixin/TableList'  //table列表页
    import BatchType from '../../../common/Batch'     //批量操作
    import EditType from './Edit'   //创建或编辑
    import HintType from '../../../common/Hint'   //提示框
    
    export default {
        mixins: [Warning, Tables],
        data() {
            return {
                columns: Menu.Columns1,  //table 头部
                image_path: GetImageApi,
                /* 搜索 */
                searchText: '',
                /* 批量操作 */
                batchList: [
                    {
                        value: 1,
                        label: '批量启用',
                        icon: '',
                    },
                    {
                        value: 2,
                        label: '批量禁用',
                        icon: '',
                    },
                    {
                        value: 3,
                        label: '批量删除',
                        icon: '',
                    }
                ],
            }
        },
        created() {
            /* 面包屑 */
            this.$store.state.breadList = [
                {value: "商品管理", url: ""},
                {value: "商品配置", url: ""},
                {value: "商品分类", url: ""},
            ];
            this.$store.state.breadValue = '商品分类';
            
        },
        mounted() {
            this.asyncFunc();
        },
        components: {
            BatchType, EditType, HintType
        },
        methods: {
            /* 新增 */
            add() {
                this.styleType = {
                    type: 1,  //创建
                    width: "440px", //弹出框宽度
                };
                this.ruleForm = {
                    parent_id: [],
                    status: true,
                    imageUrl: '',
                };
                this.$refs.editClassify.addClassify();  //添加顶级分类
                
                this.$store.state.model.addType = true;
            },
            /* 编辑 */
            edit(item) {
                this.styleType = {
                    type: 2,  //编辑
                    width: "440px", //弹出框宽度
                };
                /* 所属分类 */
                let paths = [];
                if(item.paths.length == 2 && item.paths[0] == 0){
                    paths = [''];
                } else {
                    for (let i of item.paths){
                        paths.push(Number(i));
                    }
                    paths.splice(paths.length-1,1);
                }
                console.log(paths)
                
                this.ruleForm = {
                    id: item.category_id,
                    parent_id: paths,
                    name: item.name,
                    sort: item.sort.toString(),
                    status: item.status == 1 ? true : false,
                    imageUrl: item.icon,
                };
                this.$refs.editClassify.addClassify();  //添加顶级分类
    
                this.$store.state.model.addType = true;
            },
            /* 批量修改 */
            refreshBatch(type) {
                switch (type) {
                    case 1:  //启用
                        this.onChange(2,1);
                        break;
                    case 2:  //禁用
                        this.onChange(2,0);
                        break;
                    case 3:   //删除
                        this.deletedID = this.rowKeys;
                        this.deletePath();
                        break;
                }
            },
            /* 删除 */
            deleted(item) {
                this.styleType = {
                    type: 1,        //弹框类型（1删除2警告）
                    types: '1',        //弹框文本类型(1删除)
                    width: "420px", //弹出框宽度
                    button: '删除', //操作方式
                    text: '',        //提示文本
                };
                this.styleType.text = '删除商品分类 <span class="text-red">“' + item.name + '”</span> 后，分类将不可使用。您确认删除吗？';
                this.deletedID = [];
                this.deletedID.push(item.category_id);  //删除商品分类ID
                this.$store.state.model.hint = true;
            },
            /* 删除 */
            deletePath() {
                let params = {
                    id: JSON.stringify(this.deletedID),
                };
                this.$http.post(DeleteProductCategoryAPI, this.$qs.stringify(params)).then(resp => {
                    if (resp.data.code == 1) {
                        this.successType('删除成功！');
                        this.asyncFunc();
                    }
                });
            },
            /* 启用/禁用(type:2批量/1单个，status:状态(1启用,0禁用)，value:分类ID) */
            onChange(type, status, value = '') {
                let statu = '';
                let values = [];
        
                if (type == 1) {     //单个
                    values.push(value);  //分类ID
                    statu = status==1?0:1; //分类状态
                } else {    //批量
                    if (this.rowKeys.length == 0) {
                        this.warningType("请选择分类");
                        return false;
                    }
                    values = this.rowKeys;  //分类ID
                    statu = status;
                }
        
                let params = {
                    id: JSON.stringify(values),
                    status: statu,
                };
                console.log(params);
                this.$http.post(EditStatusProductCategoryAPI, this.$qs.stringify(params)).then(resp => {
                    if (resp.data.code == 1) {
                        this.successType("编辑成功！");
                        this.emptyCheck();
                    }
                });
            },
            
            //初始化
            asyncFunc() {
                let params = {
                    page_size: 999,
                    page: 1,
                    id: '',         //分类ID
                    name: this.searchText,        //分类名称
                    status: '',     //分类状态
                };
                
                this.dataLoading = true;
                this.$http.get(ProductCategoryListAPI, {params}).then(resp => {
                    this.dataLoading = false;
                    if (resp.data.code == 1) {
                        this.$store.state.classifyList = [];
                        
                        let list = resp.data.data;
                        for (let item of list.categories) {
                            item.value = item.category_id;
                            item.label = item.name;
                            item.paths = item.path.split(',');
                            if(item.parent_id == 0){
                                item.paths.unshift(item.parent_id);
                            }
                        }
                        let array = this.authority.recursion(list.categories);
                        for (let item of array) {
                            if (item.type == 1) {
                                this.$store.state.classifyList.push(item);
                            }
                        }
                        this.dataList = this.$store.state.classifyList;
                        console.log(this.dataList)
                    }
                });
            },
            /* 查询 */
            search() {
                this.asyncFunc();
            },
        },
        watch: {}
    }
</script>

<style scoped>
    .table .ant-table-tbody > tr > td {
        padding: 6px 16px !important;
    }
</style>
