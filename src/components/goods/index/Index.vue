<template>
    <div class="main">
        <search-type :ruleForm="searchList" @refresh="refreshTable"></search-type>
         <div class="operate margin-top-df padding-right-sm text-right">
            <a-button type="primary" icon="plus" @click="add()" class="margin-right-sm">新建商品</a-button>
             <batch-type :batchList="batchList" @refresh="refreshBatch"></batch-type>
         </div>
        <div class="pitchNumber margin-top-sm radius-xs" ><span>i</span>已选<span>{{ rowKeys.length }}</span>个商品<span @click="emptyCheck">清空已选</span></div>
        
        <a-table :columns="columns" :data-source="dataList" :row-key="record => record.product_id" :loading="dataLoading" :row-selection="{selectedRowKeys:rowKeys, onChange:onRowChange }" :pagination="pagination" @change="loadData" class="table margin-top-df">
            <a slot="name" slot-scope="text">{{ text }}</a>
            <span slot="status" slot-scope="text" class="status">
                <span v-if="text==1" class="bg-green"></span>
                <span v-else class="bg-gray"></span>
                {{ text==1?'上架':'下架' }}
            </span>
            <span slot="price" slot-scope="text">￥{{ text }}</span>
            <span slot="action" slot-scope="text,record,index" class="text-blue cursor action">
                <router-link :to="{path:`/goods/editType/${ record.product_id }`}" tag="a" >编辑</router-link>
                <span>删除</span>
                <router-link :to="{path:`/goods/details/${ record.product_id }`}" tag="a" >查看</router-link>
            </span>
        </a-table>
    </div>
</template>

<script>
    import { ProductListAPI,DeleteProductAPI,ProductCategoryListAPI } from '../../../config/api'
    
    import Menu from '../../../config/menu'
    import SearchType from '../../common/Search'   //搜索
    import BatchType from '../../common/Batch'     //批量操作
    import { Warning } from "../../../common/mixin/Warning";
    import { Tables } from '../../../common/mixin/TableList'  //table列表页
    
    export default {
        mixins:[ Warning,Tables ],
        data () {
            return {
                columns: Menu.Columns,  //table 头部
                
                /* 搜索 */
                searchList:{
                    list:[/* type:1输入框，2上下架选择框，3商品分类 */
                        { label:'商品名称', value:'name', title:'请输入商品名称', type: 1 },
                        { label:'商品ID', value:'code', title:'请输入商品ID', type: 1 },
                        { label:'上架状态', value:'status', title:'请选择上架状态', type: 2 },
                        { label:'商品分类', value:'classify', title:'请选择商品分类', type: 3 },
                    ],
                    value:{
                        name:'',
                        code:'',
                        status:'',
                        classify: [],
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
                {value: "商品管理", url: ""},
                {value: "商品列表", url: ""},
            ];
            this.$store.state.breadValue = '商品列表';
    
        },
        mounted(){
            this.asyncFunc();   //初始化
        },
        components:{
            SearchType,BatchType,
        },
        methods: {
            /* 新增 */
            add(){
                this.$router.push('/goods/editType/0');
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
                this.styleType.text = '删除商品 <span class="text-red">“'+ item.name +'”</span> 后，商品将不可售卖。您确认删除吗？';
                console.log(this.styleType);
                this.deletedID.push(item.product_id);  //删除商品ID
                this.$store.state.model.hint = true;
            },
            /* 删除 */
            deleteLabel(){
                let params = {
                    id: this.deletedID.join(),
                };
                this.$http.post(DeleteProductAPI,this.$qs.stringify(params)).then(resp => {
                    if (resp.data.code == 1) {
                        this.successType('删除成功！');
                        this.asyncFunc();
                    }
                });
            },
            /* 批量编辑 */
            refreshBatch(type){
                console.log(type)
                switch (type) {
                    case 1:
                        break;
                }
            },
            
            //初始化
            async asyncFunc() {
                this.loadData();     //商品列表
                this.getClassify();  //商品分类
            },
    
            /* 商品列表 */
            loadData(pramas){
                    if (pramas) {
                        this.pagination.current = pramas.current;
                        this.pagination.pageSize = pramas.pageSize;
                    }
    
                    let search = this.searchList.value;
                    
                    let classify = search.classify[search.classify.length-1];
                    let params = {
                        page_size: this.pagination.pageSize,
                        page: this.pagination.current,
                        product_id: this.validate.leftRightBlank(search.code),              //商品ID
                        name: this.validate.leftRightBlank(search.name),            //商品名称
                        category_id: classify,     //商品分类
                        status: search.status,  //商品状态
                    };
    
                    this.dataLoading = true;
                    this.$http.get(ProductListAPI, {params}).then(resp => {
                        this.dataLoading = false;
                        if (resp.data.code == 1) {
                            let list = resp.data.data;
                            if(!list.products){
                                this.dataList = [];
                                return false;
                            }
                            
                            for (let item of list.products){
                                item.tag = item.tags?item.tags.join():'';
                            }
                            this.dataList = list.products;
                            this.pagination.total = list.total;
                        }
                    }).catch(error =>{
                        this.dataLoading = false;
                    });
            },
            /* 商品分类 */
            getClassify(){
                if(this.$store.state.classifyList.length > 0){
                    console.log("classifyList::",this.$store.state.classifyList);
                    return false;
                }
                let params = {
                    page_size: 999,
                    page: 1,
                };
                this.$http.get(ProductCategoryListAPI, {params}).then(resp => {
                    this.dataLoading = false;
                    if (resp.data.code == 1) {
                        this.$store.state.classifyList = [];
            
                        let list = resp.data.data;
                        for (let item of list.categories) {
                            item.value = item.category_id;
                            item.label = item.name;
                        }
                        let array = this.authority.recursion(list.categories);
                        for (let item of array) {
                            if (item.type == 1) {
                                this.$store.state.classifyList.push(item);
                            }
                        }
                        console.log("classifyList2:",this.$store.state.classifyList);
                    }
                });
            },
        },
        watch: {
        
        }
    }
</script>

<style scoped>
    /* 操作(批量、新建) */
    .operate{
        width: 100%;
        height: 36px;
    }
    
    
</style>
