	Layer = {};
	/***
	 * Layer �����㴦���࣬��Ҫ����չʾ�����ص����㡣�ṩ���·����������
	 * 
	 * ���window.open������
	 * open(url,name,feature,sourceWindow[,mask,moveLimited]);
	 * close([id])
	 * 
	 * �´��ڲ������ڵ�������Ƕ��iframe��������ָ��url��
	 * openWin(url,name,feature,sourceWindow[,mask,moveLimited]);
	 * closeWin([id])
	 * 
	 * ���������������һ�������㣬���ָ��html���룺
	 * showDiv(title, html, width, height[, top, left, mask,moveLimited])
	 * hideDiv([id])
	 * 
	 * @author CHENLONG
	 */
	Layer = {
		WIN_WIN_PREF : "LAYOUT_WIN_",
		WIN_DIV_PREF : "LAYOUT_DIV_",
		zIndex : 100,// ��������㱻�ڵ�ʱ����������˲���
		/**
		 * ģ��һ���´��ڣ���close()����һ��ʹ�ã��˷�������ֱ���滻window.open������
		 * url ��������
		 * title ����
		 * features ��������������ƣ�'width=200,height=100'
		 * sourceWindow Դ���ڣ��˴��ڻ���Ϊ�������ڵ�opener
		 * mask �Ƿ���Ҫ�ɰ棬Ĭ����(��ѡ)
		 * moveLimited �϶�ʱ�Ƿ�����(ֻ���ڵ�ǰ�����϶�) Ĭ����(��ѡ) �������ڱȽϴ�ʱ����������
		 */
		open:function(url, title, features, sourceWindow, mask,moveLimited){
			try{
				if(top.Layer){
					// ����һ��url
					if(!(NsUtil.startWith(url,"/") || NsUtil.startWith(url,"https:")|| NsUtil.startWith(url,"http:")|| NsUtil.startWith(url,"file:"))){
						var path = (sourceWindow||window).document.location.pathname;
						var context = path.substring(0,path.indexOf('/',2)+1);
						url = context +url;
					}
					return top.Layer.openWin(url,title, features, sourceWindow, mask,moveLimited);
				}
			}catch(e){
				if(!e.message || e.message.indexOf("Ȩ��") < 0){
					throw e;
				}
			}
			return Layer.openWin(url,title, features, sourceWindow, mask,moveLimited);
		},
		/**
		 * �رմ��ڣ���open()����һ��ʹ�ã��˷�������ֱ���滻window.open������
		 * id ��Ҫ�رմ��ڵ�ID��Ĭ�Ϲر�ȫ��(��ѡ)
		 */
		close : function(id){
			try{
				if(self!=top && top.Layer){
					top.Layer.closeWin(id);
				}
			}catch(e){
				if(!e.message || e.message.indexOf("Ȩ��") < 0){
					throw e;
				}
			}
			Layer.closeWin(id);
		},
		/**
		 * ģ��һ���´��ڣ���closeWin()����һ��ʹ�ã�
		 * url ��������
		 * title ����
		 * features ��������������ƣ�'width=200,height=100'
		 * sourceWindow Դ���ڣ��˴��ڻ���Ϊ�������ڵ�opener(��ѡ)
		 * mask �Ƿ���Ҫ�ɰ棬Ĭ����(��ѡ)
		 * moveLimited �϶�ʱ�Ƿ�����(ֻ���ڵ�ǰ�����϶�) Ĭ����(��ѡ)
		 */
		openWin : function(url, title, features, sourceWindow, mask,moveLimited,border) {
			var _id = escape(this.WIN_WIN_PREF + url);
			var exists = NsUtil.F(_id);
			if(!!exists){
				return ;
			}
			// ��������
			features = features || "";
			var featureArray = features.split(",");
			var featureObject = new Object();
			for ( var i = 0; i < featureArray.length; i++) {
				var array = featureArray[i].toString().split("=");
				featureObject[NsUtil.trim(array[0])] = NsUtil.trim(array[1]);
			}
			//�����ɰ�
			moveLimited = !(moveLimited === false);
			mask = !(mask === false);
			if (true == mask)
				this.createMask(_id, function() {
					Layer.close(_id);
				});
			// ������������
			var iframeName = "iframe_" + this.zIndex;
			var iframeHtml = "<iframe id='" + _id + "_iframe' src='' width=100% height=100% frameborder=0 name="
					+ iframeName + " ></iframe>";
			this.createContentDiv(_id, iframeHtml, title, featureObject.width,
					featureObject.height, featureObject.top,
					featureObject.left, border,function() {
						Layer.close(_id);
					},featureObject.fullscreen);
			try {
				(sourceWindow || {}).NSTC_LAYER_ID = _id;
				window[iframeName].NSTC_LAYER_ID = _id;
				window[iframeName].opener = sourceWindow;
				window[iframeName].close = function() {
					Layer.closeWin(_id);
				}
				// TJF�޸ģ��������ҳ����μ���js��ͻ���������
				window[iframeName].location.href=url;
			} catch (e) {
				NsUtil.log("�����������������:"+ e?e.message:"δ֪");
			}
			// ֧����ק
			new Dragable(_id, {
				mxContainer : document.body,
				Handle : _id + "_header",
				Limit : moveLimited
			});
			// ����꽻���´���
			try{
				window[iframeName].focus();
			}catch(e){
			}
			try{
				var text = window[iframeName].jQuery(":text:visible");
				text[0] && text[0].focus();
			}catch(e){}
			
			return window[iframeName];
		},
		/**
		 * �رմ��ڣ���openWin()����һ��ʹ�ã�
		 * id ��Ҫ�رմ��ڵ�ID��Ĭ�Ϲر�ȫ��(��ѡ)
		 */
		closeWin : function(id) {
			if (!id) {
				// ��ָ��idʱ���Ƴ����е�����
				var divs = document.getElementsByTagName("div") || [];
				for ( var i = 0, k = divs.length; i < k; i++) {
					var div = divs[i];
					if (div && div.layId && NsUtil.startWith(div.id, this.WIN_WIN_PREF)) {
						Layer.closeWin(div.id);
					}
				}
				return;
			}
			// ���Ƴ�Iframe��ĳЩ�Բе�IE�汾���ܻ�����Ƴ������󣬵�iframe��Ȼ�����BUG
			var ifr = NsUtil.F(id+"_iframe");
			if(ifr){
				ifr.src="";
				ifr.parentElement.removeChild(ifr);
			}
			// �Ƴ�������DIV
			var div = NsUtil.F(id);
			if (div) {
				div.parentElement.removeChild(div);
			}
			// �Ƴ��ɰ�
			var maskId = id + "_layoutBackground";
			var mask = NsUtil.F(maskId);
			if (mask) {
				mask.parentElement.removeChild(mask);
			}
		},
		/**
		 * ����һ���㣬�������ָ��HTML����hideDiv()����һ��ʹ�ã�
		 * title ����
		 * html ������html
		 * width �߶�
		 * height ���
		 * top �൱ǰ���ڶ�������(��ѡ)
		 * left �൱ǰ����������(��ѡ)
		 * mask �Ƿ����ɰ�,Ĭ����(��ѡ)
		 * moveLimited �϶�ʱ�Ƿ�����(ֻ���ڵ�ǰ�����϶�) Ĭ����(��ѡ)
		 */
		showDiv : function(title, html, width, height, top, left, mask,moveLimited,border) {
			var _id = escape(this.WIN_DIV_PREF + new Date().getTime());
			//�����ɰ�
			moveLimited = !(moveLimited===true);
			mask = !(mask === false);
			if (mask) {
				this.createMask(_id, function() {
					Layer.hideDiv(_id);
				});
			}
			// ����������
			this.createContentDiv(_id, html, title, width, height, top, left,border,
					function() {
						Layer.hideDiv(_id);
					});
			// ��ק
			new Dragable(_id, {
				mxContainer : document.body,
				Handle : _id + "_header",
				Limit : moveLimited
			});
			return _id;
		},
		/**
		 * �رյ����㣬��showDiv()����һ��ʹ��
		 * id �������id,Ĭ�Ϲر����е�����(��ѡ)
		 */
		hideDiv : function(id) {
			if (!id) {
				var divs = document.getElementsByTagName("div") || [];
				for ( var i = 0, l = divs.length; i < l; i++) {
					var div = divs[i];
					if (div && div.layId && NsUtil.startWith(div.id, this.WIN_DIV_PREF)) {
						Layer.hideDiv(div.id);
					}
				}
				return;
			}
			var div = NsUtil.F(id);
			if (div) {
				div.parentElement.removeChild(div);
			}
			var maskId = id + "_layoutBackground";
			var mask = NsUtil.F(maskId);
			if (mask) {
				mask.parentElement.removeChild(mask);
			}
		},
		/* �����ɰ棬�����ⲿ���� */
		createMask : function(_id, cancleCb) {
			var bgObj = NsUtil.F(_id + "_layoutBackground");
			if (!bgObj) {
				//<div id="layoutBackground" class="layoutBackground" style="display:none;"></div>
				bgObj = document.createElement("DIV");
				bgObj.id = _id + "_layoutBackground";
				bgObj.className = "layoutBackground";
				bgObj.style.display = "block";
				bgObj.style.zIndex = this.zIndex++;
				NsUtil.addEventHandler(bgObj, "dblclick", cancleCb);
				document.body.appendChild(bgObj);
			}
		},
		/* ���������㣬�����ⲿ���� */
		createContentDiv : function(id, html, title, width, height, top, left,border,
				closeCb,fullscreen) {
			// ������ʵ�λ��
			// �����С
			if(fullscreen==1 || fullscreen == 'yes'){
				// ֧��ȫ��
				width = 1000000;
				height = 1000000;
			}
			var _width_p = null;
			var _width = parseInt(width) || 860;
			var _height = parseInt(height) || 500;
			if(_width>document.body.clientWidth){
				_width = document.body.clientWidth;
				_width_p="100%";
			}
			if(_height>document.body.clientHeight){
				_height=document.body.clientHeight-28;
			}
			// ����λ��
			var _left = parseInt(left)
					|| (parseInt((document.body.clientWidth - _width) / 2) );
			var _top = parseInt(top)
					|| (parseInt((document.body.clientHeight - _height) / 2) - 50);
			// left��top�����������С��0��������Ϊ0
			if (_left < 0) {
				_left = 0;
			} 
			if (_top < 0) {
				_top = 0;
			}
			// ����title
			if(!title || NsUtil.trim(title)=="_blank" || NsUtil.trim(title)=="_self" || NsUtil.trim(title)=="blank"){
				title = "";
			}
			// ��װHTML
			var divId = id;
			var divContent = document.createElement("DIV");
			var divContentHeaderLeft = document.createElement("DIV");
			var divContentHeaderCen = document.createElement("DIV");
			var divContentHeaderRight = document.createElement("DIV");
			var divContentBody = document.createElement("DIV");
			// ����������
			divContent.id = id;
			divContent.className = "layoutContentDiv";
			divContent.layId=id;
			divContent.style.width = _width_p||(_width + "px");
			//divContent.style.height=_height+"px";
			divContent.style.top = _top + "px";
			divContent.style.left = _left + "px";
			divContent.style.zIndex = this.zIndex++;
			divContent.style.postion = "absolute";
			divContent.style.display = "block";
			if(!(border===false)) divContent.style.border="1px solid #c0c0c0";
			// ����
			divContentHeaderLeft.className = "layoutContentHeader_left";
			divContentHeaderCen.className = "layoutContentHeader_center";
			divContentHeaderCen.id = id + "_header";
			// ������
			divContentHeaderCen.innerHTML = "<b>" + title + "</b>";
			// �ı������״
			divContentHeaderCen.style.cursor="move";
			// �رհ�ť
			divContentHeaderRight.className = "layoutContentHeader_right";
			NsUtil.addEventHandler(divContentHeaderRight, "click", closeCb
					|| function() {
						Layer.close(id);
					});
			// ������
			divContentBody.id = id + "_body";
			divContentBody.style.width = "100%";
			divContentBody.style.height = _height + "px";
			divContentBody.style.display = "block";
			divContentBody.innerHTML = html;

			divContent.appendChild(divContentHeaderLeft);
			divContent.appendChild(divContentHeaderCen);
			divContent.appendChild(divContentHeaderRight);
			divContent.appendChild(divContentBody);
			
			document.body.appendChild(divContent);
		}
	};

	var NsUtil = NsUtil || {};
	function Extend(destination, source) {
		for ( var property in source) {
			destination[property] = source[property];
		}
	}
	Extend(NsUtil, {
		isIE : (document.all) ? true : false,
		/**
		 * �����̨��ӡ��Ϣ
		 */
		log : function (msg) {
			if (window.console && window.console.log && msg) {
				console.log(msg);
			}
		},
		/**
		 * document.getElementById��д
		 */
		F : function(id) {
			if(!!id){
				if(id.tagName) return id;
				return document.getElementById(id);
			}
			return null;
		},
		/**
		 * ����initialize�½���
		 */
		Class : {
			create : function() {
				return function() {
					this.initialize.apply(this, arguments);
				}
			}
		},
		Bind : function(object, fun) {
			return function() {
				return fun.apply(object, arguments);
			}
		},
		BindAsEventListener : function(object, fun) {
			return function(event) {
				return fun.call(object, (event || window.event));
			}
		},
		CurrentStyle : function(element) {
			return element.currentStyle
					|| document.defaultView.getComputedStyle(element, null);
		},
		addEventHandler : function(oTarget, sEventType, fnHandler) {
			if (oTarget.addEventListener) {
				oTarget.addEventListener(sEventType, fnHandler, false);
			} else if (oTarget.attachEvent) {
				oTarget.attachEvent("on" + sEventType, fnHandler);
			} else {
				oTarget["on" + sEventType] = fnHandler;
			}
		},
		removeEventHandler : function(oTarget, sEventType, fnHandler) {
			if (oTarget.removeEventListener) {
				oTarget.removeEventListener(sEventType, fnHandler, false);
			} else if (oTarget.detachEvent) {
				oTarget.detachEvent("on" + sEventType, fnHandler);
			} else {
				oTarget["on" + sEventType] = null;
			}
		},
		trim : function(val) {
			return val?val.replace(/(^\s*)|(\s*$)/g, ""):"";
		},
		startWith : function(str, s) {
			if (s == null || s == "" || str.length == 0
					|| s.length > str.length)
				return false;
			if (str.substr(0, s.length) == s)
				return true;
			else
				return false;
			return true;
		},
		endWith : function(str, s) {
			if (s == null || s == "" || str.length == 0
					|| s.length > str.length)
				return false;
			if (str.substring(str.length - s.length) == s)
				return true;
			else
				return false;
			return true;
		}
	});
	// �Ϸų���
	var Dragable = NsUtil.Class.create();
	Dragable.prototype = {
		// �ϷŶ���
		initialize : function(drag, options) {
			this.Drag = NsUtil.F(drag);// �ϷŶ���
			this._x = this._y = 0;// ��¼�������ϷŶ����λ��
			this._marginLeft = this._marginTop = 0;// ��¼margin
			// �¼�����(���ڰ��Ƴ��¼�)
			this._fM = NsUtil.BindAsEventListener(this, this.Move);
			this._fS = NsUtil.Bind(this, this.Stop);
			this.SetOptions(options);
			this.Limit = !!this.options.Limit;
			this.mxLeft = parseInt(this.options.mxLeft);
			this.mxRight = parseInt(this.options.mxRight);
			this.mxTop = parseInt(this.options.mxTop);
			this.mxBottom = parseInt(this.options.mxBottom);

			this.LockX = !!this.options.LockX;
			this.LockY = !!this.options.LockY;
			this.Lock = !!this.options.Lock;

			this.onStart = this.options.onStart;
			this.onMove = this.options.onMove;
			this.onStop = this.options.onStop;

			this._Handle = NsUtil.F(this.options.Handle) || this.Drag;
			this._mxContainer = NsUtil.F(this.options.mxContainer) || null;

			this.Drag.style.position = "absolute";
			this.positionMove = !!this.options.positionMove;
			// ͸��
			if (NsUtil.isIE && !!this.options.Transparent) {
				// ����ϷŶ���
				with (this._Handle.appendChild(document.createElement("div")).style) {
					width = height = "100%";
					backgroundColor = "#fff";
					filter = "alpha(opacity:0)";
					fontSize = 0;
				}
			}
			// ������Χ
			this.Repair();
			NsUtil.addEventHandler(this._Handle, "mousedown", NsUtil
					.BindAsEventListener(this, this.Start));
		},
		// ����Ĭ������
		SetOptions : function(options) {
			this.options = {// Ĭ��ֵ
				Handle : "",// ���ô������󣨲�������ʹ���ϷŶ���
				Limit : false,// �Ƿ����÷�Χ����(Ϊtrueʱ�����������,�����Ǹ���)
				mxLeft : 0,// �������
				mxRight : 9999,// �ұ�����
				mxTop : 0,// �ϱ�����
				mxBottom : 9999,// �±�����
				mxContainer : "",// ָ��������������
				LockX : false,// �Ƿ�����ˮƽ�����Ϸ�
				LockY : false,// �Ƿ�������ֱ�����Ϸ�
				Lock : false,// �Ƿ�����
				Transparent : false,// �Ƿ�͸��
				positionMove : false,// ��ʼ״̬�Ƿ���Ϊ���ƶ�
				onStart : function() {
				},// ��ʼ�ƶ�ʱִ��
				onMove : function() {
				},// �ƶ�ʱִ��
				onStop : function() {
				}// �����ƶ�ʱִ��
			};
			Extend(this.options, options || {});
		},
		// ׼���϶�
		Start : function(oEvent) {
			if (this.Lock) {
				return;
			}
			// ���ѡ��
			window.getSelection ? window.getSelection().removeAllRanges()
					: document.selection.empty();
			this.Repair();
			// ��¼�������ϷŶ����λ��
			this._x = oEvent.clientX - this.Drag.offsetLeft;
			this._y = oEvent.clientY - this.Drag.offsetTop;
			// ��¼margin
			this._marginLeft = parseInt(NsUtil.CurrentStyle(this.Drag).marginLeft) || 0;
			this._marginTop = parseInt(NsUtil.CurrentStyle(this.Drag).marginTop) || 0;
			// mousemoveʱ�ƶ� mouseupʱֹͣ
			NsUtil.addEventHandler(document, "mousemove", this._fM);
			NsUtil.addEventHandler(document, "mouseup", this._fS);
			if (NsUtil.isIE) {
				// ���㶪ʧ
				NsUtil.addEventHandler(this._Handle, "losecapture", this._fS);
				// ������겶��
				this._Handle.setCapture();
			} else {
				// ���㶪ʧ
				NsUtil.addEventHandler(window, "blur", this._fS);
				// ��ֹĬ�϶���
				oEvent.preventDefault();
			}
			// ���ӳ���
			this.onStart();
		},
		// ������Χ
		Repair : function() {
			if (this.Limit) {
				// ��������Χ����
				this.mxRight = Math.max(this.mxRight, this.mxLeft
						+ this.Drag.offsetWidth);
				this.mxBottom = Math.max(this.mxBottom, this.mxTop
						+ this.Drag.offsetHeight);
				// �����������������positionΪrelative��absolute����Ի���Զ�λ�����ڻ�ȡoffset֮ǰ����
				!this._mxContainer
						|| NsUtil.CurrentStyle(this._mxContainer).position == "relative"
						|| NsUtil.CurrentStyle(this._mxContainer).position == "absolute"
						|| (this._mxContainer.style.position = "relative");
			}
		},
		// �϶�
		Move : function(oEvent) {
			// �ж��Ƿ�����
			if (this.Lock) {
				this.Stop();
				return;
			}
			// �����ƶ�����
			var iLeft = oEvent.clientX - this._x, iTop = oEvent.clientY
					- this._y;
			// ���÷�Χ����
			if (this.Limit) {
				// ���÷�Χ����
				var mxLeft = this.mxLeft, mxRight = this.mxRight, mxTop = this.mxTop, mxBottom = this.mxBottom;
				// �����������������������Χ����
				if (!!this._mxContainer) {
					mxLeft = Math.max(mxLeft, 0);
					mxTop = Math.max(mxTop, 0);
					mxRight = Math.min(mxRight, this._mxContainer.clientWidth);
					mxBottom = Math.min(mxBottom,
							this._mxContainer.clientHeight);
				}
				// �����ƶ�����
				iLeft = Math.max(Math.min(iLeft, mxRight - this.Drag.offsetWidth), mxLeft);
				iTop = Math.max(Math.min(iTop, mxBottom - this.Drag.offsetHeight), mxTop);
			}
			// ����λ�ã�������margin
			if (!this.LockX) {
				this.Drag.style.left = iLeft - this._marginLeft + "px";
			}
			if (!this.LockY) {
				this.Drag.style.top = iTop - this._marginTop + "px";
			}
			// ���ӳ���
			this.onMove();
		},
		// ֹͣ�϶�
		Stop : function() {
			// �Ƴ��¼�
			NsUtil.removeEventHandler(document, "mousemove", this._fM);
			NsUtil.removeEventHandler(document, "mouseup", this._fS);
			if (NsUtil.isIE) {
				NsUtil.removeEventHandler(this._Handle, "losecapture",this._fS);
				this._Handle.releaseCapture();
			} else {
				NsUtil.removeEventHandler(window, "blur", this._fS);
			}
			this.positionMove = true;
			// ���ӳ���
			this.onStop();
		}
	};

