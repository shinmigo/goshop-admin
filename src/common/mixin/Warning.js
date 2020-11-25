//警告
export const Warning = {
    data() {
        return {}
    },
    destroyed(){
        /* 面包屑 */
        this.$store.state.BreadShow = true;
        this.$store.state.breadList = [];
        this.$store.state.breadValue = '';
        /* 主体是否100% */
        this.$store.state.ContentShow = false;
    },
    methods: {
        //添加警告提示框
        warningType(name) {
            this.$notification.warning({
                message: '警告',
                duration: 3,
                description: name
            });
        },
        //添加成功提示框
        successType(name) {
            this.$notification.success({
                message: '提示',
                duration: 3,
                description: name
            });
        },
        //按钮预防多次点击事件--放开
        onlyRead(event){
            console.log('444455555',event.target.style.pointerEvents,event);
            event.target.style.pointerEvents = 'auto';
            console.log('88888',event.target.style.pointerEvents,event);
        },
    },
    watch: {
        '$route' (to, from) {  //路由url变化
            this.reload();
        },
    }
};

//刷新
export const Refurbish = {
    data() {
        return {
            isRouterAlive: true,
        }
    },
    methods: {
        //刷新
        reload(){
            this.isRouterAlive = false; //先关闭
            this.$nextTick(function(){
                this.isRouterAlive = true;  //在打开
            })
        },
    }
};
