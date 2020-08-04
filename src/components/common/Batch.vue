<template>
    <div class="batch">
        <a-dropdown-button v-if="batchList.length>0">
            批量操作
            <a-menu slot="overlay" @click="onBatch">
                <a-menu-item v-for="(item,index) in batchList" :key="item.value">
                    <a-icon :type="item.icon" v-if="item.icon"/>{{ item.label }}
                </a-menu-item>
            </a-menu>
        </a-dropdown-button>
    </div>
</template>

<script>
    export default {
        props: ['batchList'],
        name: "Batch",
        methods:{
            onBatch({ key }){
                this.$emit('refresh',key);
            }
        }
    }
</script>

<style scoped>
    .batch{
        display: inline-block;
    }
</style>