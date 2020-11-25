const menu = {
    /* 用户设置-下拉 */
    menuUp: [
        {content: '设置头像'},
        {content: '修改密码'},
        {content: '退出登录'}
    ],
    /* 网站导航 */
    menuData: [
        {
            name: '首页',
            key: 'home',
            icon: 'bank',
            url: '/home/index'
        },
        {
            name: '商品管理',
            key: 'product',
            icon: 'calendar',
            children: [
                {
                    name: '商品列表',
                    key: 'goods',
                    icon: 'database',
                    url: '/goods/index',
                },
                {
                    name: '商品配置',
                    key: 'configure',
                    icon: 'schedule',
                    children:[
                        {
                            name: '商品分类',
                            key: 'classify',
                            icon: 'file-text',
                            url: '/goods/classify'
                        },
                        {
                            name: '商品类型',
                            key: 'type',
                            icon: 'project',
                            url: '/goods/type'
                        },
                        {
                            name: '商品规格',
                            key: 'norms',
                            icon: 'wallet',
                            url: '/goods/norms'
                        },
                        {
                            name: '商品参数',
                            key: 'parameter',
                            icon: 'exception',
                            url: '/goods/parameter'
                        },
                        {
                            name: '商品标签',
                            key: 'label',
                            icon: 'audit',
                            url: '/goods/label'
                        }
                    ]
                }
            ]
        },
        {
            name: '订单管理',
            key: 'order',
            icon: 'paper-clip',
            url: '/order/index',
        },
        {
            name: '物流管理',
            icon: 'car',
            children: [
                {
                    name: '物流公司',
                    key: 'logistics',
                    icon: 'profile',
                    url: '/logistics/index',
                },
                {
                    name: '运费模板',
                    key: 'freight',
                    icon: 'file-pdf',
                    url: '/logistics/freight',
                },
            ]
        },
        {
            name: '权限管理',
            icon: 'security-scan',
            children: [
                {
                    name: '管理员列表',
                    key: 'administrator',
                    icon: 'solution',
                    url: '/authority/index',
                },
                {
                    name: '角色管理',
                    key: 'roles',
                    icon: 'share-alt',
                    url: '/authority/roles',
                },
                {
                    name: '权限管理',
                    key: 'rights',
                    icon: 'security-scan',
                    url: '/authority/rights',
                },
            ]
        },
        {
            name: '会员管理',
            key: 'user',
            icon: 'idcard',
            url: '/home/user'
        },
        {
            name: '插件管理',
            key: 'plugIn',
            icon: 'block',
            url: '/plugIn/index'
        },
        {
            name: '商城设置',
            icon: 'setting',
            children: [
                {
                    name: '广告管理',
                    key: 'roles',
                    icon: 'share-alt',
                    url: '/settings/index',
                }
            ]
            
        },
    ],
    
    /* 商品搜索-上下架 */
    menuUp1:[
        { value: '', label: '全部' },
        { value: '1', label: '上架' },
        { value: '2', label: '下架' },
    ],
    /* 会员搜索-启用禁用 */
    menuUp2:[
        { value: '', label: '全部' },
        { value: '1', label: '启用' },
        { value: '2', label: '禁用' },
    ],
    /* 广告位类型状态-banner、广告位 */
    menuUp3:[
        { value: '', label: '全部' },
        { value: '1', label: 'banner' },
        { value: '2', label: '广告位' },
    ],
    /* 广告位类型-banner、广告位 */
    menuUp4:[
        { value: '1', label: 'banner' },
        { value: '2', label: '广告位' },
    ],
    /* 商品列表-头部 */
    Columns: [
        {title: "操作", dataIndex: 'action',width:'180px', scopedSlots: { customRender: 'action' } },
        {title: '商品ID', dataIndex: 'product_id', },
        {title: "商品名称", dataIndex: 'name', ellipsis: true,scopedSlots: { customRender: 'name' }},
        {title: "类型", dataIndex: 'kind_name', },
        {title: "商品标签", dataIndex: 'tag',  ellipsis: true,},
        {title: "上架状态", dataIndex: 'status', scopedSlots: { customRender: 'status' }},
        {title: "售卖状态", dataIndex: 'unit',  },
        {title: "价格", dataIndex: 'price',  scopedSlots: { customRender: 'price' }}
    ],
    /* 商品分类列表-头部 */
    Columns1: [
        {title: "操作", dataIndex: 'action',width:'250px', scopedSlots: { customRender: 'action' } },
        {title: '分类ID', dataIndex: 'category_id', },
        {title: "分类名称", dataIndex: 'name', ellipsis: true,scopedSlots: { customRender: 'name' }},
        {title: "图标", dataIndex: 'icon', scopedSlots: { customRender: 'icon' }},
        {title: "排序", dataIndex: 'sort',  ellipsis: true,},
        {title: "状态", dataIndex: 'status', scopedSlots: { customRender: 'status' }},
    ],
    /* 商品类型列表-头部 */
    Columns2: [
        {title: "操作", dataIndex: 'action',width:'250px', scopedSlots: { customRender: 'action' } },
        {title: '类型ID', dataIndex: 'kind_id', },
        {title: "类型名称", dataIndex: 'name', ellipsis: true,scopedSlots: { customRender: 'name' }},
        {title: "参数数量", dataIndex: 'param_qty', },
        {title: "规格数量", dataIndex: 'spec_qty',  ellipsis: true,},
    ],
    /* 商品参数列表-头部 */
    Columns3: [
        {title: "操作", dataIndex: 'action', scopedSlots: { customRender: 'action' } },
        {title: '参数ID', dataIndex: 'param_id' },
        {title: "参数名称", dataIndex: 'name' },
        {title: "参数类型", dataIndex: 'type', scopedSlots: { customRender: 'type' } },
        {title: "参数值", dataIndex: 'content', ellipsis: true },
    ],
    /* 商品规格列表-头部 */
    Columns4: [
        {title: "操作", dataIndex: 'action', scopedSlots: { customRender: 'action' } },
        {title: '规格ID', dataIndex: 'spec_id', },
        {title: "规格名称", dataIndex: 'name', ellipsis: true,scopedSlots: { customRender: 'name' }},
        {title: "规格值", dataIndex: 'content',  ellipsis: true,},
        {title: "排序", dataIndex: 'sort', },
    ],
    /* 商品标签列表-头部 */
    Columns5: [
        {title: "操作", dataIndex: 'action', scopedSlots: { customRender: 'action' } },
        {title: '标签ID', dataIndex: 'tag_id', },
        {title: "标签名称", dataIndex: 'name', ellipsis: true,scopedSlots: { customRender: 'name' }},
    ],
    
    /* 商品详情-规格-头部 */
    Columns6: [
        {title: '图片',label:'image',need: true},
        {title: "售价",label:'price',need:true},
        {title: "成本价",label:'cost_price',need:false},
        {title: '原价',label:'old_price',need:true},
        {title: '库存',label:'stock',need:true},
        {title: '产品编号',label:'sku',need:false},
        {title: '重量',label:'weight',need:false},
        {title: '体积',label:'volume',need:false},
        {title: '操作',label:'action',need:false},
    ],
    /* 商品详情页--规格 */
    Columns7:{'image':'','price':'','cost_price':'','old_price':'','stock':'','sku':'','weight':'','volume':''},
    
    /* 会员列表-头部 */
    Columns8: [
        {title: "操作", dataIndex: 'action', scopedSlots: { customRender: 'action' } },
        {title: '称呢', dataIndex: 'nickname' },
        {title: "手机号码", dataIndex: 'mobile' },
        {title: "等级", dataIndex: 'member_level_id' },
        {title: "状态", dataIndex: 'status', scopedSlots: { customRender: 'status' } },
        {title: "最后登录", dataIndex: 'updated_at' },
    ],
    /* 权限列表-头部 */
    Columns9: [
        {title: "操作", dataIndex: 'action', scopedSlots: { customRender: 'action' } },
        {title: '权限名称', dataIndex: 'key', },
        {title: "权限类型", dataIndex: 'name', ellipsis: true,scopedSlots: { customRender: 'name' }},
        {title: "状态", dataIndex: 'status', scopedSlots: { customRender: 'status' }},
        {title: "最后登录", dataIndex: 'type', },
    ],
    /* 角色分配权限-头部 */
    Columns10: [
        {title: '菜单权限', dataIndex: 'label', ellipsis: true,width:'260px' },
        {title: "功能权限", dataIndex: 'rights', ellipsis: true,scopedSlots: { customRender: 'rights' }},
    ],
    
    /* 订单列表-头部 */
    Columns11: [
        {title: '订单号', dataIndex: 'order_id',width:'180px',scopedSlots: { customRender: 'order_id' } },
        {title: "订单类型", dataIndex: 'order_type', scopedSlots: { customRender: 'order_type' }},
        {title: "下单日期", dataIndex: 'updated_at', width:'160px'},
        {title: "用户", dataIndex: 'name'},
        {title: "收货人手机号", dataIndex: 'phone',width:'120px'},
        {title: "订单状态", dataIndex: 'order_statu' },
        {title: "支付状态", dataIndex: 'payment_status', scopedSlots: { customRender: 'payment_status' }},
        {title: "发货状态", dataIndex: 'shipping_status',scopedSlots: { customRender: 'shipping_status' } },
        {title: "订单总额", dataIndex: 'grand_total'},
    ],
    /* 订单详情-订单备注--头部 */
    Columns12: [
        {title: '备注类型', dataIndex: 'order_id',width:'180px',scopedSlots: { customRender: 'order_id' } },
        {title: "备注内容", dataIndex: 'type', scopedSlots: { customRender: 'type' }},
        {title: "是否本订单有效", dataIndex: 'updated_at', width:'160px'},
        {title: "创建日期", dataIndex: 'name'},
        {title: "操作", dataIndex: 'action',width:'180px',scopedSlots: { customRender: 'action' }},
    ],
    /* 订单详情-商品列表--头部 */
    Columns13: [
        {title: '商品ID', dataIndex: 'product_id',scopedSlots: { customRender: 'product_id' } },
        {title: "商品名称", dataIndex: 'name', scopedSlots: { customRender: 'name' }},
        {title: "销售价", dataIndex: 'old_price'},
        {title: "购买数量", dataIndex: 'qty_ordered'},
        {title: "已发数量", dataIndex: 'num'},
        {title: "促销价", dataIndex: 'price'},
        {title: "小计", dataIndex: 'total_payable'},
    ],
    /* 订单详情-赠品列表--头部 */
    Columns14: [
        {title: '商品ID', dataIndex: 'order_id',width:'180px',scopedSlots: { customRender: 'order_id' } },
        {title: "商品名称", dataIndex: 'type', scopedSlots: { customRender: 'type' }},
        {title: "销售价", dataIndex: 'name'},
        {title: "赠品数量", dataIndex: 'number'},
        {title: "已发数量", dataIndex: 'num'},
        {title: "小计", dataIndex: 'total'},
        {title: "操作", dataIndex: 'action',width:'180px',scopedSlots: { customRender: 'action' }},
    ],
    /* 物流公司列表-头部 */
    Columns15: [
        {title: "操作", dataIndex: 'action',width:'180px', scopedSlots: { customRender: 'action' } },
        {title: 'ID', dataIndex: 'carrier_id', },
        {title: "公司名称", dataIndex: 'name', scopedSlots: { customRender: 'company_name' }},
        {title: "公司编码", dataIndex: 'code' },
        {title: "排序", dataIndex: 'sort' },
        {title: "状态", dataIndex: 'status', scopedSlots: { customRender: 'status' }},
    ],
    /* 运费模板列表-头部 */
    Columns17: [
        {title: "操作", dataIndex: 'action', scopedSlots: { customRender: 'action' } },
        {title: '名称', dataIndex: 'nickname' },
        {title: "运费", dataIndex: 'mobile' },
        {title: "状态", dataIndex: 'status',scopedSlots: { customRender: 'status' }  },
        {title: "创建日期", dataIndex: 'updated_at' },
    ],
    /* 广告位列表-头部 */
    Columns16: [
        {title: "操作", dataIndex: 'action', scopedSlots: { customRender: 'action' } },
        {title: "编号ID", dataIndex: 'id' },
        {title: '广告位名称', dataIndex: 'tag_name' },
        {title: "类型", dataIndex: 'ele_type',scopedSlots: { customRender: 'type' } },
        {title: "状态", dataIndex: 'status',scopedSlots: { customRender: 'status' }  },
        {title: "排序", dataIndex: 'sort' },
        {title: "创建日期", dataIndex: 'updated_at' },
    ],
    
};

export default menu;
