<template>
    <div class="main">
        隐私
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
                {value: "帮助", url: ""},
                {value: "隐私", url: ""},
            ];
            this.$store.state.breadValue = '隐私';
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
