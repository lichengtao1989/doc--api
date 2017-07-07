(function(win,doc,$){

	if (!Array.prototype.indexOf){  
        Array.prototype.indexOf = function(elt /*, from*/){  
        var len = this.length >>> 0;  
        var from = Number(arguments[1]) || 0;  
        from = (from < 0)  
             ? Math.ceil(from)  
             : Math.floor(from);  
        if (from < 0)  
          from += len;  
        for (; from < len; from++)  
        {  
          if (from in this &&  
              this[from] === elt)  
            return from;  
        }  
        return -1;  
      };  
    }  

var QCCR = {
    flag: {
        //邮箱
        email: /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/,
        //手机号
        phone: /^(0|86|17951)?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])([0-9]{8}|\*{4}[0-9]{4})$/,
        //座机
        telphone: /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/g,
        //整数
        int: /^\d*$/g,
        //小数
        float: /^\d+\.\d+$/g,
        //正式或者小数
        number: /^(\d+)?(\.\d+)?$/g
    },
    escapeQuery : function(str) { //参数处理
        if(!str){
            return "";
        }
        var _isObj = false;
        if ( typeof str != "string" ) {
            try{
                str = JSON.stringify(str);
                _isObj = true;
            }catch(e){
            }
        }
        var obj = {
            '<': '&lt;',
            '>': '&gt;'
        };
        str = str.replace( /(\<|\>)/ig, function ( s, t ) {
            return obj[ t ];
        });
        if(_isObj){
            try{
                str = JSON.parse(str);
            }catch(e){
            }
        }
        return str;
    },
    getQueryString : function (url) { //链接参数获取
        var _me = this;
        if (url) {
            url = url.substr(url.indexOf("?") + 1);
        }
        var result = {}, queryString = url || location.search.substring(1),
        re = /([^&=]+)=([^&]*)/g, m;

        while (m = re.exec(queryString)) {
            result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
        if(!_me.isEmptyObject(result)){
            for (var prop in result) {
                if (result.hasOwnProperty(prop)) {
                    result[prop] = _me.escapeQuery(result[prop]);
                }
            }
        }
        return result;
    },
    dateFormat: function(timestep, fmt) { //日期格式化
            timestep = timestep || '';
            fmt = fmt || 'yyyy-MM-dd hh:mm:ss';
            var date = new Date(timestep)
            var o = {
                "M+": date.getMonth() + 1, //月份 
                "d+": date.getDate(), //日 
                "h+": date.getHours(), //小时 
                "m+": date.getMinutes(), //分 
                "s+": date.getSeconds(), //秒 
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
                "S": date.getMilliseconds() //毫秒 
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
    },
    setInit: function(fn) {
        if(this.isString(fn)){
            this.initFn.push(fn);
        }else if(this.isArray(fn)){
            for (var i = 0; i < fn.length; i++) {
                this.initFn.push(fn[i])
            };
        }
    },
    divDrag : function(obj) {//div拖动
        var oDiv = obj.box,
            oBtn = obj.btn,
            disX = 0,
            disY = 0,
            doc = document;
        oBtn.onmouseenter = function() {
            this.style.cursor = "move";
        };
        oBtn.onmouseleave = function() {
            this.style.cursor = "default";
        };
        oBtn.onmousedown = function(ev) {
            var oEvent = ev || event;
            disX = oEvent.clientX - oDiv.offsetLeft;
            disY = oEvent.clientY - oDiv.offsetTop;
            doc.onmousemove = function(ev) {
                var oEvent = ev || event;
                var oLeft = oEvent.clientX - disX;
                var oTop = oEvent.clientY - disY;
                if (oLeft < 0) {
                    oLeft = 0;
                } else if (oLeft > doc.documentElement.clientWidth - oDiv.offsetWidth) {
                    oLeft = doc.documentElement.clientWidth - oDiv.offsetWidth;
                }
                if (oTop < 0) {
                    oTop = 0;
                } else if (oTop > doc.documentElement.clientHeight - oDiv.offsetHeight) {
                    oTop = doc.documentElement.clientHeight - oDiv.offsetHeight;
                }
                oDiv.style.left = oLeft + "px";
                oDiv.style.top = oTop + "px";
            };
            doc.onmouseup = function() {
                doc.onmousemove = null;
                doc.onmouseup = null;
            };
            return false;
        };
    },
    initFn: [], //初始化项目列表
    winSize: function() { //返回可视窗口的宽高
        var result = {};
        result.width = win.innerWidth;
        result.height = win.innerHeight;
        if (typeof result.width != 'number') {
            if (doc.compatMode == 'CSS1Compat') {
                result.width = doc.documentElement.clientWidth;
                result.height = doc.documentElement.clientHeight;
            } else {
                result.width = doc.body.clientWidth;
                result.height = doc.body.clientHeight;
            }
        }
        return result;
    },
    isFunction: function(fn) { //检测是否为函数
        return fn && fn.constructor === Function ? !0 : !1;
    },
    isArray: function(arr) { //检测是否为数组
        return arr && arr.constructor == Array ? !0 : !1;
    },
    isNumber: function(number) { //检测是否为数字
        return number && number.constructor == Number ? !0 : !1;
    },
    isString: function(string) { //检测是否为字符串
        if(typeof string == "undefined"){return !1;}
        return typeof string != "undefined" && string.constructor == String ? !0 : !1;
    },
    isEmptyObject: function(obj) { //检测是否为空对象
        if(typeof obj == "undefined"){return !1;}
        var name;
        for (name in obj) return !1;
        return !0;
    },
    isEmptyVal: function(value) { //是否为空值
        return (typeof value == "string" && "" == this.trim(value)) | typeof value != "undefined" ? !0 : !1;
    },
    isChinese: function(name) { //检测是否是中文
        if(!name){return !1}
        for (i = 0; i < name.length; i++)
            if (name.charCodeAt(i) > 128) return !0;
        return !1;
    },
    isEmail: function(value) { //检测是否为邮箱
        return value && this.flag.email.test(value) ? !0 : !1;
    },
    isPhone: function(value) { //检测是否为手机号码
        return value && this.flag.phone.test(value) ? !0 : !1;
    },
    isTel: function(value) { //检测座机号
        return value && this.flag.telphone.test(value) ? !0 : !1;
    },
    parseJSON: function(str) { //将字符串的json转换为obj
        return str = str || {}, str.constructor !== String ? str : new Function("return " + str)();
    },
    extend: function() { //方法扩展
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            _this = this,
            deep = false;
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            i = 2;
        }
        if (typeof target !== "object" && !_this.isFunction(target)) {
            target = {};
        }
        if (length === i) {
            target = this;
            --i;
        }
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    if (deep && copy && (_this.isPlainObject(copy) || (copyIsArray = _this.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && _this.isArray(src) ? src : [];
                        } else {
                            clone = src && _this.isPlainObject(src) ? src : {};
                        }
                        target[name] = _this.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    },
    isPlainObject: function(obj) {
        if (!obj || this.type(obj) !== "object" || obj.nodeType || this.isWindow(obj)) {
            return false;
        }
        try {
            if (obj.constructor && !core_hasOwn.call(obj, "constructor") && !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            return false;
        }
        var key;
        for (key in obj) {}
        return key === undefined || core_hasOwn.call(obj, key);
    },
    readyEvent: function(fn) { //防止覆盖window.onlaod事件
        if (fn == null) {
            fn = doc;
        }
        var oldonload = win.onload;
        if (typeof win.onload != "function") {
            win.onload = fn;
        } else {
            win.onload = function() {
                oldonload();
                fn();
            };
        }
        return this;
    },
    unbindEvent: function(el, eventName, eventHandler, capture) { //事件绑定
        capture = capture === true ? capture : false;
        if (el.removeEventListener) {
            el.removeEventListener(eventName, eventHandler, capture);
        } else if (el.detachEvent) {
            el.detachEvent("on" + eventName, eventHandler);
        } else {
            el["on" + eventName] = null;
        }
        return this;
    },
    bindEvent: function(el, eventName, eventHandler, capture) { //解除事件绑定
        capture = capture === true ? capture : false;
        if (el.addEventListener) {
            el.addEventListener(eventName, eventHandler, capture);
        } else if (el.attachEvent) {
            el.attachEvent("on" + eventName, eventHandler);
        } else {
            el["on" + eventName] = eventHandler;
        }
        return this;
    },
    preventDefault: function(evt) { //阻止默认事件
        if (evt.preventDefault) {
            evt.preventDefault();
        } else {
            evt.returnValue = false;
        }
        return this;
    },
    stopPropagation: function(evt) { //阻止冒泡
        if (evt.stopPropagation) {
            evt.stopPropagation();
        } else {
            evt.cancelBubble = true;
        }
        return this;
    },
    index: function(current) { //获取索引
        for (var i = 0, length = this.length; i < length; i++) {
            if (this[i] == current) {
                return i;
            }
        }
    },
    objCount: function(a) { //获取对象的属性和方法数量
        var c, b = 0;
        for (c in a) a.hasOwnProperty(c) && b++;
        return b;
    },
    browser: function() { //获取浏览器类型及版本号
        var c, d, e, a = {},
            b = navigator.userAgent.toLowerCase();
        (c = b.match(/msie ([\d.]+)/)) ? a.ie = c[1]: (c = b.match(/firefox\/([\d.]+)/)) ? a.firefox = c[1] : (c = b.match(/chrome\/([\d.]+)/)) ? a.chrome = c[1] : (c = b.match(/opera.([\d.]+)/)) ? a.opera = c[1] : (c = b.match(/version\/([\d.]+).*safari/)) ? a.safari = c[1] : 0;
        for (e in a) d = {
            browser: e,
            version: a[e]
        };
        return d;
    },
    isIE: function() { //判断是否为ie
        var b = this.browser();
        return b.browser === 'ie' ? true : false;
    },
    isIE6: function() { //判断是否为ie6
        var b = this.browser();
        return b.browser === 'ie' && b.version === '6.0' ? true : false;
    },
    isIE7: function() { //判断是否为ie6
        var b = this.browser();
        return b.browser === 'ie' && b.version === '7.0' ? true : false;
    },
    isIE8: function() { //判断是否为ie6
        var b = this.browser();
        return b.browser === 'ie' && b.version === '8.0' ? true : false;
    },
    isIE9: function() { //判断是否为ie6
        var b = this.browser();
        return b.browser === 'ie' && b.version === '9.0' ? true : false;
    },
    round: function(value1, value2) {
        if (value1 < value2) {
            return -1;
        } else if (value1 > value2) {
            return 1;
        } else {
            return 0;
        }
    },
    sort: function(arr, re) { //数组排序默认从大到小 传递false倒序
        if (!this.isArray(arr)) {
            return;
        }
        var nweArr = arr.sort(this.rnums);
        re = typeof re != 'undefined' && re === false ? false : true;
        if (re === true) {
            return nweArr;
        } else {
            return nweArr.reverse(nweArr);
        }
    },
    thousands: function(str) { //给数字加上千分位逗号
        var reg = /(?=(?!\b)(\d{3})+$)/g;
        str = this.isNumber(str) ? new String(str) : str;
        return str = str.replace(reg, ",");
    },
    roundNum: function(start, end) { //返回随机数
        var total = end - start + 1;
        return Math.floor(Math.random() * total + start);
    },
    indexOf: function(arr, elem) { //检测元素是否存在
        var i = 0,
            len = arr.length;
        for (; i < len; i++) {
            if (arr[i] === elem) {
                return i;
            }
        }
        return -1;
    },
    trim: function(value) { //去除所有空格
        return value = value.replace(/\s/g, "");
    },
    leftTrim: function(value) { //去除左边空格
        return value = value.replace(/(^[\\s]*)/g, "");
    },
    rightTrim: function(value) { //去除右边空格
        return value = value.replace(/([\\s]*$)/g, "");
    },
    lrTrim: function(value) { //去除左右空格
        return value = value.replace(/(^\s*)|(\s*$)/g, "");
    },
    ChineseLength: function(string) { //返回字符串的长度
        return string.replace(/[^\x00-\xff]/g, "**").length;
    },
    log: function(result) { //控制台打印结果
        try {
            console.log(result)
        } catch (e) {
            alert(result);
        }
        return this;
    },
    tchange: function(element, fn) { //文本框改变监听
        if (!element) {
            return false;
        }
        if ("\v" == "v") {
            element.onpropertychange = fn;
        } else {
            element.addEventListener("input", fn, false);
        }
        return this;
    }
}


	function Dialog(options){
	options = options || {};
	var detaults = {
			width : "",
			height : "",
			isOkhide : true,
			isClosefn : true,
			isdrag : true,
			boxStyle : "",
			title : "",
			animate : true,
			timeout : 2,
			showClose : false,
			showBtn : true,
			iconType : "",
			iconStyle : "",
			showMask : true,
			yesBtn : "确定",
			noBtn : "取消",
			yesFn : new Function(),
			noFn : new Function(),
			initFn : new Function(),
			maskStyle : "",
			zindex : 100
		}
	options = $.extend(true, detaults,options);
	this.opt = {};
	for ( var i in options ) {
		this.opt[i] = options[i];
	}
	if(!this.opt.content){
		return;
	}
	this.init();
}

Dialog.prototype = {
	constructor : Dialog,
	init : function(){
		this.createElement();
		return this;
	},
	divDrag : function(obj) {//div拖动
        var oDiv = obj.box,
            oBtn = obj.btn,
            before = obj.before || new Function(),
            after = obj.after || new Function(),
            disX = 0,
            disY = 0,
            doc = document;
        oBtn.onmouseenter = function() {
            this.style.cursor = "move";
        };
        oBtn.onmouseleave = function() {
            this.style.cursor = "default";
        };
        oBtn.onmousedown = function(ev) {
        	before();
            var oEvent = ev || event;
            disX = oEvent.clientX - oDiv.offsetLeft;
            disY = oEvent.clientY - oDiv.offsetTop;
            doc.onmousemove = function(ev) {
                var oEvent = ev || event;
                var oLeft = oEvent.clientX - disX;
                var oTop = oEvent.clientY - disY;
                if (oLeft < 0) {
                    oLeft = 0;
                } else if (oLeft > doc.documentElement.clientWidth - oDiv.offsetWidth) {
                    oLeft = doc.documentElement.clientWidth - oDiv.offsetWidth;
                }
                if (oTop < 0) {
                    oTop = 0;
                } else if (oTop > doc.documentElement.clientHeight - oDiv.offsetHeight) {
                    oTop = doc.documentElement.clientHeight - oDiv.offsetHeight;
                }
                oDiv.style.left = oLeft + "px";
                oDiv.style.top = oTop + "px";
            };
            doc.onmouseup = function() {
            	after();
                doc.onmousemove = null;
                doc.onmouseup = null;
            };
            return false;
        };
    },
	createElement : function(){//创建元素
		this.template();
	},
	hide : function(){ //移除弹窗
		var _me = this;
		_me._content.css({
			top : - _me.opt._t
		});
		setTimeout(function(){
			if(_me._box){
				_me._box.remove();
				_me._box = null;
			}
		},200);
	},
	event : function(){ //事件绑定
		var _me = this;
		if(_me.opt.isdrag && _me._head){
			_me.divDrag({
				box : _me._content[0],
				btn : _me._head[0],
				before : function(){
					_me._content.removeClass('qccr-fadein')
				},
				after : function(){
					_me._content.addClass('qccr-fadein')
				}
			})
		}
		if(_me._yesbtn){
			_me._yesbtn.on({
				click : function(){
	
					var isClose=_me.opt.yesFn(_me);
					if(typeof isClose =="undefined"){
						isClose =true
					}
					if(isClose && _me.opt.isOkhide){
						_me.hide();
					}
				}
			});
		}
		
		if(_me._nobtn){
			_me._nobtn.on({
				click : function(){
					_me.hide();
					_me.opt.noFn(_me);
				}
			});
		}
		if(_me._close){
			_me._close.on({
				click : function(){
					_me.hide();
					if(_me.opt.isClosefn){
						_me.opt.noFn(_me);
					}
				}
			});
		}
		
	},
	getWin : function(){
		return {
			W : $(window).width(),
			H : $(window).height()
		}
	},
	show : function(){
		var _me = this;
		var _o = _me.getWin();
		
		if(_me._content){
			var _h = _me._content.outerHeight(),
				_w = _me._content.outerWidth(),
				_W = 0,
				_H = 0,
				_l = 0,
				_t = 0,
				_hh = 0,
				_fh = 0;
            if(_h > _o.H * 0.9){
            	_H = _o.H * 0.9;
            }else{
            	_H = _h;
            }
            if(_w > _o.W * 0.9){
            	_W = _o.W * 0.9;
            }else{
            	_W = _w;
            }
            _l = (_o.W - _W )/2;
            _t = (_o.H - _H )/2;
            if(_me._footer){
            	_fh = _me._footer.outerHeight();
            }
            if(_me._head){
            	_hh = _me._head.outerHeight();
            }
            /*if(this._body.outerHeight() > _H - _fh - _hh - 20){
            	this._body.css({
            		"height" : _H - _fh - _hh - 20
            	});
            }*/
            _me._body.css({
        		"max-height" :  _o.H * 0.9 - _fh - _hh - 20
        	});
            _me.opt._t = _t;
            _me._content.css({
            	opacity : 1,
            	width : _W,
            	maxHeight : _o.H * 0.9,
            	left : _l,
            	top : _t
            });
            if(_me.opt.animate !== false){
            	_me._content.addClass('qccr-fadein');
            }
		}else{
			if(_me._box){
				_me._box.remove();
			}
		}
		if(_me.opt.type == "toast"){
			setTimeout(function(){
				_me.hide();
				if(_me.opt.isClosefn){
					_me.opt.noFn(_me);
				}
			},_me.opt.timeout*1000);
		}
		if(_me.opt.initFn){
			_me.opt.initFn(_me);
		}
		this.event();
	},
	template : function(){ //返回模版
		var _me = this;
		if($('.qccr-modal').length > 0){
			var _zindex = parseInt($('.qccr-modal:last').css("z-index"));
			if(_zindex >= _me.opt.zindex){
				_me.opt.zindex = _zindex + 1;
			}
		}
		var iconType = ["success","error","warn"],
			_emptyStr = '',
			_box = $('<div class="qccr-modal">').css({"z-index":_me.opt.zindex}),
			_content = $('<div class="qccr-modal-conent" style="'+(_me.opt.boxStyle ? _me.opt.boxStyle : _emptyStr )+'">'),
			_head = $('<div class="qccr-modal-head">').html(_me.opt.title ? _me.opt.title : _emptyStr),
			_mask = $('<div class="qccr-mask" style="'+(_me.opt.maskStyle ? _me.opt.maskStyle : _emptyStr )+'">'),
			_body = $('<div class="qccr-modal-body">'),
			_close = $('<div class="qccr-modal-close iconfont">').html('&#xe604;'),
			_footer = $('<div class="qccr-modal-footer">'),
			_bodycontent =  $('<div class="qccr-model-cbox">'),
			_nobtn = $('<a href="javascript:void(0);" class="qccr-btn qccr-btn-middle">' + _me.opt.noBtn + '</a>'),
			_yesbtn = $('<a href="javascript:void(0);" class="qccr-btn qccr-btn-middle qccr-btn-primary">' + _me.opt.yesBtn + '</a>');
			if(_me.opt.noBtn == ""){
				_nobtn = "";
			}
			if(_me.opt.yesBtn == ""){
				_yesbtn = "";
			}
			if(_me.opt.showBtn == true){ //是否显示按钮
				if(_me.opt.type == "confrim"){
					_footer.append(_nobtn,_yesbtn);
				}
				if(_me.opt.type == "alert"){
					_nobtn = "";
					_footer.append(_yesbtn);
				}
			}
			if(_me.opt.iconType){
				var _icoM = ["&#xe603;","&#xe602;","&#xe601;"];
				var _str = "";
				var _ind = iconType.indexOf(_me.opt.iconType);
				if(_ind > -1){
					_str = _icoM[_ind]
				}else{
					_str = _me.opt.iconType;
				}
				_bodycontent.append(
					$('<p class="qccr-body-icon iconfont" style="'+(_me.opt.iconStyle ? _me.opt.iconStyle : _emptyStr )+'">').html(_str)
				);
			}
			if(_me.opt.width){
				_content.width(_me.opt.width)
			}
			if(_me.opt.height){
				_content.height(_me.opt.height)
			}
			_body.append(
				_bodycontent.append(_me.opt.content)
			);

			if(_me.opt.showClose != true){
				_close = "";
			}
			if(_me.opt.title.replace(/\s/g,'') == ""){
				_head = "";
			}

			if(_me.opt.type == "toast"){
				_me.opt.showBtn = false;
			}
			if(_nobtn == "" && _yesbtn == ""){
				_footer = "";
			}
			if(_me.opt.showBtn != true){
				_footer = "";
				_content.css({
					"text-align" : "center"
				})
			}
			
			if(_me.opt.showMask != true){//是否显示遮罩
				_mask = '';
			}

			_content.append(_close,_head,_body,_footer);
			_box.append(_mask,_content);
			this._box =  _box;
			this._content =  _content;
			this._footer =  _footer;
			this._head =  _head;
			this._body = _body;
			this._close =  _close;
			this._nobtn =  _nobtn;
			this._yesbtn =  _yesbtn;
			$('body').append(_box);
			_me.show();
	}
}
function isDom(obj){ //判断对象是否为DOM对象
	if(!obj){
		return false;
	}
    if(typeof obj != "object"){
        return false;
    }
    if(obj instanceof jQuery){
        if(!obj[0]){
            return false    
        }else{
            if(typeof HTMLElement === 'object'){
	        	return obj[0] instanceof HTMLElement;
	        }else{
	        	return obj[0] && typeof obj[0] === 'object' && obj[0].nodeType === 1 && typeof obj[0].nodeName === 'string';
	        }
        }
    }else{
        if(typeof HTMLElement === 'object'){
        	return obj instanceof HTMLElement;
        }else{
        	return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
        }
    }
}
function Tooltips(opt){
	var detaults = {
			direction : "bottom",
			isForm : false,
			title : "",
			trigger : "click",
			theme : "normal",
			maxWidth : 0,
			index : 50,
			el : null
	}
	opt = $.extend(true, detaults,opt);
	if(opt.title.replace(/\s/g,'') == ''){
		return;
	}
	if(isDom(opt.el) === false){
		return;
	}
	this.opt = opt;
	this.opt.hideel = false;
	this.init();
}

Tooltips.prototype = {
	constructor : Tooltips,
	init : function(){
		$('.qccrTipsModel').remove();
		this.createElement();
	},
	createElement : function(){
		var _me = this;
		var _themeClass = "";
		var theme = ["normal","error","warn","success"];
		var _ind = theme.indexOf(_me.opt.theme);
		if(_ind == -1){
			_ind = 0;
		}
		_me.opt.theme = theme[_ind];
		_themeClass = "qccr-tips-"+_me.opt.theme;
		var _box = $('<div class="qccr-tips qccr-tips-tip qccrTipsModel '+_themeClass+'">').html('<span class="qccr-tip-arrow"></span><p>'+_me.opt.title+'</p>').css({
			opacity : 0
		});
		if(parseFloat(_me.opt.width) > 0){//设置宽高
			_box.css({
				maxWidth : parseFloat(_me.opt.maxWidth)
			});
		}
		if(parseInt(_me.opt.index) > 0){
			_box.css({
				zIndex : parseInt(_me.opt.index)
			});
		}
		_me.opt._box = _box;
		$('body').append(_box);
		_me.show();
	},
	getwh : function(obj){
		return {
			w : $(obj).outerWidth(),
			h : $(obj).outerHeight()
		}
	},
	setDerection : function(){
		var _me = this,
			_derection = ["top","right","bottom","left"],
			_className = ['qccr-tips-bottom','qccr-tips-left','qccr-tips-top','qccr-tips-right'],
			_ind = _derection.indexOf(_me.opt.direction),
			//_pos = $(_me.opt.el).offset(),
			_pos = {
				left : $(_me.opt.el)[0].offsetLeft,
				top : $(_me.opt.el)[0].offsetTop
			}
			_pwh = _me.getwh(_me.opt.el),
			_ar = [],
			_docs = {
				w : $(window).width(),
				h : $(document).outerHeight()
			},
			_owh = {
				w : _me.opt._box.outerWidth(),
				h : _me.opt._box.outerHeight()
			},
			_rwh = {
				top : _pos.top,
				left : _pos.left,
			};
			if(_ind == -1){
				_ind = 0;
			}
			if(_pos.top < 60 && _ind == 0){
				_ind = 2;
			}
			if(_pos.left < 60 && _ind == 3){
				_ind = 1;
			}
			if(_docs.w -  (_pos.left + _pwh.w) < 60 && _ind == 1){
				_ind = 3;
			}
			if(_docs.h - (_pos.top + _pwh.h) < 60 && _ind == 2){
				_ind = 1;
			}
			_me.opt._box.addClass(_className[_ind]);
			_me.opt._box.css({
				maxWidth : function(){
					var mw = 0;
					switch(_ind) {
						case 0 :
						case 2 : 
							mw = _docs.w - 60;
							break;
						case 1 : 
							mw = _docs.w - _pos.left - _pwh.w - 20;
							break;
						default :
							mw = _pos.left - 30
							break;
					}
					if(parseFloat(_me.opt.maxWidth) > 0 && parseFloat(_me.opt.maxWidth) < mw){
						mw = parseFloat(_me.opt.maxWidth)
					}
					return mw;
				}
			});
			_owh = {
				w : _me.opt._box.outerWidth(),
				h : _me.opt._box.outerHeight()
			}
			switch(_ind) {
				case 0 : //top
					var _l = _pos.left - _owh.w/2 + _pwh.w/2;
					if(_l < 10){
						_me.opt._box.find('.qccr-tip-arrow').css({
							left : _pos.left + _pwh.w/2 - 10
						});
						_l = 10;
					}else{
						_me.opt._box.css({
							maxWidth : _docs.w - _l - 10
						});
						_me.opt._box.find('.qccr-tip-arrow').css({
							left : (_pos.left + _pwh.w/2 - _l)
						});
					}
					_rwh = {
						top : _pos.top - _me.opt._box.outerHeight() - 10,
						left : _l
					}
					break;
				case 1 : //right
					_rwh = {
						left : _pos.left + _pwh.w + 10,
						top : _pos.top - _owh.h/2 + _pwh.h/2
					}
					break;
				case 2 : //bottom
					var _l = _pos.left - _owh.w/2 + _pwh.w/2
					if(_l < 10){
						_me.opt._box.find('.qccr-tip-arrow').css({
							left : _pos.left + _pwh.w/2 - 10
						});
						_l = 10;
					}else{
						_me.opt._box.css({
							maxWidth : _docs.w - _l - 10
						});
						_me.opt._box.find('.qccr-tip-arrow').css({
							left : (_pos.left + _pwh.w/2 - _l)
						});
					}
					_rwh = {
						top : _pos.top + _pwh.h + 10,
						left : _l
					}
					break;
				default : //left
					_rwh = {
						left : _pos.left - _owh.w - 10,
						top : _pos.top - _owh.h/2 + _pwh.h/2
					}
					break;
			}
			_me.opt._box.css({
				opacity : 1,
				top : _rwh.top,
				left : _rwh.left
			});
		return this;
	},
	show : function(){
		var _me = this;
		_me.setDerection().bindEvent();
	},
	bindEvent : function(){
		var _me = this;
		$(_me.opt.el).on({
			mouseout : function(){
				_me.opt.hideel = true;
				_me.hide();
			}
		});
		_me.opt._box.on({
			mouseover : function(){
				_me.opt.hideel = false;
			},
			mouseout : function(){
				_me.opt.hideel = true;
				_me.hide();
			}
		});
		if(_me.opt.isForm === true){
			$(_me.opt.el).on({
				click : function(){
					_me.opt.hideel = true;
					_me.hide();
				}
			});
		}
	},
	hide : function(){
		var _me = this;
		setTimeout(function(){
			if(isDom(_me.opt._box) && _me.opt.hideel === true){
				_me.opt._box.remove();
				if($(_me.opt.el).length > 0){
					$(_me.opt.el).removeAttr('data-tipshow');
				}
				_me.opt._box = null;
			}
		},200);
	}
}

QCCR.extend({
	alert : function(opt){
		opt = opt || {};
		opt.type  = "alert";
		return new Dialog(opt);
	},
	isDom : isDom,
	confrim : function(opt){
		opt = opt || {};
		opt.type  = "confrim";
		return new Dialog(opt);
	},
	toast : function(opt){
		opt = opt || {};
		opt.type  = "toast";
		return new Dialog(opt);
	},
	tooltip : function(opt){
		var _me = this;
		var detaults = {
				direction : "bottom",
				title : "",
				theme : "normal",
				trigger : "click",
				isForm : false
		}
		opt = $.extend(true, detaults,opt);
		if(opt.title.replace(/\s/g,'') == ''){
			return;
		}
		if(_me.isDom(opt.el) === false){
			return;
		}
		new Tooltips(opt);
	},
	btntooltip : function(){
		var _me = this;
		$(document).on({
			click : function(e){
				if($(this).attr('data-tipshow') == "true"){
					return;
				}
				$(this).attr('data-tipshow',"true");
				var _that = this;
				var _obj = {
						title : _that.getAttribute('data-title') || '',
						direction : _that.getAttribute('data-direction') || "bottom",
						maxWidth : _that.getAttribute('data-maxwidth') || 0,
						theme :  _that.getAttribute('data-theme') || "normal",
						index : _that.getAttribute('data-index') || 50,
						theme : _that.getAttribute('data-theme') || "normal",
						trigger : "click",
						el : _that
				}
				if(!_obj.title){
					return;
				}
				if(_that.getAttribute('data-trigger') != "hover"){
					_me.tooltip(_obj);
				}
			}
		},'[data-tooltip=true]');
		$(document).on({
			mouseover : function(){
				if($(this).attr('data-tipshow') == "true"){
					return;
				}
				$(this).attr('data-tipshow',"true");
				var _that = this;
				var _obj = {
						title : _that.getAttribute('data-title') || '',
						direction : _that.getAttribute('data-direction') || "bottom",
						maxWidth : _that.getAttribute('data-maxwidth') || 0,
						theme :  _that.getAttribute('data-theme') || "normal",
						index : _that.getAttribute('data-index') || 50,
						theme : _that.getAttribute('data-theme') || "normal",
						trigger : "hover",
						el : $(_that)
				}
				if(!_obj.title){
					return;
				}
				_me.tooltip(_obj);
			}
		},'[data-tooltip=true][data-trigger=hover]');
	},
	showLoading : function(obj){
		obj = obj || {};
		var _me = this,
			_ie89 = false,
			boxStyle = "",
			defaults = {
				transparentBackground : false
			},
			options = $.extend(true, defaults,obj);
		if(options.transparentBackground === true){
			boxStyle = "background:rgba(0,0,0,0);border:0 none;opacity:0";
		}
		if(_me.isIE9() || _me.isIE8()){
			_ie89 = true;
		}
		_me.alert({
			boxStyle :"background:transparent;border:none",
			zindex : 9999999,
			animate : false, 
			yesBtn : "",
			content : '<div class="qccrLoadgif"></div>',
			initFn : function(o){
				_me.loadingId = o;
			}
		});
	},
	hideLoading : function(){
		var _me = this;
		if(_me.loadingId && typeof _me.loadingId.hide != "undefined" && _me.loadingId.hide.constructor == Function){
			_me.loadingId.hide();
			_me.loadingId = null;
		}
	}
});

QCCR.setInit('btntooltip');

	function renderFormErrorTips(item,el,msg,$form){ //普通文本提示
	if(item.length == 0){
		return;
	}
	if(el.length == 0){
		return;
	}
	if(!msg){
		return;
	}
	$form.find('.qccr-form-errmsg').hide();
	$form.find('input').removeClass('qccr-input-error');
	var _errel = el.find('.qccr-form-errmsg'),
		_tagName = item[0].tagName.toLocaleLowerCase();
	if(_errel.length == 0){
		el.append(
			$('<div class="qccr-form-errmsg">')
			.append($('<i class="iconfont icon-guanbixianxing">'))
			.append($('<span>').html(msg))
		);
	}else{
		_errel.find('span').html(msg);
		_errel.show();
	}
	if(_tagName == "input" && item[0].type != "checkbox" && item[0].type != "radio"){
		item.addClass('qccr-input-error');
	}
}



QCCR.extend({
	switchui : function(){
		$(document).on({
			click : function(){
				$(this).toggleClass('qccr-switch-active');
			}
		},'.qccr-switch')
	},
	checkBox : function(obj){
		obj = obj || {};
		var _me = this;
		if(_me.isEmptyObject(obj)){
            function _all(_el,_this){
				var _len = _el.length;
				for (var i = 0; _len > i; i++) {
	    			if(_el[i]){
	    				_el[i].checked = _this.checked;
	    				var _a = _el[i].getAttribute('data-checkall');
	    				if(_a){
	    					var _$e = $("input[data-checkonly='" + _a + "']"),
	    						_l = $(_$e).length;
	    					if(_l > 0){
	    						_all($(_$e),_el[i]);
	    					}
	    				}
	    			}
	    		}
			}

			function _only(_this){
				_name = _this.getAttribute('data-checkonly');
	    		if(_name){
	    			var _el = "input[data-checkall='" + _name + "']",
	    				_$t = $(_el),
	    				_len = _$t.length;
	    			if(_len == 0){return;}
	    			$("input[data-checkonly ='" + _name + "']:checked").length == $("input[data-checkonly='" + _name + "']").length ? _$t.prop("checked", !0) : _$t.prop("checked", !1);
	    			if(_$t.attr('data-checkonly')){
	    				_only(_$t[0]);
	    			}
	    		}
			}
			
            $(document).on({
            	click : function(){
            		_only(this);            			
            	}
            },'input[data-checkonly]');
            $(document).on({
            	click : function(){
            		var _this = this,
            			_name = this.getAttribute('data-checkall');
            		if(_name){
            			var _el = "input[data-checkonly='" + _name + "']",
            				_len = $(_el).length;
            			if(_len == 0){return;}
            			_all($(_el),_this);
            		}
            	}
            },'input[data-checkall]');
        }else{
        	var e = "input[name='" + obj.checkall_name + "']", //全选
			    f = "input[name='" + obj.checkbox_name + "']", //单选
			    g = $(f).length; //被操作的复选框数量
			   	$(document).on({
			    	click : function(){
			    		var _$t = $(e);
			    		$("input[name ='" + obj.checkbox_name + "']:checked").length == $("input[name='" + obj.checkbox_name + "']").length ? _$t.prop("checked", !0) : _$t.prop("checked", !1);
			    	}
			    },f);
			    $(document).on({
			    	click : function(){
			    		var _this = this;
			    		for (var i = 0; g > i; i++) {
			    			if($(f)[i]){
			    				$(f)[i].checked = _this.checked;
			    			}
			    		}
			    	}
			    },e);
        }
	},
	getFormDataAsObj: function($form) {//表单序列化
		var obj = {},
			arr = $form.serializeArray(),
			_arr = [],
			__arr = [],
		    $inputs = $('input,select,textarea',$form);
		    $.each($inputs,function(){
		    	var _this = this,
		    		_index = $inputs.index(_this);
		    		if(_arr.indexOf(_this.name) > -1){
 						return;
		    		}
		    		if(_this.type == "submit"){
		    			return;
		    		}
		    		_arr.push(_this.name);
		    	if(_this.type == "radio" || _this.type == "checkbox"){
		    		var _obj = {
		    			name : _this.name,
		    			value : (function(){
		    				if(_this.type == "radio"){
		    					return $form.find('input[name='+_this.name+']:checked').val() || ''
		    				}else{
		    					var val = [];
		    					$form.find('input[name='+_this.name+']').each(function(){
		    						if(this.checked){
		    							val.push(this.value);
		    						}
		    					});
		    					return val.join(',');
		    				}
		    			})()
		    		}
					__arr.push(_obj);
		    	}else if(_this.tagName.toLocaleLowerCase() == "select"){
		    		var _obj = {
		    			name : _this.name,
		    			value : (function(){
		    				return $form.find('select[name='+_this.name+']').val() || ''
		    			})()
		    		}
		    		__arr.push(_obj);
		    	}else{
		    		var _obj = {
		    			name : _this.name,
		    			value : (function(){
		    				return $form.find('input[name='+_this.name+']').val() || ''
		    			})()
		    		}
		    		__arr.push(_obj);
		    	}
		    });
		for (var i = 0; i < __arr.length; i++) {
			obj[__arr[i].name] = __arr[i].value;
		}
		return obj;
	},
	showFormErr : function(msg,item,el,theme,options){
		var _me = this;
		if(options.tipWay == "tooltips"){
			_me.tooltip({
				title : msg,
				el : el,
				theme : theme,
				direction : "top",
				index : 99999,
				isForm : true
			});
		}else{
			renderFormErrorTips(item,el,msg,options.form);
		}
	},
	validate: function($form, options) {//表单验证
		options = options || {};
		options.rule = options.rule || {};
		options.success = options.success || new Function();
		options.tooltipsIndex = options.tooltipsIndex || 50;
		options.tipWay = options.tipWay || "normal";
		options.inputTrigger = typeof options.inputTrigger != "undefined" && options.inputTrigger.constructor == Boolean ? options.inputTrigger : false;
		options.form = $form;
		var _me = this,
			_way = ["normal","tooltips"],
			_rule = $.extend(true, _me.flag,options.rule);
			if(_way.indexOf(options.tipWay) == -1){
				options.tipWay = _way[0];
			}
		$form.on({
			submit : function(){
				var valid = true,
					data = _me.getFormDataAsObj($form);
					
				for (var i in data) {
					var value = data[i],
						$item = $('[name=' + i + ']',$form),
						$elitem = $item.parents('[data-errorparent=true]'),
						require = $item.data('require'),
						nullMsg = $item.data('null'),
						min = $item.data('min') || 0,
						max = $item.data('max') || 9999,
						errorparent = $item.data('errorparent') || '',
						errorMsg = $item.data('error'),
						ruleName = $item.data('rule') || '',
						repeatName = $item.data('repeat') || '',
						rule = _rule[ruleName];
						if (require) {
							if (!value) {
								valid = false;
								_me.showFormErr(nullMsg,$item,$elitem,'warn',options);
								break;
							} else if (ruleName && !rule.test(value)) {
								if (rule.test(value)) {
									continue;
								}
								valid = false;
								_me.showFormErr(errorMsg,$item,$elitem,'error',options);
								break;
							}else if(repeatName){
								if(value != data[repeatName]){
									valid = false;
									_me.showFormErr(errorMsg,$item,$elitem,'error',options);
									break;
								}
							}else{
								if(value.length < min){
									valid = false;
									_me.showFormErr(errorMsg,$item,$elitem,'error',options);
									break;
								}
								if(value.length > max){
									valid = false;
									_me.showFormErr(errorMsg,$item,$elitem,'error',options);
									break;
								}
							}
						} else {
							if (value && ruleName && !rule.test(value)) {
								if (rule.test(value)) {
									continue;
								}
								valid = false;
								_me.showFormErr(errorMsg,$item,$elitem,'error',options);
								break;
							}
						}
				}
				if(valid){
					return options.success();
				}else{
					return false;
				}
				
			}
		}).on({
			click : function(){
				if(options.tipWay == "normal"){
					$(this).removeClass('qccr-input-error').parents('[data-errorparent=true]').find('.qccr-form-errmsg').hide();
				}
			}
		},'input,select,textarea').on({
			click : function(){
				$(this).parents('[data-errorparent=true]').find('.qccr-form-errmsg').hide();
			}
		},'[data-select-box=true]')
		.on({
			blur : function(){
				var _this = this;
				if(options.inputTrigger && _this.type != "checkbox" && _this.type != "radio"){
					$form.trigger('submit');
				}
			}
		},'input,textarea');
		
	},
});
QCCR.setInit(["checkBox","switchui"]);

	QCCR.extend({
    nav: function(obj) { //左侧下拉菜单
        var _me = this;
        obj = obj || {};
        var _btn = '[data-qccr-nav] a[data-role=btn]',
            _curstyle = 'active';
        $(_btn).each(function(){
            if($(this).next().length == 0){
                $(this).removeClass('iconfont');
            }
        });
        $(document).on({
            click: function() {
                if(!$(this).parent("dd").hasClass("active")){
                    $(this).parent("dd").find(".beforIcon").text("-");
                }else{
                    $(this).parent("dd").find(".beforIcon").text("+");
                }
                if ($(this).next().length > 0) {
                    $(this).parent().toggleClass(_curstyle);
                    $(this).next().toggle();

                }
            }
        }, _btn);
    },
    mTab: function(obj) { //菜单切换
        var _me = this;
        var isMoudel = false;
        obj = obj || {};
        if(_me.isEmptyObject(obj)){
            isMoudel = true;
            obj.btnBox = '[data-nav-content-box]';
            obj.btn = '[data-nav-btn]';
            obj.cur = 'active';
            obj.content = '[data-nav-content]';
        }

        $("[data-close-btn]").addClass('iconfont icon-guanbixianxing');

        function current(){
              
            var _this=this;
            var _btn = $(this).parent();
            var _index = (_btn.find(obj.btn)).index(this);

            if(isMoudel){
                if(_btn.attr('data-nav-content-box')){
                    if($('#'+_btn.attr('data-nav-content-box')).children(obj.content).eq(_index).length == 0){
                        return;
                    }
                    $('#'+_btn.attr('data-nav-content-box')).children(obj.content).css({

                    })
                    $('#'+_btn.attr('data-nav-content-box')).children(obj.content).eq(_index).attr('data-nav-content','true').css({
                        display : "block"
                    }).siblings().attr('data-nav-content','false').css({
                        display : "none"
                    });
                    $(this).attr('data-nav-btn','true').siblings().attr('data-nav-btn','false');
                }
            }    
        }
        $(document).on({
        	click : function(){
        		current.call(this);     
               

        	}
        },obj.btn);

        $(document).on({
            click : function(){
                 var index=$(this).parents("a").index();
                 var _p=$(this).parents("a").parent();

                _p.parent().find("[data-nav-content]").eq(index).remove();
                 $(this).parents("a").remove();

                 if(_p.find("a").length>0){
                    _p.find("a").eq(0).trigger("click");
                }else{
                    _p.next().remove();
                    _p.remove();
                }

            }
        },"[data-close-btn]");


        $(document).on({
            mouseover : function(){
                  current.call(this);        
            }
        },obj.btn+'[data-trigger=hover]');
    }
});
QCCR.setInit(["mTab","nav"]);

      /**
 @Name : qccrDate v3.5 日期控件
 @Author: chen guojun
 @Date: 2016-10-25
 @QQ群：516754269
 @官网：http://www.jayui.com/qccrDate/ 或 https://github.com/singod/qccrDate
 */
window.console && (console = console || {log : function(){return;}});
;(function(root, factory) {
	//amd
	if (typeof define === 'function' && define.amd) {
		define(['$'], factory);
	} else if (typeof exports === 'object') { //umd
		module.exports = factory();
	} else {
		root.qccrDate = factory(window.jQuery || $);
	}
})(win, function($) {
	var jet = {}, doc = document, ymdMacth = /\w+|d+/g, parseInt = function (n) { return window.parseInt(n, 10);},
	config = {
		skinCell:"qccrDateblue",
		format:"YYYY-MM-DD hh:mm:ss", //日期格式
		minDate:"1900-01-01 00:00:00", //最小日期
		maxDate:"2099-12-31 23:59:59" //最大日期
	};
	$.fn.qccrDate = function(options){
		return this.each(function(){
			return new qccrDate($(this),options||{});
		});
	};
	$.extend({
		qccrDate:function(elem, options){
			return $(elem).each(function(){
				return new qccrDate($(this),options||{});
			});
		}
	});

	jet.docScroll = function(type) {
		type = type ? "scrollLeft" :"scrollTop";
		return doc.body[type] | doc.documentElement[type];
	};
	jet.winarea = function(type) {
		return doc.documentElement[type ? "clientWidth" :"clientHeight"];
	};
	jet.isShow = function(elem, bool) {
		elem.css({display: bool != true ? "none" :"block"});
	};
	//判断是否闰年
	jet.isLeap = function(y) {
		return (y % 100 !== 0 && y % 4 === 0) || (y % 400 === 0);
	}
	//获取本月的总天数
	jet.getDaysNum = function(y, m) {
		var num = 31;
		switch (parseInt(m)) {
			case 2:
				num = jet.isLeap(y) ? 29 : 28; break;
			case 4: case 6: case 9: case 11:
			    num = 30; break;
		}
		return num;
	}
	//获取月与年
	jet.getYM = function(y, m, n) {
		var nd = new Date(y, m - 1);
		nd.setMonth(m - 1 + n);
		return {
			y: nd.getFullYear(),
			m: nd.getMonth() + 1
		};
	}
	//获取上个月
	jet.getPrevMonth = function(y, m, n) {
		return jet.getYM(y, m, 0 - (n || 1));
	}
	//获取下个月
	jet.getNextMonth = function(y, m, n) {
		return jet.getYM(y, m, n || 1);
	}
	//补齐数位
	jet.digit = function(num) {
		return num < 10 ? "0" + (num | 0) :num;
	};
	//判断是否为数字
	jet.IsNum = function(str){
		return (str!=null && str!="") ? !isNaN(str) : false;
	}
	//转换日期格式
	jet.parse = function(ymd, hms, format) {
		ymd = ymd.concat(hms);
		var hmsCheck = jet.parseCheck(format, false).substring(0, 5) == "hh:mm", num = 2;
		return format.replace(/YYYY|MM|DD|hh|mm|ss/g, function(str, index) {
			var idx = hmsCheck ? ++num :ymd.index = ++ymd.index | 0;
			return jet.digit(ymd[idx]);
		});
	};
	jet.parseCheck = function(format, bool) {
		var ymdhms = [];
		format.replace(/YYYY|MM|DD|hh|mm|ss/g, function(str, index) {
			ymdhms.push(str);
		});
		return ymdhms.join(bool == true ? "-" :":");
	};
	jet.checkFormat = function(format) {
		var ymdhms = [];
		format.replace(/YYYY|MM|DD|hh|mm|ss/g, function(str, index) {
			ymdhms.push(str);
		});
		return ymdhms.join("-");
	};
	jet.parseMatch = function(str) {
		var timeArr = str.split(" ");
		return timeArr[0].match(ymdMacth);
	};
	//验证日期
	jet.checkDate = function (date) {
		var dateArr = date.match(ymdMacth);
		if (isNaN(dateArr[0]) || isNaN(dateArr[1]) || isNaN(dateArr[2])) return false;
		if (dateArr[1] > 12 || dateArr[1] < 1) return false;
		if (dateArr[2] < 1 || dateArr[2] > 31) return false;
		if ((dateArr[1] == 4 || dateArr[1] == 6 || dateArr[1] == 9 || dateArr[1] == 11) && dateArr[2] > 30) return false;
		if (dateArr[1] == 2) {
			if (dateArr[2] > 29) return false;
			if ((dateArr[0] % 100 == 0 && dateArr[0] % 400 != 0 || dateArr[0] % 4 != 0) && dateArr[2] > 28) return false;
		}
		return true;
	}
	//初始化日期
	jet.initDates = function(num, format) {
		format = format || 'YYYY-MM-DD hh:mm:ss';
		if(typeof num === "string"){
			var newDate = new Date(parseInt(num.substring(0,10)) * 1e3);
		}else{
			num = num | 0;
			var newDate = new Date(), todayTime = newDate.getTime() + 1000*60*60*24*num;
			newDate.setTime(todayTime);
		}
		var years = newDate.getFullYear(), months = newDate.getMonth() + 1, days = newDate.getDate(), hh = newDate.getHours(), mm = newDate.getMinutes(), ss = newDate.getSeconds();
		return jet.parse([ years, jet.digit(months), jet.digit(days) ], [ jet.digit(hh), jet.digit(mm), jet.digit(ss) ], format);
	};
	jet.montharr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ];
	jet.weeks = [ "日", "一", "二", "三", "四", "五", "六" ];
	//判断元素类型
	jet.isValHtml = function(that) {
		return /textarea|input/.test(that[0].tagName.toLocaleLowerCase());
	};
	jet.isBool = function(obj){  return (obj == undefined || obj == true ?  true : false); };
	jet.addDateTime = function(time,num,type,format){
		var ishhmm = jet.checkFormat(format).substring(0, 5) == "hh-mm" ? true :false;
		var nocharDate = ishhmm ? time.replace(/^(\d{2})(?=\d)/g,"$1,") : time.substr(0,4).replace(/^(\d{4})/g,"$1,") + time.substr(4).replace(/^(\d{2})(?=\d)/g,"$1,");
		var tarr = jet.IsNum(time) ? nocharDate.match(ymdMacth) : time.match(ymdMacth), date = new Date(),
			tm0 = parseInt(tarr[0]),  tm1 = tarr[1] == undefined ? date.getMonth() + 1 : parseInt(tarr[1]), tm2 = tarr[2] == undefined ? date.getDate() : parseInt(tarr[2]),
			tm3 = tarr[3] == undefined ? date.getHours() : parseInt(tarr[3]), tm4 = tarr[4] == undefined ? date.getMinutes() : parseInt(tarr[4]), tm5 = tarr[5] == undefined ? date.getMinutes() : parseInt(tarr[5]);
		var newDate = new Date(tm0,jet.digit(tm1)-1,(type == "DD" ? tm2 + num : tm2),(type == "hh" ? tm3 + num : tm3),(type == "mm" ? tm4 + num : tm4),jet.digit(tm5));
		return jet.parse([ newDate.getFullYear(), newDate.getMonth()+1, newDate.getDate() ], [ newDate.getHours(), newDate.getMinutes(), newDate.getSeconds() ], format);
	}
	jet.boxCell = "#qccrDatebox";
	function qccrDate(elem, opts){
		this.opts = opts;
		this.valCell = elem;
		this.init();
	}
	var jedfn = qccrDate.prototype;
	jedfn.init = function(){
		var that = this, opts = that.opts, zIndex = opts.zIndex == undefined ? 2099 : opts.zIndex,
			isinitVal = (opts.isinitVal == undefined || opts.isinitVal == false) ? false : true,
		    createDiv = $("<div id="+jet.boxCell.replace(/\#/g,"")+" class='qccrDatebox "+(opts.skinCell || config.skinCell)+"'></div");
		jet.fixed = jet.isBool(opts.fixed);
		createDiv.attr("author","chen guojun--www.jayui.com--version:3.5");
		createDiv.css({"z-index": zIndex ,"position":(jet.fixed == true ? "absolute" :"fixed"),"display":"block"});
		var initVals = function(elem) {
			var jeformat = opts.format || config.format, inaddVal = opts.initAddVal || [0], num, type;
			if(inaddVal.length == 1){
				num = inaddVal[0], type = "DD";
			}else{
				num = inaddVal[0], type = inaddVal[1];
			}
			var nowDateVal = jet.initDates(0, jeformat), jeaddDate = jet.addDateTime(nowDateVal, num, type, jeformat);
			(elem.val() || elem.text()) == "" ? jet.isValHtml(elem) ? elem.val(jeaddDate) :elem.text(jeaddDate) :jet.isValHtml(elem) ? elem.val() : elem.text();
		};
		//为开启初始化的时间设置值
		if (isinitVal && jet.isBool(opts.insTrigger)) {
			that.valCell.each(function() {
				initVals($(this));
			});
		}
		if (jet.isBool(opts.insTrigger)) {
			that.valCell.on("click", function (ev) {
				if(opts.startel){
					var _el = $('#'+opts.startel);
					if(_el.length > 0 && _el.val() == ""){
						_el.click();
						return;
					}
				}
				ev.stopPropagation();
				if ($(jet.boxCell).size() > 0) return;
				jet.format = opts.format || config.format;
				jet.minDate = opts.minDate || config.minDate;
				jet.maxDate = opts.maxDate || config.maxDate;
				$("body").append(createDiv);
				that.setHtml(opts);
			});
		}else {
			jet.format = opts.format || config.format;
			jet.minDate = opts.minDate || config.minDate;
			jet.maxDate = opts.maxDate || config.maxDate;
			$("body").append(createDiv);
			that.setHtml(opts);
		}
	};
	//方位辨别
	jedfn.orien = function(obj, self, pos) {
		var tops, leris, ortop, orleri, rect = jet.fixed ? self[0].getBoundingClientRect() : obj[0].getBoundingClientRect();
		if(jet.fixed) {
			leris = rect.right + obj.outerWidth() / 1.5 >= jet.winarea(1) ? rect.right - obj.outerWidth() : rect.left + (pos ? 0 : jet.docScroll(1));
			tops = rect.bottom + obj.outerHeight() / 1 <= jet.winarea() ? rect.bottom - 1 : rect.top > obj.outerHeight() / 1.5 ? rect.top - obj.outerHeight() - 1 : jet.winarea() - obj.outerHeight();
			ortop = Math.max(tops + (pos ? 0 :jet.docScroll()) + 1, 1) + "px", orleri = leris + "px";
		}else{
			ortop = "50%", orleri = "50%";
			obj.css({"margin-top":-(rect.height / 2),"margin-left":-(rect.width / 2)});
		}
		obj.css({"top":ortop,"left":orleri});
	};
	//关闭层
	jedfn.dateClose = function() {
		$(jet.boxCell).remove();
	};
	//布局控件骨架
	jedfn.setHtml = function(opts){
		var that = this, elemCell = that.valCell, boxCell = $(jet.boxCell);
		var weekHtml = "", tmsArr = "", date = new Date(),  dateFormat = jet.checkFormat(jet.format),
			isYYMM = (dateFormat == "YYYY-MM" || dateFormat == "YYYY") ? true :false,  ishhmm = dateFormat.substring(0, 5) == "hh-mm" ? true :false;
		if ((elemCell.val() || elemCell.text()) == "") {
			tmsArr = [ date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() ];
			jet.currDate = new Date(tmsArr[0], parseInt(tmsArr[1])-1, tmsArr[2], tmsArr[3], tmsArr[4], tmsArr[5]);
			jet.ymdDate = tmsArr[0] + "-" + jet.digit(tmsArr[1]) + "-" + jet.digit(tmsArr[2]);
		} else {
			var initVal = jet.isValHtml(elemCell) ? elemCell.val() : elemCell.text();
			//对获取到日期的进行替换
			var nocharDate = ishhmm ? initVal.replace(/^(\d{2})(?=\d)/g,"$1,") : initVal.substr(0,4).replace(/^(\d{4})/g,"$1,") + initVal.substr(4).replace(/^(\d{2})(?=\d)/g,"$1,");
			//判断是否为数字类型，并分割
			var inVals = jet.IsNum(initVal) ? nocharDate.match(ymdMacth) : initVal.match(ymdMacth);
			if(ishhmm){
				tmsArr = dateFormat == "hh-mm" ? [ inVals[0], inVals[1], date.getSeconds() ] :[ inVals[0], inVals[1], inVals[2] ];
				jet.currDate = new Date(date.getFullYear(), date.getMonth()-1, date.getDate());
			}else{
				tmsArr = [ inVals[0], inVals[1], inVals[2], inVals[3] == undefined ? date.getHours() : inVals[3], inVals[4] == undefined ? date.getMinutes() : inVals[4], inVals[5] == undefined ? date.getSeconds() :inVals[5] ];
				jet.currDate = new Date(tmsArr[0], parseInt(tmsArr[1])-1,  tmsArr[2], tmsArr[3], tmsArr[4], tmsArr[5]);
				jet.ymdDate = tmsArr[0] + "-" + jet.digit(tmsArr[1]) + "-" + jet.digit(tmsArr[2]);
			}
		}
		jet.currMonth = tmsArr[1], jet.currDays = tmsArr[2];
		//控件HMTL模板
		var datetopStr = '<div class="qccrDatetop">' + (!isYYMM ? '<div class="qccrDateym" style="width:50%;"><i class="prev triangle yearprev"></i><span class="qccrDateyy" ym="24"><em class="qccrDateyear"></em><em class="pndrop"></em></span><i class="next triangle yearnext"></i></div>' + '<div class="qccrDateym" style="width:50%;"><i class="prev triangle monthprev"></i><span class="qccrDatemm" ym="12"><em class="qccrDatemonth"></em><em class="pndrop"></em></span><i class="next triangle monthnext"></i></div>' :'<div class="qccrDateym" style="width:100%;"><i class="prev triangle ymprev"></i><span class="qccrDateyy"><em class="qccrDateyearmonth"></em></span><i class="next triangle ymnext"></i></div>') + "</div>";
		var dateymList = !isYYMM ? '<div class="qccrDatetopym" style="display: none;">' + '<ul class="ymdropul"></ul><p><span class="qccrDateymchle">&lt;&lt;</span><span class="qccrDateymchri">&gt;&gt;</span><span class="qccrDateymchok">关闭</span></p>' + "</div>" :(dateFormat == "YYYY" ? '<ul class="jedayy"></ul>' :　'<ul class="jedaym"></ul>');
		var dateriList = '<ol class="jedaol"></ol><ul class="jedaul"></ul>';
		var bothmsStr = !isYYMM ? '<div class="botflex qccrDatehmsshde"><ul class="qccrDatehms"><li><input type="text" /></li><i>:</i><li><input type="text" /></li><i>:</i><li><input type="text" /></li></ul></div>' + '<div class="botflex qccrDatebtn"><span class="qccrDateok">确认</span><span class="qccrDatetodaymonth">今天</span><span class="qccrDateclear">清空</span></div>' :(dateFormat == "YYYY" ? '<div class="botflex qccrDatebtn"><span class="qccrDateok" style="width:47.8%">确认</span><span class="qccrDateclear" style="width:47.8%">清空</span></div>' : '<div class="botflex qccrDatebtn"><span class="qccrDateok">确认</span><span class="qccrDatetodaymonth">本月</span><span class="qccrDateclear">清空</span></div>');
		var datebotStr = '<div class="qccrDatebot">' + bothmsStr + "</div>";
		var datehmschoose = '<div class="qccrDateprophms ' + (ishhmm ? "qccrDatepropfix" :"qccrDateproppos") + '"><div class="qccrDatepropcon"><div class="qccrDatehmstitle">时间选择<div class="qccrDatehmsclose">&times;</div></div><div class="qccrDateproptext">小时</div><div class="qccrDateproptext">分钟</div><div class="qccrDateproptext">秒数</div><div class="qccrDatehmscon qccrDateprophours"></div><div class="qccrDatehmscon qccrDatepropminutes"></div><div class="qccrDatehmscon qccrDatepropseconds"></div></div></div>';
		var dateHtmStr = isYYMM ? datetopStr + dateymList + datebotStr :ishhmm ? datetopStr + datehmschoose + datebotStr :datetopStr + dateymList + dateriList + datehmschoose + datebotStr;
		boxCell.html(dateHtmStr);
        //是否显示清除按钮
		jet.isBool(opts.isClear) ? "" : jet.isShow(boxCell.find(".qccrDatebot .qccrDateclear"), false);
		//是否显示今天按钮
		if(!isYYMM){
			jet.isBool(opts.isToday) ? "" : jet.isShow(boxCell.find(".qccrDatebot .qccrDatetodaymonth"), false);
		};
		//判断是否有时分秒
		if(/\hh-mm/.test(dateFormat)){
			var isTimehms = function(bool) {
				if(elemCell.val() != "" || elemCell.text() != "") {
					var hmsArrs = bool ? [ tmsArr[0], tmsArr[1], tmsArr[2] ] : [ tmsArr[3], tmsArr[4], tmsArr[5] ];
				}else{
					var hmsArrs =  [ jet.currDate.getHours(), jet.currDate.getMinutes(), jet.currDate.getSeconds() ];
				}
				boxCell.find(".qccrDatebot .qccrDatehms input").each(function(i) {
					$(this).val(jet.digit(hmsArrs[i]));
					jet.isBool(opts.ishmsVal) ? "" : $(this).attr("readOnly",'true');
				});
			};
			if(ishhmm){
				isTimehms(true);
				boxCell.find(".qccrDateyear").text(jet.currDate.getFullYear() + '年');
				boxCell.find(".qccrDatemonth").text(jet.digit(jet.currDate.getMonth() + 1) + '月');
			}else{
				if(jet.isBool(opts.isTime)){
					isTimehms(false);
				}else{
					jet.isShow(boxCell.find(".qccrDatebot .qccrDatehmsshde"), false);
					boxCell.find(".qccrDatebot .qccrDatebtn").css("width" , "100%");
				}
			}
		}else{
			if (!isYYMM) jet.isShow(boxCell.find(".qccrDatebot .qccrDatehmsshde"), false);
			boxCell.find(".qccrDatebot .qccrDatebtn").css("width" , "100%");
		};
		//判断是否为年月类型
		if(/\YYYY-MM-DD/.test(dateFormat)){
			$.each(jet.weeks, function(i, week) {
				weekHtml += '<li class="weeks" data-week="' + week + '">' + week + "</li>";
			});
			boxCell.find(".jedaol").html(weekHtml);
			that.createDaysHtml(jet.currDate.getFullYear(), jet.currDate.getMonth()+1, opts);
			that.chooseYM(opts);
		};
		if(isYYMM){
			var monthCls = boxCell.find(".qccrDateym .qccrDateyearmonth");
			if(dateFormat == "YYYY"){
				monthCls.attr("data-onyy",tmsArr[0]).text(tmsArr[0] + "年");
				boxCell.find(".jedayy").html(that.onlyYear(tmsArr[0]));
			}else{
				monthCls.attr("data-onym",tmsArr[0]+"-"+jet.digit(tmsArr[1])).text(tmsArr[0] + "年" + parseInt(tmsArr[1]) + "月");
				boxCell.find(".jedaym").html(that.onlyYMStr(tmsArr[0], parseInt(tmsArr[1])));
			}
			that.onlyYMevents(tmsArr,opts);
		}
		that.orien(boxCell, elemCell);
		setTimeout(function () {
			opts.success && opts.success(elemCell);
		}, 2);
		that.events(tmsArr, opts);
	};
	//循环生成日历
	jedfn.createDaysHtml = function(ys, ms, opts){
		var that = this, elemCell = that.valCell, boxCell = $(jet.boxCell);
		var year = parseInt(ys), month = parseInt(ms), dateHtml = "",count = 0;
		var minArr = jet.minDate.match(ymdMacth), minNum = minArr[0] + minArr[1] + minArr[2],
			maxArr = jet.maxDate.match(ymdMacth), maxNum = maxArr[0] + maxArr[1] + maxArr[2];
		boxCell.find(".jedaul").html(""); //切忌一定要把这个内容去掉，要不然会点一次翻页都在日历下面依次显示出来
		var firstWeek = new Date(year, month - 1, 1).getDay() || 7,
			daysNum = jet.getDaysNum(year, month), prevM = jet.getPrevMonth(year, month),
			prevDaysNum = jet.getDaysNum(year, prevM.m), nextM = jet.getNextMonth(year, month),
			currOne = jet.currDate.getFullYear() + "-" + jet.digit(jet.currDate.getMonth() + 1) + "-" + jet.digit(1),
			thisOne = year + "-" + jet.digit(month) + "-" + jet.digit(1);
		boxCell.find(".qccrDateyear").attr("year", year).text(year + '年');
		boxCell.find(".qccrDatemonth").attr("month", month).text(month + '月');
		//设置时间标注
		var mark = function (my, mm, md) {
			var Marks = opts.marks, contains = function(arr, obj) {
				var len = arr.length;
				while (len--) {
					if (arr[len] === obj) return true;
				}
				return false;
			};
			return $.isArray(Marks) && Marks.length > 0 && contains(Marks, my + "-" + jet.digit(mm) + "-" + jet.digit(md)) ? '<i class="marks"></i>' :"";
		}
		//是否显示节日
		var isfestival = function(y, m ,d) {
			var festivalStr;
			if(opts.festival == true){
				var lunar = jeLunar(y, m - 1, d), feslunar = (lunar.solarFestival || lunar.lunarFestival),
					lunartext = (feslunar && lunar.jieqi) != "" ? feslunar : (lunar.jieqi || lunar.showInLunar);
				festivalStr = '<p><span class="solar">' + d + '</span><span class="lunar">' + lunartext + '</span></p>';
			}else{
				festivalStr = '<p class="nolunar">' + d + '</p>';
			}
			return festivalStr;
		};
		//判断是否在限制的日期之中
		var dateOfLimit = function(Y, M, D, isMonth){
			var thatNum = (Y + "-" + jet.digit(M) + "-" + jet.digit(D)).replace(/\-/g, '');
			if(isMonth){
				if (parseInt(thatNum) >= parseInt(minNum) && parseInt(thatNum) <= parseInt(maxNum)) return true;
			}else {
				if (parseInt(minNum) > parseInt(thatNum) || parseInt(maxNum) < parseInt(thatNum)) return true;
			}
		}
		//上一月剩余天数
		for (var p = prevDaysNum - firstWeek + 1; p <= prevDaysNum; p++, count++) {
			var pmark = mark(prevM.y,prevM.m,p), pCls = dateOfLimit(prevM.y, prevM.m, p, false) ? "disabled" : "other";
			dateHtml += '<li year="'+prevM.y+'" month="'+prevM.m+'" day="'+p+'" class='+pCls+'>'+(isfestival(prevM.y,prevM.m,p) + pmark)+'</li>';
		}
		//本月的天数
		for(var b = 1; b <= daysNum; b++, count++){
			var bCls = "", bmark = mark(year,month,b),
				thisDate = (year + "-" + jet.digit(month) + "-" + jet.digit(b)); //本月当前日期
			if(dateOfLimit(year, month, b, true)){
				bCls = jet.ymdDate == thisDate ? "action" : (currOne != thisOne && thisOne == thisDate ? "action" : "");
			}else{
				bCls = "disabled";
			}
			dateHtml += '<li year="'+year+'" month="'+month+'" day="'+b+'" '+(bCls != "" ? "class="+bCls+"" : "")+'>'+(isfestival(year,month,b) + bmark)+'</li>';
		}
		//下一月开始天数
		for(var n = 1, nlen = 42 - count; n <= nlen; n++){
			var nmark = mark(nextM.y,nextM.m,n), nCls = dateOfLimit(nextM.y, nextM.m, n, false) ? "disabled" : "other";
			dateHtml += '<li year="'+nextM.y+'" month="'+nextM.m+'" day="'+n+'" class='+nCls+'>'+(isfestival(nextM.y,nextM.m,n) + nmark)+'</li>';
		}
		//把日期拼接起来并插入
		boxCell.find(".jedaul").html(dateHtml);
		that.chooseDays(opts);
	};
	//循环生成年月（YYYY-MM）
	jedfn.onlyYMStr = function(y, m) {
		var onlyYM = "";
		$.each(jet.montharr, function(i, val) {
			var minArr = jet.parseMatch(jet.minDate), maxArr = jet.parseMatch(jet.maxDate),
				thisDate = new Date(y, jet.digit(val), "01"), minTime = new Date(minArr[0], minArr[1], minArr[2]), maxTime = new Date(maxArr[0], maxArr[1], maxArr[2]);
			if (thisDate < minTime || thisDate > maxTime) {
				onlyYM += "<li class='disabled' ym='" + y + "-" + jet.digit(val) + "'>" + y + "年" + jet.digit(val) + "月</li>";
			} else {
				onlyYM += "<li " + (m == val ? 'class="action"' :"") + ' ym="' + y + "-" + jet.digit(val) + '">' + y + "年" + jet.digit(val) + "月</li>";
			}
		});
		return onlyYM;
	};
	//循环生成年（YYYY）
	jedfn.onlyYear = function(YY) {
		var onlyStr = "";
		jet.yearArr = new Array(15);
		$.each(jet.yearArr, function(i) {
			var minArr = jet.parseMatch(jet.minDate), maxArr = jet.parseMatch(jet.maxDate),
				minY = minArr[0], maxY = maxArr[0], yyi = YY - 7 + i,
				getyear = $(jet.boxCell).find(".qccrDateym .qccrDateyearmonth").attr("data-onyy");
			if (yyi < minY || yyi > maxY) {
				onlyStr += "<li class='disabled' yy='" + yyi + "'>" + yyi + "年</li>";
			} else {
				onlyStr += "<li "+(getyear == yyi ? 'class="action"' : "")+" yy='" + yyi + "'>" + yyi + "年</li>";
			}
		});
		return onlyStr;
	};
	//生成定位时分秒
	jedfn.setStrhms = function(opts) {
		var that = this, boxCell = $(jet.boxCell);
		var parseFormat = jet.format, hmsArr = [], hmsliCls = boxCell.find(".qccrDatehms li"),
			proptextCls = boxCell.find(".qccrDatepropcon .qccrDateproptext"), propconCls = boxCell.find(".qccrDatepropcon .qccrDatehmscon");
		var parsehms = function(str) {
			var ymdstr = str.match(ymdMacth).join("-"), timeArr = ymdstr == "YYYY-MM-DD-hh-mm" ? str.split(" ") : ymdstr,
				isHMtime = ymdstr == "YYYY-MM-DD-hh-mm" ? timeArr[1] :timeArr;
			return isHMtime.match(ymdMacth).join("-");
		};
		var parmathm = parsehms(parseFormat) == "hh-mm";
		if(parmathm){
			var hmsliWidth = hmsliCls.css('width').replace(/\px|em|rem/g,''), hmsiW = boxCell.find(".qccrDatehms i").css('width').replace(/\px|em|rem/g,''),
				hmschoseW = proptextCls.css('width').replace(/\px|em|rem/g,''), hmslival = Math.round(parseInt(hmsliWidth) + parseInt(hmsliWidth)/2 + parseInt(hmsiW)/2);
			hmsliCls[0].style.width = hmsliCls[1].style.width = hmslival + "px";
			proptextCls[0].style.width = proptextCls[1].style.width = propconCls[0].style.width = propconCls[1].style.width = Math.round(parseInt(hmschoseW) + parseInt(hmschoseW)/2 + 2) + "px";
		}
		//生成时分秒
		
		$.each([ 24, 60, 60 ], function(i, len) {
			var hmsStr = "", hmsCls = "", inputCls = boxCell.find(".qccrDatehms input"), textem = inputCls.eq(i).val();
			inputCls.eq(i).attr("maxlength",2).attr("numval",len-1).attr("item",i);
			var _islimt = false;
			if(i == 1 && typeof opts.minutesArray != "undefined" && opts.minutesArray.constructor == Array && opts.minutesArray.length > 1){
				opts._islimt = true;
				_islimt = true;
			}
			if(_islimt && i == 1){
				var _textem = textem.toString().replace(/^(0)/g,'');
				if(opts.minutesArray.indexOf(parseInt(_textem)) == -1){
					textem = opts.minutesArray[0];
					inputCls.eq(1).val(jet.digit(textem));
				}
				inputCls.eq(i).attr("numval",opts.minutesArray[opts.minutesArray.length - 1]);
			}
			for (var h = 0; h < len; h++) {
				var s = 0;
				if(_islimt){
					if(h >= opts.minutesArray.length){
						break;
					}else{
						s = opts.minutesArray[h];
					}
					s = jet.digit(s);
				}else{
					h = jet.digit(h);
				}
				if (opts.ishmsLimit) {
					hmsCls = h < textem ? "disabled" :h == textem ? "action" :"";
				} else {
					if(_islimt){
						hmsCls = parmathm && i == 2 ? textem == s.toString() ? "disabled action" :"disabled" :textem == s.toString() ? "action" :"";
						if(parmathm && i == 2){
							var readCls = hmsliCls.eq(2);
							readCls.css({"display":"none"}).prev().css({"display":"none"});
							proptextCls.eq(i).css({"display":"none"});
							propconCls.eq(i).css({"display":"none"});
						}
					}else{
						hmsCls = parmathm && i == 2 ? textem == h ? "disabled action" :"disabled" :textem == h ? "action" :"";
						if(parmathm && i == 2){
							var readCls = hmsliCls.eq(2);
							readCls.css({"display":"none"}).prev().css({"display":"none"});
							proptextCls.eq(i).css({"display":"none"});
							propconCls.eq(i).css({"display":"none"});
						}
					}
					
				}
				if(_islimt){
					hmsStr += '<p class="' + hmsCls + '">' + s + "</p>";
				}else{
					hmsStr += '<p class="' + hmsCls + '">' + h + "</p>";
				}
			}
			hmsArr.push(hmsStr);
		});
		return hmsArr;
	};
	//仅年月情况下的点击
	jedfn.onlyYMevents = function(tmsArr, opts) {
		var that = this, boxCell = $(jet.boxCell);
		var ymVal, ymPre = boxCell.find(".qccrDateym .ymprev"), ymNext = boxCell.find(".qccrDateym .ymnext"), ony = parseInt(tmsArr[0]), onm = parseFloat(tmsArr[1]);
		$.each([ ymPre, ymNext ], function(i, cls) {
			cls.on("click", function(ev) {
				ev.stopPropagation();
				if(jet.checkFormat(jet.format) == "YYYY"){
					ymVal = cls == ymPre ? boxCell.find(".jedayy li").attr("yy") : boxCell.eq(jet.yearArr.length-1).find(".jedayy li").attr("yy");
					boxCell.find(".jedayy").html(that.onlyYear(parseInt(ymVal)));
				}else{
					ymVal = cls == ymPre ? ony -= 1 :ony += 1;
					boxCell.find(".jedaym").html(that.onlyYMStr(ymVal, onm));
				}
				that.ymPremNextEvents(opts);
			});
		});
	};
	jedfn.nongliorien = function(obj, self, pos) {
		var tops, leris, ortop, orleri, rect =self[0].getBoundingClientRect();
		leris = rect.right + obj[0].offsetWidth / 1.5 >= jet.winarea(1) ? rect.right - obj[0].offsetWidth : rect.left + (pos ? 0 : jet.docScroll(1));
		tops = rect.bottom + obj[0].offsetHeight / 1 <= jet.winarea() ? rect.bottom - 1 : rect.top > obj[0].offsetHeight / 1.5 ? rect.top - obj[0].offsetHeight - 1 : jet.winarea() - obj[0].offsetHeight;
		ortop = Math.max(tops + (pos ? 0 :jet.docScroll()) + 1, 1) + "px", orleri = leris + "px";
		return {top: ortop, left: orleri }
	};

	//选择日期
	jedfn.chooseDays = function(opts) {
		var that = this, elemCell = that.valCell, boxCell = $(jet.boxCell);
		boxCell.find(".jedaul li").on("click", function(ev) {
			var _that = $(this), liTms = [];
			if (_that.hasClass("disabled")) return;
			ev.stopPropagation();
			//获取时分秒的集合
			boxCell.find(".qccrDatehms input").each(function() {
				liTms.push($(this).val());
			});
			var aty = parseInt(_that.attr("year")), atm = parseFloat(_that.attr("month")), atd = parseFloat(_that.attr("day")),
				getDateVal = jet.parse([ aty, atm, atd ], [ liTms[0], liTms[1], liTms[2] ], jet.format);
			jet.isValHtml(elemCell) ? elemCell.val(getDateVal) :elemCell.text(getDateVal);
			that.dateClose();
			opts.festival && $("#qccrDatetipscon").remove();
			if ($.isFunction(opts.choosefun) || opts.choosefun != null) opts.choosefun && opts.choosefun(elemCell,getDateVal);
		});

		if(opts.festival) {
			//鼠标进入提示框出现
			boxCell.find(".jedaul li").on("mouseover", function () {
				var _this = $(this), aty = parseInt(_this.attr("year")), atm = parseFloat(_this.attr("month")), atd = parseFloat(_this.attr("day")),
					tipDiv = $("<div/>",{id:"qccrDatetipscon",class:"qccrDatetipscon"}), lunar = jeLunar(aty, atm - 1, atd);
				var tiphtml = '<p>' + lunar.solarYear + '年' + lunar.solarMonth + '月' + lunar.solarDate + '日 ' + lunar.inWeekDays + '</p><p class="red">农历：' + lunar.shengxiao + '年 ' + lunar.lnongMonth + '月' + lunar.lnongDate + '</p><p>' + lunar.ganzhiYear + '年 ' + lunar.ganzhiMonth + '月 ' + lunar.ganzhiDate + '日</p>';
				var Fesjieri = (lunar.solarFestival || lunar.lunarFestival) != "" ? '<p class="red">' + ("节日："+lunar.solarFestival + lunar.lunarFestival) + '</p>' : "";
				var Fesjieqi = lunar.jieqi != "" ? '<p class="red">'+(lunar.jieqi != "" ? "节气："+lunar.jieqi : "") + '</p>': "";
				var tiptext = (lunar.solarFestival || lunar.lunarFestival || lunar.jieqi) != "" ? (Fesjieri + Fesjieqi) : "";
				//生成提示框到文档中
				$("body").append(tipDiv);
				tipDiv.html(tiphtml + tiptext);
				//获取并设置农历提示框出现的位置
				var tipPos = jedfn.nongliorien(tipDiv, _this);
				tipDiv.css({"z-index":  (opts.zIndex == undefined ? 2099 + 5 : opts.zIndex + 5),top:tipPos.top,left:tipPos.left,position:"absolute",display:"block"});
			}).on( "mouseout", function () { //鼠标移除提示框消失
				if($("#qccrDatetipscon").size() > 0) $("#qccrDatetipscon").remove();
			});
		}
	};
	//下拉选择年和月
	jedfn.chooseYM = function(opts) {
		var that = this, boxCell = $(jet.boxCell);
		var jetopym = boxCell.find(".qccrDatetopym"), qccrDateyy = boxCell.find(".qccrDateyy"), qccrDatemm = boxCell.find(".qccrDatemm"), qccrDateyear = boxCell.find(".qccrDateyy .qccrDateyear"),
			qccrDatemonth = boxCell.find(".qccrDatemm .qccrDatemonth"), mchri = boxCell.find(".qccrDateymchri"), mchle = boxCell.find(".qccrDateymchle"),
			ishhmmss = jet.checkFormat(jet.format).substring(0, 5) == "hh-mm" ? true :false;
		var minArr = jet.minDate.match(ymdMacth), minNum = minArr[0] + minArr[1],
			maxArr = jet.maxDate.match(ymdMacth), maxNum = maxArr[0] + maxArr[1];
		//循环生成年
		function eachYears(YY) {
			var eachStr = "", ycls;
			$.each(new Array(15), function(i,v) {
				if (i === 7) {
					var getyear = qccrDateyear.attr("year");
					ycls = (parseInt(YY) >= parseInt(minArr[0]) && parseInt(YY) <= parseInt(maxArr[0])) ? (getyear == YY ? 'class="action"' :"") : 'class="disabled"';
					eachStr += "<li " + ycls + ' yy="' + YY + '">' + YY + "年</li>";
				} else {
					ycls = (parseInt(YY - 7 + i) >= parseInt(minArr[0]) && parseInt(YY - 7 + i) <= parseInt(maxArr[0])) ? "" : 'class="disabled"';
					eachStr += '<li ' + ycls + ' yy="' + (YY - 7 + i) + '">' + (YY - 7 + i) + "年</li>";
				}
			});
			return eachStr;
		}
		//循环生成月
		function eachYearMonth(YY, ymlen) {
			var ymStr = "";
			if (ymlen == 12) {
				$.each(jet.montharr, function(i, val) {
					var getmonth = qccrDatemonth.attr("month"), val = jet.digit(val);
					var mcls = (parseInt(qccrDateyear.attr("year") + val) >= parseInt(minNum) && parseInt(qccrDateyear.attr("year") + val) <= parseInt(maxNum)) ?
						(jet.digit(getmonth) == val ? 'class="action"' :"") : 'class="disabled"';
					ymStr += "<li " + mcls + ' mm="' + val + '">' + val + "月</li>";
				});
				$.each([ mchri, mchle ], function(c, cls) {
					jet.isShow(cls,false);
				});
			} else {
				ymStr = eachYears(YY);
				$.each([ mchri, mchle ], function(c, cls) {
					jet.isShow(cls,true);
				});
			}
			jetopym.removeClass( ymlen == 12 ? "qccrDatesety" :"qccrDatesetm").addClass(ymlen == 12 ? "qccrDatesetm" :"qccrDatesety");
			boxCell.find(".qccrDatetopym .ymdropul").html(ymStr);
			jet.isShow(jetopym,true);
		}
		function clickLiYears(year) {
			boxCell.find(".ymdropul li").on("click", function(ev) {
				var _this = $(this), Years = _this.attr("yy"), Months = parseInt(qccrDatemonth.attr("month"));
				if (_this.hasClass("disabled")) return;
				ev.stopPropagation();
				year.attr("year", Years).html(Years + '年');
				jet.isShow(jetopym,false);
				that.createDaysHtml(Years, Months, opts);
			});
		}
		//下拉选择年
		!ishhmmss && qccrDateyy.on("click", function() {
			var yythat = $(this), YMlen = parseInt(yythat.attr("ym")), yearAttr = parseInt(qccrDateyear.attr("year"));
			eachYearMonth(yearAttr, YMlen);
			clickLiYears(qccrDateyear);
		});
		//下拉选择月
		!ishhmmss && qccrDatemm.on("click", function() {
			var mmthis = $(this), YMlen = parseInt(mmthis.attr("ym")), yearAttr = parseInt(qccrDateyear.attr("year"));
			eachYearMonth(yearAttr, YMlen);
			boxCell.find(".ymdropul li").on("click", function(ev) {
				if ($(this).hasClass("disabled")) return;
				ev.stopPropagation();
				var lithat = $(this), Years = qccrDateyear.attr("year"), Months = parseInt(lithat.attr("mm"));
				qccrDatemonth.attr("month", Months).html(Months + '月');
				jet.isShow(jetopym,false);
				that.createDaysHtml(Years, Months, opts);
			});
		});
		//关闭下拉选择
		boxCell.find(".qccrDateymchok").on("click", function(ev) {
			ev.stopPropagation();
			jet.isShow(jetopym,false);
		});
		var yearMch = parseInt(qccrDateyear.attr("year"));
		$.each([ mchle, mchri ], function(d, cls) {
			cls.on("click", function(ev) {
				ev.stopPropagation();
				d == 0 ? yearMch -= 15 :yearMch += 15;
				var mchStr = eachYears(yearMch);
				boxCell.find(".qccrDatetopym .ymdropul").html(mchStr);
				clickLiYears(qccrDateyear);
			});
		});
	};
	//年月情况下的事件绑定
	jedfn.ymPremNextEvents = function(opts){
		var that = this, elemCell = that.valCell, boxCell = $(jet.boxCell);
		var newDate = new Date(), isYY = (jet.checkFormat(jet.format) == "YYYY"), ymCls = isYY ? boxCell.find(".jedayy li") : boxCell.find(".jedaym li");
		//选择年月
		ymCls.on("click", function (ev) {
			if ($(this).hasClass("disabled")) return;    //判断是否为禁选状态
			ev.stopPropagation();
			var atYM =  isYY ? $(this).attr("yy").match(ymdMacth) : $(this).attr("ym").match(ymdMacth),
				getYMDate = isYY ? jet.parse([atYM[0], newDate.getMonth() + 1, 1], [0, 0, 0], jet.format) : jet.parse([atYM[0], atYM[1], 1], [0, 0, 0], jet.format);
			jet.isValHtml(elemCell) ? elemCell.val(getYMDate) : elemCell.text(getYMDate);
			that.dateClose();
			if ($.isFunction(opts.choosefun) || opts.choosefun != null) opts.choosefun(elemCell, getYMDate);
		});
	};
	jedfn.events = function(tmsArr,opts){
		var that = this, elemCell = that.valCell, boxCell = $(jet.boxCell);
		var newDate = new Date(), yPre = boxCell.find(".yearprev"), yNext = boxCell.find(".yearnext"),
			mPre = boxCell.find(".monthprev"), mNext = boxCell.find(".monthnext"),
			qccrDateyear = boxCell.find(".qccrDateyear"), qccrDatemonth = boxCell.find(".qccrDatemonth"),
			isYYMM = (jet.checkFormat(jet.format) == "YYYY-MM" || jet.checkFormat(jet.format) == "YYYY") ? true :false,
			ishhmmss = jet.checkFormat(jet.format).substring(0, 5) == "hh-mm" ? true :false;
		if (!isYYMM) {
			//切换年
			!ishhmmss && $.each([ yPre, yNext ], function(i, cls) {
				cls.on("click", function(ev) {
					if(boxCell.find(".qccrDatetopym").css("display") == "block") return;
					ev.stopPropagation();
					var year = parseInt(qccrDateyear.attr("year")), month = parseInt(qccrDatemonth.attr("month")),
						pnYear = cls == yPre ? --year : ++year, PrevYM = jet.getPrevMonth(pnYear, month), NextYM = jet.getNextMonth(pnYear, month);
					cls == yPre ? that.createDaysHtml(PrevYM.y, month, opts) : that.createDaysHtml(NextYM.y, month, opts);
				});
			});
			//切换月
			!ishhmmss && $.each([ mPre, mNext ], function(i, cls) {
				cls.on("click", function(ev) {
					if(boxCell.find(".qccrDatetopym").css("display") == "block") return;
					ev.stopPropagation();
					var year = parseInt(qccrDateyear.attr("year")), month = parseInt(qccrDatemonth.attr("month")),
						PrevYM = jet.getPrevMonth(year, month), NextYM = jet.getNextMonth(year, month);
					cls == mPre  ? that.createDaysHtml(PrevYM.y, PrevYM.m, opts) : that.createDaysHtml(NextYM.y, NextYM.m, opts);
				});
			});
			//时分秒事件绑定
			var hmsStr = that.setStrhms(opts), hmsevents = function(hmsArr) {
				$.each(hmsArr, function(i, hmsCls) {
					if (hmsCls.html() == "") hmsCls.html(hmsStr[i]);
				});
				if (ishhmmss) {
					jet.isShow(boxCell.find(".qccrDatehmsclose"), false);
					jet.isShow(boxCell.find(".qccrDatetodaymonth"), false);
				} else {
					jet.isShow(boxCell.find(".qccrDateprophms"), true);
				}
				//计算当前时分秒的位置
				$.each([ "hours", "minutes", "seconds" ], function(i, hms) {
					var hmsCls = boxCell.find(".qccrDateprop" + hms), achmsCls = boxCell.find(".qccrDateprop"+hms+" .action");
					if(opts._islimt && i == 1){
						hmsCls[0].scrollTop = 0;
					}else{
						if(achmsCls[0]){
							hmsCls[0].scrollTop = achmsCls[0].offsetTop - 146;
						}
					}
					var onhmsPCls = boxCell.find(".qccrDateprop" + hms + " p");
					onhmsPCls.on("click", function() {
						var _this = $(this);
						if (_this.hasClass("disabled")) return;
						onhmsPCls.each(function() {
							$(this).removeClass("action");
						});
						_this.addClass("action");
						boxCell.find(".qccrDatebot .qccrDatehms input").eq(i).val(jet.digit(_this.text()));
						if (!ishhmmss) jet.isShow(boxCell.find(".qccrDateprophms"), false);
					});
				});
			};
			var hs = boxCell.find(".qccrDateprophours"), ms = boxCell.find(".qccrDatepropminutes"), ss = boxCell.find(".qccrDatepropseconds");
			if (ishhmmss) {
				hmsevents([ hs, ms, ss ]);
			} else {
				boxCell.find(".qccrDatehms").on("click", function() {
					if (boxCell.find(".qccrDateprophms").css("display") !== "block") hmsevents([ hs, ms, ss ]);
					//关闭时分秒层
					boxCell.find(".qccrDateprophms .qccrDatehmsclose").on("click", function() {
						jet.isShow(boxCell.find(".qccrDateprophms"), false);
					});
				});
			}
			//今天按钮设置日期时间
			boxCell.find(".qccrDatebot .qccrDatetodaymonth").on("click", function() {
				var toTime = [ newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate(), newDate.getHours(), newDate.getMinutes(), newDate.getSeconds() ],
					gettoDate = jet.parse([ toTime[0], toTime[1], toTime[2] ], [ toTime[3], toTime[4], toTime[5] ], jet.format);
				that.createDaysHtml(toTime[0], toTime[1], opts);
				jet.isValHtml(elemCell) ? elemCell.val(gettoDate) :jet.text(gettoDate);
				that.dateClose();
				if ($.isFunction(opts.choosefun) || opts.choosefun != null) opts.choosefun(elemCell,gettoDate);
				if (!isYYMM) that.chooseDays(opts);
			});
		}else{
			that.ymPremNextEvents(opts);
			//本月按钮设置日期时间
			boxCell.find(".qccrDatebot .qccrDatetodaymonth").on("click", function(ev) {
				ev.stopPropagation();
				var ymTime = [ newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate() ],
					YMDate = jet.parse([ ymTime[0], ymTime[1], 0 ], [ 0, 0, 0 ], jet.format);
				jet.isValHtml(elemCell) ? elemCell.val(YMDate) :elemCell.text(YMDate);
				that.dateClose();
				if ($.isFunction(opts.choosefun) || opts.choosefun != null) opts.choosefun(elemCell,YMDate);
			});
		}
		//检查时间输入值，并对应到相应位置
		boxCell.find(".qccrDatehms input").on("keyup", function() {
			return false;
			var _this = $(this), thatval = _this.val(), hmsVal = parseInt(_this.attr("numval")), thatitem = parseInt(_this.attr("item"));
			_this.val(thatval.replace(/\D/g,""));
			//判断输入值是否大于所设值
			if(thatval > hmsVal){
				_this.val(hmsVal);
				alert("输入值不能大于"+hmsVal);
			}
			if(thatval == "") _this.val("00");
			boxCell.find(".qccrDatehmscon").eq(thatitem).children().each(function(){
				$(this).removeClass("action");
			})
			boxCell.find(".qccrDatehmscon").eq(thatitem).children().eq(parseInt(_this.val().replace(/^0/g,''))).addClass("action");
			$.each([ "hours", "minutes", "seconds" ], function(i, hms) {
				var hmsCls = boxCell.find(".qccrDateprop" + hms), achmsCls = boxCell.find(".qccrDateprop" + hms + " .action");
				hmsCls[0].scrollTop = achmsCls[0].offsetTop - 118;
			});
		});
		//清空按钮清空日期时间
		boxCell.find(".qccrDatebot .qccrDateclear").on("click", function(ev) {
			ev.stopPropagation();
			var clearVal = jet.isValHtml(elemCell) ? elemCell.val() :elemCell.text();
			jet.isValHtml(elemCell) ? elemCell.val("") :elemCell.text("");
			that.dateClose();
			if (clearVal != "") {
				if (jet.isBool(opts.clearRestore)){
					jet.minDate = opts.startMin || jet.minDate;
					jet.maxDate = opts.startMax || jet.maxDate;
				}
				if ($.isFunction(opts.clearfun) || opts.clearfun != null) opts.clearfun(elemCell,clearVal);
			}
		});
		//确认按钮设置日期时间
		boxCell.find(".qccrDatebot .qccrDateok").on("click", function(ev) {
			ev.stopPropagation();
			var isValtext = (elemCell.val() || elemCell.text()) != "", isYYYY = jet.checkFormat(jet.format) == "YYYY", okVal = "",
			//获取时分秒的数组
				eachhmsem = function() {
					var hmsArr = [];
					boxCell.find(".qccrDatehms input").each(function() {
						hmsArr.push($(this).val());
					});
					return hmsArr;
				};
			var minArr = jet.minDate.match(ymdMacth), minNum = minArr[0] + minArr[1] + minArr[2],
				maxArr = jet.maxDate.match(ymdMacth), maxNum = maxArr[0] + maxArr[1] + maxArr[2];
			if (isValtext) {
				var btnokVal = jet.isValHtml(elemCell) ? elemCell.val() :elemCell.text(), oktms = btnokVal.match(ymdMacth);
				if (!isYYMM) {
					var okTimeArr = eachhmsem(), okTime = [ parseInt(qccrDateyear.attr("year")), parseInt(qccrDatemonth.attr("month")), oktms[2]],
						okTimeNum = okTime[0] + okTime[1] + okTime[2];
					//判断获取到的日期是否在有效期内
					var isokTime = (parseInt(okTimeNum) >= parseInt(minNum) && parseInt(okTimeNum) <= parseInt(maxNum)) ? true : false;
					okVal = isValtext && isokTime ? jet.parse([ okTime[0], okTime[1], okTime[2] ], [ okTimeArr[0], okTimeArr[1], okTimeArr[2] ], jet.format) :
						jet.parse([ oktms[0], oktms[1], oktms[2] ], [ okTimeArr[0], okTimeArr[1], okTimeArr[2] ], jet.format);
					if(!ishhmmss) that.createDaysHtml(okTime[0], okTime[1], opts);   /*console.log(okVal)*/
					that.chooseDays(opts);
				} else {
					var ymactCls = isYYYY ? boxCell.find(".jedayy .action") : boxCell.find(".jedaym .action");
					//判断是否为（YYYY或YYYY-MM）类型
					if(isYYYY){
						var okDate = ymactCls ? ymactCls.attr("yy").match(ymdMacth) : oktms;
						okVal = jet.parse([parseInt(okDate[0]), newDate.getMonth() + 1, 1], [0, 0, 0], jet.format);
					}else {
						var jedYM = ymactCls ? ymactCls.attr("ym").match(ymdMacth) : oktms;
						okVal = jet.parse([parseInt(jedYM[0]), parseInt(jedYM[1]), 1], [0, 0, 0], jet.format);
					}
				}
			} else {
				var okArr = eachhmsem(), monthCls = boxCell.find(".qccrDateyearmonth")[0], okDate = "";
				//判断是否为时分秒(hh:mm:ss)类型
				if (ishhmmss) {
					okVal = jet.parse([ tmsArr[0], tmsArr[1], tmsArr[2] ], [ okArr[0], okArr[1], okArr[2] ], jet.format);
				} else {
					//判断是否为年月（YYYY或YYYY-MM）类型
					if(isYYMM){
						okDate = jet.checkFormat(jet.format) == "YYYY" ? $(monthCls).attr("data-onyy").match(ymdMacth) : $(monthCls).attr("data-onym").match(ymdMacth);
					}else{
						okDate = [ newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate()];
					}
					okVal = isYYYY ? jet.parse([parseInt(okDate[0]), newDate.getMonth(), 1], [0, 0, 0], jet.format) :
						jet.parse([parseInt(okDate[0]), parseInt(okDate[1]), newDate.getDate()], [okArr[0], okArr[1], okArr[2]], jet.format);
				}
			}

			jet.isValHtml(elemCell) ? elemCell.val(okVal) :elemCell.text(okVal);
			that.dateClose();
			if ($.isFunction(opts.okfun) || opts.okfun != null) opts.okfun(jet.elemCell,okVal);
		});
		//点击空白处隐藏
		$(document).on("mouseup", function(ev) {
			ev.stopPropagation();
			var box = $(jet.boxCell);
			if (box && box.css("display") !== "none")  box.remove();
		});
		$(jet.boxCell).on("mouseup", function(ev) {
			ev.stopPropagation();
		});
	};

	//日期控件版本
	$.dateVer = "3.5";
	//返回指定日期
	$.nowDate = function(num) {
		return jet.initDates(num);
	};
	//为当前获取到的日期加减天数，这里只能控制到天数，不能控制时分秒加减
	$.addDate = function(time,num,type) {
		num = num | 0;   type = type || "DD";
		return jet.addDateTime(time,num,type,jet.format);
	};
	return qccrDate;
});

//农历数据
;(function(root, factory) {
	root.jeLunar = factory(root.jeLunar);
})(win, function(jeLunar) {
	var lunarInfo=[19416,19168,42352,21717,53856,55632,91476,22176,39632,21970,19168,42422,42192,53840,119381,46400,54944,44450,38320,84343,18800,42160,46261,27216,27968,109396,11104,38256,21234,18800,25958,54432,59984,28309,23248,11104,100067,37600,116951,51536,54432,120998,46416,22176,107956,9680,37584,53938,43344,46423,27808,46416,86869,19872,42448,83315,21200,43432,59728,27296,44710,43856,19296,43748,42352,21088,62051,55632,23383,22176,38608,19925,19152,42192,54484,53840,54616,46400,46496,103846,38320,18864,43380,42160,45690,27216,27968,44870,43872,38256,19189,18800,25776,29859,59984,27480,21952,43872,38613,37600,51552,55636,54432,55888,30034,22176,43959,9680,37584,51893,43344,46240,47780,44368,21977,19360,42416,86390,21168,43312,31060,27296,44368,23378,19296,42726,42208,53856,60005,54576,23200,30371,38608,19415,19152,42192,118966,53840,54560,56645,46496,22224,21938,18864,42359,42160,43600,111189,27936,44448],
		sTermInfo = [ 0, 21208, 43467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758 ];
	var Gan = "甲乙丙丁戊己庚辛壬癸", Zhi = "子丑寅卯辰巳午未申酉戌亥", Animals = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
	var solarTerm = [ "小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满",
		"芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至" ];
	var nStr1 = "日一二三四五六七八九十", nStr2 = "初十廿卅", nStr3 = [ "正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "腊"],
		sFtv1 = {
			"0101" : "*1元旦节",         "0202" : "湿地日",
			"0214" : "情人节",           "0308" : "妇女节",
			"0312" : "植树节",           "0315" : "消费者权益日",
			"0401" : "愚人节",           "0422" : "地球日",
			"0501" : "*1劳动节",         "0504" : "青年节",
			"0512" : "护士节",           "0518" : "博物馆日",
			"0520" : "母亲节",           "0601" : "儿童节",
			"0623" : "奥林匹克日",       "0630" : "父亲节",
			"0701" : "建党节",           "0801" : "建军节",
			"0903" : "抗战胜利日",       "0910" : "教师节",
			"1001" : "*3国庆节",         "1201" : "艾滋病日",
			"1224" : "平安夜",           "1225" : "圣诞节"
		},
		sFtv2 = {
			"0100" : "除夕",             "0101" : "*2春节",
			"0115" : "元宵节",           "0505" : "*1端午节",
			"0707" : "七夕节",           "0715" : "中元节",
			"0815" : "*1中秋节",         "0909" : "*1重阳节",
			"1015" : "下元节",           "1208" : "腊八节",
			"1223" : "小年"

		};
	function flunar(Y) {
		var sTerm = function (j, i) {
				var h = new Date((31556925974.7 * (j - 1900) + sTermInfo[i] * 60000) + Date.UTC(1900, 0, 6, 2, 5));
				return (h.getUTCDate())
			},
			d = function (k) {
				var h, j = 348;
				for (h = 32768; h > 8; h >>= 1) {
					j += (lunarInfo[k - 1900] & h) ? 1 : 0;
				}
				return (j + b(k))
			},
			ymdCyl = function (h) {
				return (Gan.charAt(h % 10) + Zhi.charAt(h % 12))
			},
			b =function (h) {
				var islp = (g(h)) ? ((lunarInfo[h - 1900] & 65536) ? 30 : 29) : (0);
				return islp
			},
			g = function (h) {
				return (lunarInfo[h - 1900] & 15)
			},
			e = function (i, h) {
				return ((lunarInfo[i - 1900] & (65536 >> h)) ? 30 : 29)
			},
			newymd = function (m) {
				var k, j = 0, h = 0, l = new Date(1900, 0, 31), n = (m - l) / 86400000;
				this.dayCyl = n + 40;
				this.monCyl = 14;
				for (k = 1900; k<2050&&n>0; k++) {
					h = d(k); n -= h;
					this.monCyl += 12;
				}
				if (n < 0) {
					n += h; k--;
					this.monCyl -= 12;
				}
				this.year = k;
				this.yearCyl = k - 1864;
				j = g(k);
				this.isLeap = false;
				for (k = 1; k<13&&n>0; k++) {
					if (j > 0 && k == (j + 1) && this.isLeap == false) {
						--k;
						this.isLeap = true;
						h = b(this.year);
					} else {
						h = e(this.year, k);
					}
					if (this.isLeap == true && k == (j + 1)) {
						this.isLeap = false;
					}
					n -= h;
					if (this.isLeap == false) this.monCyl++;
				}
				if (n == 0 && j > 0 && k == j + 1) {
					if (this.isLeap) {
						this.isLeap = false;
					} else {
						this.isLeap = true;
						--k;
						--this.monCyl;
					}
				}
				if (n < 0) {
					n += h; --k;
					--this.monCyl
				}
				this.month = k;
				this.day = n + 1;
			},
			digit = function (num) {
				return num < 10 ? "0" + (num | 0) :num;
			},
			reymd = function (i, j) {
				var h = i;
				return j.replace(/dd?d?d?|MM?M?M?|yy?y?y?/g, function(k) {
					switch (k) {
						case "yyyy":
							var l = "000" + h.getFullYear();
							return l.substring(l.length - 4);
						case "dd": return digit(h.getDate());
						case "d": return h.getDate().toString();
						case "MM": return digit((h.getMonth() + 1));
						case "M": return h.getMonth() + 1;
					}
				})
			},
			lunarMD = function (i, h) {
				var j;
				switch (i, h) {
					case 10: j = "初十"; break;
					case 20: j = "二十"; break;
					case 30: j = "三十"; break;
					default:
						j = nStr2.charAt(Math.floor(h / 10));
						j += nStr1.charAt(h % 10);
				}
				return (j)
			};
		this.isToday = false;
		this.isRestDay = false;
		this.solarYear = reymd(Y, "yyyy");
		this.solarMonth = reymd(Y, "M");
		this.solarDate = reymd(Y, "d");
		this.solarWeekDay = Y.getDay();
		this.inWeekDays = "星期" + nStr1.charAt(this.solarWeekDay);
		var X = new newymd(Y);
		this.lunarYear = X.year;
		this.shengxiao = Animals.charAt((this.lunarYear - 4) % 12);
		this.lunarMonth = X.month;
		this.lunarIsLeapMonth = X.isLeap;
		this.lnongMonth = this.lunarIsLeapMonth ? "闰" + nStr3[X.month - 1] : nStr3[X.month - 1];
		this.lunarDate = X.day;
		this.showInLunar = this.lnongDate = lunarMD(this.lunarMonth, this.lunarDate);
		if (this.lunarDate == 1) {
			this.showInLunar = this.lnongMonth + "月";
		}
		this.ganzhiYear = ymdCyl(X.yearCyl);
		this.ganzhiMonth = ymdCyl(X.monCyl);
		this.ganzhiDate = ymdCyl(X.dayCyl++);
		this.jieqi = "";
		this.restDays = 0;
		if (sTerm(this.solarYear, (this.solarMonth - 1) * 2) == reymd(Y, "d")) {
			this.showInLunar = this.jieqi = solarTerm[(this.solarMonth - 1) * 2];
		}
		if (sTerm(this.solarYear, (this.solarMonth - 1) * 2 + 1) == reymd(Y, "d")) {
			this.showInLunar = this.jieqi = solarTerm[(this.solarMonth - 1) * 2 + 1];
		}
		if (this.showInLunar == "清明") {
			this.showInLunar = "清明节";
			this.restDays = 1;
		}
		this.solarFestival = sFtv1[reymd(Y, "MM") + reymd(Y, "dd")];
		if (typeof this.solarFestival == "undefined") {
			this.solarFestival = "";
		} else {
			if (/\*(\d)/.test(this.solarFestival)) {
				this.restDays = parseInt(RegExp.$1);
				this.solarFestival = this.solarFestival.replace(/\*\d/, "");
			}
		}
		this.showInLunar = (this.solarFestival == "") ? this.showInLunar : this.solarFestival;
		this.lunarFestival = sFtv2[this.lunarIsLeapMonth ? "00" : digit(this.lunarMonth) + digit(this.lunarDate)];
		if (typeof this.lunarFestival == "undefined") {
			this.lunarFestival = "";
		} else {
			if (/\*(\d)/.test(this.lunarFestival)) {
				this.restDays = (this.restDays > parseInt(RegExp.$1)) ? this.restDays : parseInt(RegExp.$1);
				this.lunarFestival = this.lunarFestival.replace(/\*\d/, "");
			}
		}
		if (this.lunarMonth == 12  && this.lunarDate == e(this.lunarYear, 12)) {
			this.lunarFestival = sFtv2["0100"];
			this.restDays = 1;
		}
		this.showInLunar = (this.lunarFestival == "") ? this.showInLunar : this.lunarFestival;
	}
	var jeLunar = function(y,m,d) {
		return new flunar(new Date(y,m,d));
	};
	return jeLunar;
});

      
(function() {
    'use strict';

    var $window = $(window);
    var $document = $(document);
    var NAMESPACE = 'completer';
    var EVENT_RESIZE = 'resize';
    var EVENT_MOUSE_DOWN = 'mousedown';

    function Completer(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Completer.DEFAULTS, $.isPlainObject(options) && options);
        this.init();
    }

    function espace(s) {
        return s.replace(/([\.\$\^\{\[\(\|\)\*\+\?\\])/g, '\\$1');
    }

    function toRegexp(s) {
        if (typeof s === 'string' && s !== '') {
            s = espace(s);

            return new RegExp(s + '+[^' + s + ']*$', 'i');
        }

        return null;
    }

    function toArray(s) {
        if (typeof s === 'string') {
            s = s.replace(/[\{\}\[\]"']+/g, '').split(/\s*,+\s*/);
        }

        s = $.map(s, function(n) {
            return typeof n !== 'string' ? n.toString() : n;
        });

        return s;
    }

    Completer.prototype = {
        constructor: Completer,

        init: function() {
            var options = this.options,
                data = toArray(options.source);

            if (data.length > 0) {
                this.data = data;
                this.regexp = toRegexp(options.separator);
                this.$completer = $(options.template);
                this.$completer.hide().appendTo('body');
                this.place();

                this.$element.attr('autocomplete', 'off').on({
                    focus: $.proxy(this.enable, this),
                    blur: $.proxy(this.disable, this)
                });

                if (this.$element.is(':focus')) {
                    this.enable();
                }
            }
        },

        enable: function() {
            if (!this.active) {
                this.active = true;
                this.$element.on({
                    keydown: $.proxy(this.keydown, this),
                    keyup: $.proxy(this.keyup, this)
                });
                this.$completer.on({
                    mousedown: $.proxy(this.mousedown, this),
                    mouseover: $.proxy(this.mouseover, this)
                });
            }
        },

        disable: function() {
            if (this.active) {
                this.active = false;
                this.$element.off({
                    keydown: this.keydown,
                    keyup: this.keyup
                });
                this.$completer.off({
                    mousedown: this.mousedown,
                    mouseover: this.mouseover
                });
            }
        },

        attach: function(val) {
            var options = this.options;
            var separator = options.separator;
            var regexp = this.regexp;
            var part = regexp ? val.match(regexp) : null;
            var matched = [];
            var all = [];
            var that = this;
            var reg;
            var item;

            if (part) {
                part = part[0];
                val = val.replace(regexp, '');
                reg = new RegExp('^' + espace(part), 'i');
            }

            $.each(this.data, function(i, n) {
                n = separator + n;
                item = that.template(val + n);

                if (reg && reg.test(n)) {
                    matched.push(item);
                } else {
                    all.push(item);
                }
            });

            matched = matched.length ? matched.sort() : all;

            if (options.position === 'top') {
                matched = matched.reverse();
            }

            this.fill(matched.join(''));
        },

        suggest: function(val) {
            var reg = new RegExp(espace(val), 'i');
            var that = this;
            var matched = [];

            $.each(this.data, function(i, n) {
                if (reg.test(n)) {
                    matched.push(n);
                }
            });

            matched.sort(function(a, b) {
                return a.indexOf(val) - b.indexOf(val);
            });

            $.each(matched, function(i, n) {
                matched[i] = that.template(n);
            });

            this.fill(matched.join(''));
        },

        template: function(text) {
            var tag = this.options.itemTag;

            return ('<' + tag + '>' + text + '</' + tag + '>');
        },

        fill: function(html) {
            var filter;

            this.$completer.empty();

            if (html) {
                filter = this.options.position === 'top' ? ':last' : ':first';
                this.$completer.html(html);
                this.$completer.children(filter).addClass(this.options.selectedClass);
                this.show();
            } else {
                this.hide();
            }
        },

        complete: function() {
            var options = this.options;
            var val = options.filter(this.$element.val()).toString();

            if (val === '') {
                this.hide();
                return;
            }

            if (options.suggest) {
                this.suggest(val);
            } else {
                this.attach(val);
            }
        },

        keydown: function(e) {
            var keyCode = e.keyCode || e.which || e.charCode;

            if (keyCode === 13) {
                e.stopPropagation();
                e.preventDefault();
            }
        },

        keyup: function(e) {
            var keyCode = e.keyCode || e.which || e.charCode;

            if (keyCode === 13 || keyCode === 38 || keyCode === 40) {
                this.toggle(keyCode);
            } else {
                this.complete();
            }
        },

        mouseover: function(e) {
            var options = this.options;
            var selectedClass = options.selectedClass,
                $target = $(e.target);

            if ($target.is(options.itemTag)) {
                $target.addClass(selectedClass).siblings().removeClass(selectedClass);
            }
        },

        mousedown: function(e) {
            e.stopPropagation();
            e.preventDefault();
            this.setValue($(e.target).text());
        },

        setValue: function(val) {
            this.$element.val(val);
            this.options.complete(val);
            this.hide();
        },

        toggle: function(keyCode) {
            var selectedClass = this.options.selectedClass;
            var $selected = this.$completer.find('.' + selectedClass);

            switch (keyCode) {

                // Down
                case 40:
                    $selected.removeClass(selectedClass);
                    $selected = $selected.next();
                    break;

                    // Up
                case 38:
                    $selected.removeClass(selectedClass);
                    $selected = $selected.prev();
                    break;

                    // Enter
                case 13:
                    this.setValue($selected.text());
                    break;

                    // No default
            }

            if ($selected.length === 0) {
                $selected = this.$completer.children(keyCode === 40 ? ':first' : ':last');
            }

            $selected.addClass(selectedClass);
        },

        place: function() {
            var $element = this.$element;
            var offset = $element.offset();
            var left = offset.left;
            var top = offset.top;
            var height = $element.outerHeight();
            var width = $element.outerWidth();
            var styles = {
                minWidth: width,
                zIndex: this.options.zindex
            };

            switch (this.options.position) {
                case 'right':
                    styles.left = left + width;
                    styles.top = top;
                    break;

                case 'left':
                    styles.right = $window.innerWidth() - left;
                    styles.top = top;
                    break;

                case 'top':
                    styles.left = left;
                    styles.bottom = $window.innerHeight() - top;
                    break;

                    // case 'bottom':
                default:
                    styles.left = left;
                    styles.top = top + height;
            }

            this.$completer.css(styles);
        },

        show: function() {
            this.$completer.show();
            $window.on(EVENT_RESIZE, $.proxy(this.place, this));
            $document.on(EVENT_MOUSE_DOWN, $.proxy(this.hide, this));
        },

        hide: function() {
            this.$completer.hide();
            $window.off(EVENT_RESIZE, this.place);
            $document.off(EVENT_MOUSE_DOWN, this.hide);
        },

        destroy: function() {
            var $this = this.$element;

            this.hide();
            this.disable();

            $this.off({
                focus: this.enable,
                blur: this.disable
            });

            $this.removeData(NAMESPACE);
        }
    };

    Completer.DEFAULTS = {
        itemTag: 'li', //自定义列表标签
        position: 'bottom', //列表方向
        source: [],   //列表所需的数据
        selectedClass: 'completer-selected', //下拉列表选中的类名
        separator: '', //补全内容连接符
        suggest: false, //是否开启模糊匹配
        template: '<ul class="completer-container"></ul>', //自定义下拉框
        zindex: 1,  //元素层级
        complete: $.noop, //成功回调
        filter: function(val) {  //显示列表之前对表单的值进行处理
            return val;
        }
    };

    Completer.setDefaults = function(options) {
        $.extend(Completer.DEFAULTS, options);
    };

    // Save the other completer
    Completer.other = $.fn.completer;

    // Register as jQuery plugin
    $.fn.qccrcompleter = function(option) {
        var args = [].slice.call(arguments, 1);
        var result;

        this.each(function() {
            var $this = $(this);
            var data = $this.data(NAMESPACE);
            var options;
            var fn;

            if (!data) {
                if (/destroy/.test(option)) {
                    return;
                }

                options = $.extend({}, $this.data(), $.isPlainObject(option) && option);
                $this.data(NAMESPACE, (data = new Completer(this, options)));
            }

            if (typeof option === 'string' && $.isFunction(fn = data[option])) {
                result = fn.apply(data, args);
            }
        });

        return typeof result !== 'undefined' ? result : this;
    };

    $.fn.qccrcompleter.Constructor = Completer;
    $.fn.qccrcompleter.setDefaults = Completer.setDefaults;

    // No conflict
    $.fn.qccrcompleter.noConflict = function() {
        $.fn.qccrcompleter = Completer.other;
        return this;
    };
    QCCR.extend({
      completerInit : function(){
        $('[data-toggle="completer"]').qccrcompleter();
      }
    });
    QCCR.setInit(["completerInit"]);
}());

      function selectCar(options) {
    options = options || {};
    var detaults = {
        step: 5,
        success: function() {},
        isDrag: true
    }
    options = $.extend(true, detaults, options);
    if (options.step < 1) {
        options.step = 1;
    }
    if (options.step > 5) {
        options.step = 5;
    }
    this.opt = {};
    for (var i in options) {
        this.opt[i] = options[i];
    }
    this.opt.stepNow = 1;
    this.ajaxurl = "http://m.qccr.com";
     this.stephtml = [];
    this.branddata = null;
    this.cardata={};
    this.init();
    this.carxi="";
}

selectCar.prototype = {
    constructor: selectCar,
    init: function() {
        this.remove().createElement();
    },
    gocenter: function(div) {
        div.css({
            left: (document.documentElement.clientWidth - 760) / 2,
            top: (document.documentElement.clientHeight - 479) / 2
        })
    },
    stephead: function(index) {
        if(typeof index != "undefined"){
             this._box.find('.qccr-model-carstep .qccr-model-round').eq(index-1).addClass('round').removeClass('round2');
              this._box.find('.qccr-model-carstep .qccr-model-round').eq(index-1).parent().css({"color":"#d12a3e"});
        }else{
            var _index = this.opt.stepNow;
           this._box.find('.qccr-model-carstep .qccr-model-round').addClass('round2').removeClass('round').eq(_index - 1).addClass('round').removeClass('round2');
        }
    },
    superLog: function (content,options,func){
        var dilog=null;
    if(dilog)
    {
        return false;
    }
    var __this=this;
    this.ele=$('<div class="dialog"><h3 class="title">提示</h3><div class="close">x</div><div class="content"></div>');
    this.auto=true;
    if(options){
      for(var key in options){
        __this[key]=options[key];
      }
    }
    this.close=function(){
        dilog=null;
      $(__this.ele).remove();
    }
    this.setcontent=function(){
      if(content&&typeof content=="string"){
        __this.ele.find(".content").html("<p>"+content+"</p>");
      }else if(content&&(typeof content)=="object"){
        __this.ele.find(".title").html(content.title);
        __this.ele.find(".content").html(content.content);
      }
      __this.ele.find(".close").bind("click",function(){
      __this.close();
      });
    };
    this.center=function(mydiv){
        mydiv[0].style.left = (document.documentElement.clientWidth - mydiv.width()) / 2+"px";
        mydiv[0].style.top = (document.documentElement.clientHeight-mydiv.height()) / 2-50+"px";
    }
    this.init=function(){
      __this.setcontent();
      $("body").append(__this.ele);
      __this.center(__this.ele);
      dilog=true;
      if(__this.auto){
        setTimeout(function(){
           __this.close();
        },__this.autotime?__this.autotime:3000);
      }
       if(func&&(typeof func)=="function"){
        func(__this);
       }
    }
    this.init();
  },
    getJsonData: function(url, data, callfunc, errfunc) {
        var _this=this;
        $.ajax({
            url: url,
            data: data,
            dataType: "jsonp",
            jsonp: "callback",
            success: function(data) {
                if (data.code == 0 || data.code == 1 || data.success == true) {
                    callfunc(data);
                } else if (data.code == -200) {
                    $(".loginout").show();
                } else {
                    if (errfunc)
                        errfunc(data);
                    else
                        new _this.superLog(data.data);
                }
            },
            error: function(data) {
                if (errfunc)
                    errfunc(data);
            }
        });
    },
    // 到达规定步数返回数据并关闭窗口
    checkStep : function(){
        var _me = this;
        if(_me.opt.stepNow > _me.opt.step){
            _me.opt.success(_me.cardata);
            return true;
        }
        return false;
    },
    dataName : function(data){
                var _data = {};
                data.forEach(function(value){
                    if(value["manufacturer"] && !_data[value["manufacturer"]]){
                        _data[value["manufacturer"]] = [];
                        _data[value["manufacturer"]].push(value);
                    }else{
                        _data[value["manufacturer"]].push(value);
                    }
                })
                return _data
            },
     chexi:function (data) {
                data=this.dataName(data);
    var html = "",
        manufacturer = "",
        series = "";
    var seriesCOunt = 0;
    var newmanufacturer=[];
      for(var key in data){
           html += "<div class='CarBrandTitle'><span class='CarBrandTitlespan'></span>" + key + "</div>"; 
            data[key].forEach(function(value){
                  
                          html += "<div class='carOneTitle CarVecl1' data-ht='" + value.carCategoryId + "' data-id='" + value.manufacturer + "' data-vehicle='" + value.series + "'>" + value.carCategoryName + "</div>";
            })
      }


   $(".qccr-model-div5").html(html);
 
    // for (var i = 0; i < data.length; i++) {

    //     if (data[i].manufacturer != manufacturer) {
    //             manufacturer = data[i].manufacturer;
    //              html += "<div class='CarBrandTitle'><span class='CarBrandTitlespan'></span>" + manufacturer + "</div>"; 
    //     }
    //     if (data[i].series != series) {
    //         seriesCOunt = 0;

    //     }
    //       series = data[i].series;
    //     var carCategoryName = data[i].carCategoryName;


    //     if (i != data.length - 1) {
    //         if (carCategoryName != series) {
    //             seriesCOunt++;
    //         }

    //         if (data[i + 1].series == series) {
    //             seriesCOunt++;
    //             continue;
    //         }

    //     }

    //     if (seriesCOunt > 0) {
    //         html += "<div class='carOneTitle CarVecl2'  data-id='" + manufacturer + "' data-vehicle='" + series + "'>" + series + "</div>";
    //     } else {
    //         html += "<div class='carOneTitle CarVecl1' data-ht='" + data[i].carCategoryId + "' data-id='" + manufacturer + "' data-vehicle='" + series + "'>" + carCategoryName + "</div>";

    //     }
    // }

    // $(".qccr-model-div5").html(html);

    //    $(".CarBrandTitle").each(function(i){
    //       if($(this).next().attr("class") == "CarBrandTitle"){
    //         $(this).remove();
    //       }
    // });


},
    selcar:function (list, dataid, series) {
        var html = "";
        html += "<div class='CarBrandTitle'><span class='CarBrandTitlespan'></span>" + dataid + "</div>";
        for (var i = 0; i < list.length; i++) {
            if (list[i].manufacturer == dataid && list[i].series == series) {
                html += "<div class='CarVecl1' data-ht='" + list[i].carCategoryId + "' title='" + list[i].carCategoryName + "'  data-id='" + list[i].carCategoryName + "' data-vehicle='" + list[i].series + "'>" + list[i].carCategoryName + "</div>";
            }
        }

        return html;
    },
 jsonsToString: function(conent) {
    function arrayToString(arr) {
        var nstr = "";
        for (var i = 0; i < arr.length; i++) {
            if (typeof arr[i] == "object") {
                if (arr[i].length) {
                    arr[i] = arrayToString(arr[i])
                } else {
                    arr[i] = NjsonToString(arr[i])
                }
            } else if (typeof arr[i] == "string") {
                arr[i] = '"' + arr[i] + '"'
            }
        }
        nstr += '[' + arr.join(",") + ']';
        return nstr
    }
    var str = "{";
    for (var key in conent) {
        if (typeof conent[key] == "number") {
            str += '"' + key + '":' + conent[key] + ','
        } else {
            if (typeof conent[key] == "object") {
                if (conent[key].length) {
                    str += '"' + key + '":' + arrayToString(conent[key]) + ','
                } else {
                    str += '"' + key + '":' + NjsonToString(conent[key]) + ','
                }
            } else if (!conent[key]) {
                continue
            } else {
                str += '"' + key + '":"' + conent[key] + '",'
            }
        }
    }
    str += "}";
    str = str.replace(/\,\}/g, "}");
    str = str.replace(/\]\"/g, "]").replace(/\}\"/g, "}").replace(/\"\{/g, "{").replace(/\"\[/g, "[");
    return str
},
    over:function () {
        var _this=this;
    $(".qccr-model-div8").show();
    $(".qccr-model-div7").hide();
    var carName="";
    if(typeof _this.cardata.detailvehicle  == 'undefined' ){
             carName = _this.cardata.CarBrand ;
    }else{
            carName = _this.cardata.CarBrand + " " + unescape(_this.cardata.detailvehicle);
    }
    $(".datacar").html(carName);

    setTimeout(function() {
        _this.close();
    }, 1500);

    if (window.localStorage) {
        if (_this.cardata.sailyearid == _this.cardata.detailvehicleid) {

            _this.cardata.detailvehicle = escape(_this.cardata.detailvehicle);
            _this.cardata.vehicle = escape(_this.cardata.vehicle);
            localStorage.carSelect = _this.jsonsToString(_this.cardata);


            for (var i = 0; i < _this.stephtml.length; i++) {
                _this.stephtml[i] = "\'" + escape(_this.stephtml[i]) + "\'";
            }

            localStorage.stephtml = "[" + _this.stephtml.join(",") + "]";

            localStorage.stephtmlheade = $(".hiswarp").html();

        } else {
            try {
                localStorage.removeItem("stephtml");
                localStorage.removeItem("stephtmlheade");

            } catch (e) {
            }
        }

    }
     _this.stephtml = [];
     _this.stephtmlheade = "";
    try {
        addCookie("carid", _this.cardata.detailvehicleid, {
            expires: 3600 * 24 * 30
        });
        addCookie("sailyearid", _this.cardata.sailyearid, {
            expires: 3600 * 24 * 30
        });
        addCookie("carbrand", _this.cardata.CarBrandid, {
            expires: 3600 * 24 * 30
        });
    } catch (e) {}
},
    selyear:function (yearlist) {
        var _this=this;
        var html = '';
        for (var i = 0; i < yearlist.length; i++) {
            html += "<div class='CarNian1' data-id='" + yearlist[i].carCategoryId + "'  data-nian='" + yearlist[i].carCategoryName + "' >" + yearlist[i].carCategoryName + "</div>";

        }
        return html;
    },
    step1: function() {
        var _this = this;
        _this._box.show();
        _this.gocenter(_this._box);
        _this.opt.stepNow = 1;
        _this.stephtml = [];
        _this.stephead();
        if (window.localStorage) {
            try {
                localStorage.removeItem("stephtml");
                localStorage.removeItem("stephtmlheade");
            } catch (e) {}
        }
        _this._box.find(".qccr-model-div7,.qccr-model-div8").hide();
        _this._box.find(".qccr-model-div2").show();
        _this._box.find(".CarHistoryTitlediv").remove();
        _this.getJsonData(_this.ajaxurl + "/api/datacenter/car/getCarByParentIdBatch?api=superapi", {parentIds:'["1"]'}, function(data) {
            _this.branddata = _this.dataFilte(data.info);
            _this.brandcar(_this.dataFilte(data.info));
          
        }, function() {
            _this._box.find(".qccr-model-div2").html("<p style='text-align:center;padding:5px;font-size:16px;'>请求数据错误<p>");
        });

    },
   arrStr: function (id){
    var newArr=[];
    newArr[0]=id;
    newArr=JSON.stringify(newArr);
    return newArr;
    },
    step2:function(){
    
          var _this = this;
            _this.opt.stepNow = 2;
            var newCarBrandId=_this.arrStr(_this.cardata.CarBrandid);

          _this.stephead(2);
            var html = "<div class='CarHistoryTitlediv'><div class='CarHistoryTitle'>" + _this.cardata.CarBrand + "</div><div class='CarHistoryTitleDel' data-index='1'></div></div>";
            $(".qccr-model-div40 .hiswarp").append(html);

            $(".qccr-model-div2").hide();
            $(".qccr-model-div7").show();
                    
            _this.getJsonData(_this.ajaxurl + "/api/datacenter/car/getCarByParentIdBatch?api=superapi", {
              parentIds:newCarBrandId
            }, function(data) {
                _this.carxi = data.info;
                _this.chexi(data.info);
               
            });
 
    },
    step21:function () {
        var _this = this;
           _this.opt.stepNow = 3;
               _this.stephead(3);
        var html = "<div class='CarHistoryTitlediv'><div class='CarHistoryTitle'>" + _this.cardata.vehicle + "</div><div class='CarHistoryTitleDel' data-index='12'></div></div>";
                var str = _this.selcar(_this.carxi, _this.cardata.vehicleid, _this.cardata.vehicle);
                $(".qccr-model-div5").html(str);
                $(".qccr-model-div40 .hiswarp").append(html);
        },
        selpailiang:function (data) {
            var html = "";

            for (var i = 0; i < data.length; i++) {
                html += "<div class='CarPaiLiang1' data-id='" + data[i].carCategoryId + "' >" + data[i].carCategoryName + "</div>";

            }
            return html;
        },
        step3:function () {
              var _this = this;
                _this.opt.stepNow = 3;
            _this.stephead(3);

                var newdetailvehicleId=_this.arrStr(_this.cardata.detailvehicleid);

            var html = "<div class='CarHistoryTitlediv'><div class='CarHistoryTitle'>" + _this.cardata.detailvehicle + "</div><div class='CarHistoryTitleDel' data-index='2'></div></div>";
           
            _this.getJsonData(_this.ajaxurl + "/api/datacenter/car/getCarByParentIdBatch?api=superapi", {
                 parentIds:newdetailvehicleId
            }, function(data) {
        
                    $(".qccr-model-div40 .CarHistoryTitleDel[data-index=2]").parents(".CarHistoryTitlediv").remove();
                    $(".qccr-model-div40 .hiswarp").append(html);
                try {
                    if (isList) {
                        _this.cardata.sailyearid = _this.cardata.detailvehicleid;
                        _this.cardata.yearid=_this.cardata.detailvehicleid;
                        _this.over();
                        return false;
                    }
                } catch (e) {
                }
                if (data.info.length == 0) {
                    _this.over();
                    return false;
                } else {
                }
                $(".qccr-model-div5").html(_this.selpailiang(data.info));
            });
        },
        step4:function () {
              var _this = this;
                _this.opt.stepNow = 4;
            _this.stephead(4);
                var newpailiangId=_this.arrStr(_this.cardata.pailiangid);

            var html = "<div class='CarHistoryTitlediv'><div class='CarHistoryTitle'>" + _this.cardata.pailiang + "</div><div class='CarHistoryTitleDel' data-index='3'></div></div>";
            _this.getJsonData(_this.ajaxurl + "/api/datacenter/car/getCarByParentIdBatch?api=superapi", {
             parentIds:newpailiangId
            }, function(data) {
                if (data.info.length == 0) {
                    _this.stephtml = [];
                    _this.stephtmlheade = "";
                    _this.over();

                }
                $(".qccr-model-div40 .hiswarp").append(html);
                $(".qccr-model-div5").html(_this.selyear(data.info));
            });
        },
        step5:function () {
                var _this = this;
                _this.opt.stepNow = 5;
                _this.stephead(5);
                var newYearid=_this.arrStr(_this.cardata.yearid);

            var html = "<div class='CarHistoryTitlediv'><div class='CarHistoryTitle'>" + _this.cardata.year + "</div><div class='CarHistoryTitleDel' data-index='8'></div></div>";
            $(".qccr-model-div40 .hiswarp").append(html);
            _this.getJsonData(_this.ajaxurl + "/api/datacenter/car/getCarByParentIdBatch?api=superapi", {
                 parentIds:newYearid
            }, function(data) {
                    
                if (data.info.length <= 1) {
                    if (data.info.length == 1) {
                            _this.cardata.sailyear = data.info[0].carCategoryName;
                            _this.cardata.sailyearid = data.info[0].carCategoryId;
                            if(_this.opt.step == 5){
                                _this.opt.success(_this.cardata);
                            }
                        
                    }
                    _this.stephtml = [];
                    _this.stephtmlheade = "";
                    _this.over();
                }
                $(".qccr-model-div5").html(_this.selsailyear(data.info));
            });
        },
       selsailyear : function (list) {
         var html = "<div class='selsailyearInfo'><img src='http://static.qichechaoren.com/static/o2o/shop/images/selsailyear.png'><p>选错发动机型号往往会导致配件出错无法安装，括号中的信息代表该车对应的发动机型号，<span>例：EQ6100</span></p></div>";
            for (var i = 0; i < list.length; i++) {
                html += "<div class='SailCarNian1' data-id='" + list[i].carCategoryId + "' title='" + list[i].carCategoryName + "'  data-sailnian='" + list[i].carCategoryName + "' >" + list[i].carCategoryName + "</div>";

            }
            return html;
        },
        brandcarlist: function(list) {
        var str = "";
            var imgUrl="http://static.qichechaoren.com/upload/logo/";
        for (var i = 0; i < list.length; i++) {
            if (i == 0) {
                str += "<div class='CarBrand' data-id='" + list[i].carCategoryId + "' data-brand='" + list[i].carCategoryName + "'><div style='float:left'><img src="+imgUrl + list[i].logoImg + "></div><div class='Line'></div> " + list[i].carCategoryName + "</div>";
            } else {
                str += "<div class='CarBrand2' data-id='" + list[i].carCategoryId + "' data-brand='" + list[i].carCategoryName + "'><div style='float:left'><img src="+imgUrl + list[i].logoImg + "></div><div class='Line'></div> " + list[i].carCategoryName + "</div>";
            }

        }
        return str;
    },
    dataFilte : function(data){
                var _data = {};
                var _ar ="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
                _ar.forEach(function(val){
                    _data[val] = [];
                });
                data.forEach(function(value){
                   
                    _data[value["shortCut"]].push(value);
                });
                for (var prop in _data) {
                    if (_data.hasOwnProperty(prop)) {
                        if(_data[prop].length == 0){
                            delete _data[prop]
                        }
                    }
                }

                return _data
            },
    brandcar: function(data) {
        var _this = this;
         // data = _this.dataFilte(data);
        var html = "",
            htmlBrand = "";
           
        for (var key in data) {
            if (key == "hot") {

                html += "<div class='CarZiMu1'>热门</div>";
                htmlBrand = _this.brandcarlist(data[key]);
            } else {
                html += "<div class='CarZiMu2'>" + key + "</div>";
            }
        };
     
        htmlBrand = _this.brandcarlist(data["A"]);
        _this._box.find(".qccr-model-div2 .shouzimu").eq(0).html(html);
        _this._box.find(".qccr-model-div2 .shouzimu div").eq(0).attr('class', "CarZiMuSelect");
        _this._box.find(".qccr-model-CarBrands").html(htmlBrand);

    },
    remove: function() {
        $('.qccrui-car-model').remove();
        return this;
    },
    close: function() {

        if (this._div.length > 0) {
            this._div.remove();
        }

    },
    stepJump:function(step){
        var _me=this;
         if(_me.opt.step ==step){
                 _me.over();
         }
    },
    resetAyrray:function (s) {
        var _this=this;
    var arr = new Array();
    for (var i = 0; i < s; i++) {
        arr[i] = _this.stephtml[i];
        }
        return arr;
    },
    bindEvent: function() {
        var _me = this;
        _me._box.on({
                click: function() {
                    _me.close();
                }
            }, '.qccr-model-close')
            .on({
                mouseover: function() {
                    var cur = $(this).index();
                    var htmlBrand = '';
                    if (cur == -1) {
                        $(this).attr("class", "CarZiMu1");
                        _me._box.find(".qccr-model-div2 .shouzimu div").not(":eq(0)").attr("class", "CarZiMu2");
                        htmlBrand = _me.brandcarlist(_me.branddata["hot"]);

                    } else {
                        _me._box.find(".qccr-model-div2 .shouzimu div").attr("class", "CarZiMu2");
                        $(this).attr("class", "CarZiMuSelect");

                        htmlBrand = _me.brandcarlist(_me.branddata[$(this).html()]);

                    }
                    _me._box.find(".qccr-model-CarBrands").html(htmlBrand);
                }
            }, '.qccr-model-div2 .shouzimu div')
            .on({
                click:function(){
                              _me.cardata.CarBrand = $(this).attr("data-brand");
                              _me.cardata.CarBrandid = $(this).attr("data-id");
                              _me.stephtml.push(_me._box.find(".qccr-model-div2").html());
                              _me.step2();
                              _me.checkStep();
                              _me.stepJump(1);
                }
            },".CarBrand,.CarBrand2")
             .on("click", ".CarHistoryTitlediv .CarHistoryTitleDel", function() {
                        var i = $(this).parent(".CarHistoryTitlediv").index();
                        _me._box.find('.qccr-model-carstep .qccr-model-round').eq(i+1).parent().css({"color":"#ccc"});
 _me._box.find('.qccr-model-carstep .qccr-model-round').eq(4).removeClass('round');
_me._box.find('.qccr-model-carstep .qccr-model-round').eq(4).addClass('round2');
 _me._box.find('.qccr-model-carstep .qccr-model-round').eq(4).parent().css({"color":"#ccc"});

_me._box.find('.qccr-model-carstep .qccr-model-round').eq(i+1).parent().next().css({"color":"#ccc"});

                    _me._box.find('.qccr-model-carstep .qccr-model-round').eq(i+1).removeClass('round');
_me._box.find('.qccr-model-carstep .qccr-model-round').eq(i+1).parent().next().find(".qccr-model-round").removeClass('round');
                    _me._box.find('.qccr-model-carstep .qccr-model-round').eq(i+1).addClass('round2');
_me._box.find('.qccr-model-carstep .qccr-model-round').eq(i+1).parent().next().find(".qccr-model-round").addClass('round2');
                        if (i == 2 && $(this).attr("data-index") == 2) {
                            _me.stephead(2);
                        } else {
                            _me.stephead(i+1);
                        }
                        if (i == 0) {
                            _me.step1();
                        } else {
                            if (i == 2 && $(this).attr("data-index") == 2) {
                                $(".qccr-model-div5").html(_me.stephtml[i]);
                                _me.stephtml =_me.resetAyrray(i);
                            } else {
                                $(".qccr-model-div5").html(_me.stephtml[i]);
                                     _me.stephtml =_me.resetAyrray(i);            
                            }
                            $(".qccr-model-div2").hide();
                            $(".qccr-model-div7").show();
                            $(".CarHistoryTitlediv").eq(i).nextAll().remove();
                            $(".CarHistoryTitlediv").eq(i).remove();
                        }
                    })
                    .on({
                        click:function(){
                            _me.cardata.vehicle = $(this).attr("data-vehicle");
                            _me.cardata.vehicleid = $(this).attr("data-id");
                            _me.stephtml.push(_me._box.find(".qccr-model-div5").html());
                            _me.step21();
                            _me.checkStep();
                             _me.stepJump(2);
                        }
                    },".CarVecl2")
                 .on({
                        click:function(){
                            var id = $(this).attr("data-ht");
                              _me.cardata.detailvehicle = $(this).html();
                              _me.cardata.detailvehicleid = id;
                              _me.stephtml.push(_me._box.find(".qccr-model-div5").html());
                              _me.step3();
                              _me.checkStep();
                              _me.stepJump(2);
                        }
                    },".CarVecl1")
                 .on("click", ".CarPaiLiang1", function() {
                            var id = $(this).attr("data-id");
                            _me.cardata.pailiang = $(this).html();
                            _me.cardata.pailiangid = id;
                            _me.stephtml.push($(".qccr-model-div5").html());
                            _me.step4();
                            _me.checkStep();
                           _me.stepJump(3);
                            
                     })
                  .on("click", ".CarNian1", function() {
                            _me.cardata.year = $(this).html();
                            _me.cardata.yearid = $(this).attr("data-id");
                            _me.stephtml.push($(".qccr-model-div5").html());
                            _me.step5();
                            _me.checkStep();
                             _me.stepJump(4);


                }).on("click", ".SailCarNian1", function() {
                    _me.opt.stepNow = 5;
                    _me.stephead(5);
                    _me.cardata.sailyear = $(this).html();
                    _me.cardata.sailyearid = $(this).attr("data-id");
                    _me.stephtml = [];
                    _me.stephtmlheade = "";
                    // _me.checkStep();
                    _me.over();
                      _me.opt.success(_me.cardata);
                });

    },
    getStep: function() {
        var _html = '';
        for (var i = 1; i <= this.opt.step; i++) {
            if (i == 1) {
                _html += '<span class="head_div2"><span class="qccr-model-round round">1</span>选择品牌</span>';
            }
            if (i == 2) {
                _html += '<span class="head_div3"><span class="qccr-model-round round2">2</span>选择车系</span>';
            }
            if (i == 3) {
                _html += '<span class="head_div5"><span class="qccr-model-round round2">3</span>选择排量</span>';
            }
            if (i == 4) {
                _html += '<span class="head_div5"><span class="qccr-model-round round2">4</span>生产年份</span>'
            }
            if (i == 5) {
                _html += '<span class="head_div5"><span class="qccr-model-round round2">5</span>销售年份</span>'
            }
        }
        return _html;
    },
    createElement: function() {

        var _me = this,

            colseIcon = 'http://www.qccr.com/resources/shop/default/images/icon_modal.png',
            _div = $('<div class="qccrui-car-model">'),
            _bgdiv = $('<div>').attr('style', "display:block ;position: fixed; z-index: 9999998; background-color: black; opacity: 0.3; right: 0px; bottom: 0px; left: 0px; top: 0px;filter:alpha(opacity=30)\9;"),
            _box = $('<div class="qccr-body" id="carsel">').attr("style", "z-index: 9999999; position: fixed;").html('<div class="qccr-model-title" style="height: 45px"><div style="float: left; width: 20px;  height: 16px; background-position: 0px -180px;  margin-top: 14px;"></div><div class="SelectCar">选择车型</div><div class="qccr-model-close" style="width: 20px;height:16px; cursor:pointer;background:url(' + colseIcon + ');background-position: 0px -220px;margin-top: 14px;float: right" class="close"></div></div><div class="qccr-model-carstep" style="border: 1px solid #d5d5d5; height: 37px; background-color: #ffffff; ">' + _me.getStep() + '</div><div style="padding-bottom: 10px; margin-top: 6px;" class="qccr-model-div2" class="clearfix"><div style=" padding-top: 16px"><div class="shouzimu" style="margin-top: -4px;width:710px;height:32px;"></div></div><div class="qccr-model-CarBrands"></div></div><div class="qccr-model-div7" style="display: none;"><div  class="qccr-model-div40 clearfix"><div class="qccr-model-div4">已选车型</div><div class="hiswarp"></div></div><div class="qccr-model-div5"></div></div><div class="qccr-model-div8"><div class="qccr-over"></div><div class="succeed">车型选择成功！</div><hr class="hr2"><div id="CarOver"></div><p style="padding:10px;text-align:center">您选的车型是：<span class="datacar"></span></p></div>');
                  

        _div.append(_bgdiv, _box);
        _box.hide();
        $('body').append(_div);
        if (this.opt.isDrag) {
            QCCR.divDrag({
                btn: _box.find('.qccr-model-title')[0],
                box: _box[0]
            })
        }
        this._bgdiv = _bgdiv;
        this._div = _div;
        this._box = _box;
        this.bindEvent();
        this.step1();
    }
}


QCCR.extend({
    selectCar: function(obj) {
        new selectCar(obj);
    }
});

      
;(function($,window,document,undefined){

	//配置参数
	var defaults = {
		totalData:0,			//数据总条数
		showData:0,				//每页显示的条数
		pageCount:9,			//总页数,默认为9
		current:1,				//当前第几页
		prevCls:'prev',			//上一页class
		nextCls:'next',			//下一页class
		prevContent:'<',		//上一页内容
		nextContent:'>',		//下一页内容
		activeCls:'active',		//当前页选中状态
		coping:false,			//首页和尾页
		homePage:'',			//首页节点内容
		endPage:'',				//尾页节点内容
		count:3,				//当前页前后分页个数
		jump:false,				//跳转到指定页数
		jumpIptCls:'jump-ipt',	//文本框内容
		jumpBtnCls:'jump-btn',	//跳转按钮
		jumpBtn:'跳转',			//跳转按钮文本
		callback:function(){}	//回调
	};

	var Pagination = function(element,options){
		//全局变量
		var opts = options,//配置
			current,//当前页
			$document = $(document),
			$obj = $(element);//容器

		/**
		 * 设置总页数
		 * @param int page 页码
		 * @return opts.pageCount 总页数配置
		 */
		this.setTotalPage = function(page){
			return opts.pageCount = page;
		};

		/**
		 * 获取总页数
		 * @return int p 总页数
		 */
		this.getTotalPage = function(){
			var p = opts.totalData || opts.showData ? Math.ceil(parseInt(opts.totalData) / opts.showData) : opts.pageCount;
			return p;
		};

		//获取当前页
		this.getCurrent = function(){
			return current;
		};

		/**
		 * 填充数据
		 * @param int index 页码
		 */
		this.filling = function(index){
			var html = '';
			current = index || opts.current;//当前页码
			var pageCount = this.getTotalPage();
			if(current > 1){//上一页
				html += '<a href="javascript:;" class="'+opts.prevCls+'">'+opts.prevContent+'</a>';
			}else{
				$obj.find('.'+opts.prevCls) && $obj.find('.'+opts.prevCls).remove();
			}
			if(current >= opts.count * 2 && current != 1 && pageCount != opts.count){
				var home = opts.coping && opts.homePage ? opts.homePage : '1';
				html += opts.coping ? '<a href="javascript:;" data-page="1">'+home+'</a><span>...</span>' : '';
			}
			var start = current - opts.count,
				end = current + opts.count;
			((start > 1 && current < opts.count) || current == 1) && end++;
			(current > pageCount - opts.count && current >= pageCount) && start++;
			for (;start <= end; start++) {
				if(start <= pageCount && start >= 1){
					if(start != current){
						html += '<a href="javascript:;" data-page="'+start+'">'+ start +'</a>';
					}else{
						html += '<span class="'+opts.activeCls+'">'+ start +'</span>';
					}
				}
			}
			if(current + opts.count < pageCount && current >= 1 && pageCount > opts.count){
				var end = opts.coping && opts.endPage ? opts.endPage : pageCount;
				html += opts.coping ? '<span>...</span><a href="javascript:;" data-page="'+pageCount+'">'+end+'</a>' : '';
			}
			if(current < pageCount){//下一页
				html += '<a href="javascript:;" class="'+opts.nextCls+'">'+opts.nextContent+'</a>'
			}else{
				$obj.find('.'+opts.nextCls) && $obj.find('.'+opts.nextCls).remove();
			}

			html += opts.jump ? '<input type="text" class="'+opts.jumpIptCls+'"><a href="javascript:;" class="'+opts.jumpBtnCls+'">'+opts.jumpBtn+'</a>' : '';

			$obj.empty().html(html);
		};

		//绑定事件
		this.eventBind = function(){
			var self = this;
			var pageCount = this.getTotalPage();//总页数
			$obj.off().on('click','a',function(){
				if($(this).hasClass(opts.nextCls)){
					var index = parseInt($obj.find('.'+opts.activeCls).text()) + 1;
				}else if($(this).hasClass(opts.prevCls)){
					var index = parseInt($obj.find('.'+opts.activeCls).text()) - 1;
				}else if($(this).hasClass(opts.jumpBtnCls)){
					if($obj.find('.'+opts.jumpIptCls).val() !== ''){
						var index = parseInt($obj.find('.'+opts.jumpIptCls).val());
					}else{
						return;
					}
				}else{
					var index = parseInt($(this).data('page'));
				}
				self.filling(index);
				typeof opts.callback === 'function' && opts.callback(self.getCurrent(),self.getTotalPage());
			});
			//输入跳转的页码
			$obj.on('input propertychange','.'+opts.jumpIptCls,function(){
				var $this = $(this);
				var val = $this.val();
				var reg = /[^\d]/g;
	            if (reg.test(val)) {
	                $this.val(val.replace(reg, ''));
	            }
	            (parseInt(val) > pageCount) && $this.val(pageCount);
	            if(parseInt(val) === 0){//最小值为1
	            	$this.val(1);
	            }
			});
			//回车跳转指定页码
			$document.keydown(function(e){
				// var self = this;
		        if(e.keyCode == 13 && $obj.find('.'+opts.jumpIptCls).val()){
		        	var index = parseInt($obj.find('.'+opts.jumpIptCls).val());
		            self.filling(index);
					typeof opts.callback === 'function' && opts.callback(self.getCurrent(),self.getTotalPage());
		        }
		    });
		};

		//初始化
		this.init = function(){
			this.filling(opts.current);
			this.eventBind();
		};
		this.init();
	};

	$.fn.qccrpagination = function(parameter,callback){
			$(this).attr("data-qccrpage","true");

		if(typeof parameter == 'function'){//重载
		
			callback = parameter;
			parameter = {};
		}else{
			parameter = parameter || {};
			callback = callback || function(){};
		}
		var options = $.extend({},defaults,parameter);
		return this.each(function(){
			var pagination = new Pagination(this, options);
			callback(pagination);
		});
	};

})(jQuery,window,document);


	if (QCCR && QCCR.initFn) {
    $(function() {
        var i = 0,
            _fn = QCCR.initFn,
            _len = _fn.length;
        if (_len > 0) {
            for (var i = 0; i < _len; i++) {
                if (_fn[i] in QCCR) {
                    QCCR[_fn[i]]();
                }
            };
        }
    });
}
if (typeof module != 'undefined' && module.exports) {
    module.exports = QCCR;
} else if (typeof define == 'function' && define.amd) {
    define(function() {
        return QCCR;
    });
} else {
    window.QCCR = QCCR;
}

}(window,document,jQuery));
