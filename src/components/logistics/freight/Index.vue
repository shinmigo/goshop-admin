<template>
    <div class="main">
        <div class="operate margin-top-df padding-right-sm text-right">
            <a-button type="primary" icon="plus" @click="add()" class="margin-right-sm">新建运费模板</a-button>
            <batch-type :batchList="batchList" @refresh="refreshBatch"></batch-type>
        </div>
        <div class="pitchNumber margin-top-sm radius-xs" ><span>i</span>已选<span>{{ rowKeys.length }}</span>个运费模板<span @click="emptyCheck">清空已选</span></div>
    
        <a-table :columns="columns" :data-source="dataList" :loading="dataLoading" :row-selection="{selectedRowKeys:rowKeys, onChange:onRowChange }" :pagination="pagination" @change="asyncFunc" class="table margin-top-df">
            <a slot="name" slot-scope="text">{{ text }}</a>
            <span slot="status" slot-scope="text" class="status">
                <span v-if="text==1" class="bg-green"></span>
                <span v-else class="bg-gray"></span>
                {{ text==1?'启用':'禁用' }}
            </span>
            <span slot="price" slot-scope="text">￥{{ text }}</span>
            <span slot="action" slot-scope="text,record,index" class="text-blue cursor action">
                <span @click="edit(record)" >编辑</span>
                <span @click="onChange(1,record.status,record.key)">{{  record.status==1 ? '禁用':'启用' }}</span>
                <span @click="deleted(record)" >删除</span>
            </span>
        </a-table>
    
        <edit-type :styleType="styleType" :ruleForm="ruleForm" @refresh="emptyCheck"></edit-type>
        <hint-type :styleType="styleType" @refresh="deletePath"></hint-type>
    </div>
</template>

<script>
    import indexData from '../../../../static/data'   //json数据
    
    import Menu from '../../../config/menu'
    import BatchType from '../../common/Batch'     //批量操作
    import HintType from '../../common/Hint'   //提示框
    
    import { Warning } from "../../../common/mixin/Warning"
    import { Tables } from '../../../common/mixin/TableList'  //table列表页
    
    import EditType from './Edit'   //创建或编辑
    
    export default {
        mixins:[ Warning,Tables ],
        data () {
            return {
                columns: Menu.Columns17,  //table 头部
                
                /* 批量操作 */
                batchList:[
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
                {value: "物流管理", url: ""},
                {value: "运费模板列表", url: ""},
            ];
            this.$store.state.breadValue = '运费模板列表';
        },
        mounted(){
            this.asyncFunc();   //初始化
        },
        components:{
            BatchType,HintType,EditType
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
                    id: 10,                        //公司ID
                    company_name: '',    //公司名称
                    company_code: '',    //公司编码
                    sort: '',                    //排序
                    status: item.status==1?true:false,  //状态(1启用，2禁用)
                };
                console.log(item);
                this.$store.state.model.editType = true;
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
                this.styleType.text = '删除运费模板 <span class="text-red">“'+ item.name +'”</span> 后，该运费模板将不可使用。您确认删除吗？';
                this.deletedID.push(item.carrier_id);
                this.$store.state.model.hint = true;
            },
            /* 删除 */
            deletePath(){
                if(this.deletedID.length == 0){
                    this.warningType("请选择运费模板");
                    return false;
                }
                let params = {
                    id : JSON.stringify(this.deletedID),
                };
                this.successType('删除成功！');
                /*
                this.$http.post(DeleteCarrierAPI,this.$qs.stringify(params)).then(resp => {
                    if (resp.data.code == 1) {
                        this.successType('删除成功！');
                        this.emptyCheck();
                    }
                });*/
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
    
                this.successType("编辑成功！");
                
               /* this.$http.post(EditCarrierStatusAPI,this.$qs.stringify(params)).then(resp => {
                    if (resp.data.code == 1) {
                        this.successType("编辑成功！");
                        this.emptyCheck();
                    }
                });*/
            },
            /* 批量编辑 */
            refreshBatch(type){
                console.log(type)
                switch (type) {
                    case 1:
                        this.deletedID = this.rowKeys;
                        this.deletePath();
                        break;
                }
            },
    
            /* 初始化 */
            asyncFunc(pramas){
                if(pramas){
                    this.pagination.current = pramas.current;
                    this.pagination.pageSize = pramas.pageSize;
                }
                
                this.dataLoading = true;
                this.dataList = indexData.index;
                this.pagination.total = indexData.index.length;
                this.dataLoading = false;
            },
        },
        watch: {
        
        }
    }
</script>

<style scoped>

</style>
