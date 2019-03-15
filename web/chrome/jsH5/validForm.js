/**
 * @description У���������
 * @depJs dynamicForm.js
 */
/*--------- �����ռ� ---------*/
if (!nstc)
	var nstc = {};
if (!nstc.sf)
	nstc.sf = {};

/**
 * ����ָ���¼��������ڵı���У������������
 * Ŀǰֻ����<input>,<textarea>��<select>��ͨ������IF�жϿ����������Ӽ���
 * ���Ϊ��У����ڵ�ĳһ��Ԫ�ء�
 *
 */
nstc.sf.validateForm = function(th) {
	var form = nstc.sf.findParent(th, "FORM");
	var id = "div\\."+th.id.split(".")[0];
	// input
	if(!nstc.sf.validateAllInputs(form,"input")){
		return false ;
	}
	// select 
	if(!nstc.sf.validateAllInputs(form,"select")){
		return false;
	}
	// textarea
	if(!nstc.sf.validateAllInputs(form,"textarea")){
		return false;
	}
	// ���ӣ�nstc.sf.validate ��ҵ�������ʹ�ã����У���߼����������ID
	// nstc.sf.validate ����true��ͨ����֤�������ػ��߷���false��ͨ����֤
	if(nstc.sf.validate && !nstc.sf.validate(id)){
		return false;
	}
	return true;
}
/**��ִ֤������ָ��Ԫ�ء�
 * �������("form1","select")������֤form1������select��ֵ��
 * ��idΪ�գ�����ҳ������ָ��tagName��ֵ��
 */
nstc.sf.validateAllInputs = function(frm,tagName){
	inStr = tagName+":visible[validate$='|']";
	var vinputs = $(frm).find(inStr);
	for ( var i = 0; i < vinputs.length; i++) {
		var input = vinputs[i];
		if(!nstc.sf.validateValue(input)){
			return false;
		}
	}
	return true;
}

/**��ִ֤������ָ��Ԫ�ء�
 * �������("form1","select")������֤form1������select��ֵ��
 * ��idΪ�գ�����ҳ������ָ��tagName��ֵ��
 */
nstc.sf.validateInputs = function(id,tagName){
	var inStr = "";
	if(id){
		inStr="#"+id+" ";
	}
	inStr = inStr + tagName+":visible[validate$='|']";
	var vinputs = $(inStr);
	for ( var i = 0; i < vinputs.length; i++) {
		var input = vinputs[i];
		if(!nstc.sf.validateValue(input)){
			return false;
		}
	}
	return true;
}
//���ݹ�����ָ֤��������������([object]select)������֤��select��ֵ
nstc.sf.validateValue =  function(input){
	var types = $(input).attr("validate");
	if(!types){
		return true;
	}
	var typeArray = types.split("|");
	if(typeArray.length > 0){
		for(var j=0;j<typeArray.length-1;j++){
			// ��֤�ǿ�
			if (typeArray[j] == 'require') {
				var hint = nstc.sf.validateEmpty_Ext(input);
				if(!hint){
					return false;
				}
			}
			// ��֤����
			if (typeArray[j] == 'number') {
				var hint2 = nstc.sf.validateNumber(input);
				if(!hint2){
					return false;
				}
			}
			// ��֤���ڸ�ʽ
			if (typeArray[j] == 'date') {
				var hint3 = nstc.sf.validateDate(input);
				if(!hint3){
					return false;
				}
			}
			// ���ӡ������Ԫ�������һ��validate='execute|'��У�����ԣ������ʵ�ַ���nstc.sf.validateExecute(input)�Ը�����������֤��
			// input ����У���Ԫ��(�Զ���validate='execute|'�˵�Ԫ��)��
			if(typeArray[j] && nstc.sf['validate'+nstc.sf.firstLetterUpcase(typeArray[j])]){
				var hint = nstc.sf['validate'+nstc.sf.firstLetterUpcase(typeArray[j])](input);
				if(!hint){
					return false;
				}
			}
		}
	}
	return true;
}

//��֤�ǿ�
nstc.sf.validateEmpty = function(input){
	var s = $.trim(input.value);
	if (s == "" || s.length == 0) {
		var hint = $(input).attr("alt");
		hint = hint||"������";
		alert(hint+"����Ϊ��");
		//nstc.sf.warningFormAlert(hint+"����Ϊ��");
		return false;
	} else {
		return true;
	}
}
//��֤����
nstc.sf.validateNumber = function(input){
	var s = $.trim(input.value);
	var regNum = new RegExp("^([+-]?)\\d*\\.?\\d+$");
	if (regNum.test(s)) {
		return true;
	} else {
		var hint = $(input).attr("alt");
		hint = hint||"���";
		alert(hint+"ֻ��������");
		//nstc.sf.warningFormAlert(hint+'ֻ��������');
		return false;
	}
}
//��֤���ڸ�ʽ
nstc.sf.validateDate = function(input){
	var regDate = new RegExp("^\\d{4}(\\-|\\/|\.)\\d{1,2}\\1\\d{1,2}$");
	if (regDate.test(input.value)) {
		return true;
	} else {
		var hint = $(input).attr("alt");
		hint = hint||"������";
		alert(hint+"��������ȷ�����ڸ�ʽ");
		//nstc.sf.warningFormAlert(hint+'��������ȷ�����ڸ�ʽ');
		return false;
	}
}

nstc.sf.firstLetterUpcase = function(str){
	return str.substr(0,1).toLocaleUpperCase()+str.substring(1);
}
//��֤�ǿգ����� radio,checkbox
nstc.sf.validateEmpty_Ext = function(input){
	var s = $.trim(input.value);
	var hint = $(input).attr("alt");
	var type = $(input).attr("type") ? $(input).attr("type").toLowerCase() : '';/*SMP1.4.7 http://192.168.0.7:8089/browse/BCT-246 input��selectʱ��ȡ����type*/
	var flag = false;
	hint = hint||"������";
	hint +="����Ϊ��";
	if(type == "checkbox" || type == "radio"){
		var inputSiblings = document.getElementsByName(input.name);
		if(inputSiblings !=null){
			for(var i=0; i<inputSiblings.length; i++){
				if($(inputSiblings[i]).is(":checked")){
					flag = true;
					break;
				}
			}
		}
	}else if(s !="" && s !=null){
		flag = true;
	}
	if(!flag){
		alert(hint);
		//nstc.sf.warningFormAlert(hint);
	}
	return flag;
}

//��֤������
nstc.sf.validatePositiveNumber_ = function(input){
	var s = $.trim(input.value);
	var regNum = new RegExp("^[1-9]\\d*$");
	if (regNum.test(s)) {
		return true;
	} else {
		var hint = $(input).attr("alt");
		hint = hint||"���";
		alert(hint+'ֻ����������');
		//nstc.sf.warningFormAlert(hint+'ֻ����������');
		input.focus();
		return false;
	}
}
//��֤������
nstc.sf.validatePositiveNumber_java= function(input){
	var s = $.trim(input.value);
	var regNum = new RegExp("^[1-9]\\d*$");
	if (regNum.test(s)) {
		var sInt = parseInt(s,10);
		if( sInt > 2147483647 ){
			var hint = $(input).attr("alt");
			hint = hint||"���";
			alert(hint+'����ܳ���2147483647');
			//nstc.sf.warningFormAlert(hint+'����ܳ���2147483647');
			//input.focus();
			input.value = '';
			return false;
		}
		return true;
	} else {
		var hint = $(input).attr("alt");
		hint = hint||"���";
		alert(hint+'ֻ����������');
		//nstc.sf.warningFormAlert(hint+'ֻ����������');
		//input.focus();
		input.value = '';
		return false;
	}
}
//��������
nstc.sf.warningFormAlert=function(infoStr){
	/*alert(infoStr);*/
	var dialog=art.dialog({title:'��ʾ',
	 content:infoStr,//��ʾ��Ϣ
	 icon:'warning',//��ʾͼ�꣺����,warning;�ɹ�,succeed;ʧ��,error
	 lock:true,//�Ƿ񵯳����ֲ�
	 opacity:0.55,//���ֲ�͸����
	 background:'#000',//���ֲ���ɫ
	 fllow:document.getElementById('SmartPage__Msg__')});//�öԻ���������ָ��Ԫ�ظ�����
}
//�����ɹ���ʾ
nstc.sf.scucceedAlert=function(infoStr){
	/*alert(infoStr);*/
	var dialog=art.dialog({title:'�ɹ�',
	 content:infoStr,//��ʾ��Ϣ
	 icon:'succeed',//��ʾͼ�꣺����,warning;�ɹ�,succeed;ʧ��,error
	 lock:true,//�Ƿ񵯳����ֲ�
	 opacity:0.55,//���ֲ�͸����
	 background:'#000',//���ֲ���ɫ
	 fllow:document.getElementById('SmartPage__Msg__')});//�öԻ���������ָ��Ԫ�ظ�����
}
//����������ʾ
nstc.sf.errorAlert=function(infoStr){
	/*alert(infoStr);*/
	var dialog=art.dialog({title:'����',
	 content:infoStr,//��ʾ��Ϣ
	 icon:'error',//��ʾͼ�꣺����,warning;�ɹ�,succeed;ʧ��,error
	 lock:true,//�Ƿ񵯳����ֲ�
	 opacity:0.55,//���ֲ�͸����
	 background:'#000',//���ֲ���ɫ
	 fllow:document.getElementById('SmartPage__Msg__')});//�öԻ���������ָ��Ԫ�ظ�����
}
//��������
nstc.sf.warningAlert=function(infoStr){
	/*var res = confirm(infoStr);
	if (res)
	{
		try {
			smartForm_confirm_true();
		} catch (e) {
			if(document.getElementById('smb_is_dev'))// ����ģʽ����ʾ��Ч
				nstc.sf.errorAlert("ȱ��JS�������壬�붨��smartForm_confirm_true()!");
		}
	} else {
		try {
			smartForm_confirm_false();
		} catch (e) {
			if(document.getElementById('smb_is_dev'))// ����ģʽ����ʾ��Ч
				nstc.sf.errorAlert("ȱ��JS�������壬�붨��smartForm_confirm_false()!");
		}
	}*/
	var dialog=art.dialog({title:'����',
	 content:infoStr,//��ʾ��Ϣ
	 icon:'warning',//��ʾͼ�꣺����,warning;�ɹ�,succeed;ʧ��,error
	 lock:true,//�Ƿ񵯳����ֲ�
	 opacity:0.55,//���ֲ�͸����
	 background:'#000',//���ֲ���ɫ
	 button: [
	 {
	 name: 'ȷ��',
	 callback: function () {
	 try {
	 smartForm_confirm_true();
	 } catch (e) {
	 if(document.getElementById('smb_is_dev'))// ����ģʽ����ʾ��Ч
	 nstc.sf.errorAlert("ȱ��JS�������壬�붨��smartForm_confirm_true()!");
	 }
	 },
	 focus: true
	 },
	 {
	 name: 'ȡ��',
	 callback: function () {
	 try {
	 smartForm_confirm_false();
	 } catch (e) {
	 if(document.getElementById('smb_is_dev'))// ����ģʽ����ʾ��Ч
	 nstc.sf.errorAlert("ȱ��JS�������壬�붨��smartForm_confirm_false()!");
	 }

	 }
	 }
	 ],
	 fllow:document.getElementById('SmartPage__Msg__')});//�öԻ���������ָ��Ԫ�ظ�����
}
