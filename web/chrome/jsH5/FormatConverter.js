// �ٳֱ���submit���ԣ�ʹ��ָ���Զ��庯������������������ֶ����ñ���onsubmit������
// ���onsubmit����true��ִ��ԭ��ָ����Ǹ�submit������
// 1. ���onsubmit����true����Ӱ�������ط�����form.submit()����
// 2. �������false,��ִ��ԭ�ύ����
$(function(){
	var forms = document.getElementsByTagName('form');
	for(var i=0;i<forms.length;i++){
		var func = forms[0].submit;
		forms[0].submit=function(){
			if(this.onsubmit() != false)
				func.apply(this); // IE8  �����IE6,7��Ϊ func();   
		}
	}
}); 

// ת������,���������ת���������case��ڼ���
/**
function convert(obj){
	var eles = $("#"+obj.id+" :text[format],#"+obj.id+" :hidden[format]");
	$.each(eles,function(i,n){
		var format = $(n).attr("format").toUpperCase();
		switch (format){
		case 'MONEY':
			convertFromMoney(n);
			break;
		default :
			alert("�޷���ɸ�ʽת����δ֪��ת����ʽ��"+format);
		}
	});

	var f1 = window['build_FormValue_SlickGrid_Unit_Data'];
	if(Object.prototype.toString.apply(f1) === '[object Function]'){
		f1(obj);
	}

	return true;
	
}
// ת�����
function convertFromMoney(text){
	text.value = text.value.replace(/,/g,"");
}
�Ż���ĺ���
**/
//ת������,���������ת���������case��ڼ���
function convert(obj){
	//var eles = $("#"+obj.id+" :text[format],#"+obj.id+" :hidden[format]");
	var eles = $("#"+obj.id+" [format]");

	$.each(eles,function(i,n){
		var format = $(n).attr("format").toUpperCase();
		switch (format){
		case 'MONEY':
			convertFromMoney(n);
			break;
		default :
			alert("�޷���ɸ�ʽת����δ֪��ת����ʽ��"+format);
		}
	});

	var f1 = window['build_FormValue_SlickGrid_Unit_Data'];
	if(Object.prototype.toString.apply(f1) === '[object Function]'){
		f1(obj);
	}

	return true;
	
}
//ת�����
function convertFromMoney(text){
	if("undefined" != typeof(text.value) && "undefined" != typeof(text.type) ){
		if("text" == text.type || "hidden" == text.type){
           text.value = text.value.replace(/,/g,"");
		}
		
	}
}