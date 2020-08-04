//table list
import Menu from '../../config/menu'
export const Goods = {
    data() {
        return {
            /* 下拉--搜索 */
            filterOption(input, option) {
                return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0);
            },
    
            /* 轮播图片 */
            carousel:["d00cd077d140ac46152519692c59dd9e-w300.jpg","9a03f957e0fa253ee2a632fa95c02fff-w300.jpg",'32bedb45662130484792a66d355e7ad9-w300.jpg'],
            //上传图片参数
            upload: {
                name: 'file',     //上传文件名称
                method: 'post',   //提交类型
                action: '',   //上传地址
                classType: 'picture-card',          //样式
                headers:{  //头部
                    Authorization: "Bearer 58458695465465dfee",
                },
                data:{   //参数
                    lengt:'SUNJUNFA',
                }
            },
            loading: false,  //轮播图片上传状态
    
            /* 规格 */
            columns: Menu.Columns6,  //table 头部--单规格
            columns1: Menu.Columns16,  //table 头部--多规格
            isNorms: false,  //是否多个规格(2true多规格，1false单规格)
            /* 多规格-规格选项列表 */
            normsData: {},
            normsDataList: [],       //多规格-规格选中列表
            isNormsData: false,   //多规格-是否选中规格选项(true已选中-规格列表展示，false未选中-规格列表不展示)
            /* 规格数据列表(图片、价格、成本、原价、库存、编号、重量、体积) */
            normsList: {'image':'cc60a023cf41f9bdcc6c74474c3ff217-w300.jpg','price':'','cost_price':'','old_price':'','stock':'','sku':'','weight':'','volume':''},
            manyNormsList:[],   //多规格列表
            oneNormsList: [],  //单规格列表
    
            /* 手机端描述(type:1文字,2图片。status:1编辑状态,2:展示状态。focus:true选中,false:未选中。text:文本或图片ID。url:图片url) */
            phoneList:[],  //手机端描述列表
            phoneFocus: '',   //手机端描述焦点所在
            phoneText:{},     //手机端描述焦点所在文档
    
            kindList:[],   //商品类型列表
            labelList:[],   //商品标签列表
            
            /* 商品参数-- */
            paramterData:[],
            
        }
    },
    destroyed(){
    
    },
    mounted() {
    },
    methods: {
        /* 轮播图片上传之后的钩子 */
        beforeUpload(info){
            console.log("轮播图片:",info);
            let str = "87414e07e41d512f5ff9a1b96bf0ae9e-w300.jpg";
        
            if (info.file.status === 'uploading') {  //上传开始
                this.loading = true;
                return;
            }
            if (info.file.status === 'done') {  //上传成功
                this.loading = false;
                console.log('成功')
            }
            if (info.file.status === 'error') {  //上传失败
                this.loading = false;
                console.log('失败');
                this.carousel.push(str);
            }
        },
        /* 轮播图操作(左右移动，删除) */
        aboutImg(type,index){
            switch (type) {
                case 'left':
                    if(type == 'left' && index == 0){
                        this.warningType("已经置左，无法左移");
                        break;
                    }
                    this.authority.swapArray(this.carousel,index,index-1);
                    break;
                case 'delete':
                    this.carousel.splice(index, 1);
                    break;
                case 'right':
                    if(type == 'right' && index+1 == this.carousel.length){
                        this.warningType("已经置右，无法右移");
                        break;
                    }
                    this.authority.swapArray(this.carousel,index,index+1);
                    break;
            }
        },
        
        /* 根据商品类型设置--规格和参数 */
        setParams(kind_id){
            // console.log('规格参数：',kind_id,this.kindList);
            for (let item of this.kindList){
                if(kind_id == item.kind_id){
                    /*  参数 */
                    this.paramterData = [];
                    if(item.params) {
                        for (let value of item.params) {
                            let list = {
                                type: value.type,
                                label: value.name,
                                param_id: value.param_id,
                                children: [],
                            };
                            
                            if(value.type == 1 || value.type == 2){
                                list.value = '';
                            } else {
                                list.value = [];
                            }
                            if (!value.contents) {
                                this.paramterData.push(list);
                                continue;
                            }
                            for (let values of value.contents) {
                                let str = {
                                    value: values.param_value_id,
                                    label: values.content
                                };
                                list.children.push(str);
                            }
                            this.paramterData.push(list);
                        }
                    }
                    
                    /* 规格 */
                    this.normsData = {};
                    if(item.specs){
                        for(let value of item.specs){
                            this.normsData[value.name] = [];
                            for (let values of value.contents) {
                                let str = {
                                    id: values.spec_value_id,
                                    parent_id: 'spec'+ value.spec_id,
                                    title: values.content,
                                    check:false
                                };
                                this.normsData[value.name].push(str);
                            }
                        }
                    }
                    break;
                }
            }
    
            //console.log('规格参数2：',JSON.stringify(this.paramterData),this.normsData);
        },
    
        /* 商品规格切换 */
        normsChange(e){
            this.isNorms = e.target.value == 2 ? true:false;
            if(this.isNorms){  //多规格
                if(this.manyNormsList.length > 0){
                    return false;
                }
                this.isNormsData = false;   //多规格列表-头部隐藏
            } else {  //单规格
                if(this.oneNormsList.length > 0){
                    return false;
                }
                this.oneNormsList.push(Menu.Columns7);
            }
        },
        /* 多规格-规格选中(isList是否生成列表默认生成) */
        checkChange(index,key,isList=true){
            let item = this.normsData[index][key];
            item.check = !item.check;
            //console.log("item:",JSON.stringify(item));
        
            let column = JSON.parse(JSON.stringify(this.columns1));
            if(item.check){
                /* 多规格列表--显示或隐藏 */
                this.isNormsData = true;   //多规格选中，规格列表显示
                this.normsDataList.push(item);
            
                /* 规格列表--头部 */
                let n = column.reduce((arr,item) => { if(item.title == index){ arr++; } return arr; }, 0);
                if(n == 0){
                    let str = {title: index,label:item.parent_id, need: false};
                    column.unshift(str);
                    this.normsList[item.parent_id] = item.parent_id;
                }
            
                /* 多规格-循环列表 */
                if(isList) {
                    let m = this.normsDataList.reduce((arr, value) => {
                        if (value.parent_id != item.parent_id) {
                            arr++;
                        }
                        return arr;
                    }, 0);
                    if (m > 0) {
                        let l = this.normsDataList.reduce((arr, value) => {
                            if (value.parent_id == item.parent_id) {
                                arr++;
                            }
                            return arr;
                        }, 0);
                        if (l == 1) {
                            for (let value of this.manyNormsList) {
                                value.spec_value_id.push(item.id);
                                value[item.parent_id] = item.title;
                            }
                            
                        } else {
                            /* 相同父元素的对象提取 */
                            let afterData = [];
                            let tempArr = [];
                            for (let value of this.normsDataList) {
                                if (tempArr.indexOf(value.parent_id) === -1) {
                                    afterData.push([value]);
                                    tempArr.push(value.parent_id);
                                } else {
                                    for (let value1 of afterData) {
                                        if (value1[0].parent_id == value.parent_id) {
                                            value1.push(value);
                                            break;
                                        }
                                    }
                                }
                            }
                            
                            /* 笛卡尔积 算法--交叉 */
                            let data = this.authority.calcDescartes(afterData);
    
                            for (let value of data) {
                                let str = JSON.parse(JSON.stringify(this.normsList));
                                let statu = false;
                                let spec_value_id = [];
                                for (let value1 of value) {
                                    if (value1.title == item.title) {
                                        statu = true;
                                    }
                                    spec_value_id.push(value1.id);
                                    str[value1.parent_id] = value1.title;
                                }
                                if (statu) {
                                    str.spec_value_id = spec_value_id;
                                    this.manyNormsList.push(str);
                                    statu = false;
                                }
                            }
                        }
                    } else {
                        let normsLists = {};
                        let spec_value_id = [];
                        for (let i in this.normsList) {
                            if (i == item.parent_id) {
                                spec_value_id.push(item.id);
                                normsLists[i] = item.title;
                                continue;
                            }
                            normsLists[i] = this.normsList[i];
                        }
                        normsLists.spec_value_id = spec_value_id;
                       
                        this.manyNormsList.push(normsLists);
                    }
                }
            } else {
                /* 多规格列表--显示或隐藏 */
                for (let i in this.normsDataList) {
                    if(this.normsDataList[i].id == item.id){
                        this.normsDataList.splice(i,1)
                    }
                }
                if(this.normsDataList.length == 0){
                    this.isNormsData = false;   //多规格取消，规格列表隐藏
                }
            
                /* 规格列表--头部 */
                let n = this.normsDataList.reduce((arr,value) => { if(value.parent_id == item.parent_id){ arr++; } return arr; }, 0);
                if(n == 0){
                    for (let i in column) {
                        if(column[i].title == index){
                            column.splice(i,1);
                        }
                    }
                    
                    delete this.normsList[item.parent_id];
                    if(!this.isNormsData){
                        this.manyNormsList = [];
                    } else {
                        for (let value of this.manyNormsList){
                            delete value[item.parent_id];
                            let index = value.spec_value_id.indexOf(item.id);
                            value.spec_value_id.splice(index,1);
                        }
                    }
                
                } else {
                    /* 多规格-循环列表--去除 */
                    let manyNormsList = [];
                    for (let value of this.manyNormsList){
                        if(value[item.parent_id] != item.title){
                            manyNormsList.push(value);
                        }
                    }
                    /* 规格列表--数据 */
                    this.manyNormsList = manyNormsList;
                }
            }
        
            /* 规格列表--头部 */
            this.columns1 = column;
        
           // console.log("column::",JSON.stringify(this.manyNormsList));
        },
        /* 删除多规格列表数据 */
        deleteManyNorms(index){
            this.manyNormsList.splice(index,1);
        },
    
        /* 规格图片-图片库打开 */
        handleChangeFocus(type,index){
            this.imageType = {
                status: 2,     //状态(1商品轮播图，2商品规格图片)
                type: 1,       //上传图片状态1单品，2批量
                specType: type,  //商品规格类型(1单规格2多规格)
                index: index,     //key键
                action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',     //图片上传接口
            };
            this.$store.state.model.editType = true;
        },
  
    
        /* 手机端描述--焦点选中 */
        textChange(index,item){
            //console.log('焦点选中',item);
            for (let value of this.phoneList){
                value.focus = false;
            }
            this.phoneFocus = '';
            this.phoneText = {};
            item.focus = !item.focus;
            if(item.focus){
                this.phoneFocus = index;
                this.phoneText = JSON.parse(JSON.stringify(item));
            }
        },
        /* 手机端描述--上下移动(type:top上移,bottom下移) */
        moveText(type,index){
            if(type == 'top'){  //上移
                let tempIndex = this.phoneList[index - 1];
                this.$set(this.phoneList, index - 1, this.phoneList[index]);
                this.$set(this.phoneList, index, tempIndex);
            
            } else if(type == 'bottom'){  //下移
                let tempIndex = this.phoneList[index + 1];
                this.$set(this.phoneList, index + 1, this.phoneList[index]);
                this.$set(this.phoneList, index, tempIndex);
            }
        },
        /* 手机端描述--删除 */
        deleteText(index){
            this.phoneList.splice(index,1);
        },
        /* 手机端描述--编辑文字(type:1编辑,2确认,3取消) */
        editText(type,item,index){
            item.status = type;
            if(type == 3){  //取消
                item.text = this.phoneText.text;
                item.status = 2;
            }
            if(!this.validate.leftRightBlank(item.text.toString())){
                this.deleteText(index);
            }
        },
        /* 手机端描述--添加文字 */
        addWriting(){
            //console.log('添加文字',this.phoneFocus);
            this.phoneText.text = '';
            let n = this.phoneFocus?this.phoneFocus + 1:this.phoneList.length;
            let str = {
                type: 1,
                status: 1,
                focus: false,
                text: '',
            };
            this.phoneList.splice(n,0,str);
        },
        
        /* 手机端描述-图片库打开 */
        imgChange(type){
            console.log("图片1上传或2替换:",type)
            this.imageType = {
                status: 3,     //状态(1商品轮播图，2商品规格图片，3手机端描述)
                type: 1,       //上传图片状态1单品，2批量
                phoneType: type,  //手机端描述类型(1上传或2替换)
                action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',     //图片上传接口
            };
            this.$store.state.model.editType = true;
        },
        
    },
    watch: {
    
    }
};
