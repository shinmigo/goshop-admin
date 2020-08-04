import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            component: name => require(['../components/Login'], name),
        },
        {
            path: '/image',
            component: name => require(['../components/image/Index'], name),
        },
        {
            path: '/home',
            component: name => require(['../components/Home'], name),
            redirect:"/home/index",
            children:[
                { // 主页
                    path: '/home/index',
                    component: name => require(['../components/index/Index'], name),
                },
                { // 会员管理
                    path: '/home/user',
                    component: name => require(['../components/user/Index'], name),
                },
                { // 会员管理
                    path: '/home/lookUser/:id',
                    component: name => require(['../components/user/Edit'], name),
                },
            ],
            
        },
        {  //订单管理
            path: '/order',
            component: name => require(['../components/Home'], name),
            redirect:"/order/index",
            children:[
                //主页
                {
                    path: '/order/index',
                    component: name => require(['../components/order/Index'], name),
                },
                //编辑
                {
                    path: '/order/editType/:id',
                    component: name => require(['../components/order/Edit'], name),
                },
            ],
        },
        {  //商品管理
            path: '/goods',
            component: name => require(['../components/Home'], name),
            redirect:"/goods/index",
            children:[
                { // 商品列表
                    path: '/goods/index',
                    component: name => require(['../components/goods/index/Index'], name),
                },
                { // 编辑/添加-商品
                    path: '/goods/editType/:id',
                    component: name => require(['../components/goods/index/Edit'], name),
                },
                { //商品详情
                    path: '/goods/details/:id',
                    component: name => require(['../components/goods/index/Details'], name),
                },
                { // 商品分类
                    path: '/goods/classify',
                    component: name => require(['../components/goods/configure/classify/Index'], name),
                },
                { // 商品类型
                    path: '/goods/type',
                    component: name => require(['../components/goods/configure/type/Index'], name),
                },
                { // 商品规格
                    path: '/goods/norms',
                    component: name => require(['../components/goods/configure/norms/Index'], name),
                },
                { // 商品参数
                    path: '/goods/parameter',
                    component: name => require(['../components/goods/configure/parameter/Index'], name),
                },
                { // 商品标签
                    path: '/goods/label',
                    component: name => require(['../components/goods/configure/label/Index'], name),
                },
            ],
        },
        {  //物流管理
            path: '/logistics',
            component: name => require(['../components/Home'], name),
            redirect:"/logistics/index",
            children:[
                { //物流公司
                    path: '/logistics/index',
                    component: name => require(['../components/logistics/index/Index'], name),
                },
                { //运费模板
                    path: '/logistics/freight',
                    component: name => require(['../components/logistics/freight/Index'], name),
                },
            ],
        },
        {  //权限管理
            path: '/authority',
            component: name => require(['../components/Home'], name),
            redirect:"/authority/index",
            children:[
                { //管理员列表
                    path: '/authority/index',
                    component: name => require(['../components/authority/index/Index'], name),
                },
                { //角色管理
                    path: '/authority/roles',
                    component: name => require(['../components/authority/roles/Index'], name),
                },
                { //角色授权权限
                    path: '/authority/warrant/:id',
                    component: name => require(['../components/authority/roles/Warrant'], name),
                },
                { //权限管理
                    path: '/authority/rights',
                    component: name => require(['../components/authority/rights/Index'], name),
                },
            ],
        },
        {  //插件管理
            path: '/plugIn',
            component: name => require(['../components/Home'], name),
            redirect:"/plugIn/index",
            children:[
                //主页
                {
                    path: '/plugIn/index',
                    component: name => require(['../components/plugIn/Index'], name),
                },
            ],
        },
        {  //商城设置
            path: '/settings',
            component: name => require(['../components/Home'], name),
            redirect:"/settings/index",
            children:[
                //主页
                {
                    path: '/settings/index',
                    component: name => require(['../components/settings/Index'], name),
                },
            ],
        },
        /* 帮助、隐私、条款 */
        {
            path: '/notice',
            component: name => require(['../components/Home'], name),
            redirect:"/notice/help",
            children:[
                //帮助
                {
                    path: '/notice/help',
                    component: name => require(['../components/agreement/Help'], name),
                },
                //隐私
                {
                    path: '/notice/secret',
                    component: name => require(['../components/agreement/Secret'], name),
                },
                //条款
                {
                    path: '/notice/clause',
                    component: name => require(['../components/agreement/Clause'], name),
                },
            ],
        }
    ]
})
