<template>
    <div class="home">
        <div v-title>一米市集-商品中心</div>
        <a-layout id="components-layout-demo-fixed-sider">
            <a-layout-sider v-model="collapsed" :trigger="null" collapsible class="layoutLeft" >
                <div class="logo" ><img :src="logoImage" /></div>
                <a-menu theme="dark" mode="inline" @select="menuSkip" :default-selected-keys="selectedKeys" :open-keys.sync="openKeys" :inline-collapsed="collapsed" class="padding-bottom-lg">
                    <template v-for="(item,index) in menuData" >
                        <a-menu-item v-if="!item.children" :key="item.key">
                            <router-link :to="{path:`${ item.url }`}" tag="a">
                                <a-icon :type="item.icon" />
                                <span>{{item.name}}</span>
                            </router-link>
                        </a-menu-item>
                        <subMenu-item v-else :menu-info="item" :key="item.key" ></subMenu-item>
                    </template>
                </a-menu>
                
            </a-layout-sider>
            <a-layout class="layoutRight" :class="collapsed?'margin-left-80':''">
                <a-layout-header class="layoutHeader" >
                    <div class="regulate text-left">
                        <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="() => (collapsed = !collapsed)" />
                    </div>
                    <headerType-item :count="cueNumber"></headerType-item>
                </a-layout-header>
                
                <a-layout-content class="layoutContent" v-if="isRouterAlive" >
                    <div class="breadcrumb" v-if="this.$store.state.BreadShow">
                        <a-breadcrumb>
                            <a-breadcrumb-item v-for="(item,index) in this.$store.state.breadList" :key="index">
                                <router-link :to="{ path: `${item.url}`}" tag="a" v-if="item.url">{{ item.value }}</router-link>
                                <span v-else>{{ item.value }}</span>
                            </a-breadcrumb-item>
                        </a-breadcrumb>
                        <div class="name text-bold">
                            {{ this.$store.state.breadValue }}
                        </div>
                    </div>
                    
                    <div class="content" :class="{ 'contented':this.$store.state.ContentShow }" >
                        <router-view></router-view>
                    </div>
                    
                </a-layout-content>
                
                <a-layout-footer class="layoutFooter text-center">
                    <footerType-item></footerType-item>
                </a-layout-footer>
            </a-layout>
       
        </a-layout>
        
    </div>
</template>

<script>
    import Menu from '../config/menu'
    import { Warning,Refurbish } from '../common/mixin/Warning'
    import headerType from './index/Header'  //页头
    import footerType from './index/Footer'  //页脚
    import SubMenuType from "./index/SubMenu"    //导航
    
    export default {
        mixins:[ Warning,Refurbish ],
        provide (){
            return {
                reload:this.reload
            }
        },
        data () {
            return {
                collapsed: false,  //导航是否伸缩
                logoImage:'./static/image/logo.png',  //导航-头部图片
                menuData: Menu.menuData,    //导航列表
                openKeys: ['product'],   //打开子菜单
                selectedKeys: "['home']", //焦点所在
    
                cueNumber: 10,  //未读信息
            }
        },
        created(){
            /* 导航--焦点所在 */
            this.selectedKeys = [];
            let focus = localStorage.getItem('goShopFocus');
            if(focus){
                this.selectedKeys.push(focus);
            }
            /* 会员信息 */
            let user = this.$store.state.users;
            //用户名称、用户头像
            if(!user.account || !user.headImg){
                let userInfo = JSON.parse(localStorage.getItem("UserInfo"));
                if(userInfo){
                    user.account = userInfo.account;
                    user.headImg = userInfo.headImg;
                }
            }
        },
        mounted(){
        
        },
        components: {
            'footerType-item': footerType,
            'headerType-item': headerType,
            'subMenu-item': SubMenuType,
        },
        methods:{
            //焦点缓存
            menuSkip(item){
                localStorage.setItem('goShopFocus',item.key);
            },
        },
    }
</script>

<style scoped>
    .home{
        width: 100%;
        height: 100%;
    }
    /* 左边 */
    .layoutLeft{
        height: 100vh;
        position: fixed;
        left: 0;
        overflow-y: auto;
        overflow-x: hidden;
    }
    /** 图标 */
    .layoutLeft .logo {
        margin: 16px;
        height: 32px;
        /* background: rgba(255, 255, 255, 0.2); */
    }
    .layoutLeft .logo img{
        height: 32px;
    }
    /* 右边 */
    .layoutRight{
        margin-left: 200px;
        width: 100%;
        min-height: 100vh;
        transition: margin 0.3s;
    }
    .margin-left-80{
        margin-left: 80px;
    }
    /** 头部 */
    .layoutRight .layoutHeader{
        padding: 0 16px;
        display: grid;
        grid-template-columns: 1fr 4fr;
        background: #ffffff;
    }
    /*** 头部--左边 */
    .layoutHeader .regulate{
    }
    /**** 导航伸缩  */
    .layoutHeader .regulate .trigger {
        font-size: 20px;
        line-height: 64px;
        padding: 0 24px 0 4px;
        cursor: pointer;
        transition: color 0.3s;
    }
    .layoutHeader .regulate .trigger:hover {
        color: #1890ff;
    }
   
    /** 中部 */
    .layoutRight .layoutContent{
        width: 100%;
        min-height: calc(100% - 154px);
    }
    /*** 面包屑 */
    .layoutContent .breadcrumb{
        padding: 0px 20px;
        width: 100%;
        border-top: 1px solid #dddddd;
        background-color: #ffffff;
    }
    .layoutContent .breadcrumb .ant-breadcrumb{
        padding: 16px 0 14px;
    }
    .layoutContent .breadcrumb .name{
        padding-bottom: 12px;
        font-size: 20px;
    }
    /*** 主体 */
    .layoutContent>.content{
        margin: 28px 24px 0;
        width: auto;
        position: relative;
        height: calc(100% - 94px);
        min-height: calc(100% - 94px);
    }
    /*** 主体边距为零 */
    .layoutContent>.contented{
        margin: 0;
    }
    .layoutContent>.content:only-of-type{
        min-height: 100%;
    }
    .layoutContent>.content>.main{
        padding: 24px;
        width: 100%;
        height: calc(100% - 30px);
        min-height: calc(100% - 30px);
        position: relative;
        overflow: hidden;
        background-color: #ffffff;
    }
    /*** 主体边距为零 */
    .layoutContent>.contented>.main{
        padding: 0;
        height: 100%;
        min-height: 100%;
        background-color: #f0f2f5;
    }
    /** 底部 */
    .layoutFooter{
        padding: 14px 50px 8px;
    }
</style>
