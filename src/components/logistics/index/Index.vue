<template>
    <div class="main">
        <search-type :ruleForm="searchList" @refresh="refreshTable"></search-type>
        <div class="operate margin-top-df padding-right-sm text-right">
            <a-button type="primary" icon="plus" @click="add()" class="margin-right-sm">新建物流公司</a-button>
            <batch-type :batchList="batchList" @refresh="refreshBatch"></batch-type>
        </div>
        
        <div class="pitchNumber margin-top-df radius-xs"><span>i</span>已选<span>{{ rowKeys.length }}</span>个公司<span @click="emptyCheck">清空已选</span></div>
    
        <a-table :columns="columns" :data-source="dataList" :row-key="record => record.carrier_id" :loading="dataLoading" :row-selection="{selectedRowKeys:rowKeys, onChange:onRowChange }" :pagination="pagination" @change="asyncFunc" class="table classify-padding margin-top-df">
            <span slot="status" slot-scope="text,record,index" >
                <a-switch :checked="text==1?true:false"  @click="onChange(1,record.status,record.carrier_id)" checked-children="启用" un-checked-children="禁用" class="switch"/>
            </span>
            <span slot="action" slot-scope="text,record,index" class="text-blue cursor action">
                <span @click="edit(record)">编辑</span>
                <span @click="deleted(record)">删除</span>
            </span>
        </a-table>
    
        <edit-type :styleType="styleType" :ruleForm="ruleForm" @refresh="emptyCheck"></edit-type>
        <hint-type :styleType="styleType" @refresh="deleteParameter"></hint-type>

    </div>
</template>

<script>
    import { CarrierListAPI,EditCarrierStatusAPI,DeleteCarrierAPI } from '../../../config/api'
    
    import Menu from '../../../config/menu'
    import SearchType from '../../common/Search'   //搜索
    import BatchType from '../../common/Batch'     //批量操作
    import {Warning} from "../../../common/mixin/Warning";
    import {Tables} from '../../../common/mixin/TableList'  //table列表页
    import EditType from './Edit'   //创建或编辑
    import HintType from '../../common/Hint'   //提示框
    
    export default {
        mixins:[ Warning,Tables ],
        data () {
            return {
                columns: Menu.Columns15,  //table 头部
    
                /* 搜索 */
                searchList:{
                    list:[/* type:1输入框，2上下架选择框，3商品分类，4启用禁用 */
                        { label:'公司名称', value:'company_name', title:'请输入公司名称', type: 1 },
                        { label:'公司编码', value:'company_code', title:'请输入公司编码', type: 1 },
                        { label:'公司状态', value:'status', title:'请选中公司状态', type: 4 },
                    ],
                    value:{
                        company_name:'',
                        company_code:'',
                        status:'',
                    }
                },
                /* 批量操作 */
                batchList:[
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
        created () {
            /* 面包屑 */
            this.$store.state.breadList = [
                {value: "物流管理", url: ""},
                {value: "物流公司列表", url: ""},
            ];
            this.$store.state.breadValue = '物流公司列表';
    
        },
        mounted(){
            this.asyncFunc();
        },
        components:{
            EditType,HintType,SearchType,BatchType
        },
        methods: {
            /* 新增 */
            add(){
                this.styleType = {
                    type: 1,  //创建
                    width: "440px", //弹出框宽度
                };
                this.ruleForm = {
                    company_name:'',    //公司名称
                    company_code:'',    //公司编码
                    sort:'',            //排序
                    status: true,        //状态(1启用，2禁用)
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
                    id: item.carrier_id,                        //公司ID
                    company_name: item.name,    //公司名称
                    company_code: item.code,    //公司编码
                    sort: item.sort.toString(),                    //排序
                    status: item.status==1?true:false,  //状态(1启用，2禁用)
                };
                console.log(item);
                this.$store.state.model.editType = true;
            },
            /* 批量操作 */
            refreshBatch(key){
                console.log('批量操作:',key);
                switch (key) {
                    case 1:  //启用
                        this.onChange(2,1);
                        break;
                    case 2:  //禁用
                        this.onChange(2,2);
                        break;
                    case 3:  //删除
                        this.deletedID = this.rowKeys;  //公司ID
                        this.deleteParameter();
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
                this.styleType.text = '删除物流公司 <span class="text-red">“'+ item.name +'”</span> 后，该公司物流将不可使用。您确认删除吗？';
                this.deletedID.push(item.carrier_id);
                this.$store.state.model.hint = true;
            },
            /* 删除 */
            deleteParameter(){
                if(this.deletedID.length == 0){
                    this.warningType("请选择公司");
                    return false;
                }
                let params = {
                    id : JSON.stringify(this.deletedID),
                };
                this.$http.post(DeleteCarrierAPI,this.$qs.stringify(params)).then(resp => {
                    if (resp.data.code == 1) {
                        this.successType('删除成功！');
                        this.emptyCheck();
                    }
                });
            },
            
            /* 启用/禁用(type:2批量/1单个，status:状态(1启用,2禁用)，value:公司ID) */
            onChange(type,status,value=''){
                let statu = '';
                let values = [];
                
                if(type == 1){     //单个
                    values.push(value);     //公司ID
                    statu = status==1?2:1;  //状态
                } else {    //批量
                    if(this.rowKeys.length == 0){
                        this.warningType("请选择公司");
                        return false;
                    }
                    values = this.rowKeys;  //公司ID
                    statu = status;
                }
        
                let params = {
                    id: JSON.stringify(values),
                    status: statu,
                };
                this.$http.post(EditCarrierStatusAPI,this.$qs.stringify(params)).then(resp => {
                    if (resp.data.code == 1) {
                        this.successType("编辑成功！");
                        this.emptyCheck();
                    }
                });
            },
    
            
            //初始化
            asyncFunc(pagination) {
                if(pagination){
                    this.pagination.current = pagination.current;
                    this.pagination.pageSize = pagination.pageSize;
                }
        
                let search = this.searchList.value;
                console.log("搜索参数：", search);
                
                let params = {
                    page_size: this.pagination.pageSize,
                    page: this.pagination.current,
                    company_name: search.company_name,
                    company_code: search.company_code,
                    status: search.status,
                };
    
                this.dataLoading = true;
                this.$http.get(CarrierListAPI,{ params }).then(resp => {
                    this.dataLoading = false;
                    if (resp.data.code == 1) {
                        console.log(resp.data.data);
                        let list = Object.keys(resp.data.data).length > 0 ? resp.data.data:'';
                      
                        let carriers = [];
                        let total = 0;
                        if(list){
                            carriers = list.carriers;
                            total = list.total;
                        }
                        this.dataList = carriers;
                        this.pagination.total = total;
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
