<template>
    <div class="main">
        <div class="fewSearch">
            <div class="search-input margin-right-df">
                <div class="text-row">
                    <label>参数名称：</label>
                    <a-input v-model="searchText" placeholder="请输入参数名称"></a-input>
                </div>
            </div>
            <div class="search-button text-right padding-right-sm">
                <a-button type="primary" @click="search">查&nbsp;询</a-button>
                <a-button type="primary" icon="plus" @click="add()" class="margin-lr-sm">新建参数</a-button>
                <batch-type :batchList="batchList" @refresh="refreshBatch"></batch-type>
            </div>
        </div>
        <div class="pitchNumber margin-top-sm radius-xs"><span>i</span>已选<span>{{ rowKeys.length }}</span>个商品<span @click="emptyCheck">清空已选</span></div>
    
    
        <a-table :columns="columns" :data-source="dataList" :row-key="record => record.param_id" :loading="dataLoading" :row-selection="{selectedRowKeys:rowKeys, onChange:onRowChange }" :pagination="pagination" @change="asyncFunc" class="table margin-top-df">
            <a slot="type" slot-scope="text">{{ text==1?'文本框': text==2?'单选框':'复选框' }}</a>
            <span slot="action" slot-scope="text,record,index" class="text-blue cursor action">
                <span @click="edit(record)">编辑</span>
                <span @click="deleted(record)">删除</span>
            </span>
        </a-table>
    
        <edit-type :styleType="styleType" :ruleForm="ruleForm" @refresh="emptyCheck"></edit-type>
        <hint-type :styleType="styleType" @refresh="deletePath"></hint-type>
    </div>
</template>

<script>
    import { ProductParamListAPI,DelProductParamAPI } from '../../../../config/api'
    
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
                columns: Menu.Columns3,  //table 头部
            
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
                {value: "商品参数", url: ""},
            ];
            this.$store.state.breadValue = '商品参数';
    
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
                    type: 1,        //创建
                    width: "440px", //弹出框宽度
                };
                this.ruleForm = {
                    param_id:'',
                    name:'',        //参数名称
                    type:'',        //参数类型(1文本框，2单选框，3复选框)
                    contents:[{param_value_id: 0,content:""}]   //参数值
                };
                this.$store.state.model.editType = true;
            },
            /* 编辑 */
            edit(item){
                this.styleType = {
                    type: 2,  //编辑
                    width: "440px", //弹出框宽度
                };
    
                this.ruleForm = {
                    param_id: item.param_id,  //参数ID
                    name: item.name,          //参数名称
                    type: item.type.toString(),          //参数类型(1文本框，2单选框，3复选框)
                    contents: JSON.parse(JSON.stringify(item.contents)),  //参数值
                };
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
            /* 删除--弹窗确认 */
            deleted(item){
                this.styleType = {
                    type: 1,        //弹框类型（1删除2警告）
                    types: '1',     //弹框文本类型(1删除)
                    width: "420px", //弹出框宽度
                    button: '删除', //操作方式
                    text:'',        //提示文本
                };
                this.styleType.text = '删除商品参数 <span class="text-red">“'+ item.name +'”</span> 后，参数将不可使用。您确认删除吗？';
                this.deletedID.push(item.param_id);
                this.$store.state.model.hint = true;
            },
            /* 删除 */
            deletePath(){
                let params = {
                    param_id : JSON.stringify(this.deletedID),
                };
                console.log(params);
                this.$http.post(DelProductParamAPI,this.$qs.stringify(params)).then(resp => {
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
                    id: '',         //类型ID
                    name: this.searchText,        //类型名称
                };
    
                this.dataLoading = true;
                this.$http.get(ProductParamListAPI,{ params }).then(resp => {
                    this.dataLoading = false;
                    if (resp.data.code == 1) {
                        let list = resp.data.data;
                        for (let item of list.params){
                            if(item.type == 1){  //输入框
                                item.content = '';
                                continue;
                            }
                            item.contents = item.contents?item.contents:[];
                            let content = [];
                            for (let value of item.contents){
                                content.push(value.content);
                            }
                            item.content = content.join();
                        }
                        this.dataList = list.params;
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
