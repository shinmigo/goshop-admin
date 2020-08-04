const validate = {
    //判断手机号码
    isPhone(name) {
        let status = false;
        let reg = new RegExp("^1[3|4|5|6|7|8|9][0-9]{9}$");
        if(reg.test(name))
        {
            status = true;
        }
        return status;
    },
    //判断邮箱
    isEMaill(name){
        let status = false;
        let reg = new RegExp("^[a-z1-9][a-z0-9._\\-]{2,18}@([a-zA-Z0-9]{2,15}.){1,3}[a-z]{2,10}$");
        if(reg.test(name))
        {
            status = true;
        }
        return status;
    },
    //判断Url
    isUrl(name){
        let status = false;
        let reg = new RegExp("^(https|http|ftp)://[A-Za-z]{1,10}.[A-Za-z0-9]+.[a-z]{2,8}$");
        
        if(reg.test(name))
        {
            status = true;
        }
        return status;
    },
    /**
     * 判断 大写字母|小写字母
     * @param name 参数
     * @param start 开始
     * @param end 结束
     * @returns {boolean}
     */
    isStringA(name,start,end){
        let status = false;
        let reg = new RegExp("^[a-zA-Z]{"+ start +","+ end +"}$");
        if(reg.test(name)){
            status = true;
        }
        return status;
    },
    /**
     * 判断 大写字母|小写字母|数字，字母开头
     * @param name 参数
     * @param start 开始
     * @param end 结束
     * @returns {boolean}
     */
    isStringB(name,start,end){
        let status = false;
        let reg = new RegExp("^[a-zA-Z][a-zA-Z0-9]{"+ start +","+ end +"}$");
        if(reg.test(name)){
            status = true;
        }
        return status;
    },
    /**
     * 判断 大写字母|小写字母|汉字
     * @param name 参数
     * @param start 开始
     * @param end 结束
     * @returns {boolean}
     */
    isStringC(name,start,end){
        let status = false;
        let reg = new RegExp("^[\u4E00-\u9FA5A-Za-z]{"+ start +","+ end +"}$");
        if(reg.test(name)){
            status = true;
        }
        return status;
    },
    /**
     * 判断 大写字母|小写字母|横线|下划线|斜杠
     * @param name 参数
     * @param start 开始
     * @param end 结束
     * @returns {boolean}
     */
    isStringD(name,start,end){
        let status = false;
        var reg = new RegExp("^[a-zA-Z0-9\\-\\_\\/]{"+ start +","+ end +"}$");
        if(reg.test(name)){
            status = true;
        }
        return status;
    },
    /**
     * 判断 大写字母|小写字母|下划线|横线 + 斜杠 + 大写字母|小写字母|下划线|横线
     * @param name 参数
     * @param start 开始
     * @param end 结束
     * @returns {boolean}
     */
    isStringE(name,start,end){
        let status = false;
        var reg = new RegExp("^([a-zA-Z0-9\\-\\_]+/[a-zA-Z0-9\\-\\_]+){"+ start +","+ end +"}$");
        if(reg.test(name)){
            status = true;
        }
        return status;
    },
    /**
     * 判断 大写字母|小写字母|汉字|空格
     * @param name 参数
     * @param start 开始
     * @param end 结束
     * @returns {boolean}
     */
    isStringF(name,start,end){
        let status = false;
        let reg = new RegExp("^[\u4E00-\u9FA5A-Za-z\s]{"+ start +","+ end +"}$");
        if(reg.test(name)){
            status = true;
        }
        return status;
    },
    /**
     * 判断 大写字母|小写字母|汉字|字符|空格
     * @param name 参数
     * @param start 开始
     * @param end 结束
     * @returns {boolean}
     */
    isStringG(name,start,end){
        let status = false;
        let reg = new RegExp("^[\u4E00-\u9FA5A-Za-z，,。、!！*\.\\-\_\s]{"+ start +","+ end +"}$");
        if(reg.test(name)){
            status = true;
        }
        return status;
    },
    
    /**
     * 判断 大写字母+小写字母+数字+特殊字符串
     * @param name 参数
     * @param start 开始
     * @param end 结束
     * @returns {boolean}
     */
    isStringAllA(name,start,end){
        let status = false;
        let reg = new RegExp("(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{"+ start +","+ end +"}");
        if(reg.test(name)){
            status = true;
        }
        return status;
    },
    /**
     * 判断 大小写字母|数字|下划线|横线，字母开头
     * @param name 参数
     * @param start 开始
     * @param end 结束
     * @returns {boolean}
     */
    isStringH(name,start,end){
        let status = false;
        let reg = new RegExp("^[a-zA-Z][a-zA-Z0-9\\-\_]{"+ start +","+ end +"}$");
        if(reg.test(name)){
            status = true;
        }
        return status;
    },
    /**
     * 判断 数字
     * @param name 参数
     * @param start 开始
     * @param end 结束
     * @returns {boolean}
     */
    isStringI(name,start,end){
        let status = false;
        let reg = new RegExp("^[0-9]{"+ start +","+ end +"}$");
        if(reg.test(name)){
            status = true;
        }
        return status;
    },
    
    //判断字符串非空
    isBlank(name){
        console.log(name);
        if (name !== null && name !== undefined && name !== '') {
            return true;
        }
        return false;
    },
    //去除字符串所有空格
    allBlank(name){
        return name.replace(/\s+/g,"");
    },
    //去除换行
    allLine(name){
        return name.replace(/[\r\n]/g,"");
    },
    //去除字符串两头空格
    leftRightBlank(name){
        return name.replace(/^\s+|\s+$/g,"");
    },
    //去除字符串左空格
    leftBlank(name){
        return name.replace( /^\s*/, '');
    },
    //去除字符串右空格
    rightBlank(name){
        return name.replace( /^\s*/, '');
    }
};

export default validate;