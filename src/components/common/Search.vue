<template>
    <div class="search" :class="{ 'search-show': isDown }">
        <div class="search-input" >
            <div class="text-row" v-for="(item,index) in ruleForm.list" :key="index">
                <label>{{ item.label }}：</label>
                <a-input v-model="ruleForm.value[item.value]" v-if="item.type == 1" :placeholder="item.title" ></a-input>
                <a-select v-model="ruleForm.value[item.value]" v-else-if="item.type == 2" >
                    <a-select-option v-for="(value,key) in menuUp" :key="key" :value="value.value">
                        {{ value.label }}
                    </a-select-option>
                </a-select>
                <!-- 商品分类 -->
                <a-cascader :options="classifyList" v-model="ruleForm.value[item.value]" v-else-if="item.type == 3" />
                <!-- 会员状态(空全部,1启用,2禁用) -->
                <a-select v-model="ruleForm.value[item.value]" v-else-if="item.type == 4">
                    <a-select-option v-for="(value,key) in menuUp1" :key="key" :value="value.value">
                        {{ value.label }}
                    </a-select-option>
                </a-select>
                <!-- 日期 -->
                <a-range-picker v-model="ruleForm.value[item.value]" format="YYYY-MM-DD HH:mm:ss" v-else-if="item.type == 5" @change="onChange" />
                <!-- 广告位 -->
                <a-select v-model="ruleForm.value[item.value]" v-else-if="item.type == 6" >
                    <a-select-option v-for="(value,key) in menuUp2" :key="key" :value="value.value">
                        {{ value.label }}
                    </a-select-option>
                </a-select>
            </div>
        </div>
        <div class="search-button text-right padding-right-sm">
            <a-button type="primary" @click="search">查&nbsp;询</a-button>
            <a-button class="margin-left-xs" @click="resetting">重&nbsp;置</a-button>
            <span class="margin-left-df cursor text-blue ">
                <span @click="isDown = !isDown">{{ isDown ? '展开' : '收起' }}&nbsp;&nbsp;&nbsp;<a-icon type="down"></a-icon></span>
            </span>
        </div>
    </div>
</template>

<script>
    import Menu from '../../config/menu'
    import { mapState } from 'vuex'
    
    export default {
        props: ['ruleForm'],
        name: "Search",
        data() {
            return {
                isDown: false,
                menuUp: Menu.menuUp1,  //上下架(空全部,1上架,2下架)
                menuUp1: Menu.menuUp2,  //启用禁用(空全部,1启用,2禁用)
                menuUp2: Menu.menuUp3,  //广告位类型(空全部,1banner,2广告位)
            }
        },
        computed: {
            ...mapState({
                classifyList: 'classifyList',
            })
        },
        methods: {
            onChange(date, dateString){
                console.log(date,dateString);
                //this.ruleForm.value.time = dateString;
            },
            /* 查询 */
            search(){
                this.$emit('refresh');
            },
            /* 重置 */
            resetting(){
                console.log('11111')
                for(let item of this.ruleForm.list){
                    console.log(item);
                    switch (item.type.toString()) {
                        case "1":  //输入框
                            this.ruleForm.value[item.value] = '';
                            break;
                        case "2":
                            this.ruleForm.value[item.value] = '';
                            break;
                        case "3":
                            this.ruleForm.value[item.value] = [];
                            break;
                        case "4":
                            this.ruleForm.value[item.value] = '';
                            break;
                    }
                }
            },
        }
    }
</script>

<style scoped>
    .search {
        width: 100%;
        display: grid;
        grid-template-columns: auto 230px;
        column-gap: 40px;
    }
    .search-show{
        height: 33px;
        overflow: hidden;
    }
    /* 输入--文本 */
    .search .search-input{
        width: 100%;
        min-height: 33px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 320px));
        gap: 20px 10px;
    }
    .search .search-input .text-row{
        width: 100%;
        display: grid;
        line-height: 2.4;
        grid-template-columns: 100px auto;
        column-gap: 6px;
    }
    .search .search-input .text-row label{
        text-align: right;
    }
    /* 搜索-按钮 */
    .search .search-button{
        width: 100%;
    }
</style>
