<template>
    <div>
        <div class="chart-one">
            <div>总销售额</div>
            <div>
                访问量
                <ve-line :data="chartData" :settings="chartSettings" :extend="oneExtend" :legend-visible='false' width="100%" height="70px"></ve-line>
    
                <a-button @click="createImage">生成图片</a-button>
    
                <div ref="box"></div>
            </div>
            <div>
                支付笔数
                <ve-histogram :data="chartData" :extend="oneExtend" :legend-visible='false' width="100%" height="70px"></ve-histogram>
            </div>
            <div>
                识别成功率
            </div>
        </div>
    
        <div class="chart-two">
            柱状
            <ve-histogram :data="chartData" ref="chartTwo" width="100%" height="320px"></ve-histogram>
        </div>
    
        <div class="chart-three">
            <div>
                海浪
                <ve-line :data="chartData" ref="chartThree1" :settings="chartSettings" width="100%" height="320px"></ve-line>
            </div>
            <div>
                环状
               <vue-ring :data="chartData" ref="chartThree2" width="100%" height="320px"></vue-ring>
            </div>
        </div>
    
        <div class="chart-four">
            折线
            <ve-line :data="chartData" ref="chartFour" width="100%"></ve-line>
        </div>
        
    </div>
</template>

<script>
    import { Warning } from "../../common/mixin/Warning";
    import VeHistogram from 'v-charts/lib/histogram.common'   //柱状图
    import VeLine from 'v-charts/lib/line.common'    //折线图
    import VeRing from 'v-charts/lib/ring.common'    //环状图
    
    export default {
        mixins:[ Warning ],
        data () {
            return {
                chartData: {
                    columns: ['日期', '访问量'],
                    rows: [
                        { '日期': '1/1', '访问量': 1393 },
                        { '日期': '1/2', '访问量': 3530 },
                        { '日期': '1/3', '访问量': 2923 },
                        { '日期': '1/4', '访问量': 1723 },
                        { '日期': '1/5', '访问量': 3792 },
                        { '日期': '1/6', '访问量': 4593 }
                    ]
                },
                chartSettings: {
                    area: true,   //设置堆叠折线图
                },
                oneExtend:{
                    'xAxis.0.axisPointer.type': "none",//x轴移动的指示线
                    'xAxis.0.axisTick.show': false, //x轴刻度线
                    'xAxis.0.axisLabel.show': false,//x轴文本是否显示
                    'xAxis.0.axisLabel.color': 'red',//x轴文本颜色
    
                    'yAxis.0.axisTick.show': false,//x轴刻度线
                    'yAxis.0.splitLine.show': false,//x轴网格线是否显示
                    'yAxis.0.axisLabel.show': false,//y轴文本是否显示
                    'yAxis.0.axisLabel.color': "green",//y轴文本改变颜色
                },
            }
        },
        created () {
            /* 面包屑 */
            this.$store.state.breadList = [
                {value: "会员管理", url: ""},
                {value: "会员列表", url: "/home/index"},
            ];
            this.$store.state.breadValue = '会员列表';
    
        },
        mounted(){
            setTimeout(() => {
                this.$refs.chartTwo.resize();
                this.$refs.chartThree1.resize();
                this.$refs.chartThree2.resize();
                this.$refs.chartFour.resize();
            },20)
        },
        components:{
            "ve-histogram": VeHistogram,
            "ve-line": VeLine,
            "vue-ring": VeRing,
        },
        methods: {
            
    
            //打印页面
            doPrint(){
                this.createImage();
                this.$nextTick(()=>{
                    if(this.$refs.box.innerHTML){
                
                        let PrintContent = document.getElementById('print-content');
                        let newContent =PrintContent.innerHTML;
                        let oldContent = document.body.innerHTML;
                        document.body.innerHTML = newContent;
                        window.print();
                        window.location.reload();
                        document.body.innerHTML = oldContent;
                        return false;
                    }
                });
            },

            //chart图标导出图片
            createImage(){
                const canvas = document.getElementsByTagName('canvas')[0];
        
                const box = this.$refs.box;
        
                let image = canvas.toDataURL({
                    type:"png",
                    pixelRatio: 2,
                    backgroundColor: '#fff',//不设置此项，导出图片的底色是黑色
                });
        
                box.innerHTML = '<img src="'+image+'" alt="">';
            }
        
        },
        watch: {
        
        }
    }
</script>

<style scoped>
    .chart-one{
        margin-bottom: 26px;
        width: 100%;
        height: 190px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: 190px;
        column-gap: 26px;
    }
    .chart-one>div{
        background-color: #ffffff;
    }

    
    .chart-two{
        margin-bottom: 26px;
        width: 100%;
        height: 400px;
        background-color: #ffffff;
    }
    .chart-three{
        margin-bottom: 26px;
        width: 100%;
        height: 520px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 520px;
        column-gap: 26px;
    }
    .chart-three>div{
        background-color: #ffffff;
    }
    .chart-four {
        width: 100%;
        height: 560px;
        background-color: #ffffff;
    }
</style>
