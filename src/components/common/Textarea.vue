<template>
    <div class="textarea extent">
        <a-textarea v-model="ruleForm.text" :maxLength="ruleForm.total" placeholder="请输入商品简介" :class="{ borderRed:ruleForm.isEmpty }" :disabled="ruleForm.disabled" :auto-size="{ minRows: 3, maxRows: 5 }"/>
        <span :class="{ isDisabled: ruleForm.disabled }">{{ ruleForm.limitInput }}/{{ ruleForm.total }}</span>
    </div>
</template>

<script>
    export default {
        props: ['ruleForm'],
        name: "Textarea",
        data() {
            return {}
        },
        methods: {
      
        },
        watch:{
            "ruleForm.text":{
                handler(news,old){
                    this.ruleForm.limitInput = this.validate.leftRightBlank(news).length;
                    this.ruleForm.isEmpty = true;
                    if(this.ruleForm.limitInput > 0){
                        this.ruleForm.isEmpty = false;
                    }
                }
            },
        }
    }
</script>

<style scoped>
    .isDisabled{
        background-color: #f5f5f5;
    }
    .borderRed{
        border-color: red;
    }
    .borderRed:focus{
        box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.2);
    }
</style>