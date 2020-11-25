<template>
    <div class="main">
        <search-type :ruleForm="searchList" @refresh="refreshTable"></search-type>
        <div class="operate margin-top-df padding-right-sm text-right">
            <a-button type="primary" icon="plus" @click="add()" class="margin-right-sm">新建广告位</a-button>
        </div>
        <div class="pitchNumber margin-top-sm radius-xs"><span>i</span>已选<span>{{ rowKeys.length }}</span>个商品<span @click="emptyCheck">清空已选</span></div>
    
        <a-table :columns="columns" :data-source="dataList" :row-key="record => record.id" :loading="dataLoading" :row-selection="{selectedRowKeys:rowKeys, onChange:onRowChange }" :pagination="pagination" @change="asyncFunc" class="table margin-top-df">
            <span slot="type" slot-scope="text">
                {{ text==1?'banner':'广告位' }}
            </span>
            <span slot="status" slot-scope="text,record,index" class="status cursor" @click="isStauts(record.id,record.status)">
                <div v-if="text==1"><span class="bg-green"></span>&nbsp;上架</div>
                <div v-else><span class="bg-gray"></span>&nbsp;下架</div>
            </span>
            <span slot="action" slot-scope="text,record,index" class="text-blue cursor action">
                <span @click="edit(record)" >编辑</span>
                <span @click="deleted(record)">删除</span>
            </span>
        </a-table>
        
        <edit-type :styleType="styleType" :ruleForm="ruleForm" @refresh="emptyCheck"></edit-type>
        <hint-type :styleType="styleType" @refresh="deletePath"></hint-type>
    </div>
</template>

<script>
    import { Warning } from "../../common/mixin/Warning";
    import { BannerListAPI,DeleteBannerAPI,EditBannerStatusAPI,GetImageApi } from "../../config/api";
    import Menu from '../../config/menu'
    import SearchType from '../common/Search'   //搜索
    import HintType from '../common/Hint'   //提示框
    import { Tables } from '../../common/mixin/TableList'  //table列表页
    import EditType from './Edit'   //创建或编辑
    
    export default {
        mixins:[ Warning,Tables ],
        data () {
            return {
                columns: Menu.Columns16,
    
                /* 搜索 */
                searchList:{
                    list:[/* type:1输入框，2上下架选择框，3商品分类 */
                        { label:'广告位名称', value:'name', title:'请输入广告位名称', type: 1 },
                        { label:'广告位ID', value:'id', title:'请输入广告位ID', type: 1 },
                        { label:'上架状态', value:'status', title:'请选择上架状态', type: 2 },
                        { label:'广告位类型', value:'type', title:'请选择类型', type: 6 },
                    ],
                    value:{
                        name: '',
                        id: '',
                        status: '',
                        type: '',
                    }
                },
            }
        },
        created () {
            /* 面包屑 */
            this.$store.state.breadList = [
                {value: "商城设置", url: ""},
                {value: "广告管理", url: ""},
            ];
            this.$store.state.breadValue = '广告管理';
        },
        mounted(){
            this.asyncFunc();
        },
        components:{
            SearchType,HintType,EditType
        },
        methods: {
            /* 创建 */
            add(){
                this.styleType = {
                    type: 1,  //创建
                    width: "560px", //弹出框宽度
                };
                this.ruleForm = {
                    url: GetImageApi,
                    type: '2',    //广告位类型
                    ele_info: [{ redirect_url:'',image_url: '' }],   //广告位图片
                    name: '',        //广告位名称
                    status: true,     //状态
                };
                this.$store.state.model.addType = true;
            },
            /* 编辑 */
            edit(item){
                this.styleType = {
                    type: 2,  //编辑
                    width: "560px", //弹出框宽度
                };
                
                this.ruleForm = {
                    url: GetImageApi,
                    id: item.id,
                    type: item.ele_type.toString(),    //广告位类型
                    ele_info: JSON.parse(item.ele_info),   //广告位图片
                    name: item.tag_name?item.tag_name:'',        //广告位名称
                    status: item.status==1?true:false,     //状态
                };
                console.log(item,this.ruleForm);
                
                this.$store.state.model.addType = true;
            },
            //上下架
            isStauts(id,status){
                console.log(id,status);
                let ids = [];
                ids.push(id);
                let params = {
                    id: JSON.stringify(ids),
                    status: status==1?2:1
                }
                this.$http.post(EditBannerStatusAPI,this.$qs.stringify(params)).then(resp => {
                    if (resp.data.code == 1) {
                        this.successType('编辑成功！');
                        this.emptyCheck();
                    }
                });
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
                this.styleType.text = '删除广告位 <span class="text-red">“'+ item.tag_name +'”</span> 后，广告位将不可使用。您确认删除吗？';
                this.deletedID.push(item.id);  //删除商品ID
                this.$store.state.model.hint = true;
            },
            /* 删除 */
            deletePath(){
                let params = {
                    id: JSON.stringify(this.deletedID),
                };
                this.$http.post(DeleteBannerAPI,this.$qs.stringify(params)).then(resp => {
                    if (resp.data.code == 1) {
                        this.successType('删除成功！');
                        this.emptyCheck();
                    }
                });
            },
            /* 查询 */
            search() {
                this.asyncFunc();
            },
            //初始化
            asyncFunc(pramas) {
                if (pramas) {
                    this.pagination.current = pramas.current;
                    this.pagination.pageSize = pramas.pageSize;
                }
    
                let search = this.searchList.value;
                
                let params = {
                    page_size: this.pagination.pageSize,
                    page: this.pagination.current,
                    id: search.id,                       //广告位编号ID
                    type: search.type,          //广告位类型
                    name: search.name,        //广告位名称
                    status: search.status,      //广告位状态
                };
        
                this.dataLoading = true;
                this.$http.get(BannerListAPI,{ params }).then(resp => {
                    this.dataLoading = false;
                    if (resp.data.code == 1) {
                        let list = resp.data.data;
                        this.dataList = list.banner_ads;
                        this.pagination.total = list.total;
                    }
                });
            },
            
        },
        watch: {
        
        }
    }
</script>

<style scoped>

</style>
