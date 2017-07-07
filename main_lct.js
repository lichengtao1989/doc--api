// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    /*
    jQuery支持的是AMD规范
    seajs推荐将jquery进行cmd包装。
    包装方法：
    define(function() {
    //jquery源码
    return $.noConflict();
    });
    */

    // 通过 require 引入依赖
    var $ = require('jquery');
    var vue = require('vue');
 

    $('#div1').text('$$');

    var demo = new Vue({
        el: '#div2',
        data: {
            message: 'Hello Vue.js!'
        }
    });


    require.async(['say'], function(say) {
    	console.log(say.foo)
    	say.doSomething('lct11')
    
    });
 

   

});
