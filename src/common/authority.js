class authority {
    //判断用户的token是否有效
    static isValidToken() {
        let status = false;
        let expires = localStorage.getItem("Expires");
        if (!expires) {
            return status;
        }
        let accessToken = localStorage.getItem("AccessToken");
        if (!accessToken) {
            return status;
        }
        let milliSeconds = new Date().getTime();
        if (milliSeconds > expires) {
            return status;
        }
        //Token有效时间设置
        let time = milliSeconds + 3600 * 1000 * 8;
        localStorage.setItem("Expires", time);
        
        return true;
    }
    /**
     * 清除缓存
     */
    static cleanAuthList() {
        localStorage.clear();
    }
    /**
     * 没有权限 退出登录
     * @param host
     * @param condition
     */
    static judgeMenu(host,condition){
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
    /**
     * 数组元素交换位置
     * @param {array} arr 数组
     * @param {number} index1 添加项目的位置
     * @param {number} index2 删除项目的位置
     * index1和index2分别是两个数组的索引值，即是两个要交换元素位置的索引值，如1，5就是数组中下标为1和5的两个元素交换位置
     */
    static swapArray(arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
    }
    /**
     * 数据去重
     * @param arr 数组
     * @param name 重复去除id
     * @returns {*}
     */
    static noRepeat(arr, name) {
        let hash = {};
        return arr.reduce(function (item, next) {
            hash[next[name]] ? '' : hash[next[name]] = true && item.push(next);
            return item;
        }, []);
    }
    /**
     * 笛卡尔积 算法
     * @param array
     * @returns {*|Array|*|(function(*, *): Array)}
     */
    static calcDescartes (array) {
        if (array.length < 2) return array[0] || [];
        return [].reduce.call(array, function (col, set) {
            let res = [];
            col.forEach(function (c) {
                set.forEach(function (s) {
                    let t = [].concat(Array.isArray(c) ? c : [c]);
                    t.push(s);
                    res.push(t);
                })
            });
            return res;
        });
    }
    /**
     * 数组对象排序
     * @param array 数组
     * @param key 要参与排序的参数
     * @param type 类型(1:从小到大，!1:从大到小)
     * @returns {*}
     */
    static sortKey(array, key,type=1) {
        return array.sort(function (a, b) {
            let x = Number(a[key]);
            let y = Number(b[key]);
            if(type == 1){
                return ((x < y) ? -1 : (x > y) ? 1 : 0)
            } else {
                return ((x > y) ? -1 : (x < y) ? 1 : 0)
            }
        });
    }
    /**
     * 分类数组递归
     * @param array 数组[{value: "567",label: "测试w",parent_id:'0'}]
     * @param type
     * @param total
     * @param i
     * @returns {*}
     */
    static recursion(array, type='children', total = [], i = 0){
        let men = [];
        if (i == 0) {
            for (let item of array) {
                if (item.parent_id == '0') {
                    item.type = 1;
                    men.push(item);
                }
            }
            array = this.sortKey(array,'sort');
        } else {
            for (let item of total) {
                let ment = [];
                for (let index in array) {
                    if (item.value == array[index].parent_id) {
                        ment.push(array[index]);
                        men.push(array[index]);
                    }
                }
                ment = this.sortKey(ment,'sort');
                if (ment.length > 0) {
                    item[type] = ment;
                }
            }
        }
        if (i != 0 && total.length == 0) {
            return array;
        }
        i++;
        return this.recursion(array, type, men, i);
    }
    
    /**
     * 权限列表递归
     * @param array
     * @param type
     * @param total
     * @param i
     * @returns {*}
     */
    static dataList(array, type='children', total = [], i = 0){
        let men = [];
        if (i == 0) {
            for (let item of array) {
                if (item.parent_id == '0') {
                    item.types = 1;
                    men.push(item);
                }
            }
        } else {
            for (let item of total) {
                let ment = [];
                let n = 1;
                for (let index in array) {
                    if (item.value == array[index].parent_id) {
                        ment.push(array[index]);
                        men.push(array[index]);
                        n = array[index].type;
                    }
                }
                if (ment.length > 0) {
                    if(n == 2){
                        item.rights = ment;
                    } else {
                        item[type] = ment;
                    }
                }
            }
        }
        if (i != 0 && total.length == 0) {
            return array;
        }
        i++;
        return this.dataList(array, type, men, i);
    }
    
    /**
     * 格式化时间
     * @param fmt（yyyy-MM-dd hh:mm:ss）
     * @param date 日期
     * @returns {*}
     */
    static dateFtt(fmt, date) {
        let time = {
            "M+": date.getMonth() + 1,                 //月份
            "d+": date.getDate(),                    //日
            "h+": date.getHours(),                   //小时
            "m+": date.getMinutes(),                 //分
            "s+": date.getSeconds(),                 //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (let key in time) {
            if (new RegExp("(" + key + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (time[key]) : (("00" + time[key]).substr(("" + time[key]).length)));
            }
        }
        return fmt;
    }
};

export default authority;
