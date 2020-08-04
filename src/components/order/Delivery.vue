<template>
    <a-modal class="model" title="订单发货" width="420px" :visible="this.$store.state.model.editType" @cancel="ruleCancel" centered >
        <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol" @keyup.enter.native="submitForm()">
            <a-form-item label="物流公司" has-feedback >
                <a-select v-decorator="['carrier_type',{ rules:rules.carrier_type }]">
                    <a-select-option v-for="(value,key) in carrierList" :key="key" :value="value.value">
                        {{ value.label }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="物流运单号" has-feedback >
                <a-input v-decorator="['carrier_id',{ rules:rules.carrier_id }]" placeholder="请输入物流运单号"/>
            </a-form-item>
            
            <a-form-item :wrapper-col="{ span: 16, offset: 6 }" class="text-left bg-loading">
                <a-button type="primary" @click.prevent="submitForm()" class="margin-right-df">马上确认</a-button>
                <a-button @click.prevent="ruleCancel()">取消</a-button>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
    import { CarrierListAPI } from '../../config/api'
    export default {
        name: "Delivery",
        data () {
            return {
                form: this.$form.createForm(this, { name: 'edit' }),
                rules:{
                    carrier_type:[{required: true,whitespace: true, message: '请选择配送方式!' }],
                    carrier_id:[{required: true,whitespace: true, message: '请输入物料单号!' }],
                },
                labelCol: {
                    span: 6
                },
                wrapperCol: {
                    span: 16
                },
                carrierList:[],  //配送列表
                //订单发货参数
                ruleForm:{
                    carrier_id: '',
                    carrier_type: '',
                },
            }
        },
        methods: {
            /* 提交 */
            submitForm(){
                this.form.validateFields((err, values) => {
                    if (!err) {
                        this.$emit('refresh', values);
                        this.ruleCancel();
                    }
                });
            },
            //物流公司列表
            loadData() {
                let params = {
                    page_size: 999,
                    page: 1,
                };
                this.$http.get(CarrierListAPI,{ params }).then(resp => {
                    if (resp.data.code == 1) {
                        let list = Object.keys(resp.data.data).length > 0 ? resp.data.data:'';
                        if(!list){
                            this.carrierList = [];
                            return false;
                        }
                        let carriers = [];
                        for (let item of list.carriers){
                            let str = {
                                value: item.carrier_id.toString(),
                                label: item.name,
                            };
                            carriers.push(str);
                        }
                        this.carrierList = carriers;
                    }
                });
            },
            //取消
            ruleCancel(){
                this.$store.state.loading = false;
                this.$store.state.model.editType = false;
                this.form.resetFields();
            }
        }
    }
</script>

<style scoped>

</style>