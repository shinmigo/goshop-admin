<template>
    <div class="main">
        <!-- 初始判断是否有数据，默认展示所有行 -->
        <a-table v-if="dataList && dataList.length" :defaultExpandAllRows="true"  :columns="columns" :data-source="dataList" :row-key="record => record.value" :loading="dataLoading" :row-selection="{selectedRowKeys:rowKeys, onSelect:onRowChange, onSelectAll:onAllChange }" :pagination="false" @change="loadData" class="noTable margin-top-df">
            <span slot="rights" slot-scope="text">
                <div v-if="text.length > 0" class="tableGird">
                    <span v-for="(item,index) in text" :key="index" >
                        <a-checkbox v-model="item.checked" :value="item.value"  @change="onChange(item)">{{ item.label }}</a-checkbox>
                    </span>
                </div>
            </span>
        </a-table>
        
        <div class="text-center bg-loading">
            <a-button type="primary" class="margin-right-df text-letter">
                <a-spin v-show="this.$store.state.loading"/>
                {{ this.$store.state.loading ? "正在确认中":"确认" }}
            </a-button>
            <a-button @click.prevent="ruleCancel()">取消</a-button>
        </div>
    </div>
</template>

<script>
    import indexData from '../../../../static/right'   //json数据
    import Menu from '../../../config/menu'
    
    export default {
        name: "Warrant",
        data () {
            return {
                isDown: true,
                
                columns: Menu.Columns10,  //table 头部
                
                dataLoading: false,     //table加载状态
                dataList: [],           //table数据列表
                rowKeys:[],             //table默认选中
    
                
                /* type:1菜单，2功能 */
                dataLists:[
                    {
                        label:'线上渠道', value:'1', type: 1, checked: false,isDown:false,
                        children:[
                            { label:'自营渠道', value:'2', type: 1, checked: false,isDown:false,
                                children:[
                                    { label:'上下架', value:'2-3', type: 2, checked: false, },
                                    { label:'添加', value:'2-4', type: 2, checked: false, },
                                    { label:'编辑', value:'2-5', type: 2, checked: false, },
                                    { label:'删除', value:'2-6', type: 2, checked: false, },
                                    { label:'批量上下架', value:'2-7', type: 2, checked: false, },
                                    { label:'批量删除', value:'2-8', type: 2, checked: false, },
                                ],
                            },
                            { label:'BTB渠道', value:'3', type: 1, checked: false,isDown:false,
                                children:[
                                    { label:'上下架', value:'3-1', type: 2, checked: false, },
                                    { label:'添加', value:'3-4', type: 2, checked: false, },
                                    { label:'编辑', value:'3-5', type: 2, checked: false, },
                                    { label:'删除', value:'3-6', type: 2, checked: false, },
                                    { label:'批量上下架', value:'3-7', type: 2, checked: false, },
                                    { label:'批量删除', value:'3-8', type: 2, checked: false, },
                                ],
                            }
                        ]
                    },
                    {
                        label:'线下渠道', value:'100', type: 1, checked: false,
                        children:[
                            { label:'农夫市集', value:'102', type: 1, checked: false,
                                children:[
                                    { label:'上下架', value:'1003', type: 2, checked: false, },
                                    { label:'添加', value:'1004', type: 2, checked: false, },
                                    { label:'编辑', value:'1005', type: 2, checked: false, },
                                    { label:'删除', value:'1006', type: 2, checked: false, },
                                    { label:'批量上下架', value:'1007', type: 2, checked: false, },
                                    { label:'批量删除', value:'1008', type: 2, checked: false, },
                                ],
                            }
                        ]
                    },
                ],
                
                /* 菜单/功能对应接口 */
                homologous: {
                    productsList:'product/index',
                    productsStatus: 'product/status',
                    addProducts: 'product/add',
                    editProducts: ['product/details', 'product/edit'],
                    deleteProduct: 'product/delete',
                    pathProductsStatus: 'product/status',
                    pathProductsDelete: 'product/delete',
                },
    
            }
        },
        created () {
            /* 面包屑 */
            this.$store.state.breadList = [
                {value: "权限管理", url: ""},
                {value: "角色列表", url: ""},
                {value: "分配权限", url: ""},
            ];
            this.$store.state.breadValue = '分配权限';
        
        },
        mounted(){
            this.asyncFunc();   //初始化
        },
        methods: {
            /* 是否下拉展示 */
            isDownShow(item){
                console.log(item);
                let isDown = !item.isDown;
                this.$set(item,'isDown',isDown);
            },
            
            
            changeActivekey(key) {
                console.log(key);
            },
            
            
            /* 取消 */
            ruleCancel(){
                console.log('取消');
                this.loadData();   //初始化
            },
            /* 权限-复选框选中 */
            onChange(item){
                  console.log(item);
                  
                  if(item.checked){
                      this.rowKeys.push(item.value);
                      this.rowKeys.push(item.parent_id);
                  } else {
                      let index = this.rowKeys.indexOf(item.value);
                      this.rowKeys.splice(index,1);
                  }
                  console.log(this.rowKeys);
            },
            /* table菜单--全选 */
            onAllChange(checked,item){
                  console.log(checked,item);
                  
                  if(checked){
                      for (let value of item){
                          this.rowKeys.push(value.value);
                          this.recursion(value,true);
                      }
                  } else {
                      this.rowKeys = [];
                      this.recursion(this.dataList,false,1);
                  }
                console.log(this.rowKeys,this.dataList);
            },
            /* table菜单-复选框选中 */
            onRowChange(item,checked){
                console.log(item,checked)
                
                if(checked){  //选中
                    this.rowKeys.push(item.value);
                    this.recursion(item,true);
                    
                } else {  //取消
                    let index = this.rowKeys.indexOf(item.value);
                    this.rowKeys.splice(index,1);
                    this.recursion(item,false);
                }
                
                console.log(this.rowKeys);
            },
    
            /* table递归选中或取消 type:true/false */
            recursion(item,type,i=0){
                let men = [];
                if(i == 0) {
                    if (type) {
                        if (item.rights) {
                            for (let value of item.rights) {  //下级权限
                                value.checked = true;
                                this.rowKeys.push(value.value);
                            }
                        }
                        
                        if (item.children) {
                            for (let value of item.children) {  //下级菜单
                                value.checked = true;
                                this.rowKeys.push(value.value);
                                if (value.children || value.rights) {
                                    men.push(value);
                                }
                            }
                        }
                    } else {
                        if (item.rights) {
                            for (let value of item.rights) {  //下级权限
                                value.checked = false;
                                let index = this.rowKeys.indexOf(value.value);
                                this.rowKeys.splice(index, 1);
                            }
                        }
                        if (item.children) {
                            for (let value of item.children) {  //下级菜单
                                value.checked = false;
                                let index = this.rowKeys.indexOf(value.value);
                                this.rowKeys.splice(index, 1);
                                if (value.children || value.rights) {
                                    men.push(value);
                                }
                            }
                        }
                    }
                } else {
                    if (type) {
                        for (let value of item){
                            if (value.rights) {
                                for (let values of value.rights) {  //下级权限
                                    values.checked = true;
                                    this.rowKeys.push(values.value);
                                }
                            }
                            if (value.children) {
                                for (let values of value.children) {  //下级菜单
                                    values.checked = true;
                                    this.rowKeys.push(values.value);
                                    if (values.children || values.rights) {
                                        men.push(values);
                                    }
                                }
                            }
                        }
                    } else {
                        for (let value of item) {
                            if (value.rights) {
                                for (let values of value.rights) {  //下级权限
                                    values.checked = false;
                                    let index = this.rowKeys.indexOf(values.value);
                                    this.rowKeys.splice(index, 1);
                                }
                            }
                            if (value.children) {
                                for (let values of value.children) {  //下级菜单
                                    values.checked = false;
                                    let index = this.rowKeys.indexOf(values.value);
                                    this.rowKeys.splice(index, 1);
                                    if (values.children || values.rights) {
                                        men.push(values);
                                    }
                                }
                            }
                        }
                    }
                }
                if(men.length == 0){
                    return false;
                }
                i++;
                this.recursion(men,type,i);
            },
    
            /* 初始化 */
            async asyncFunc(){
                this.dataLoading = true;
                const details = await this.loadDetails();  //角色关联权限详情
                const list = await this.loadData(details);  //权限列表
                
                
                this.dataList = list;
                this.dataLoading = false;
            },
            
            /* 权限列表 */
            loadData(details){
                return new Promise((resolve, reject) => {
                    for (let item of indexData.list) {
                        item.checked = false;
                        if (item.type == 1) {
                            item.rights = [];
                            if(details.includes(item.value)){
                                this.rowKeys.push(item.value);
                            }
                        } else {
                            if(details.includes(item.value)){
                                item.checked = true;
                                this.rowKeys.push(item.value);
                            }
                        }
                    }
    
                    let dataList = [];
                    for (let item of this.authority.dataList(indexData.list)) {
                        if (item.types && item.types == 1) {
                            dataList.push(item);
                        }
                    }
    
                    console.log(dataList)
    
                    resolve(dataList);
                });
            },
            
            /* 角色关联权限详情 */
            loadDetails(){
                return new Promise((resolve, reject) => {
                    let dataList = indexData.detail;
                    
                    resolve(dataList);
                });
            }
          
        }
    }
</script>

<style scoped>
    .main .text-center{
        margin: 56px 0 20px;
    }
    
    .table{
        border: 1px solid #dddddd;
    }
</style>
