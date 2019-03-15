if(!nstc) var nstc = {};
nstc.cookieUtil = {
		/**���ӻ��߸���һ��cookie*/
		setCookie:function(objName, objValue, objHours){
			var str = objName + "=" + escape(objValue);
			if (objHours > 0) { // Ϊ0ʱ���趨����ʱ�䣬������ر�ʱcookie�Զ���ʧ
				var date = new Date();
				var ms = objHours * 3600 * 1000;
				date.setTime(date.getTime() + ms);
				str += "; expires=" + date.toGMTString();
			}
			document.cookie = str;
		},
		/**ɾ��cookie*/
		delCookie:function(name){
			var exp = new Date();
			exp.setTime(exp.getTime() - 1);
			var cval = getCookie(name);
			if (cval != null)
				document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
		},
		/**ȡ����Ϊname��cookieֵ*/
		getCookie:function(name){
			var cookieArray = document.cookie.split("; "); // �õ��ָ��cookie��ֵ��
			//var cookie = new Object();
			for ( var i = 0; i < cookieArray.length; i++) {
				var arr = cookieArray[i].split("="); // ������ֵ�ֿ�
				if (arr[0] == name)
					return unescape(arr[1]); // �����ָ����cookie���򷵻�����ֵ
			}
			return "";
		}
		
}
