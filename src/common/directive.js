import Vue from 'vue';
//定义文档的标题: <div v-title>编辑框</div>
const title = Vue.directive('title',{
    inserted: function (el) {
        document.title = el.innerText;
        el.remove();
    },
});
//焦点所在: <input type="text" v-focus="true" />
const focus = Vue.directive('focus',{
    inserted: function (el, {value}) {
        if (value) {
            el.focus();
        }
    }
});

//防止按钮多次点击--禁止点击(解除禁止点击事件在Warning方法中) ：<a-button v-banClick="" @click="submitForm($event)" ></a-button>
const click = Vue.directive('banClick',{
    inserted: function (el) {
        el.addEventListener('click', () => {
            el.style.pointerEvents = 'none';  //禁止点击事件
        });
    }
});

//权限判定
const judgeRight = Vue.directive('roleClick',{
    inserted(el, {value}) {
        if(value !== null && value !== ''){
            //获取权限列表
            let roleRight = JSON.parse(localStorage.getItem("AuthShowList") || '[]');
            /* 过滤匹配权限 */
            if(!roleRight.includes(value)){  //没有权限，隐藏按钮
                el.style.display = 'none';
            }
        }
    }
});


export { title,focus,click,judgeRight }
