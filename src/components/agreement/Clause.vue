<template>
    <div class="main">
        条款
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
            console.log('123')
            /* 面包屑 */
            this.$store.state.breadValue = '条款';
            this.$store.state.breadList = [
                {value: "隐私", url: ""},
                {value: "条款", url: ""},
            ];
        },
        methods: {
        
        },
        watch: {
        
        }
    }
</script>

<style scoped>
   .main{
       padding: 24px;
   }
</style>
