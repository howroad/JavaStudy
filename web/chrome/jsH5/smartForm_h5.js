var rowOver_backGroundColor = {};
var rowBackGroundColor1 = {};
var rowBackGroundColor2 = {};
var rowClick_backGroundColor = {};
var t1;
var mOrder = '';
var allDataGridDiv;
// �̶���ͷ����
var fixTableObj = null;
document.onreadystatechange = function(){
	if(document.readyState=="complete"){
		try{
			t1 = new Date().getTime();
			smartPage_changeAppNo();
			smartPage_clearFirst();
		}catch(e){}
	}
};


$(document).ready(function(){
	// ҳ�濨Ƭ����ʱ��ȥ��GridUnitDiv��ʽ�е�position
	/*var $cardGrpTable = $("table.fixedtable[iscardgrp=1]");
	 if($cardGrpTable.size()>0) {
	 $cardGrpTable.each(function() {
	 var $gridUnitDiv = $(this).find("div.GridUnitDiv");
	 $gridUnitDiv.removeClass("GridUnitDiv");
	 $gridUnitDiv.css({"width":"100%","height":"100%","border":"solid,1px"});
	 });
	 }*/
	if (typeof _$ == "undefined") {
		_$ = window.$;
	}
	/*
	 * ������ǵ����IFRAME�е�ҳ�棬�������߾�
	 * */
	try {
		if (document.parentWindow.name == "content") {
			document.getElementById("form-main-table").style.paddingLeft = "5px";
			document.getElementById("form-main-table").style.paddingTop = "5px";
		}
	} catch (e) {}
	/*
	 * �����ı�������򡢶����ı����ڽ���ͷǽ���״̬�ı߿���ʽ
	 * */
	$("input[type='text'],input[type='password'],textarea").live("focus",function (e) {
		this.style.borderColor = "#2CA8F4";
	}).live("blur",function (e) {
		this.style.borderColor = "#E5E5E5";
	});
	try {	// ����ڲ�û��table��formռ�ÿռ�����
		$.each($("form"), function (n, value) {
			if ($(value).find("table").length == 0) {
				$(value).css("height", "0px");
			}
		})
	} catch(e) {}
	try{
		//û�й̶���ͷ���ȥ��fixedtable��ʽ
		if(  $("div.fix_title").size() == 0 ){
			$(".GridUnitTable").find("td.autoWrap").removeAttr("noWrap");
			$("table.fixedtable").removeClass('fixedtable');
		}
		if ($("table.GridUnitTable") && $("table.GridUnitTable").css("border-collapse") == "collapse") {
			$("table.GridUnitTable").find("th.fixedHeaderCol").css("border-right","1px solid silver").css("border-left","0px solid silver");
		}
	}catch(e){
	}

	try{
		var frameId = window.frameElement && window.frameElement.id || '';
		if(window.parent != window)
			window.parent.smartForm_iFrameHeight && window.parent.smartForm_iFrameHeight(frameId);
	}catch(e){

	}
	//�̶���ͷ������
	try{
		/*$("body.BODY_SCR_AUTO").children("div:eq(0)").css("height", "100%");*/
		fixTableObj = fixTable();
		if(fixTableObj.fixSize+fixTableObj.fixTopColsSize>0) {
			// ���ڴ�С�ı�ʱ�����̶���ͷ����
			var resizeTimer = null;
			$(window).resize(function() {
				if (resizeTimer) clearTimeout(resizeTimer);
				resizeTimer = setTimeout(function() {
					//fixTableObj.getLatestStack().actDiv.parents('div')[1].style.height = "";
					//fixTableObj.getLatestStack().actDiv.parents('div')[0].style.height = "";
					var scrollTop = fixTableObj.getScrollTop();
					var scrollLeft = fixTableObj.getScrollLeft();
					var scrollObj = {"top": scrollTop, "left": scrollLeft};
					fixTableObj.reset();
					fixTableObj.fix(scrollObj);
					try {
						dragColumns();
						dropColumns();
						resizableColumns();
					} catch(e) {

					}

				}, 10);
			});
			//$(window).resize();		// 771,�������չʾ��ȫ������
		}
	}catch(e){
	}
	/* ��ʼ����ѡ��ť�͸�ѡ�����ʽ */
	window.setTimeout(function () {
		$("input[type='checkbox']").each(function (n, value) {
			if ($(value).css("display") == "none") {
				return true;
			}
			change_checkbox_img(value);
		});
		$("input[type='radio']").each(function (n, value) {
			change_radio_img(value);
		});
		$("span.select-span").each(function (n, value) {
			refreshSelectStyle(value);
		});
		$("span.checkbox_bg").each(function (n, value) {
			refreshCheckboxStyle(value);
		});
		$(".form-main-table").css({"height":"100%"});
	}, 100);
	/* ��ֹ��ť�ĵ���¼��Ա������������ܵ�Ӱ�� */
	$(".button").bind('click', function (e) {
		if (this.parentNode.tagName.toLowerCase() == "a") {
			this.parentNode.click();
		}
		e.stopPropagation();
	});
	/* ����ҳ�浼�� */
	new Navigation();
});

function fixTable() {
	fixTableObj = new nstc.FixedTable();
	fixTableObj.keetDefault();
	fixTableObj.fix();
	return fixTableObj;
}

function smartPage_adjustHeight(table){
	var table_unitOuter = $(table).parents('table.GridUnitOuterTable');
	var table_page = $(table).parents('table.fixedtable');
	var form_table = $(table).parents('table.FormUnitTable');
	//�����ڿ�Ƭģʽ��������£�����Ԫtable��Ƕ�б�Ԫtable
	if(form_table.length > 0){
		table_unitOuter.css('table-layout','auto');
		table_page.css('table-layout','auto');
		table_page.height('1%');
		$('td.GridUnitTableTD').height('1%');
		return;
	}

	var div_unit = $(table).parent();
	var table_unit = $(table);
	var	td_unit = div_unit.parent();
	if(div_unit.height() < table_unit.height() + 3 || td_unit.height() < div_unit.height() + 2){
		var h_page = table_page.height() ;
		var h_adjust = table_unit.height() + 3 - div_unit.height() ;
		if(h_adjust <  div_unit.height() + 2 - td_unit.height())
			h_adjust =  div_unit.height() + 2 - td_unit.height();
		table_unitOuter.height( table_unitOuter.height() + h_adjust + (div_unit.width()< table_unit.width()? 17:0) + 'px');
		table_page.height( h_page + h_adjust + 'px');

	}else if( $(document).height() > $(window).height()) {
		var h_adjust =  div_unit.height() - table_unit.height() - 3 -(div_unit.width()< table_unit.width()? 17:0);
		var h_page = table_page.height() - h_adjust ;
		table_unitOuter.height( table_unitOuter.height() - h_adjust + 'px');
		table_page.height( (h_page > $(window).height() ? h_page: $(window).height()) + 'px' );
	}
}

function smarPage_adjustPageHeight(tr){
	var div_unit = $(tr).parents('div.unit_content_list');
	var table_unit = $(tr).parents('table.GridUnitTable');
	if(div_unit.height() < table_unit.height() + 2){
		var h_adjust = table_unit.height() + 2 - div_unit.height();
		var table_unitOuter = $(tr).parents('table.GridUnitOuterTable');
		var table_page = $(tr).parents('table.fixedtable');
		table_unitOuter.height( table_unitOuter.height() + h_adjust + 'px');
		table_page.height( table_page.height() + h_adjust + 'px');
	}
}

/**
 * ���ڽ��select��ȫѡ����ѡ����ʾ�벻��ʾ�Ŀ���
 */
function smartPage_clearFirst(ids){
	var filterStr = null == ids ? "clearFirst=true" : "id='"+ids+"'";
	var selects = $("select["+filterStr+"]");
	if(selects == null) return;

	var len = selects.length;
	for(var i=0; i < len; i++){
		var slt = selects[i];
		try{
			if(slt.options[0].text=="��ѡ��" || slt.options[0].text=="ȫѡ" || slt.options[0].text==""){
				slt.options.remove(0);
			}
		}catch(e){}
	}
}

/**
 * ���ڽ��PageContextParamRender.java��д���appNo����Ԫ�ص�name����
 */
function smartPage_changeAppNo(){
	var smartpage_appno_obj = document.getElementById("appNo");
	if(null!=smartpage_appno_obj && "pageCode"==smartpage_appno_obj.name)
		smartpage_appno_obj.name = "appNo";
}

/***
 * �����ı������ĳ��ȣ��������ģ�
 */
function smartPage_checkLength(obj,length){
	if(obj.value.getStrLength()<=length){
		return ;
	}
	alert(obj.alt+"���벻�ܳ���"+length+"�ַ�(һ�������������ַ�)");
	obj.value = obj.value.subCHString(0,length)
}

/**
 * ���ñ���ҳ�����ʱ��״̬
 * @param {} obj
 */
function smartPage_doReset(obj){
	var form = nstc.sf.findParent(obj, "FORM");
	var rowTypes = $("#"+form.id+" [name$=.rowType]");
	for(var i=0;i<rowTypes.length;i++){
		rowTypes[i].exValue=rowTypes[i].value;
	}

	var tid = obj.id.split(".")[0];
	$("#"+tid)[0].reset();

	for(var i=0;i<rowTypes.length;i++){
		rowTypes[i].value=rowTypes[i].exValue;
	}
}

/**
 * ���ύ������֤���� �ύobj���ڵı��õ�
 *
 * @param obj
 */
function smartForm_doSubmit(obj) {
	var form = nstc.sf.findParent(obj, "FORM");
	form.action = $('#appNo').val() + '@' + obj.id + ".sf";
	var flag = nstc.sf.validateForm(obj);
	if (true == flag){
		form.submit();
	}
}

/**
 * ���ύ������֤���� �ύobj���ڵı��õ�
 *
 * @param obj
 */
function smartForm_doRefresh(obj) {
	check_simple_page_invoke(arguments.callee);               //��⵱ǰ�����Ƿ�ͨ����ҳ����������������ǣ����õ�ǰҳ��Ϊ1
	var form = nstc.sf.findParent(obj, "FORM");
	form.action = $('#appNo').val() + '@' + obj.id + ".sf";
	if(!this.disable){
		this.disable = true;
		form.submit();
	}
}

/**
 * ��������ʽ�ύ����
 *
 * @param obj
 */
function smartForm_doUploadSubmit(obj) {
	var form = nstc.sf.findParent(obj, "FORM");
	form.action = $('#appNo').val() + '@' + obj.id + ".sf";
	obj.disabled=true;
	form.encoding = "multipart/form-data";
	var flag = nstc.sf.validateForm(obj);
	if (true == flag){
		form.submit();
	}
}

/**
 * �����档 ����obj���ڵı�
 *
 * @param obj
 */
function smartForm_doSave(obj) {
	var form = nstc.sf.findParent(obj, "FORM");
	form.action = $('#appNo').val() + '@' + obj.id + ".sf";
	var flag = nstc.sf.validateForm(obj);
	if (true == flag){
		obj.disabled=true;
		form.submit();
	}

}

/**
 * ��ɾ���� ɾ��obj���ڵı�
 *
 * @param obj
 * @param gridUnitCode ���Ԫ��ţ�����Ϊ�գ�Ĭ��obj���ڵ�Ԫ��ţ�
 */
function smartForm_doDelete(obj, gridUnitCode) {
	var form = nstc.sf.findParent(obj, "FORM");
	nstc.sf.doDeleteSubmit($('#appNo').val() + '@' + obj.id + ".sf", form.id, gridUnitCode);
	// form.action = obj.id + ".sf";
	// form.submit();
}

/**
 * �����á� ���ñ������÷�����obj���ڵı����õ�ҳ�����ʱ��״̬��
 *
 * @param obj

function smartForm_doReset(obj) {
	var form = nstc.sf.findParent(obj, "FORM");
	form.reset();
	window.setTimeout(function () {
		smartForm_doReset_h5(form);
	},100);
	return false;
}
 */
function smartForm_doReset(obj) {
	var form = nstc.sf.findParent(obj, "FORM");
	form.reset();
	//����ʱ��ר������ϴ�����մ���
	var fileTypes = $("input[type=file]");
	for (var j=0; j<fileTypes.length; j++) {
		var t_flie = fileTypes[j];
		var clone_obj = $(t_flie).clone();
		$(t_flie).after($(clone_obj).val(""));
		$(t_flie).remove(); 
	}
	window.setTimeout(function () {
		smartForm_doReset_h5(form);
	},100);
	return false;
}
/*
 *
 **/
function smartForm_doReset_h5(form) {
	try {
		var radioEle = $(form).find("input[type='radio']");
		for (var i=0; i<radioEle.length; i++) {
			change_radio_img(radioEle[i]);
			/*if (radioEle[i].checked) {
				radioEle[i].parentNode.getElementsByTagName("span")[0].className = "radioStyle_f";
			} else {
				radioEle[i].parentNode.getElementsByTagName("span")[0].className = "radioStyle";
			}*/
		}
		var checkboxEle = $(form).find("input[type='checkbox']");
		for (var j=0; j<checkboxEle.length; j++) {
			change_checkbox_img(checkboxEle[j]);
		}
	} catch (e) {}
}
/**
 * �����á�
 * [��ªʵ��]��obj���ڱ��Ŀɼ�(visible)������(������input,text,textarea,select,checkbox,radio)
 * ���ó�δ��д(value��Ϊ"",selectֵ��Ϊ��һ��)״̬��
 *
 * @param obj
 */
function smartForm_doClear(obj) {
	var form = nstc.sf.findParent(obj, "FORM");
	// text,textarea
	var texts = $(form).find(
		":text:visible,:input:visible[type='textarea'],:password:visible");
	$.each(texts, function(i, n) {
		n.setAttribute("value", "");
	});
	// checkbox,radio
	var checks = $(form).find(":checked:visible");
	$.each(checks, function(i, n) {
		n.setAttribute("checked", false);
	});
	// select
	var selects = $(form).find("select:visible");
	$.each(selects, function(i, n) {
		n.selectedIndex = 0;
	});
	return false;
}

/**
 * ������Ϣ��ʾ
 *
 * @param msg

function smartForm_confirm(msg) {
	var bool = confirm(msg);
	try {
		if (true == bool) {
			smartForm_confirm_true();
		} else {
			smartForm_confirm_false();
		}
	} catch (e) {
		alert("ȱ��JS�������壬�붨��smartForm_confirm_true()��smartForm_confirm_false()!");
	}
}
   ������ǰ�ĺܶ�ҳ���smartForm_confirm������������д�����Բ��ܽ�ֹ���� 
 */
function smartForm_confirm(msg) {
	nstc.sf.warningAlert(msg);
}

/**
 * gridȫѡ
 *
 * @param obj
 */
function smartForm_all_checkbox(obj, name) {
	try {
		var isCheck = false;
		if (obj.checked == true) {
			isCheck = true
		}
		var checkBoxs = document.getElementsByName(name);
		for ( var i = 0; i < checkBoxs.length; i++) {
			if(checkBoxs[i] == obj) continue ;
			checkBoxs[i].checked = isCheck;
			//nstc.sf.changeFlag(checkBoxs[i],'modified')
			nstc.sf.clickCheckbox(checkBoxs[i]);
			change_checkbox_img(checkBoxs[i]);	//��ѡ����ʽ�л�
		}
	} catch (e) {

	}
}

/**
 * ����GridUnit��
 *
 * @param obj
 */
function smartForm_add(obj) {
	try {
		// �����ݹ̶���ͷ��񣬵�һ��������ʱ����Ԫ�񲻶��룬��Ҫ���µ���
		var refix = false;
		if(fixTableObj.fixSize+fixTableObj.fixTopColsSize>0) {
			var $fixedDiv = $(nstc.sf.findParent(nstc.sf.findParent(obj, "TABLE"), "TABLE")).find("div.fix_title");
			var $childrenDiv = $fixedDiv.children("div");
			var $childDiv = $childrenDiv.filter(":eq(1)");
			var rowSize = $childDiv.find("tbody tr:visible").size();
			if(rowSize==0)
				refix = true;
		}

		var names = obj.name.split('.');
		var unitname = names[0];
		var tr = nstc.sf.addRow(unitname, "tableCopy_" + unitname);
		tr.className=(tr.sectionRowIndex+1)%2==0?"rowCss1":"rowCss2";
		if(tr.attachEvent){
			tr.attachEvent('onclick', function(){smartForm_tr_onclick(tr);});
		} else if(tr.addEventListener){
			tr.addEventListener('click', function(){smartForm_tr_onclick(tr);}, false);
		}

		tr.onmouseover=function(){
			smartForm_tr_onmouseover(this,1);
		}
		tr.onmouseout=function(){
			smartForm_tr_onmouseout(this,1);
		}

		// �̶���ͷ������µ�������
		if(refix) {
			fixTableObj.reset();
			fixTableObj.fix();
		}
	} catch (e) {

	}

	try{
		var frameId = window.frameElement && window.frameElement.id || '';
		if(window.parent != window)
			window.parent.smartForm_iFrameHeight(frameId);
	}catch(e){

	}

}

/**
 * ���Ӹ�����
 *
 * @param obj

function smartForm_addRow(obj) {
	try {
		var div = nstc.sf.findParent(obj, "TD");
		var str = div.innerHTML;
		var list = str.toLowerCase().split("<div id");
		var count = list.length;
		var baseStr = $(div).find("div[id=1]")[0].innerHTML;
		// ����жϣ������һ�����и���������copyʱ���������ʽ�����滻���ϴ���ʽ 
		if (baseStr.indexOf("class=fileInput_close") > 0) {
			baseStr = baseStr.replace(/class=fileInput_close/, "class=fileInput");
		}
		var define = "<div id='" + count + "'>" + baseStr;
		define = define
			+ " <input input_id='"
			+ count
			+ "' type='button' value='' onclick='smartForm_delRow(this)' onmouseover=\"this.className='button41 button button41_Over'\" onmouseout=\"this.className='button41 button'\" name='"
			+ count + "' class='button41 button'> " + "</div>";
		$(div).append(define);
		$(div).find("div[id=" + count +  "]:last").find("input[type=text]").val('');
		$(div).find("div[id=" + count +  "]:last").find(":button:first").remove();
	} catch (e) {

	}

	try{
		var frameId = window.frameElement && window.frameElement.id || '';
		if(window.parent != window)
			window.parent.smartForm_iFrameHeight(frameId);
	}catch(e){}
}
 */

/**
 * ���Ӹ�����
 *
 * @param obj
 */
function smartForm_addRow(obj) {
	try {
		var div = nstc.sf.findParent(obj, "TD");
		var str = div.innerHTML;
		var list = str.toLowerCase().split("<div id");
		var count = list.length;
		// ---���������ú�, ������ӵ��ϴ�Ԫ��ֵ�ͳ�ʼ�ϴ�Ԫ��ֵ��ͬ������
		var temp = $(div).clone();
		$(temp).find('input').each( function() {
			this.value = '';
		});
		var baseStr = $(temp).find("div[id=1]")[0].innerHTML;
		/* ����жϣ������һ�����и���������copyʱ���������ʽ�����滻���ϴ���ʽ */
		if (baseStr.indexOf("class=fileInput_close") > 0) {
			baseStr = baseStr.replace(/class=fileInput_close/, "class=fileInput");
		}
		var define = "<div id='" + count + "'>" + baseStr;
		define = define
			+ " <input input_id='"
			+ count
			+ "' type='button' value='' onclick='smartForm_delRow(this)' onmouseover=\"this.className='button41 button button41_Over'\" onmouseout=\"this.className='button41 button'\" name='"
			+ count + "' class='button41 button'> " + "</div>";
		$(div).append(define);
		$(div).find("div[id=" + count +  "]:last").find("input[type=text]").val('');
		$(div).find("div[id=" + count +  "]:last").find(":button:first").remove();
	} catch (e) {

	}

	try{
		var frameId = window.frameElement && window.frameElement.id || '';
		if(window.parent != window)
			window.parent.smartForm_iFrameHeight(frameId);
	}catch(e){}
}


// ɾ����
function smartForm_delRow(obj) {
	try {
		$("#" + obj.name).remove();

	} catch (e) {}
}

function smartForm_delUploadFile(obj){
	try{
		if(window.confirm("ȷ��Ҫɾ��������")){
			var tr = nstc.sf.findParent(obj, "tr");
			$(tr).remove();
			var delObj = document.getElementById(obj.hidName);
			if(delObj.value){
				delObj.value += ";"+obj.delPath;
			} else {
				delObj.value = obj.delPath;
			}
		}
	} catch(e){
	}
}


// ����Ӧ����iframe�߶ȣ�����iframe onLoad��dynamicForm.js������
function smartForm_iFrameHeight(iframeId) {
	try{
		var ifm = document.getElementById(iframeId);
		if('no' == ifm.scrolling && ifm.src !=""){
			var subWeb = document.frames ? document.frames[iframeId].document
				: ifm.contentDocument;
			if (ifm != null && subWeb != null) {
				ifm.height = subWeb.body.scrollHeight;

				//ifm.style.height = ifm.parentNode.clientHeight+'px';	//775��Ϊ��������⣬������һ�д���򿪣�ע�͸��д���
				//ifm.style.height = '100%';
				//����߶�����Ӧ��IE8ʧЧ����
				var height = ifm.offsetHeight;
				//ifm.height = subWeb.body.scrollHeight;
				//����߶�����Ӧ��IE8ʧЧ����
				if(subWeb.body.scrollHeight > height){
					//
					ifm.style.height = subWeb.body.scrollHeight;
				}

			}
		} else if ('yes' == ifm.scrolling && ifm.src != "") {
			var subWeb = document.frames ? document.frames[iframeId].document
				: ifm.contentDocument;
			if (ifm != null && subWeb != null) {
				ifm.style.height = ($(ifm).parents("td.FormUnitTableTD")[0].clientHeight-8)+'px';//.parentNode.clientHeight+'px';
				var height = ifm.offsetHeight;
				if(subWeb.body.scrollHeight > height){
					//
					ifm.style.height = subWeb.body.scrollHeight;
				}

			}
		}
		window.setTimeout('$(".form-main-table").css({"height":"100%"});',1000);
	}catch(e){

	}
}

/**
 * ����Excel_���
 * @param {} obj �����б� {exportTableId:ָ������Table��Id;fileName:ָ�������ļ�����}
 */
function smartForm_doExport(obj) {
	try {
		var exportTableId = obj.id.split('.')[0];
		nstc.util.exportUtil.exportHtmlToExcel(exportTableId);
	} catch (e) {
		alert(e.message);
	}
}

/**
 * ����Excel_��ڣ���̨������
 * @param obj         :��̨������ť����
 *        def_tableId :��Ҫ������table id,���Ϊ�գ���def_tableIdȡobj.id
 */
function smartForm_doExport_bg(obj,def_tableId) {
	try {
		var exportTableId = def_tableId || obj.id.split('.')[0];
		var tableHeadDataId = "table_head_data";
		//var s_win=window.frames['data_export'].window;
		var table=document.getElementById(exportTableId);
		if(table !=null){
			var head = table.getElementsByTagName("THEAD")[0];
			var form = nstc.sf.findParent(obj, "FORM");
			//form.action = $('#appNo').val() + '@' + obj.id + ".sf";
			form.action = 'ExportExcelAction.sf?__eltId='+obj.id;
			if($(form).find("#"+tableHeadDataId).length ==0){
				$(form).append('<input type="hidden" id="'+tableHeadDataId+'" name="table_head_data"/>');
			}
			$("#"+tableHeadDataId).val(head.outerHTML);
			//form.target = "data_export";
			form.setAttribute("target", "_blank")
			var flag = nstc.sf.validateForm(obj);
			document.getElementById("WK_REQ_TIME_TOKEN").disabled = "disabled";
			if (true == flag){
				//obj.disabled=true;
				form.submit();
			}
			form.removeAttribute("target");
			document.getElementById("WK_REQ_TIME_TOKEN").removeAttribute("disabled");
			$("#"+tableHeadDataId).val('');

		}

	} catch (e) {
		alert(e.message);
	}
}

/**
 * ��ʾ/����SouthGroup/NorthGroup����
 * @param obj
 */
function smartForm_showGroup(obj) {
	try {
		var table = nstc.sf.findParent(obj, "table");
		var trs = $(table).find("tr[id='"+obj.id+"']");
		for(var i = 0; i<trs.length; i++){
			if(trs[i].style.display == 'none'){
				$(trs[i]).find(".GridUnitDiv,.fix_title").css("display","block");//���position:relative ����������
				trs[i].style.display='block';
			}
			else{
				$(trs[i]).find(".GridUnitDiv,.fix_title").css("display","none");//���position:relative ����������
				trs[i].style.display='none';
			}
		}
	} catch (e) {

	}
}
function smartForm_showOneGroup(obj) {
	try {
		var table = nstc.sf.findParent(obj, "table");
		var trs = $(table).find("tr.table_one_grp");
		for(var i = 0; i<trs.length; i++){
			if(trs[i].id == obj.id){
				$(trs[i]).find(".GridUnitDiv,.fix_title").css("display","block");//���position:relative ����������
				trs[i].style.display='block';
			}
			else{
				$(trs[i]).find(".GridUnitDiv,.fix_title").css("display","none");//���position:relative ����������
				trs[i].style.display='none';
			}

		}
	} catch (e) {

	}
}
/**
 * TabGroup����
 * @param obj
 */
function smartForm_showTabGroup(obj,unitcode){
	try {
		var ul = nstc.sf.findParent(obj, "ul");
		var li = $(ul).find("li");
		var table = $(document.getElementById(unitcode));
		var liNum = 0;
		for(var i = 0; i<li.length; i++){
			if(li[i].id == obj.id){
				liNum = i;
				var trs = table.find("tr[id='"+li[i].id+"']");
				for(var j = 0; j<trs.length; j++){
					$(trs[j]).find(".GridUnitDiv,.fix_title").css("display","block");//���position:relative ����������
					$(trs[j]).find("div.unit_title").css("display","block");//���position:relative ����������
					$(trs[j]).find("div.FormUnitDiv").css("display","block");//���ͼ�� ����������
					trs[j].style.display='block';
					showTotalChart(trs[j]);
				}
				li[i].onclick=null;
				li[i].style.cursor='';
				li[i].style.cursor='pointer';
				li[i].className='currentBtn';
				if(fixTableObj.fixSize+fixTableObj.fixTopColsSize>0) {
					fixTableObj.reset();
					fixTableObj.fix();
				}
			} else {
				var trs = table.find("tr[id='"+li[i].id+"']");
				for(var j = 0; j<trs.length; j++){
					$(trs[j]).find(".GridUnitDiv,.fix_title").css("display","none");//���position:relative ����������
					$(trs[j]).find("div.unit_title").css("display","none");//���position:relative ����������
					$(trs[j]).find("div.FormUnitDiv").css("display","none");//���ͼ�� ����������
					trs[j].style.display='none';
				}
				li[i].onclick=function(){
					smartForm_showTabGroup(this,unitcode);
				};

				li[i].style.cursor='hand';
				li[i].className='noBtn';
			}
		}
		liNum > 0 ? (li[(liNum-1)].className = "noBtnLeft") : (liNum == 0 ? (li[liNum].className = "currentBtnLeft") : '');
		liNum < (li.length - 1) ? (li[(liNum+1)].className = "noBtnRight") : (liNum == (li.length - 1) ? (li[liNum].className = "currentBtnRight") : '');
		if (liNum == 1) {
			li[0].className = "noBtnFirst1";
		} else if (liNum > 1) {
			li[0].className = "noBtnFirst2";
		}
	} catch (e) {

	}
}

/**
 * Gridunit�е�����ƶ��¼�����������޸�����ɫ
 * @param obj
 */
function smartForm_tr_onmouseover(obj){
	var tabIdx = getCurrentTableIndex(obj)
	if(tabIdx==-1) return;
	if(obj.x!="1"){
		if(typeof(rowBackGroundColor1[tabIdx]) == "undefined" && (obj.sectionRowIndex)%2==0) {
			rowBackGroundColor1[tabIdx] = obj.currentStyle["backgroundColor"];
		} else if(typeof(rowBackGroundColor2[tabIdx]) == "undefined" && (obj.sectionRowIndex)%2==1) {
			rowBackGroundColor2[tabIdx] = obj.currentStyle["backgroundColor"];
		}
		obj.style.cursor = "pointer";
		if(typeof(rowOver_backGroundColor[tabIdx]) == "undefined"){
			if(!isAlternat(obj)) {
				rowBackGroundColor1[tabIdx] = obj.currentStyle["backgroundColor"];
				rowBackGroundColor2[tabIdx] = rowBackGroundColor1[tabIdx];
			}
			obj.className="rowOver";
			rowOver_backGroundColor[tabIdx] = obj.currentStyle["backgroundColor"];
		}else{
			obj.style.backgroundColor=rowOver_backGroundColor[tabIdx];
		}
	}
}

/**
 * Gridunit�е�����ƶ��¼�����������޸�����ɫ
 * @param obj
 */
function smartForm_tr_onmouseout(obj,idx){
	var tabIdx = getCurrentTableIndex(obj)
	if(tabIdx==-1) return;
	if(obj.x!="1"){
		obj.style.backgroundColor = (obj.sectionRowIndex+idx)%2==0?rowBackGroundColor1[tabIdx]:rowBackGroundColor2[tabIdx];
	}
}

function smartForm_bt_onmouseover(obj){
	obj.style.cursor='hand';
	obj.style.backgroundPosition='left -24px';
	obj.style.color = '#3074C1';
}
function smartForm_bt_onmouseout(obj){
	obj.style.backgroundPosition='';
	obj.style.color = '#6682B2';
}

/**
 * Gridunit�е�������¼�����������޸�����ɫ
 * @param obj
 * @param idx
 * @param single_selected :�Ƿ�ֻ��ѡ��һ��
 */
function smartForm_tr_onclick(obj,idx,single_selected){
	var tabIdx = getCurrentTableIndex(obj)
	if(tabIdx==-1) return;
	if(obj.x!="1"){
		//ѡ�е�ǰ��		
		obj.style.cursor = "pointer";
		if(typeof(rowBackGroundColor1[tabIdx]) == "undefined" && (obj.sectionRowIndex)%2==0) {
			rowBackGroundColor1[tabIdx] = obj.currentStyle["backgroundColor"];
		} else if(typeof(rowBackGroundColor2[tabIdx]) == "undefined" && (obj.sectionRowIndex)%2==1) {
			rowBackGroundColor2[tabIdx] = obj.currentStyle["backgroundColor"];
		}
		if(typeof(rowClick_backGroundColor[tabIdx]) == "undefined"){
			if(!isAlternat(obj)) {
				rowBackGroundColor1[tabIdx] = obj.currentStyle["backgroundColor"];
				rowBackGroundColor2[tabIdx] = rowBackGroundColor1[tabIdx];
			}
			obj.className="rowSelected";
			rowClick_backGroundColor[tabIdx] = obj.currentStyle["backgroundColor"];
		}else{
			if(single_selected !=null && "1" == single_selected){
				//ֻ��ѡ��һ�����������������ϵ�'rowSelected'��ʽ��
				//$(obj).parent().find("tr").removeClass("rowSelected");	
				var trs = $(obj).parent().find("tr");
				var bkColor,curColor;
				for(var i=0; i<trs.length;i++){
					bkColor = i%2==0?rowBackGroundColor1[tabIdx]:rowBackGroundColor2[tabIdx];
					curColor = trs[i].currentStyle["backgroundColor"];
					if(curColor != bkColor){
						trs[i].style.backgroundColor = bkColor;
						trs[i].x ="0";
					}
				}
			}
			obj.style.backgroundColor=rowClick_backGroundColor[tabIdx];
		}
		obj.x="1";
	}else{
		//ȡ����ǰ�е�ѡ��״̬
		obj.x="0";
		obj.style.backgroundColor = (obj.sectionRowIndex+idx)%2==0?rowBackGroundColor1[tabIdx]:rowBackGroundColor2[tabIdx];
	}
}


/**
 * �жϱ���Ƿ�֧�ֽ�������ʽ
 */
function isAlternat(obj) {
	// �ж��Ƿ�֧�ֽ�������ʽ 
	var table = nstc.sf.findParent(obj, "TABLE");
	return table.isalternat=="1"||table.isAlternat=="1"?true:false;
}

/**
 * �жϵ�ǰ��λ�ڵ�ǰҳ��ڼ������ݱ��(����div��class="unit_content"��"unit_contenyt_list_fix_right")
 */
function getCurrentTableIndex(obj) {
	var idx = -1;
	var div = $(obj).parents("div.unit_content_list,div.unit_content_list_fix_right,div.unit_content_list_fix_left");

	// �������е����ݱ��
	if(typeof(allDataGridDiv)=='undefined')
		allDataGridDiv = $("div.unit_content_list,div.unit_content_list_fix_right,div.unit_content_list_fix_left");
	// ��ѯ��ǰ�����ڱ������
	allDataGridDiv.each(function(i, e) {
		if(div[0]==e) {
			idx = i;
			return;
		}
	});
	return idx;
}

//���ݵ���ר��iframe
$(document).ready(function(){
	$(document.body).append('<iframe name="data_export" src="" style="display:none;"></iframe>')
});
//���ֻ�������/�ϴ��ļ���/ѡ�� �ȿؼ������̻���ʱ��ҳ���ַ�仯����
$(document).ready(function(){
	$(":input[readOnly]").keydown(function(event){
		if(8 == event.keyCode){
			event.returnValue = false;
			return false;
		}
		return true;
	});

});

//��ҳ��ʵ��
function smart_page_simple_page(objId,currPage,query_func) {
	document.getElementById(objId).value = currPage;
	try{
		var td = nstc.sf.findParent(document.getElementById(objId), "TD");
		if(!td.disabled){
			if(window[query_func] !=null){    //ִ���Զ���ҳ��ˢ�·���
				window[query_func](objId, currPage);
			}else{                           //ִ��Ĭ��ҳ��ˢ��
				var unit_code = objId.substring(0,objId.indexOf("."));
				$(":button[id$='refresh']").click();
			}
		}

		td.disabled = true;

	}catch(e){

	}
}
//����Ƿ�ͨ����ҳ���ð�ť��ˢ���¼�,������ǣ��ѵ�ǰҳ����Ϊ1
function check_simple_page_invoke(func){
	var flag = false;
	var pageKey = "_curPageNum";
	if($(":hidden[id$='"+pageKey+"']").length > 0){
		while(func){
			if(func == window["smart_page_simple_page"]){
				flag = true;
				break;
			}else{
				func = func && func.caller;
			}
		}
		if(!flag){
			$(":hidden[id$='"+pageKey+"']").val("1");
		}
	}
}
//ͨ�����������ѡ���ı���ֵ
function smartForm_clearValueByLink(obj){
	var def_func = $(obj).attr("def_clear_func");
	if( def_func !=null){
		//��������Զ�����շ�����������ִ���Զ��巽��
		try{
			eval("("+def_func+")");
		}catch(e){

		}
	}else{
		//����ı����
		$(obj).val("");
	}
}
function smartForm_ShowUCon(obj){
	var btnId=$(obj).attr("id");
	var tempStr=btnId.split(".");
	var code=tempStr[0]+".content";
	var bo=tempStr[0]+".bo";
	var destObj= document.getElementById(code);
	var boObj=document.getElementById(bo);
	var frontVal=$(destObj).css("display");
	if(frontVal=="none"){
		$(destObj).css("display","")
		$(boObj).css("display","")
		obj.value="�����"
	}else{
		$(destObj).css("display","none");
		$(boObj).css("display","none");
		obj.value="չ����"

	}
}
//--------2016/8/18--add----------------------
/*
function smartForm_ShowUImg_old(obj){
	var btnId=$(obj).attr("id");
	var tempStr=btnId.split(".");
	var code=tempStr[0]+".content";
	var bo=tempStr[0]+".bo";
	var destObj= document.getElementById(code);
	var boObj=document.getElementById(bo);
	var frontVal=$(destObj).css("display");
	var img =document.getElementById(btnId);
	if(frontVal=="none"){
		$(destObj).css("display","")
		$(boObj).css("display","")
		//obj.value="�����"
		if(img){
			img.src="./SmartFormRes/js/skin/default/retract.png";
		}
	}else{
		$(destObj).css("display","none");
		$(boObj).css("display","none");
		// obj.value="չ����"		
		if(img){
			img.src="./SmartFormRes/js/skin/default/spread.png";
		}
	}
}
*/

function smartForm_ShowUImg(obj){
	var btnId=$(obj).attr("id");
	var tempStr=btnId.split(".");
	var code=tempStr[0]+".content";
	var bo=tempStr[0]+".bo";
	var destObj= document.getElementById(code);
	var boObj=document.getElementById(bo);
	var frontVal=$(destObj).css("display");
	if(frontVal=="none"){
		$(destObj).css("display","")
		$(boObj).css("display","")
		//obj.value="�����"
	}else{
		$(destObj).css("display","none");
		$(boObj).css("display","none");
		// obj.value="չ����"
	}
}

function smartForm_ShowUImg_over(obj) {
	$(obj).find(".DefaultTitleBar").css({"background-color":"#cde8f6","cursor":"pointer"});
}

function smartForm_ShowUImg_out(obj) {
	$(obj).find(".DefaultTitleBar").css("background-color","#E8F1FC");
}


function smartForm_scsbt_onmouseover(obj){
	//obj.style.background="#65E075";	
	//obj.style.color="white";
	obj.style.cursor="hand";
}
function smartForm_scsbt_onmouseout(obj){
	//obj.style.background="transparent";
	//obj.style.color="black";
	obj.style.cursor="";
}
/**
 *���ҳǩ�µ�ͳ��ͼ��Ⱦ����
 * @param obj
 */
function showTotalChart(obj){
	var idVal=$(obj).find("[name='totalChartID']").val();
	var dataVal=$(obj).find("[name='totalChartData']").val();
	if("undefined" == typeof idVal||"undefined" == typeof dataVal){
		return;
	}
	var myChart = echarts.init(document.getElementById(idVal));
	var option;
	eval(dataVal);
	myChart.setOption(option);
}
/*
 * ��ȡ��Ԫ���ڱ����е�λ�����
 * */
function getCellIndex(o) {
	for (var i=0,obj=o.parentNode.childNodes; i<obj.length; i++) {
		if (o == obj[i]) return i;
	}
}

/*
 * ��ѡ��������
 * */
function click_checkbox(ele) {
	/*var id = ele.getAttribute('data-id');
	var chkBox = document.getElementById(id);*/
	var chkBox = ele.parentNode.getElementsByTagName("input").item(0);
	chkBox.click();
	change_checkbox_img(chkBox);
}

/*
* ��ѡ����ʽ�л�
* */
function change_checkbox_img(obj) {
	try {
		var objSpan = getSpanByNext(obj);
		if (obj.disabled) {
			obj.checked ? objSpan.className='checkbox_bg_disabled_f' : objSpan.className='checkbox_bg_disabled';
		} else {
			obj.checked ? objSpan.className='checkbox_bg_f' : objSpan.className='checkbox_bg';
		}
	} catch (e) {}
}

/*
* ��ȡ��ѡ���µ���ʽSPAN��ǩ
* */
function getSpanByNext(obj) {
	if (obj.nextSibling.tagName.toLowerCase() != "span") {
		getSpanByNext(obj.nextSibling);
	} else {
		return obj.nextSibling;
	}
}

/*
 * ��ѡ��ť��ʽ�л�
 * */
function change_radio_img(obj) {
	try {
		if (obj.disabled) {
			obj.checked ? obj.nextSibling.className='radioStyle_disabled_f' : obj.nextSibling.className='radioStyle_disabled';
		} else {
			obj.checked ? obj.nextSibling.className='radioStyle_f' : obj.nextSibling.className='radioStyle';
		}
	} catch (e) {}
}

/*
 * ��ѡ��ť�������
 * */
function click_radio(ele) {
	/*var radioID = ele.getAttribute("data-id");
	document.getElementById(radioID).click();
	var name = document.getElementById(radioID).getAttribute("name");
	var radioID = ele.parentNode.getElementsByTagName("input").item(0);*/
	var radioID = ele.previousSibling;
	radioID.click();
	var name = radioID.getAttribute("name");
	var ary = document.getElementsByName(name);
	for (var i=0; i<ary.length; i++) {
		change_radio_img(ary[i]);
	}
}

/*
 * �ϴ���ť�������
 * */
function click_file(ele) {
	var val = ele.getElementsByTagName("input").item(0).value;
	if (val.length > 0) {
		ele.getElementsByTagName("input").item(0).outerHTML = ele.getElementsByTagName("input").item(0).outerHTML;
		$(ele).prev().val("");
		$(ele).attr("class", "fileInput");
	} else {
		ele.getElementsByTagName("input").item(0).click();
	}
}

/*
 * �޸������б�����ʱ�������¼�����
 * */
function propertyChange(obj) {
	try {
		if (obj.style.display == "none") {
			obj.parentNode.style.border = "0px";
			obj.parentNode.style.width = "";
			if (!obj.nextSibling.nextSibling && !obj.previousSibling) {
				obj.parentNode.style.display = "none";
			} else {
				obj.parentNode.style.display = "";
			}
		} else {
			if (obj.parentNode.style.display == "none") {
				return;
			}
			obj.parentNode.style.border = "1px solid #E0E0DA";
			var wid = obj.style.width ? obj.style.width.split(":")[1] : "";
			obj.parentNode.style.width = wid;
			obj.parentNode.style.display = "";
		}
	} catch (e) {}
}

/*
 * ҳ���ʱ���ж������б��Ƿ񱻶�̬ɾ��
 * */
function refreshSelectStyle(obj) {
	try {
		if ($(obj).find("select").length == 0) {
			obj.className = "select-span";
		}
		propertyChange($(obj).find("select")[0]);
	} catch (e) {}
}

/*
 * ҳ���ʱ���жϸ�ѡ���Ƿ񱻶�̬ɾ��
 * */
function refreshCheckboxStyle(obj) {
	if (obj.previousSibling && obj.previousSibling.type == "checkbox") {

	} else {
		obj.className = "";
	}
}
/*
 * �޸ĸ�ѡ������ʱ�������¼�����
 * */
function checkbox_propertyChange(obj) {
	if (!$(obj).attr("selfname")) {
		if (obj.style.display == "none") {
			obj.nextSibling.style.display = "none";
		} else {
			obj.nextSibling.style.display = "inline-block";
		}
	}
	change_checkbox_img(obj);
}

/*
 * �޸ĵ�ѡ��ť����ʱ�������¼�����
 * */
function radio_propertyChange(obj) {
	change_radio_img(obj);
}
/**
 * nstc.sf.requestDropFilterTable_��Ԫ����_Ԫ������
 * ���������ʵ��
 */

nstc.sf.requestDropFilterTable_D1_biaoxuan = function(ele, params){
	var inputVal = document.getElementsByName("nstc.sf.DropFilterTableInputText")[0].value;
	inputVal = inputVal.replace(/\s/g,"%");
	params.params = "username="+inputVal //sql����username
	nstc.sf.requestDropFilterTable(ele, params, "my_function");
};
//ѡ�н������
function my_function(value){
//alert(value);
}

