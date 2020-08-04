<template>
    <a-modal class="model hint" :title="styleType.type == 1 ?'删除':'警告'" :width="styleType.width" :visible="this.$store.state.model.hint" @cancel="ruleCancel" centered >
        <div v-if="styleType.types === '1'">
            <div class="layer-text" v-html="styleType.text"></div>
        </div>
        
        <div class="text-center bg-loading">
            <a-button type="primary" @click.prevent="submitForm()" class="margin-right-df text-letter">{{"确认"+styleType.button }}</a-button>
            <a-button @click.prevent="ruleCancel()">取消</a-button>
        </div>
    </a-modal>
</template>

<script>
    export default {
        props: ['styleType'],
        name: "Hint",
        methods: {
            submitForm() {
                this.$emit('refresh');
                this.ruleCancel();
            },
            //取消
            ruleCancel(){
                this.$store.state.model.hint = false;
            }
        }
    }
</script>

<style scoped>
    .layer-text{
        margin: 6px auto 30px;
        width: 86%;
        font-size: 14px;
        line-height: 22px;
        color: #696969;
        text-align: left;
    }
</style>