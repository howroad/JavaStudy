if (!nstc)
	var nstc = {};
if (!nstc.sf)
	nstc.sf = {};

//��ά���飺�洢��������ɸѡ�������Դ��Ϣ��[0]:Ԫ��id�����磺'demo_gelt_02_01_el_2'��[1]:�������
var SmartPage_DropFilterTable={};                        
var SmartPage_DropFilterTable_DropDivItemHeight = 20;
var SmartPage_DropFilterTable_MaxHeight = 200;           //���������߶�
var SmartPage_DropFilterTable_MaxWidth = 400;            //�����������
var SmartPage_DropFilterTable_Width = 0;                 //�������ȣ���̬���㣩
var SmartPage_DropFilterTable_Height = 0;                //������߶ȣ���̬���㣩
var SmartPage_DropFilterTable_FixedWidth = 200;          //������Ĭ�Ͽ��
var SmartPage_DropFilterTable_FixedHeight = 200;         //������Ĭ�ϸ߶�
var SmartPage_DropFilterTable_DropDivId = 'nstc.sf.DropFilterTableDivEle';      //������id
var SmartPage_DropFilterTable_TextName = 'nstc.sf.DropFilterTableInputText';    //��������ƣ��洢��ʾֵ��
var SmartPage_DropFilterTable_ImgName = 'nstc.sf.DropFilterTableImg';           //����ͼ��ͼƬ����
var SmartPage_DropFilterTable_ValNames = "nstc.sf.DropFilterTableValNames";     //���ؿ����ƣ��洢ʵ��ֵ��
var SmartPage_DropFilterTable_CurrentText;                                      //��ǰ����򣨴洢��ʾֵ��
var SmartPage_DropFilterTable_CurrentSelVal;                                    //��ǰ���ؿ򣨴洢ʵ��ֵ��
var SmartPage_DropFilterTable_CurrentSelDiv;                                    //��ǰ��ԾԪ�ؿ�
var SmartPage_DropFilterTable_CKName = "nstc.sf.DropFilterTableCK";             //���ؿ����ƣ��洢ʵ��ֵ��
SmartPage_DropFilterTable.data = [];
SmartPage_DropFilterTable.oldValue="";

//���˱������
nstc.sf.filterDropFilterTable=function (value){
	var clickObj = event.srcElement ? event.srcElement : event.target;
	var divEle = document.getElementById(SmartPage_DropFilterTable_DropDivId);
	var selectors = "";
	value = $.trim(value);
	if(value !=null && value !=""){
		var value_array=value.split(",");
		for(var i =0; $.trim(value_array[i]) !="" && i<value_array.length; i++){
			selectors += (":contains('"+$.trim(value_array[i])+"'),");
		}
		if(selectors.length >0){
			selectors=selectors.substring(0,selectors.length-1);
			$(divEle).find("table tbody tr").hide().filter(selectors).show(); 
		}				
	}
	//$(divEle).find("table tbody tr").hide().filter(":contains('"+value+"')").show(); 	
//	nstc.sf.dropFilterTableClear(clickObj);//����������е����ݷ���ѡ������checkbox 

	var data=SmartPage_DropFilterTable[SmartPage_DropFilterTable_CurrentSelDiv.id];

	var muti_select=data !=null ? data.muti_select :"";
	if("1" != muti_select ){
		
		var v_event =window.event;
		if(v_event.keyCode == 13){
			var trs = $(divEle).find("table tbody tr:visible");
			if(trs !=null && trs.length >0){
				trs[0].fireEvent("onclick");	
			}

		}
	}
}

//��ʾ�������
nstc.sf.showDropFilterTable=function (ele){
	//ele.blur();
	var elementDiv = ele.parentNode;
	if (!window.dropFilterTableDiv) {
		window.dropFilterTableDiv = document.createElement("div");
		dropFilterTableDiv.id = SmartPage_DropFilterTable_DropDivId;
		document.body.appendChild(dropFilterTableDiv);
		//dropFilterTableDiv.style.position = 'absolute';		
		dropFilterTableDiv.className = 'DropFilterTableDIV';
		//dropFilterTableDiv.style.overflow="auto";
		if(document.attachEvent) {
			document.attachEvent('onclick', nstc.sf.hideDropFilterTable);
		} else {
			document.addEventListener('click', nstc.sf.hideDropFilterTable);
		}
	}
	if (dropFilterTableDiv.style.display == 'block'
			&& SmartPage_DropFilterTable_CurrentSelDiv
			&& SmartPage_DropFilterTable_CurrentSelDiv == elementDiv) {
		if(ele.name == SmartPage_DropFilterTable_ImgName){
			dropFilterTableDiv.style.display = 'none';
		}
		return;
	} else if(dropFilterTableDiv.style.display == 'none'
		&& SmartPage_DropFilterTable_CurrentSelDiv
		&& SmartPage_DropFilterTable_CurrentSelDiv == elementDiv){
		var divEle = document.getElementById(SmartPage_DropFilterTable_DropDivId);
		$(divEle).find("table tbody tr").show();
		dropFilterTableDiv.style.display = 'block';		
		nstc.sf.computeDropFilterTableXY(elementDiv, dropFilterTableDiv);
		return ;
	} else{
		dropFilterTableDiv.style.display = 'block';	
	}			
	
	SmartPage_DropFilterTable_CurrentSelDiv = elementDiv;		
	
	var elements = elementDiv.childNodes;
	var vals;
	var valAndNames;
	var currentText;
	var divHeight;
	for ( var i = 0; i < elements.length; i++) {
		var node = elements[i];
		try {
			var name = node.getAttribute('name');
			if (!name || null == name || '' == name) {
				continue;
			}
			if (name == SmartPage_DropFilterTable_ValNames) {
				valAndNames = node.value;
				divHeight = node.getAttribute('alt');
			} else if (name == SmartPage_DropFilterTable_TextName) {
				SmartPage_DropFilterTable_CurrentText = node;
			} else if (name != SmartPage_DropFilterTable_ImgName) {
				vals = node.value;
				SmartPage_DropFilterTable_CurrentSelVal = node;
			}
		} catch (e) {
		}
	}	
    $(dropFilterTableDiv).empty();
    var data=SmartPage_DropFilterTable[elementDiv.id];
	nstc.sf.renderDropFilterTable(data);
	//dropFilterTableDiv.focus();
	nstc.sf.computeDropFilterTableXY(elementDiv, dropFilterTableDiv);
}

//��ʾ�������(Ajax��Ⱦʹ�ã������߼���һ���Լ��ز�̫һ��)
nstc.sf.showDropFilterTable2=function (ele, data){
	
	var elementDiv = ele.parentNode;
	if (!window.dropFilterTableDiv) {
		window.dropFilterTableDiv = document.createElement("div");
		dropFilterTableDiv.id = SmartPage_DropFilterTable_DropDivId;
		document.body.appendChild(dropFilterTableDiv);
		dropFilterTableDiv.className = 'DropFilterTableDIV';
		document.attachEvent('onclick', nstc.sf.hideDropFilterTable);
	}	
	dropFilterTableDiv.style.display = 'block';		
	
	SmartPage_DropFilterTable_CurrentSelDiv = elementDiv;		
	
	var elements = elementDiv.childNodes;
	var vals;
	var valAndNames;
	var currentText;
	var divHeight;
	for ( var i = 0; i < elements.length; i++) {
		var node = elements[i];
		try {
			var name = node.getAttribute('name');
			if (!name || null == name || '' == name) {
				continue;
			}
			if (name == SmartPage_DropFilterTable_ValNames) {
				valAndNames = node.value;
				divHeight = node.getAttribute('alt');
			} else if (name == SmartPage_DropFilterTable_TextName) {
				SmartPage_DropFilterTable_CurrentText = node;
			} else if (name != SmartPage_DropFilterTable_ImgName) {
				vals = node.value;
				SmartPage_DropFilterTable_CurrentSelVal = node;
			}
		} catch (e) {
		}
	}	
    $(dropFilterTableDiv).empty();
	
	
}
//�����������
nstc.sf.hideDropFilterTable=function hide_table(){
	var clickObj = event.srcElement ? event.srcElement : event.target;
	if (nstc.sf.notDealDropFilterTable(clickObj)) {
		return;
	}
	var divEle = document.getElementById(SmartPage_DropFilterTable_DropDivId);
	if (divEle) {
		divEle.style.display = 'none';
	}			
}
//��inputԪ���������
nstc.sf.fillDropFilterTableText=function (text,value){
	
	var data=SmartPage_DropFilterTable[SmartPage_DropFilterTable_CurrentSelDiv.id];
	var muti_select=data !=null ? data.muti_select :"";
	SmartPage_DropFilterTable.oldValue = SmartPage_DropFilterTable_CurrentSelVal.value;   //�����޸�ǰ��ֵ
	if(muti_select !=null && "1" == muti_select){//��ѡ�����߼�
		var divEle = document.getElementById(SmartPage_DropFilterTable_DropDivId);
		var texts="",values="";
		$(divEle).find("table tbody tr input:checked").each(function(i,ele){
			var temp=ele.value.split("@@");
			if(temp !=null && temp.length >0){
				texts += (temp[0]+",");
				values += (((temp.length==2) ? temp[1] : "")+",");
			}			
		});
		texts = texts.length >0 ? texts.substring(0,texts.length - 1) : "";
		values = values.length >0 ? values.substring(0,values.length - 1) : "";
		SmartPage_DropFilterTable_CurrentText.value=texts;
		SmartPage_DropFilterTable_CurrentSelVal.value=values;		
	}else{//��ѡ�����߼�
		SmartPage_DropFilterTable_CurrentText.value=text;
		SmartPage_DropFilterTable_CurrentSelVal.value=value;
	}
	nstc.sf.changeFlag(SmartPage_DropFilterTable_CurrentText,'modified');
	
}		

//��Ⱦ�������������
nstc.sf.renderDropFilterTable=function (data, f){
	
	var table="<table class=\"GridUnitTable\" cellSpacing=0 cellPadding=0 width=\"100%\" border=0>"
	          +nstc.sf.getDropFilterTableHead(data)+nstc.sf.getDropFilterTableBody(data, f)
	          +"</table>";
	$(dropFilterTableDiv).append(table);
}

//��ȡ��ͷ
nstc.sf.getDropFilterTableHead=function (data){
	var thead = "<thead class=\"td_bgb\">";
	if(data !=null && data.cols !=null && data.cols.length >0 ){
		thead +="<tr>";
		var muti_select=data.muti_select;		
		if(muti_select !=null && "1" == muti_select){
			thead +=('<th class="table_bg text-center"><input type ="checkbox"  onclick="nstc.sf.dropFilterTableCkAll(this.checked)"/></th>');
		}
		SmartPage_DropFilterTable_Width = 0;
		SmartPage_DropFilterTable_Height = data.height || SmartPage_DropFilterTable_FixedHeight;
		for(var i=0; i<data.cols.length;i++){	
			var obj=data.cols[i];
			if(obj !=null){
				thead+=( "<th width=\""+ (obj.width || "50") +"\" class=\"table_bg text-center\">"+(obj.title ||"")+"</th>");
				SmartPage_DropFilterTable_Width+=(parseInt(obj.width) || 50);
			}						
		}	
		thead+="</tr>";
	}
	thead+="</thead>";
	return thead;		
	//alert(title[0].title);
}
//��ȡ����
nstc.sf.getDropFilterTableBody=function (data, f){
	var tbody="<tbody>";
	
	SmartPage_DropFilterTable.data = (data !=null)? data.datas : null;
	if(data !=null && data.datas !=null && data.datas.length >0){
		
		var dis_col=data.dis_col;
		var val_col=data.val_col;
		var ext_col = data.ext_col;
		var muti_select=data.muti_select;
		//�Զ��庯���������������е�����ȫ�������Զ��庯����
		
		for(var i=0; i<data.datas.length;i++){
			var obj=data.datas[i];
			var ext_f="";
			var trClickFunc = SmartPage_DropFilterTable_CurrentSelDiv.trClickHandler;
			if(obj !=null ){
				if(f !=null && ext_col !=null){ext_f=f+"('"+obj[ext_col]+"');"}//�����Զ��庯��������������ǰ�汾��
				if(trClickFunc !=null){
					trClickFunc =(trClickFunc+"(SmartPage_DropFilterTable.data["+i+"],SmartPage_DropFilterTable_CurrentSelVal,SmartPage_DropFilterTable.oldValue);");
				}else{
					trClickFunc="";
				}
				tbody += ("<tr onclick=\"nstc.sf.fillDropFilterTableText('"+obj[dis_col]+"','"+obj[val_col]+"');"+ext_f+trClickFunc+"nstc.sf.dropFilterTableTRClick(this)\" onmouseover=\"smartForm_tr_onmouseover(this,1)\" onmouseout=\"smartForm_tr_onmouseout(this,1)\""
			            +" class=\"rowCss"+(2-i%2)+" DropFilterTableROW ");
				if(data.cols !=null && data.cols.length >0){
					if(muti_select !=null && "1" == muti_select ){
						var values=SmartPage_DropFilterTable_CurrentSelVal.value;
						var checked="";
						var regExp=new RegExp("(^|.*,)"+obj[val_col]+"(,.*|$)");
						checked=(values !=null && regExp.test(values)) ? " checked=checked " : "";
						tbody +=((values !=null && regExp.test(values)) ? " rowSelected " : "");//Ĭ��ѡ���б�ɫ����
						tbody +="\">";
						tbody +=('<td><input type="checkbox" name="'+SmartPage_DropFilterTable_CKName+'" value="'+obj[dis_col]+'@@'+obj[val_col]+'"'+checked+'/></td>');
					}else{
						tbody +="\">";
					}
					for(var j=0;j<data.cols.length;j++){
						var col=(data.cols[j] !=null) ? data.cols[j].field : "";
						tbody += ("<td>"+(obj[col] || "")+"</td>");
					}
				}
				tbody +="</tr>"
			}			
		}		
		
	}	
	tbody+="</tbody>"
	return tbody;
}
//
nstc.sf.notDealDropFilterTable = function(clickObj) {
	try {
		if ((clickObj && clickObj.getAttribute('name') == SmartPage_DropFilterTable_TextName)
				|| (clickObj && clickObj.getAttribute('name') == SmartPage_DropFilterTable_ImgName)) {
			return true;
		}
		var divEle = document.getElementById(SmartPage_DropFilterTable_DropDivId);
		var data=SmartPage_DropFilterTable[SmartPage_DropFilterTable_CurrentSelDiv.id];
		var muti_select=data !=null ? data.muti_select :"";
		
		var flag=$(clickObj).parents("div").filter($(divEle)).length>0?true : false;
		if(muti_select !=null && "1" == muti_select && flag){  //��ѡʱ���رյ���DIV
			return true;
		}
	} catch (e) {
		return false;
	}
	return false;
}

//���㵯��������\���\�߶�
nstc.sf.computeDropFilterTableXY = function (sourceDiv, popDiv){
	var srcDivHeight = sourceDiv.offsetHeight;
	var srcDivWidth = sourceDiv.offsetWidth;
	var winH = document.body.offsetHeight;
	var winW = document.body.clientWidth;
	var srcDivY = nstc.sf.getEleTop(sourceDiv);
	var srcDivX = nstc.sf.getEleLeft(sourceDiv);		
	var winScrollLeft = document.body.scrollLeft;
	
	
	if (winH < document.body.scrollHeight) {
		//winH = document.body.scrollHeight;
	}
	popDiv.style.width = (SmartPage_DropFilterTable_Width || SmartPage_DropFilterTable_FixedWidth)+"px";	
	popDiv.style.height = SmartPage_DropFilterTable_FixedHeight+"px";
	var popDivWidth = popDiv.offsetWidth;
	/*
	if(popDivWidth > SmartPage_DropFilterTable_MaxWidth){
		popDivWidth = SmartPage_DropFilterTable_MaxWidth;
		popDiv.style.width=popDivWidth + 'px';
	}*/
	var popDivHeight=popDiv.offsetHeight;
	/*
	if (popDivHeight > SmartPage_DropFilterTable_MaxHeight) {
		popDivHeight = SmartPage_DropFilterTable_MaxHeight;
		popDiv.style.height=popDivHeight+'px';
	}*/
	
	
	if (srcDivY +  srcDivHeight +popDivHeight+ 5 > winH) {
		var temp = srcDivY - popDivHeight;
		//temp = temp<0 ? 0 : temp;
		if(temp <0){
			temp = 0;
			popDiv.style.height =srcDivY+"px";
		}
		popDiv.style.top = temp + 'px';
		
	} else {
		popDiv.style.top = (srcDivY + srcDivHeight) + 'px';
	}
	
	if(srcDivX + popDivWidth + 5-winScrollLeft > winW){
		//var temp = srcDivX + srcDivWidth - popDivWidth;
		var temp = winW+winScrollLeft-popDivWidth
		temp = temp <0 ? 0 : temp;
		popDiv.style.left=temp + 'px';		
	}else{
		popDiv.style.left = (srcDivX) + 'px';
	}
}

//ȫѡ��ť�¼�
nstc.sf.dropFilterTableCkAll = function(checked){
	var divEle = document.getElementById(SmartPage_DropFilterTable_DropDivId);
	
	$(divEle).find("table tbody tr:visible :checkbox").each(function(i,ele){
		ele.checked =checked;		
	});
	nstc.sf.fillDropFilterTableText();
}

nstc.sf.dropFilterTableTRClick= function(obj,idx){
	
	var clickObj = event.srcElement ? event.srcElement : event.target;
	if("input" == clickObj.tagName.toLowerCase() && "checkbox" == clickObj.type.toLowerCase()){
		$(obj).toggleClass("rowSelected");
	}    
}
//����������������ֵ����ѡ��checkbox
nstc.sf.dropFilterTableClear = function(obj){
	var curr_text=obj.value;
	var curr_texts=curr_text.split(",");
	var divEle = document.getElementById(SmartPage_DropFilterTable_DropDivId);
	var values = "",texts="";
	if(SmartPage_DropFilterTable_CurrentSelDiv != null){
		var data=SmartPage_DropFilterTable[SmartPage_DropFilterTable_CurrentSelDiv.id];
	}	

	var muti_select=data !=null ? data.muti_select :"";
	if("1" == muti_select ){
	    var ck_all_flag = false;
		$(divEle).find("table tbody tr :checkbox").each(function(i,ele){
			var temp=ele.value.split("@@");
			if(temp !=null && temp.length ==2 ){
				var regExp = new RegExp("(^|.*,)("+temp[0]+"|"+temp[1]+")(,.*|$)");
				if(regExp.test(curr_text)){
					ele.checked = true;
					texts += (temp[0]+",");
					values += (temp[1]+",");
					ck_all_flag = true;
				}else{
					ele.checked = false;
				}
			}			
	
		});
		var ck_all = $(window.dropFilterTableDiv).find("thead tr th :checkbox");
	    if(!ck_all_flag && ck_all.attr("checked")){
	    	ck_all.attr("checked",false);
	    }
		texts = texts.length >0 ? texts.substring(0,texts.length - 1) : "";
		values = values.length >0 ? values.substring(0,values.length - 1) : "";
		SmartPage_DropFilterTable_CurrentText.value=texts;
		SmartPage_DropFilterTable_CurrentSelVal.value=values;	
		nstc.sf.changeFlag(SmartPage_DropFilterTable_CurrentText,'modified');
	}else if("" == SmartPage_DropFilterTable_CurrentText.value){
		SmartPage_DropFilterTable_CurrentSelVal.value="";
	}
	
	if(SmartPage_DropFilterTable_CurrentSelVal.value == ""){
		//����ʵ��ֵ���������ʾֵ
		SmartPage_DropFilterTable_CurrentText.value = "";
	}

}

//����������е����ݵ���̨��ѯ����
nstc.sf.requestDropFilterTable = function (ele, params, f){
	
	params.params = encodeURIComponent(params.params);
	nstc.sf.showDropFilterTable2(ele);
	$.ajax({
		type:'POST',
		url:'DynamicQueryDropTableAction.sf',
		data : params,
		dataType : 'text',	
		success:function(text){
	
			try{
				var data = eval('('+text+')');
				$(dropFilterTableDiv).empty();
				nstc.sf.renderDropFilterTable(data, f);
				nstc.sf.computeDropFilterTableXY(SmartPage_DropFilterTable_CurrentSelDiv, dropFilterTableDiv);
				
		
			}catch(e){
				
			}
		}
		});
}

nstc.sf.getBrothersValueByName = function (ele,name){
	return $(ele.parentNode).children("[name='"+name+"']")[0].value;
}
