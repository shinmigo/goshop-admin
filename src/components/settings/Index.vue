<template>
    <div class="main">
       商城设置
        
    </div>
</template>

<script>
    import { Warning } from "../../common/mixin/Warning";
    
    export default {
        mixins:[ Warning ],
        data () {
            return {
            
            }
        },
        created () {
            /* 面包屑 */
            this.$store.state.breadList = [
                {value: "商城设置", url: ""},
                {value: "基础设置", url: ""},
            ];
            this.$store.state.breadValue = '基础设置';
    
        },
        mounted(){
        
        },
        components:{
        
        },
        methods: {
        
        },
        watch: {
        
        }
    }
</script>

<style scoped>

</style>
