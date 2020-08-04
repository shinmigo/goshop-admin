<template>
    <div class="main">
       插件管理
        
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
                {value: "插件管理", url: ""},
                {value: "插件列表", url: ""},
            ];
            this.$store.state.breadValue = '插件列表';
    
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
