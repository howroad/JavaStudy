function saveColumnsStyle(){   
	var table;
	//if ($("table[isEditColumn='true']")) {
	//	table=$("table[isEditColumnFixed='true']").get(0);
	//} else {
	//	table=$("table[isEditColumn='true']").get(0);
	//}
	//-----------2016/8/15--update--�ж��Ƿ�ɱ༭��--------------------
	if ($("table[isEditColumn='true']").length > 0) {
		table=$("table[isEditColumn='true']").get(0);
	} else {
		table=$("table[isEditColumnFixed='true']").get(0);
	}
	var row;
	var rowData;
    var header=''
     row=table.rows[0];
     rowData=table.rows[1];
	 header+=$(table).find("thead").get(0).outerHTML;
   var allColumnData="[";
   for ( var i = 0; i < row.cells.length; i++) {
		allColumnData += "{";
		allColumnData += '"no":';
		allColumnData += '"'
				+ $(rowData.cells[i]).find("input").attr("id").split(".")[1]
				+ '"';
		allColumnData += ',"name":';
		allColumnData += '"' + $(row.cells[i]).find("label").html() + '"';
		allColumnData += ',"index":';
		//allColumnData += '"' + row.cells[i].cellIndex + '"';
	   allColumnData += '"' + getCellIndex(row.cells[i]) + '"';
	   allColumnData += ',"width":"';
		allColumnData += row.cells[i].width;
		allColumnData += '","hidden":';
		if ($(row.cells[i]).css("display") == "none") {
			allColumnData += 1;
		} else {
			allColumnData += 0;
		}
		allColumnData += "}";
		allColumnData += ",";
	}
		 allColumnData=allColumnData.substr(0,allColumnData.length-1);
		 allColumnData+="]";
		//  alert(allColumnData);
		 var unitId=$(rowData.cells[2]).find("input").attr("id").split(".")[0];
		 var pagewidth=document.body.clientWidth 
	     var t2= JSON.parse(allColumnData);  
		 var allData={"unitID":unitId,"header":header,"pagewidth":pagewidth,"allColumnData":t2};
		 submitColumnData(allData);
}
/**����Ϣ���ݸ�ʽ��
 *
 *{unitId:��Ԫ���,
 *header:��ͷ��HTML,
 *pagewidth:ҳ��ɼ�����ȣ�
 *allColumnData:[{'name':����,'no':�е�Ԫ����,'index':������,'width':�п�,'hidden':�Ƿ�����}]}
 * 1Ϊ����,0Ϊ��ʾ
 * @param dataVal
 */
function submitColumnData(dataVal){   
	var pageid = document.getElementById('pageCode').value;
	var appcode = document.getElementById('appNo').value;
       $.ajax({
		   type: "POST",
		   async: false,
		   url: "SMB_UserBehaviorSaveAction.sf",
		   data:'pageid='+pageid+'&appCode='+appcode+'&unitProps='+JSON.stringify(dataVal),
		   success: function(data){
			   
		   }
		});
}
/*
 * ��ȡ��Ԫ���ڱ����е�λ�����
 * */
function getCellIndex(o) {
	for (var i=0,obj=o.parentNode.childNodes; i<obj.length; i++) {
		if (o == obj[i]) return i;
	}
}
