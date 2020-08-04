//table list
import Menu from '../../config/menu'
export const Goods = {
    data() {
        return {
            /* 下拉--搜索 */
            filterOption(input, option) {
                return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0);
            },
    
            /* 轮播图片列表 */
            carousel:["d00cd077d140ac46152519692c59dd9e-w300.jpg","9a03f957e0fa253ee2a632fa95c02fff-w300.jpg",'32bedb45662130484792a66d355e7ad9-w300.jpg'],
    
            /* 规格 */
            columns: Menu.Columns6,  //table 头部--单规格
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
    
            kindList:[],   //商品类型列表
            labelList:[],   //商品标签列表
            
            /* 商品参数-- */
            paramterData:[],
        }
    },
    methods: {
        /* 根据商品类型设置--type1规格和2参数 */
        setParams(type,list){
            if(type == 1){  //规格
                this.normsData = {};
                let data = [];
                for(let value of list){
                    let children = [];
                    for (let values in value.children){
                        let str = {
                            id: value.children[values].spec_value_id,
                            parent_id: 'spec' + value.children[values].spec_id,
                            title: value.children[values].content,
                            check: false
                        };
                        data.push(str);
                        children.push(str);
                    }
                    this.normsData[value.name] = children;
                }
                return data;
            } else if(type == 2){  //参数
                this.paramterData = {};
                for (let value of list){
                    let children = [];
                    for (let values in value.children){
                        children.push(value.children[values].content);
                    }
                    this.paramterData[value.name] = children.join('&nbsp;&nbsp;&nbsp;&nbsp;');
                }
            }
        },
    
        /* 多规格-规格选中 */
        checkChange(index,key){
            let item = this.normsData[index][key];
            item.check = !item.check;
            
            let column = JSON.parse(JSON.stringify(this.columns));
        
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
            
            /* 规格列表--头部 */
            this.columns = column;
        },
    },
};
