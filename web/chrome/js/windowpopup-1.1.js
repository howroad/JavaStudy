/**
*	�滻ԭ����window.open������ͬʱʹ��windowClose
*	�汾 1.0
*/
window.x_open=window.open;
window.open=function(url,name,features){
   if(top.Layer){ // ������ڵ�������
		return top.Layer.open(url, name, features, window, true);
   }else if(url){ // ���URL��Ϊ��
	   // ZPJ�޸ģ�Ϊ�����������ӱ�ʶ����ʹ�ò�ѯ����
	   url = url.indexOf("?") > -1 ? (url + "&isJumpWindow=1") : (url + "?isJumpWindow=1");
		name='_'+(name==null?'W':name);
	    var newWin = window.x_open('',name,features);
		var k=x_link(newWin,url,null);
		if(k==null){//���´��崴��ʧ���ڱ����峢�Դ���
			k=x_link(window,url,name);
		}
	    k.click();
		return newWin;
   }else{ // ���ʹ��ԭ������
	   // ZPJ�޸ģ�Ϊ�����������ӱ�ʶ����ʹ�ò�ѯ����
	   url = url.indexOf("?") > -1 ? (url + "&isJumpWindow=1") : (url + "?isJumpWindow=1");
		return window.x_open(url,name,features);
   }
}

window.x_link=function(win,url,target){
   try{
	   var k = win.document.getElementById('_LK');
	   if(k==null){
		  k=win.document.createElement('A');
		  k.id='_LK';
		  k.style.display='none';
		  if(target!=null){
			k.target=target;
		  }
		  k.href=url;
		  win.document.body.appendChild(k);
	   }
	   if(target!=null){
			k.target=target;
	   }
	   k.href=url;
   }catch(e){}
   return win.document.getElementById('_LK');//�������»�ȡ
}

window.replaceURL=function(url){
   x_link(window,url,'_self').click();
}
windowOpen = window.open;// ͨ�õĴ򿪴��ڷ���
windowClose = function(){// ͨ�õĹرմ��ڷ���	SMP1.4.7 �滻opener.NSTC_LAYER_ID
	if(top.Layer && window.frameElement.getAttribute('nstc_layer_id')){
		top.Layer.close(window.frameElement.getAttribute('nstc_layer_id'));
	}else{
		window.close();
	}
}
