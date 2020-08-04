<template>
    <div class="main">
        <search-type :ruleForm="searchList" @refresh="refreshTable"></search-type>
        <div class="operate margin-top-df padding-right-sm text-right">
            <a-button type="primary" icon="plus" @click="add()" class="margin-right-sm">新建会员</a-button>
            <batch-type :batchList="batchList" @refresh="refreshBatch"></batch-type>
        </div>
        <div class="pitchNumber margin-top-sm radius-xs" ><span>i</span>已选<span>{{ rowKeys.length }}</span>个会员<span @click="emptyCheck">清空已选</span></div>
    
        <a-table :columns="columns" :data-source="dataList" :loading="dataLoading" :row-selection="{selectedRowKeys:rowKeys, onChange:onRowChange }" :pagination="pagination" @change="asyncFunc" class="table margin-top-df">
            <a slot="name" slot-scope="text">{{ text }}</a>
            <span slot="status" slot-scope="text" class="status">
                <span v-if="text==1" class="bg-green"></span>
                <span v-else class="bg-gray"></span>
                {{ text==1?'上架':'下架' }}
            </span>
            <span slot="price" slot-scope="text">￥{{ text }}</span>
            <span slot="action" slot-scope="text,record,index" class="text-blue cursor action">
                <span @click="edit(record)" >编辑</span>
                <span @click="onChange(1,record.status,record.key)">{{  record.status==1 ? '禁用':'启用' }}</span>
                <router-link :to="{path:`/authority/warrant/${ record.key }`}" tag="a" >授权</router-link>
                <span @click="deleted(record)" >删除</span>
            </span>
        </a-table>
    
        <edit-type :styleType="styleType" :ruleForm="ruleForm"></edit-type>
        <hint-type :styleType="styleType" @refresh="deletePath"></hint-type>
        
    </div>
</template>

<script>
    import indexData from '../../../../static/data'   //json数据
    
    import Menu from '../../../config/menu'
    import SearchType from '../../common/Search'   //搜索
    import BatchType from '../../common/Batch'     //批量操作
    import { Warning } from "../../../common/mixin/Warning";
    import { Tables } from '../../../common/mixin/TableList'  //table列表页
    import EditType from './Edit'   //创建或编辑
    import HintType from '../../common/Hint'   //提示框
    
    export default {
        mixins:[ Warning,Tables ],
        data () {
            return {
                columns: Menu.Columns8,  //table 头部
    
                /* 搜索 */
                searchList:{
                    list:[/* type:1输入框，2上下架选择框，3商品分类，4启用禁用 */
                        { label:'手机号码', value:'phone', title:'请输入手机号码', type: 1 },
                        { label:'状态', value:'status', title:'请选择会员状态', type: 4 },
                        { label:'会员名称', value:'name', title:'请输入会员名称', type: 1 },
                    ],
                    value:{
                        name:'张三',
                        phone:'',
                        status:'',
                    }
                },
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
                {value: "权限管理", url: ""},
                {value: "角色列表", url: ""},
            ];
            this.$store.state.breadValue = '角色列表';
    
        },
        mounted(){
            this.asyncFunc();   //初始化
        },
        components:{
            SearchType,BatchType,EditType,HintType
        },
        methods: {
            /* 启用/禁用(type:2批量/1单个，status:状态，value:单个会员ID) */
            onChange(type,status,value=''){
                let statu = '';   //角色状态
                if(type == 1){     //单个
                    statu = status==1?2:1;
                } else {    //批量
                    if(this.rowKeys.length == 0){
                        this.warningType("请选择角色");
                        return false;
                    }
                    value = this.rowKeys.join();  //角色ID
                    statu = status;
                }
                let params = {
                    member_id: value,
                    status: statu,
                };
    
                this.warningType("编辑成功");
                this.emptyCheck();
            },
            /* 新增 */
            add(){
                console.log('6546')
                this.styleType = {
                    type: 1,  //创建
                    width: "440px", //弹出框宽度
                };
                this.ruleForm = {
                    id:'',        //角色ID
                    name:'',      //角色名称
                    status: true, //角色状态
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
                    id:'',              //角色ID
                    name: item.name,    //角色名称
                    status: item.status==1?true:false,      //角色状态
                };
                console.log(this.ruleForm);
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
                this.styleType.text = '删除角色 <span class="text-red">“'+ item.name +'”</span> 后，角色将不可使用。您确认删除吗？';
                this.deletedID.push(item.spec_id);
                this.$store.state.model.hint = true;
            },
            /* 删除 */
            deletePath(){
                let params = {
                    id : JSON.stringify(this.deletedID),
                };
                console.log(params);
        
                this.successType('删除成功！');
                this.emptyCheck();
                /* this.$http.post(DeleteProductSpecAPI,this.$qs.stringify(params)).then(resp => {
                     if (resp.data.code == 1) {
                         this.successType('删除成功！');
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
            /* 商品列表 */
            asyncFunc(pramas){
                if(pramas){
                    this.pagination.current = pramas.current;
                    this.pagination.pageSize = pramas.pageSize;
                }
        
                let search = this.searchList.value;
                console.log("搜索参数：",search);
        
                console.log(pramas);
        
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
