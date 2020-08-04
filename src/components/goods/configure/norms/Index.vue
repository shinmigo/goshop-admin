<template>
    <div class="main">
        <div class="fewSearch">
            <div class="search-input margin-right-df">
                <div class="text-row">
                    <label>规格名称：</label>
                    <a-input v-model="searchText" placeholder="请输入规格名称"></a-input>
                </div>
            </div>
            <div class="search-button text-right padding-right-sm">
                <a-button type="primary" @click="search()">查&nbsp;询</a-button>
                <a-button type="primary" icon="plus" @click="add()" class="margin-lr-sm">新建规格</a-button>
                <batch-type :batchList="batchList" @refresh="refreshBatch"></batch-type>
            </div>
        </div>
        <div class="pitchNumber margin-top-sm radius-xs"><span>i</span>已选<span>{{ rowKeys.length }}</span>个商品<span @click="emptyCheck">清空已选</span></div>
        
        <a-table :columns="columns" :data-source="dataList" :row-key="record => record.spec_id" :loading="dataLoading" :row-selection="{selectedRowKeys:rowKeys, onChange:onRowChange }" :pagination="pagination" @change="asyncFunc" class="table margin-top-df">
            <span slot="action" slot-scope="text,record,index" class="text-blue cursor action">
                <span @click="edit(record)">编辑</span>
                <span @click="deleted(record)">删除</span>
            </span>
        </a-table>

        <edit-type :styleType="styleType" :ruleForm="ruleForm" @refresh="refreshTable"></edit-type>
        <hint-type :styleType="styleType" @refresh="deletePath"></hint-type>
    </div>
</template>

<script>
    import { ProductSpecListAPI,DeleteProductSpecAPI } from '../../../../config/api'
    
    import Menu from '../../../../config/menu'
    import {Warning} from "../../../../common/mixin/Warning";  //公共类--警告
    import {Tables} from '../../../../common/mixin/TableList'  //table列表页
    import BatchType from '../../../common/Batch'     //批量操作
    import EditType from './Edit'    //添加或编辑
    import HintType from '../../../common/Hint'   //提示框
    
    export default {
        mixins: [Warning, Tables],
        data() {
            return {
                columns: Menu.Columns4,  //table 头部
            
                /* 搜索 */
                searchText: '',
                /* 批量操作 */
                batchList: [
                    {
                        value: 1,
                        label: '批量删除',
                        icon: 'delete',
                    }
                ],
            }
        },
        created () {
            /* 面包屑 */
            this.$store.state.breadList = [
                {value: "商品管理", url: ""},
                {value: "商品配置", url: ""},
                {value: "商品规格", url: ""},
            ];
            this.$store.state.breadValue = '商品规格';
        },
        mounted(){
            this.asyncFunc();
        },
        components:{
            BatchType,EditType,HintType
        },
        methods: {
            /* 创建 */
            add(){
                this.styleType = {
                    type: 1,  //创建
                    width: "440px", //弹出框宽度
                };
                this.ruleForm = {
                    id:'',      //规格ID
                    name:'',    //规格名称
                    sort:'',    //规格排序
                    value:[{spec_value_id:0,content:''}], //规格值
                };
                console.log("创建:",this.ruleForm);
                this.$store.state.model.editType = true;
            },
            /* 编辑 */
            edit(item){
                this.styleType = {
                    type: 2,  //编辑
                    width: "440px", //弹出框宽度
                };
                
                this.ruleForm = {
                    id: item.spec_id,       //规格ID
                    name: item.name,        //规格名称
                    sort: item.sort.toString(),        //排序
                    value: JSON.parse(JSON.stringify(item.contents)),           //规格值
                };
                console.log("编辑:",this.ruleForm);
                this.$store.state.model.editType = true;
            },
            /* 批量修改 */
            refreshBatch(type){
                switch (type) {
                    case 1:  //删除
                        this.deletedID = this.rowKeys;
                        this.deletePath();
                        break;
                }
            },
            /* 删除 */
            deleted(item){
                this.styleType = {
                    type: 1,        //弹框类型（1删除2警告）
                    types: '1',        //弹框文本类型(1删除)
                    width: "420px", //弹出框宽度
                    button: '删除', //操作方式
                    text:'',        //提示文本
                };
                this.styleType.text = '删除商品规格 <span class="text-red">“'+ item.name +'”</span> 后，规格将不可使用。您确认删除吗？';
                this.deletedID.push(item.spec_id);
                this.$store.state.model.hint = true;
            },
            
            /* 删除 */
            deletePath(){
                let params = {
                    id : JSON.stringify(this.deletedID),
                };
                console.log(params);
                this.$http.post(DeleteProductSpecAPI,this.$qs.stringify(params)).then(resp => {
                    if (resp.data.code == 1) {
                        this.successType('删除成功！');
                        this.emptyCheck();
                    }
                });
            },
           
            //初始化
            asyncFunc(pramas) {
                if (pramas) {
                    this.pagination.current = pramas.current;
                    this.pagination.pageSize = pramas.pageSize;
                }
    
                let params = {
                    page_size: this.pagination.pageSize,
                    page: this.pagination.current,
                    id: '',                             //规格ID
                    spec_name: this.searchText,        //规格名称
                };
    
                this.dataLoading = true;
                this.$http.get(ProductSpecListAPI,{ params }).then(resp => {
                    this.dataLoading = false;
                    if (resp.data.code == 1) {
                        let list = resp.data.data;
                        for (let item of list.specs){
                            item.contents = item.contents?item.contents:[];
                            let content = [];
                            for (let value of item.contents){
                                content.push(value.content);
                            }
                            item.content = content.join();
                        }
                        console.log(list);
                        this.dataList = list.specs;
                        this.pagination.total = list.total;
                    }
                });
            },
            /* 查询 */
            search() {
                this.asyncFunc();
            },
        },
        watch: {
        
        }
    }
</script>

<style scoped>

</style>
