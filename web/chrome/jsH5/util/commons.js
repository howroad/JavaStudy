/*
     Purpose	ȥ��һ���ַ�����ǰ��ո�
     Author		ZHH
     Return		string
 */
String.prototype.trim = function() {
     return this.replace(/(^\s*)|(\s*$)/g , '') ;
}

/*
     Purpose	�����ַ����Ƿ���ָ���ַ���ͷ�����ִ�Сд
     Author		ZHH
     Param		chars ��ͷָ�����ַ�
     Return		boolean
 */
String.prototype.startWith = function(chars){
     var matchString = new RegExp("^" + chars) ;
     return this.match(matchString) != null ;
}

/*
     Purpose	�����ַ����Ƿ���ָ���ַ���β�����ִ�Сд
     Author		ZHH
     Param		chars ��βָ�����ַ�
     Return		boolean
 */
String.prototype.endWith = function(chars){
     var matchString = new RegExp(chars + "$") ;
     return this.match(matchString) != null ;
}
/*
     Purpose	ȥ���ַ��������з����ֺͶ�����ַ�
     Author		ZHH
     Date		2004-1-18

     Return		String
*/
String.prototype.excludeNotNumericDot = function(){
     return this.replace(/[^\d|.|-]/g , '') ;
}

/*****************************************************************
7   Name		getStrLength
    Purpose		�ж��ַ����󳤶�(ȫ�ǣ����ļ����ı����2���ַ�) 
    Date		2004-1-17
    Return		boolean
*****************************************************************/
String.prototype.getStrLength = function() {
    var len = 0;
    for (var i = 0; i <this.length; i++) {
        if (this.charCodeAt(i) > 126 || this.charCodeAt(i) < 27) len += 2; else len ++;
    }
    return len;
}

/*****************************************************************
6   Name		nstc.sf.subCHString
    Purpose		���ַ������н�ȡ
    Date		2004-1-17
*****************************************************************/
String.prototype.subCHString = function(start, end){
    var len = 0;
    var str = "";
    for (var i = 0; i < this.length; i++) {
        len += this.charAt(i).getStrLength();
        if (end < len)
            return str;
        else if (start <= len)
            str += this.charAt(i);
    }
    return str;
}
/*****************************************************************
6   Name		nstc.sf.subCHStr
    Purpose		���ַ������н�ȡ
    Date		2004-1-17
*****************************************************************/
String.prototype.subCHStr = function(start,length){
	    return this.subCHString(start, start + length);
}

/*
     Name		shortDate
     Purpose	ȡ�������͵Ķ̸�ʽ  YYYY-MM-DD
     Author		ZHH
     Return		String
*/
 Date.prototype.shortDate = function(){
     return this.getFullYear() + "-" + (this.getMonth() + 1<10?"0"+(this.getMonth()+1):this.getMonth()+1) + "-" + this.getDate() ;
 }
 
 /**
  * ���ܣ��Ƚ���������	
  * ������sDate-��ʼ���ڣ�eDate-��������
  * ���أ���� sDate < eDate ���ؽ������0
  * 		 ��� sDate = eDate ���ؽ������0
  * 		 ��� sDate > eDate ���ؽ��С��0
  */
 function compareDateById(sDateTextId,eDateTextId){
	return compareDate(document.getElementById(sDateTextId),document.getElementById(eDateTextId));
 }
/**
 * ���ܣ��Ƚ���������	
 * ������sDate-��ʼ���ڣ�eDate-��������,resultType-��������(d-��,w-����,m-��,y-��  Ĭ��Ϊ����)
 * ���أ���� sDate < eDate ���ؽ������0
 * 		 ��� sDate = eDate ���ؽ������0
 * 		 ��� sDate > eDate ���ؽ��С��0
 */
function compareDate(sDate,eDate,resultType){
	if(typeof(sDate) == "object"){
		sDate = sDate.value;
	}
	if(typeof(eDate) == "object"){
		eDate = eDate.value;
	}
	var miStart = Date.parse(sDate.replace(/\-/g, '/'));
	var miEnd = Date.parse(eDate.replace(/\-/g, '/'));
	var radix=1;
	var divisor=1;
	if(resultType=="d")
		divisor=radix*1000 * 24 * 3600;
	else if(resultType=="w")
		divisor=radix*7*1000 * 24 * 3600;
	else if(resultType=="m")
		divisor=radix*30*1000 * 24 * 3600;
	else if(resultType=="y")
		divisor=radix*365*1000 * 24 * 3600;
	return (miEnd-miStart)/divisor;
}
 
/*
     Purpose	�������ڼ��������������
     Author		ZHH
     Param 		days   ����
     Return		Date
*/
 Date.prototype.addDays = function(days){
     var interTimes = days * 24 * 60 * 60 * 1000 ;
     return new Date(Date.parse(this) + interTimes) ;
 } 
/*
     Purpose	��ʽ������λһ��
     Author		ZHH
     Param		amount   ��ֵ
     Return		String
 */
  function FormatMoney0(amount , peci){
  	 return FormatMoney(amount,peci,true)
  }
  function FormatMoney(amount , peci,flag){
      var tmpPos = "000000";
      if (0 == amount) {return "0."+tmpPos.substr(0,peci);}
	var result,nTen;
	var data = new String(amount) ;
	var srcData = FormatNumber(data.excludeNotNumericDot(),peci,"0.00");
	if (Math.abs(srcData) < 0.001) return flag==true?"0.00":"";
	strLen = srcData.length;
	dotPos = srcData.indexOf("." , 0);
	if (dotPos <= 0)  dotPos = strLen;
	result = "" ;
	for(var i = dotPos - 1 ; i >= 0 ; i--) {
		result = srcData.charAt(i) + result ;
		if((dotPos - i) % 3 == 0 && i != 0)
			result = "," + result ;
	}
	if (peci > 0) peci = peci + 1;
	var rs = result + srcData.substr(dotPos , peci);
	if(rs.startWith("-,"))
		return "-"+rs.substr(2);
	return rs;
 }
 /*
     Purpose		�ж��ı��������Ƿ�Ϊ��
     Author			ZHH
     Param			objText     �ı���
					message     ������ʾ��Ϣ
					isFocus	    �Ƿ����ý��㣨Ĭ��Ϊtrue��
     Return			boolean
 */
 function isEmpty(objText , message , isFocus){
   if(objText.value==null||objText.value.trim() == ""){
		alert((message==null?"":message) + "������д��");
		if((isFocus != null||isFocus==true)&&objText.focus!=null) objText.focus();
		return true;
   }
   return false ;
 }
 
/*
     Purpose	�����������ַ�������ĵĴ�д����
     Author		ZHH
     Param		amount
     Return		String
 */
 function ChineseNumber(amount) {
    if(!/^\d*(\.\d*)?$/.test(amount)){alert("Number is wrong!"); return "Number is wrong!";}
    var AA = new Array("��","Ҽ","��","��","��","��","½","��","��","��");
    var BB = new Array("","ʰ","��","Ǫ","��","��","��","");
    var a = (""+ amount).replace(/(^0*)/g, "").split("."), k = 0, re = "";
    for(var i=a[0].length-1; i>=0; i--) {
        switch(k) {
            case 0 : re = BB[7] + re; break;
            case 4 : if(!new RegExp("0{4}\\d{"+ (a[0].length-i-1) +"}$").test(a[0]))
                     re = BB[4] + re; break;
            case 8 : re = BB[5] + re; BB[7] = BB[5]; k = 0; break;
        }
        if(k%4 == 2 && a[0].charAt(i+2) != 0 && a[0].charAt(i+1) == 0) re = AA[0] + re;
        if(a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k%4] + re; k++;
    }
    if(a.length > 1) { //����С������(�����С������)
        re += BB[6];
        for(var i=0; i<a[1].length; i++) re += AA[a[1].charAt(i)];
    }
    return re;
}

/*
     Purpose	��ʽ������
     Author		ZHH
     Param		amount   ��ֵ
	 peci       С��λ���������ָ��Ĭ�ϱ���2λ
	 nanResult  ���ΪNaNʱ�ķ��ؽ���������ָ������""
     Return		String
 */
 function FormatNumber(amount , peci ,nanResult){
    var nresult=(nanResult==null)?"":nanResult;
 	if(amount.trim()=="")
 		return nresult;
 	var result = new Number(amount);
    var pecision = 2 ;
    if(peci != null) pecision = peci ;
    return result.toFixed(pecision)=="NaN"?nresult:result.toFixed(pecision) ;
 }
 
 /*
 	 Purpose	��ʽ������
     Param		amount   ��ֵ
	 peci       С��λ���������ָ��Ĭ�ϱ���4λ
     Return		String
 */
 function FormatRate(amount,peci,max){
 	if(amount=="")
 		return "";
 	var pecision=(peci==null?4:peci);
 	var num=FormatNumber(amount,pecision,"0.0000");
 	if(max!=null&&num>max)
 		return "";
 	return num;
 }
 
 /*
     Name		isDate
     Purpose		�ж�һ���ַ���(YYYY-MM-DD)�����Ƿ���Ч
     Author		ZHH
     Param		date     �ַ�������
			hasAlert �Ƿ���ʾ��Ч��Ϣ��Ĭ��Ϊfalse

     Return		��Ч true  ��Ч  false
*/
 function isDate(date , hasAlert) {
    var give = false ;
    var message = "���ڸ�ʽ������ȷ�����ڸ�ʽ���� 2009-01-01" ;
    if (hasAlert != null) give = hasAlert ;
    var result = date.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if(result == null) {
       if(give)	alert(message) ;
       return false;
    }
    var newDate = new Date(result[1], result[3]-1, result[4]);
    var isRight = newDate.getFullYear()==result[1]&&(newDate.getMonth()+1)==result[3]&&newDate.getDate()==result[4] ;
    if(!isRight){
       if(give)	alert(message) ;
    }
    return isRight ;
 }
 
 /*
     Name		checkDate
     Purpose		�����������ڸ�ʽ�Ƿ���ȷ����ȷ�ĸ�ʽΪYYYY-MM-DD
     Author		ZHH
     Param		objText  Text����
           		message  ������ʾ��Ϣ
     Return		��Ч true  ��Ч  false
 */
 function checkDate(objText){
	if(!isDate(objText.value , true)){
	   objText.focus();
	   return false ;
 	}else
	   return true ;
 }
 
/*
 20  Name		validMoney
     Purpose	�����������Ƿ���ȷ
     Author		ZHH
     Param		objText          �ı������
				errMoneyFormat   ����ʽ����ȷ����ʾ��Ϣ
				errMoneyLength   �������̫�����ʾ��Ϣ
     Return		Boolean
 */
 function validMoney(objText , mlength , errMoneyFormat , errMoneyLength){
    var data = objText.value ;
	 if(data == "" || data == "0.00") return false;
    var result,nTen;
    var temp = data.excludeNotNumericDot();
    var srcData = FormatNumber(temp);
    var msg ;
    if(isNaN(srcData)){
		if(errMoneyFormat == null || errMoneyFormat == "")
	  		msg = "������Ľ���ʽ����ȷ��" ;
		else
			msg = errMoneyFormat ;
		alert(msg);
		objText.focus();     // ���ý���
		return false;
    }
    strLen = srcData.length ;
    dotPos = srcData.indexOf(".",0) ;
	var m_length = 16;
	if(mlength != null) m_length = mlength;
    if(strLen > m_length){
		if(errMoneyLength == null || errMoneyLength == "")
		   msg = "������Ľ��λ������" ;
		else
		   msg = errMoneyLength ;
		alert(msg);
		objText.focus();     // ���ý���
		return false;
    }
    return true ;
 }

/*
     Purpose		���س�ʱ�൱�ڰ���TAB��ת�ƽ���
     Author		ZHH
     Return		void
 */
 function Tab(){
   if ( event.keyCode == 13 ) event.keyCode = 9;
 }

 // ���´���
function openwin(url, name, width, height) {
	if (height == null)height = screen.availHeight-150;
	if (width == null)width = screen.availWidth-30;
	if(name==null)name="_blank"
	var winObj = window.open(url, name, "height=" + height + ", width=" + width + ", toolbar=no, " + "menubar=no, scrollbars=yes , resizable=yes," + "location=no, status=no");
	resetToCenter(winObj, width, height);
	winObj.opener = window;
	return winObj;
}
/*
 * �򿪴��ڣ�������ʾ
 * ������widthX ���ڿ��  hightY ���ڸ߶�
 */
function resetToCenter(wObject, width, height) {
	if(!top.Layer){
		var xx = (window.screen.width - width) / 2;
		var yy = (window.screen.height - height) / 2;
		wObject.moveTo(xx, yy);
	}	
}
function sprint(frmName, tbName){
	var oFrom = $(frmName);
	if(oFrom == null){
		alert("��:" + frmName + "������");
		return;
	}
	var oTb = $(tbName);
	if(oTb == null){
		alert("���:" + tbName + "������");
		return;
	}
	var oExcelTarget = oFrom.all("text");
	if(oExcelTarget == null){
		alert("�޷��ύ����");
		return;
	}
	oExcelTarget.value = oTb.outerHTML;
	oFrom.action = "sprint.jsp";
	oFrom.target = "sprintPDF";
	winScroll("", "sprintPDF", 750, 500);
	oFrom.submit();
}

/**
 * ����ͬһ�������µ�ָ������Ԫ�ء�
 * ����Һ��Լ�ͬһ��TR�µ�����ΪacntNo��Ԫ�أ�nstc.sf.findInSameParent(this,"TR","acntNo",false);
 * ����Һ��Լ�ͬһ��TD�µ�����Ϊxxxxx.acntNo��Ԫ�أ�nstc.sf.findInSameParent(this,"TR","acntNo");
 * @param obj ����Ԫ��
 * @param parentTagName ���Ʋ��ҷ�Χ�ĸ�Ԫ��
 * @param name Ŀ��Ԫ�ص�����
 * @param isShortName ������ Ŀ��Ԫ�ص����� �Ƿ��Ǻ�׺��д��Ĭ��true
 */
nstc.sf.findInSameParent=function(obj,parentTagName,name,isShortName){
	var parnt = nstc.sf.findParent(obj,parentTagName);
	if(parent==null) return null;
	if(isShortName == null) isShortName= true;
	if(isShortName) return  jQuery(parnt).find("[name$=."+name+"]");
	return jQuery(parnt).find("[name="+name+"]");
}

/**
 * �����ڲ鿴ģʽ�£�ָ������Ԫ��/�����ֵ��
 * ������acntNo����ʾֵΪ225��nstc.sf.setViewText("acntNo","225",false)
 * ������xxx.acntNo����ʾֵΪ225��nstc.sf.setViewText("acntNo","225")
 * Ҳ����ֱ������ĳ���������ʾֵ��
 * ������xxx.acntNo����ʾֵΪ225��
 * var obj = $("[name$=acntNo]")[0];
 * nstc.sf.setViewText(obj,"225")
 * @param param ������Ԫ�ص����ƻ����
 * @param value ֵ
 * @param isShortName ���param��Ԫ�ص�����ʱ����ȷ�����������Ƿ��Ǻ�׺��д��Ĭ��true
 */
nstc.sf.setViewText=function(param,value,isShortName){
	var ele = param;
	if(typeof param == 'string'){
		if(isShortName == null) isShortName= true;
		if(isShortName)  
			ele = $("[name$=."+param+"]")[0];
		else 
			ele = $("[name="+param+"]")[0];
	}
	ele.value=value;
	nstc.sf.findParent(ele,"SPAN").innerHTML = value+ele.outerHTML;
}

nstc.sf.openEditWindow=function(code){
	window.open('../bench/page/spxForCust.jsp?code='+code,'�༭','fullscreen=1');
}