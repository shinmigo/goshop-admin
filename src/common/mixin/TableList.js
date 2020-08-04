//table list
export const Tables = {
    data() {
        return {
            dataLoading: false,     //table加载状态
            dataList: [],           //table数据列表
            rowKeys:[],             //table默认选中
            deleteId:'',            //删除选中
            deletedID: [],          //删除选中--数组
            
            /* 分页配置 */
            pagination: {
                total: 0,             //数据总数
                current: 1,           //页数
                pageSize: 10,          //条数
                pageSizeOptions: ['10','20','30','50'],   //指定每页可以显示多少条
                showSizeChanger: true,                        //是否可以改变pageSizeOptions
                showTotal: total => `共有 ${total} 条数据`,
            },
    
            /* 弹出框-参数 */
            styleType:{},
            /* 弹出框-数据 */
            ruleForm:{},
        }
    },
    destroyed(){
        this.rowKeys = [];
        this.dataList = [];
    },
    mounted() {
    },
    methods: {
        //清空已选
        emptyCheck() {
            this.rowKeys = [];
            this.asyncFunc();
        },
        /* 刷新table */
        refreshTable(){
            console.log('刷新')
            //table转到第一页
            this.rowKeys = [];
            this.pagination.current = 1;
            this.asyncFunc();
        },
        /* table 复选框选中 */
        onRowChange(keys){
            this.rowKeys = keys;
        },
    },
    watch: {
    
    }
};
