<template>
    <div class="main">
        <search-type :ruleForm="searchList" @refresh="refreshTable"></search-type>
        <div class="operate margin-top-df padding-right-sm text-right">
            <batch-type :batchList="batchList" @refresh="refreshBatch"></batch-type>
        </div>
        
        <a-table :columns="columns" :data-source="dataList" :row-key="record => record.member_id" :loading="dataLoading" :row-selection="{selectedRowKeys:rowKeys, onChange:onRowChange }" :pagination="pagination" @change="asyncFunc" class="table margin-top-df">
            <span slot="status" slot-scope="text" class="status">
                <span v-if="text==1" class="bg-green"></span>
                <span v-else class="bg-gray"></span>
                {{ text==1?'启用':'禁用' }}
            </span>
            <span slot="action" slot-scope="text,record,index" class="text-blue cursor action">
                <router-link :to="{path:`/home/lookUser/${ record.member_id }`}" >查看</router-link>
                <span @click="onChange(1,record.status,record.member_id)">{{  record.status==1 ? '禁用':'启用' }}</span>
            </span>
        </a-table>
    
        <hint-type :styleType="styleType" @refresh="refreshTable"></hint-type>
    </div>
</template>

<script>
    import { UserListAPI,EditUserStatusAPI } from "../../config/api"
    
    import Menu from '../../config/menu'
    import SearchType from '../common/Search'   //搜索
    import BatchType from '../common/Batch'     //批量操作
    import { Warning } from "../../common/mixin/Warning";   //公共类：警告
    import { Tables } from '../../common/mixin/TableList'  //table列表页
    import HintType from '../common/Hint'   //提示框
    
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
                        name:'',
                        phone:'',
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
                    }
                ],
            }
        },
        created () {
            /* 面包屑 */
            this.$store.state.breadList = [
                {value: "会员管理", url: ""},
                {value: "会员列表", url: ""},
            ];
            this.$store.state.breadValue = '会员列表';
    
        },
        mounted(){
            this.asyncFunc();   //初始化
        },
        components:{
            SearchType,BatchType,HintType
        },
        methods: {
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
                }
            },
            
            /* 启用/禁用(type:2批量/1单个，status:状态(1启用,2禁用)，value:会员ID) */
            onChange(type,status,value=''){
                let statu = '';   //商品状态
                if(type == 1){     //单个
                    statu = status==1?2:1;
                } else {    //批量
                    if(this.rowKeys.length == 0){
                        this.warningType("请选择会员");
                        return false;
                    }
                    value = this.rowKeys.join();  //会员ID
                    statu = status;
                }
                let params = {
                    member_id: value,
                    status: statu,
                };
                this.$http.post(EditUserStatusAPI,this.$qs.stringify(params)).then(resp => {
                    if (resp.data.code == 1) {
                        this.successType("编辑成功！");
                        this.asyncFunc();
                    }
                });
            },
            
            /* 商品列表 */
            asyncFunc(pagination){
                if(pagination){
                    this.pagination.current = pagination.current;
                    this.pagination.pageSize = pagination.pageSize;
                }
        
                let search = this.searchList.value;
                let params = {
                    page_size: this.pagination.pageSize,
                    page: this.pagination.current,
                    mobile: search.phone,      //手机号
                    status: search.status,      //用户状态
                    nickname: search.name,    //昵称
                    member_id:'',   //用户编号
                    
                };
                console.log("pramas:",params);
    
                this.dataLoading = true;
                this.$http.get(UserListAPI,{ params }).then(resp => {
                    this.dataLoading = false;
                    if (resp.data.code == 1) {
                        let list = resp.data.data;
                        this.dataList = list.members;
                        this.pagination.total = list.total;
                    }
                }).catch(error => {
                    this.dataLoading = false;
                });
            },
        },
        watch: {
        
        }
    }
</script>

<style scoped>

</style>
