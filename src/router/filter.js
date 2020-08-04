import Vue from 'vue'
import axios from "axios"     //vue ajax
Vue.prototype.$http = axios;  //vue ajax别名
import qs from "qs";          //vue ajax参数-JSON转换
Vue.prototype.$qs = qs;       //vue qs别名
import { notification  } from 'ant-design-vue';   //弹出提示框--组件

// 创建axios实例 axiso的一些基础参数配置,超时设置
axios.defaults.timeout =  180000;  //3分钟

import { LoginAPI } from "../config/api"
const configArray = [ LoginAPI ];
//请求拦截器
axios.interceptors.request.use(function (config) {
    /* header头无AccessToken */
    if (configArray.includes(config.url)) {
        console.log('登录');
        return config
    }
    //菜单权限判断...
    
    
    
    /* header头追加AccessToken */
    config.headers = {
        "goshop-token": localStorage.getItem("AccessToken"),
        ...config.headers
    };
    return config
}, function (error) {
    notification.error({
        message: '提示',
        duration: 2,
        description: "请求失败！"
    });
    return Promise.reject(error);
});


import { constant } from '../store/state'  //常量
//响应拦截器
let respCode = 0;
axios.interceptors.response.use(function (resp) {
    if (resp.data.code !== 1) {
        respCode++;
        //错误信息提示
        if (respCode == 1) {
            let text = resp.data.message?resp.data.message:"未获取到返回错误信息！";
            notification.error({
                message: '提示',
                duration: 3,
                description: text
            });
            setTimeout(function () {
                respCode = 0;
            },2080);
        }
    }
    return resp;
},function (error) {
    let status = error.toString().slice(-3).toString();  //返回状态
    let index = constant.httpStatus.indexOf(status);     //获取错误状态key
    let text = constant.httpText[index];            //错误提示
    console.log("status::",status,index,text);
    
    respCode++;
    // 对响应错误做点什么
    if(respCode == 1){
        notification.error({
            message: '提示',
            duration: 3,
            description: text
        });
        
        let condition = constant.condition;
        let host = window.location.host;
        setTimeout(function () {
            if(status === '401'){
                if(host == condition[0]){  //线上
                    location.href = '/';
                } else if(host == condition[1]){  //预上线preview
                    location.href = '/';
                } else if(host == condition[2]){  //测试test
                    location.href = '/';
                } else if(host == condition[3]){  //开发div
                    location.href = '/';
                } else {  //本地
                    location.href = '/';
                }
            }
            respCode = 0;
        },2080);
    }
    return Promise.reject(error);
});
