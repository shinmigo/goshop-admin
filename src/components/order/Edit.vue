<template>
    <div class="main">
        <div class="order">
            <div class="order-top">
                <a-breadcrumb>
                    <a-breadcrumb-item>{{ customForm.order_type==1?'普通订单':'特殊订单' }}</a-breadcrumb-item>
                    <a-breadcrumb-item>{{ customForm.order_id }}</a-breadcrumb-item>
                </a-breadcrumb>
            </div>
            <div class="order-number">
                <span class="img round margin-top-xs">
                    <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598611517789&di=8d783f55d6ca275832eb12427ba1efc1&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201211%2F04%2F20121104194249_nzJij.thumb.700_0.jpeg"/>
                </span>
                <span class="number">订单号：{{ customForm.order_id }}</span>
            </div>
            <div class="order-details">
                <div><label>订单类型：</label><span>{{ customForm.order_type==1?'普通订单':'特殊订单' }}</span></div>
                <div><label>下单时间：</label><span>{{ customForm.updated_at }}</span></div>
                <div><label>退款状态：</label><span>{{ customForm.refund_status==3?'全部退款':customForm.refund_status==2?'部分退款':'未退款' }}</span></div>
                <div><label>退货状态：</label><span>{{ customForm.return_status==3?'全部退货':customForm.return_status==2?'部分退货':'未退货' }}</span></div>
                <div><label>运单号：</label><span class="text-blue">{{ customForm.tracking_number }}</span></div>
            </div>
            <div class="order-operate">
                <div>
                    <a-button type="primary">打印订单</a-button>
                    <a-button @click="deliverClick()">发货</a-button>
                    <a-button>取消</a-button>
                    <a-button>退款退货</a-button>
                </div>
                <div class="record text-blue">
                    <span>退款记录</span>
                    <span>退货记录</span>
                    <span>补发记录</span>
                    <span>换货记录</span>
                </div>
            </div>
        </div>
        
        <div class="steps">
            <a-steps progress-dot :current="customForm.current">
                <a-step title="创建订单" />
                <a-step title="完成支付" />
                <a-step title="发货" />
                <a-step title="送达" />
                <a-step title="完成" />
            </a-steps>
            <div class="text-blue text-center">订单操作日志</div>
        </div>
        
        <div class="basic">
            <div class="info">
                <div class="title">订单基本信息</div>
                <div class="info-text"><label>收货人姓名：</label><span>{{ customForm.receiver }}</span></div>
                <div class="info-text"><label>收货人电话：</label><span>{{ customForm.telephone }}</span></div>
                <div class="info-text"><label>收货地址：</label><span>{{ customForm.address }}</span></div>
                <div class="info-text"><label>发货时间：</label><span>{{ customForm.shipping_time }}</span></div>
                <div class="info-text"><label>收货时间：</label><span>具体收货时间根据物流待定</span></div>
                
                <div class="info-user bg-string">
                    <div class="info-text"><label>会员用户名：</label><span>{{ customForm.name }}</span></div>
                    <div class="info-text"><label>会员手机号：</label><span>{{ customForm.mobile }}</span></div>
                    <div class="info-text"><label>会员等级：</label><span>{{ customForm.member_level_id }}</span></div>
                </div>
                <div class="info-adress bg-string">
                    <div class="info-text"><label>配送公司：</label><span>{{ customForm.carrier_name }}</span></div>
                    <div class="info-text"><label>商品总重量：</label><span>{{ customForm.weight }}</span></div>
                </div>
               
            </div>
            <div class="defray">
                <div class="title">支付信息</div>
                <div class="defray-text"><label>订单总金额：</label><span class="text-price">{{ customForm.grand_total }}</span></div>
                <div class="defray-text"><label>已付金额：</label><span class="text-price">{{ customForm.total_paid }}</span></div>
                <div class="defray-text"><label>待付金额：</label><span class="text-price">0</span></div>
                <div class="defray-text"><label>付款方式：</label><span>{{ customForm.payment_type==1?'在线支付':'' }}</span></div>
                <div class="defray-text"><label>支付途径：</label><span>{{ customForm.payment_type==1?'在线支付':''+'-'+ customForm.payment_name }}</span></div>
                <div class="defray-text bg-string"><label>商品总价格：</label><span class="text-price">{{ customForm.subtotal }}</span></div>
                <div class="defray-text"><label>配送费用：</label><span class="text-price">{{ customForm.shipping_amount }}</span></div>
                <div class="defray-text"><label>订单总优惠：</label><span class="text-price">{{ customForm.discount_amount }}</span></div>
            </div>
        </div>
        
        <div class="remark text-hide">
            <div class="title">订单备注<span class="text-blue">添加备注</span></div>
            <a-table :columns="columns1" :data-source="remarkList" :pagination="false" class="table margin-top-df">
                <span slot="action" slot-scope="text">
                    <a>删除</a>
                </span>
            </a-table>
        </div>
        <div class="remark">
            <div class="title">商品列表</div>
            <a-table :columns="columns2" :data-source="productList" :row-key="record => record.order_item_id" :pagination="false" class="table margin-top-df">
                <span slot="name" slot-scope="text">
                    <a>{{ text }}</a>
                </span>
            </a-table>
        </div>
        <div class="remark text-hide">
            <div class="title">赠品列表<span class="text-blue">编辑赠品</span></div>
            <a-table :columns="columns3" :data-source="largessList" :row-key="record => record.largess_item_id"  :pagination="false" class="table margin-top-df">
                <span slot="action" slot-scope="text">
                    <a>删除</a>
                </span>
            </a-table>
        </div>
        
        
        <delivery-type ref="deliveryd" @refresh="refreshDelivery"></delivery-type>
    </div>
</template>

<script>
    import { OrderListAPI,OrderShipmentAPI } from '../../config/api'

    import { Warning } from "../../common/mixin/Warning";
    import Menu from '../../config/menu'
    import DeliveryType from './Delivery'
    
    export default {
        mixins:[ Warning ],
        data() {
            return {
                /* 订单备注 */
                columns1: Menu.Columns12,  //table 头部
                remarkList:[],
    
                /* 商品列表 */
                columns2: Menu.Columns13,  //table 头部
                productList:[],
                
                /* 赠品列表 */
                columns3: Menu.Columns14,  //table 头部
                largessList:[],
                
                /* 数据 */
                customForm:{
                    order_id:'',   //订单ID
                    order_type:'',  //订单类型(1普通订单)
                    updated_at:'',  //下单时间
                    refund_status:'',   //退款状态
                    return_status:'',   //退货状态
                    carrier_id:'',  //物料ID
                    carrier_name:'',   //配送公司
                    tracking_number:'',  //运单号
                    weight:"",          //商品重量
                    current: 0,   //订单完成状态
                    receiver:'',  //收货人
                    telephone:'',  //收货电话
                    address:'',    //收货地址
                    shipping_time:'',  //发货时间
    
                    name:'',   //会员名称
                    member_level_id:'',  //会员等级
                    mobile:'',  //会员手机号
    
                    payment_type:'',   //付款方式(1在线支付)
                    payment_name:'',   //付款方式名称
                    total_paid:'',   //已付金额
                    shipping_amount:'',   //配送费用
                    discount_amount:'',   //订单总优惠
                    subtotal:'',   //商品总价格
                    grand_total:'',   //订单总金额
                },
                labelCol: {
                    span: 6
                },
                wrapperCol: {
                    span: 16
                },
            }
        },
        created() {
            /* 面包屑 */
            this.$store.state.BreadShow = false;
            /* 主体100%展示 */
            this.$store.state.ContentShow = true;
        },
        components:{
            DeliveryType
        },
        mounted(){
            this.asyncFunc();   //初始化
        },
        methods: {
    
            /* 订单列表 */
            asyncFunc(){
                let params = {
                    page_size: 1,
                    page: 1,
                    id: this.$route.params.id,                  //订单号
                };
                
                this.dataLoading = true;
                this.$http.get(OrderListAPI,{ params }).then(resp => {
                    this.dataLoading = false;
                    if (resp.data.code == 1) {
                        let list = resp.data.data.orders;
                        if(!list){
                            return false
                        }
                        
                        let detail = list[0];
                        this.customForm.order_id = detail.order_id;   //订单ID
                        this.customForm.order_type = detail.order_type;  //订单类型(1普通订单)
                        this.customForm.updated_at = detail.updated_at;  //下单时间
                        this.customForm.refund_status = detail.refund_status;   //退款状态
                        this.customForm.return_status = detail.return_status;   //退货状态
                        this.customForm.carrier_id = detail.order_shipment.carrier_id;  //物流公司ID
                        this.customForm.carrier_name = detail.order_shipment.carrier_name;   //配送公司
                        this.customForm.tracking_number = detail.order_shipment.tracking_number;  //运单号
                        this.customForm.weight = detail.weight?detail.weight:0;          //商品重量
                        
                        /*  订单完成状态  */
                        let current = 0;
                        switch(detail.order_status.toString()) {
                            case '1':
                                current = 0;
                                break;
                            case '2':
                                current = 1;
                                break;
                            case '3':
                                current = 2;
                                break;
                            case '4':
                                current = 3;
                                break;
                            default:
                                current = 4;
                                break;
                        }
                        this.customForm.current = current;   //订单完成状态
                        
                        this.customForm.receiver = detail.order_address.receiver;  //收货人
                        this.customForm.telephone = detail.order_address.telephone;  //收货电话
                        
                        /* 收货地址 */
                        let address = detail.order_address.province + detail.order_address.city + detail.order_address.region  + detail.order_address.street;
                        this.customForm.address = address;    //收货地址
                        this.customForm.shipping_time = detail.shipping_time;  //发货时间
    
                        /* 会员信息 */
                        
                        this.customForm.name = detail.member.name;   //会员名称
                        this.customForm.member_level_id = detail.member.member_level_id;  //会员等级
                        this.customForm.mobile = detail.member.mobile;  //会员手机号
    
                        this.customForm.payment_type = detail.payment_type;   //付款方式(1在线支付)
                        this.customForm.payment_name = detail.order_payment.payment_name;   //付款方式名称
                        this.customForm.total_paid = detail.total_paid?detail.total_paid:0;   //已付金额
                        this.customForm.shipping_amount = detail.shipping_amount?detail.shipping_amount:0;   //配送费用
                        this.customForm.discount_amount = detail.discount_amount?detail.discount_amount:0;   //订单总优惠
                        this.customForm.subtotal = detail.subtotal?detail.subtotal:0;   //商品总价格
                        this.customForm.grand_total = detail.grand_total?detail.grand_total:0;   //订单总金额
                        
                        /* 商品列表 */
                        this.productList = detail.order_items?detail.order_items:[]
                       
                        
                        console.log("customForm：：",this.customForm)
                    }
                }).catch(error => {
                    this.dataLoading = false;
                });
            },
            
            
            
            
            /* 发货--确认面板 */
            deliverClick(){
                this.$refs.deliveryd.loadData();
                this.$store.state.model.editType = true;
            },
            /* 发货--操作 */
            refreshDelivery(item){
                console.log(this.deliverys);
                
                let params ={
                    order_id: this.customForm.order_id,      //订单号
                    carrier_id: item.carrier_type,          //物流公司ID
                    tracking_number: item.carrier_id,       //运单号
                };
                
                this.$http.post(OrderShipmentAPI, this.$qs.stringify(params)).then(resp => {
                    console.log(resp.data)
                    if (resp.data.code == 1) {
                        this.successType('订单发货成功！');
                        this.asyncFunc();
                    }
                }).catch(error =>{
                    this.$store.state.loading = false;
                });
            },
            
            /* 验证数字 */
            verifySort(rule, value, callback) {
                const form = this.form;
                let str = form.getFieldValue('sort');
                if (!this.validate.isStringI(str, 1, 4)) {
                    callback('请输入数字！');
                } else {
                    callback();
                }
            },
            
            /* 下拉--搜索 */
            filterOption(input, option) {
                return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0);
            },
            /* 提交 */
            submitForm() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        console.log(values);
                        this.$store.state.loading = true;
                    }
                });
            },
            //取消
            ruleCancel() {
                this.$store.state.loading = false;
                this.$store.state.model.editType = false;
                this.form.resetFields();
            }
        }
    }
</script>

<style scoped>
    /*** 头部信息 */
    .main .title{
        margin-bottom: 10px;
        width: auto;
        height: 34px;
        line-height: 34px;
        font-size: 18px;
        font-weight: 600;
    }
    
    
    .remark{
        margin: 24px 24px 0;
        padding: 20px 30px;
        width: auto;
        background-color: #ffffff;
    }
    .remark .text-blue{
        margin-left: 14px;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
    }
    
    
    
    /* 订单信息--start */
    .order {
        padding-bottom: 20px;
        width: 100%;
        border-top: 1px solid #e9e9e9;
        border-bottom: 1px solid #e9e9e9;
        background-color: #ffffff;
    }
    /** 订单-面包屑 */
    .order .order-top {
        margin: 0 26px;
        width: auto;
        height: 42px;
    }
    .order .order-top .ant-breadcrumb {
        line-height: 42px;
        font-size: 15px;
    }
    /** 订单-订单号 */
    .order .order-number {
        margin: 6px 24px 0;
        width: auto;
        height: 40px;
        display: grid;
        grid-template-columns: 50px 1fr;
    }
    .order .order-number .img {
        width: 30px;
        height: 30px;
        display: inline-block;
    }
    .order .order-number .img img {
        width: 100%;
        height: 100%;
    }
    .order .order-number .number {
        font-size: 20px;
        line-height: 40px;
        font-weight: 600;
    }
    /** 订单-订单详细 */
    .order .order-details {
        margin: 20px 24px 0 74px;
        width: auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 300px));
        gap: 12px 20px;
    }
    /** 订单-操作 */
    .order .order-operate{
        margin: 50px 24px 0;
        width: auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 20px;
    }
    .order .order-operate .record{
        cursor: pointer;
        text-align: right;
        font-size: 15px;
        line-height: 2.5;
    }
    .order .order-operate .record span{
        margin-left: 10px;
        width: 66px;
        display: inline-block;
    }
    /* 订单信息--end */
    
    
    /* 订单步骤条--start */
    .steps{
        margin: 24px 24px 0;
        padding: 44px 40px 32px;
        width: auto;
        font-size: 15px;
        display: grid;
        grid-template-columns: 1fr 190px;
        column-gap: 30px;
        background-color: #ffffff;
    }
    .steps .text-center{
        cursor: pointer;
    }
    /* 订单步骤条--end */

    /* 订单基础--start */
    .basic{
        margin: 24px 24px 0;
        width: auto;
        display: grid;
        grid-template-columns: 1fr 340px;
        column-gap: 20px;
    }
    .basic>div{
        padding: 20px 30px;
        background-color: #ffffff;
    }
    .basic>div>div{
        width: auto;
        height: 36px;
        line-height: 36px;
        font-size: 15px;
    }
    /** 订单基础信息 */
    .basic .info .info-text{
        width: 100%;
        display: grid;
        grid-template-columns: 126px 1fr;
    }
    .basic .info .info-user,.basic .info .info-adress{
        width: 100%;
        height: auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
    /*** 上边框 */
    .basic .info .bg-string{
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #efefef;
    }
    /** 订单支付信息 */
    .basic .defray .defray-text{
        display: grid;
        grid-template-columns: 120px 1fr;
    }
    /*** 上边框 */
    .basic .defray .bg-string{
        margin-top: 16px;
        padding-top: 16px;
        height: 52px;
        border-top: 1px solid #efefef;
    }
    /* 订单基础--end */
</style>
