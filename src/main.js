// The Vue build version to load with the `import` command
import Vue from 'vue'
import App from './App'
import router from './router'      //路由
import store from "./store/index"  //vueX

/* 前端框架 */
import 'ant-design-vue/dist/antd.css';
import And from 'ant-design-vue'
Vue.use(And);

//公共函数
import authority from './common/authority'
Vue.prototype.authority = authority;
//正则验证
import validate from './common/validate'
Vue.prototype.validate = validate;

import '../static/css/main.css'    //自定义公共样式
import '../static/css/index.css'   //自定义修改样式
import "./common/directive"   //自定义全局指令
import './router/filter'      //路由拦截筛选

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
