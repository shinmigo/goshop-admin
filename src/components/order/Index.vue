<template>
    <div class="main">
        <search-type :ruleForm="searchList" @refresh="refreshTable"></search-type>
        <div class="operate margin-top-df padding-right-sm text-right">
            <batch-type :batchList="batchList" @refresh="refreshBatch"></batch-type>
        </div>
        <div class="tags margin-top-df">
            <a-tabs :default-active-key="tabKeys" @change="tabChange" @prevClick="callback" @nextClick="callback">
                <a-tab-pane v-for="item in tabsList" :key="item.value" :tab="item.label+'（'+item.num+'）'"></a-tab-pane>
            </a-tabs>
        </div>
        <div class="pitchNumber margin-top-sm radius-xs" ><span>i</span>已选<span>{{ rowKeys.length }}</span>个订单<span @click="emptyCheck">清空已选</span></div>
    
        <a-table :columns="columns" :data-source="dataList" :row-key="record => record.order_id" :loading="dataLoading" :row-selection="{selectedRowKeys:rowKeys, onChange:onRowChange }" :pagination="pagination" @change="asyncFunc" class="table margin-top-df">
            <router-link tag="a" slot="order_id" slot-scope="text" :to="{path:`/order/editType/${ text }`}">
                {{ text }}
            </router-link>
            <span slot="order_type" slot-scope="text">
                {{ text==1?'普通订单':'特殊订单' }}
            </span>
            <span slot="payment_status" slot-scope="text" class="status">
                <span v-if="text==2 || text==3" class="bg-green"></span>
                <span v-else class="bg-gray"></span>
                {{ text==2?'已付款':text==3?'部分付款':'未付款' }}
            </span>
            <span slot="shipping_status" slot-scope="text" class="status">
                <span v-if="text==1" class="bg-green"></span>
                <span v-else class="bg-gray"></span>
                {{ text==3?'已发货':text==2?'部分发货':'未发货' }}
            </span>
        </a-table>
    
        <hint-type :styleType="styleType" @refresh="refreshTable"></hint-type>
    </div>
</template>

<script>
    import { OrderListAPI,OrderStatusAPI } from '../../config/api'
    
    import Menu from '../../config/menu'
    import SearchType from '../common/Search'   //搜索
    import BatchType from '../common/Batch'     //批量操作
    import { Warning } from "../../common/mixin/Warning";
    import { Tables } from '../../common/mixin/TableList'  //table列表页
    import HintType from '../common/Hint'   //提示框
    
    export default {
        mixins:[ Warning,Tables ],
        data () {
            return {
                columns: Menu.Columns11,  //table 头部
                tabKeys: 0,  //tags-标签页焦点选中
    
                /* tabs标签页--数据列表(订单状态 1,待付款 2,待审核 3,待发货 4,待收货 5,完成 6,待评价 7,取消) */
                tabsList:[],
                
                /* 搜索 */
                searchList:{
                    list:[/* type:1输入框，2上下架选择框，3商品分类，4启用禁用，5日期 */
                        { label:'订单号', value:'order_id', title:'请输入订单号', type: 1 },
                        { label:'下单日期', value:'time', title:'请选择下单日期', type: 5 },
                    ],
                    value:{
                        order_id:'',
                        time: [],
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
                {value: "订单管理", url: ""},
                {value: "订单列表", url: ""},
            ];
            this.$store.state.breadValue = '订单列表';
    
        },
        mounted(){
            this.loadData();   //初始化
        },
        components:{
            SearchType,BatchType,HintType
        },
        methods: {
            /* tabs--左右移动 */
            callback(val) {
                console.log(val);
            },
            /* tabs-切换(订单状态) */
            tabChange(key){
                this.tabKeys = key;
                this.asyncFunc();
            },
            
            /* 批量操作 */
            refreshBatch(key){
                console.log('批量操作:',key);
                switch (key) {
                    case 1:  //启用
                        break;
                    case 2:  //禁用
                        break;
                }
            },
            /* 商品列表 */
            async loadData(){
                this.getOrderStatus();  //订单状态
                this.asyncFunc();     //订单列表
            },
            
            /* 订单状态列表 */
            getOrderStatus(){
                this.$http.get(OrderStatusAPI).then(resp => {
                    this.dataLoading = false;
                    if (resp.data.code == 1) {
                        this.tabsList = [];
                        let list = resp.data.data.order_statistics;
                        if(!list){
                            this.warningType('请增加订单状态');
                        }
                        for(let item of list){
                            let str = {
                                value: item.order_status,
                                num: item.count
                            };
                            switch (item.order_status) {
                                case 1:
                                    str.label = '待付款';
                                    break;
                                case 2:
                                    str.label = '待审核';
                                    break;
                                case 3:
                                    str.label = '待发货';
                                    break;
                                case 4:
                                    str.label = '待收货';
                                    break;
                                case 5:
                                    str.label = '完成';
                                    break;
                                case 6:
                                    str.label = '待评价';
                                    break;
                                case 7:
                                    str.label = '取消';
                                    break;
                            }
                            this.tabsList.push(str);
                        }
                    }
                });
            },
            /* 订单列表 */
            asyncFunc(pramas){
                if(pramas){
                    this.pagination.current = pramas.current;
                    this.pagination.pageSize = pramas.pageSize;
                }
        
                let search = this.searchList.value;
              
                /* 日期 */
                let time = [];
                if(search.time.length > 0){
                    time.push(this.authority.dateFtt('yyyy-MM-dd',search.time[0]._d)+" 00:00:00");
                    time.push(this.authority.dateFtt('yyyy-MM-dd',search.time[1]._d)+" 23:59:59");
                }
                let params = {
                    page_size: this.pagination.pageSize,
                    page: this.pagination.current,
                    id: search.order_id,                  //订单号
                    start_created_at: time[0],    //订单创建起始时间
                    end_created_at: time[1],      //订单创建结束时间
                    order_status: this.tabKeys,        //订单状态
                };
          
                this.dataLoading = true;
                this.$http.get(OrderListAPI,{ params }).then(resp => {
                    this.dataLoading = false;
                    if (resp.data.code == 1) {
                        let list = resp.data.data;
                        if(!list.orders){
                            this.dataList = [];
                            return false
                        }
                        for(let item of list.orders){
                            switch (item.order_status) {
                                case 1:
                                    item.order_statu = '待付款';
                                    break;
                                case 2:
                                    item.order_statu = '待审核';
                                    break;
                                case 3:
                                    item.order_statu = '待发货';
                                    break;
                                case 4:
                                    item.order_statu = '待收货';
                                    break;
                                case 5:
                                    item.order_statu = '完成';
                                    break;
                                case 6:
                                    item.order_statu = '待评价';
                                    break;
                                case 7:
                                    item.order_statu = '取消';
                                    break;
                            }
                        }
                        this.dataList = list.orders;
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
    .tags{
    }
</style>
