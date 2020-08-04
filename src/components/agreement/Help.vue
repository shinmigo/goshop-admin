<template>
    <div class="main">
        帮助
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
                {value: "帮助", url: ""},
            ];
            this.$store.state.breadValue = '帮助';
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
