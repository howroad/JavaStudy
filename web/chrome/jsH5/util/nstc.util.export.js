if (!nstc) {
	var nstc = [];
}
if (!nstc.util) {
	nstc.util=[];
}
/**
 * ���ʵ��ṹ
 * @param {} p �ϼ�
 * @param {} t �����ĵ�ǰDOM
 * @param {} v ֵ
 * @return {}
 */
var DomTree = function(p,t,v) {
	var parent = p;
	var target = t;
	var childs = [];
	var value = v;
	var attr = [];
	return {
		"getTarget":function() {
			return target;
		},
		"getParent":function() {
			return parent;
		},
		"getChilds":function() {
			return childs;
		},
		"addChild":function(child) {
			childs.push(child);
		},
		"getValue":function() {
			return value;
		},
		"addAttr":function(k,v) {
			attr.push({'KEY':k,'VALUE':v});
		},
		"toString":function() {
			return '{target:' + target + ';parent:' + (parent==null?"NULL":parent) + ';childs:' + childs.length + ';value:' + (value==null?"NULL" : value) + '}';
		},
		"toHTML":function(filter) {
			if (filter(target)) {
				var rtnStr = '<'.concat(target['tagName']);
				//��������_Begin
				//th/td��������colspan
				if((target['tagName']=='TH' || target['tagName']=='TD') && typeof(target.colSpan)!='undefined') {
					rtnStr = rtnStr.concat(" ").concat("colspan='").concat(target.colSpan).concat("' ");
				}
				for (var i = 0; i < attr.length; i++) {
					var obj = attr[i];
					rtnStr = rtnStr.concat(" ").concat(obj["KEY"]).concat("='").concat(obj["VALUE"]).concat("' ");
				}
				//��������_End
				//��Ҫ���Ǳ�ǩ����
				rtnStr = rtnStr.concat('>');
				//�ݹ��˼��/�ֲ㴦��HTML��ת��
				for (var index = 0; index < childs.length; index++) {
					var child = childs[index];
					rtnStr = rtnStr.concat(child.toHTML(filter));
				}
				rtnStr = rtnStr.concat((value == null) ? "" : value).concat("</").concat(target['tagName']).concat('>');
				return rtnStr;
			} else {
				return value == null ? '' : value;
			}
		}
	}
};
/**
 * ��ʱ���󣬸���DOM����
 */
var tmpObj = function(){
	/**
	 * ����
	 */
	function debug(str) {
		//document.getElementById('wst_acc_101.remark').value = document.getElementById('wst_acc_101.remark').value + str + "\r\n";
	}
	/**
	 * ȡ�ӽڵ�
	 */
	function getChildren(domTree) {
		var target = domTree.getTarget();
		if (target.children) {
			for (var index = 0; index < target.children.length; index++) {
				var child = target.children[index];
				var childNodes = child.childNodes;
				if((child['tagName']=='TH' || child['tagName']=='TD') && childNodes.length==1 && childNodes[0].nodeType==3) {
					// �����һ���ӽڵ�,������Ϊ�ı��ڵ�,��ǰ�ڵ�ֵΪ�ı��ӽڵ��ֵ
					domTree.addChild(new DomTree(domTree, child, childNodes[0].nodeValue));
				} else {
					var childDomTree = new DomTree(domTree, child, getChildValue(child)!=null?"&nbsp;".concat(getChildValue(child)):null);
					//var childDomTree = new DomTree(domTree, child, getChildValue(child));
					domTree.addChild(childDomTree);
					getChildren(childDomTree);
				}
			}
		}
	}
	/**
	 * ȡ�����ڵ��ֵ
	 */
	function getChildValue(child) {
		if (child['tagName'] == 'SELECTE') {
			return (child['options'][child['selectedIndex']]['value']);
		} else if (child['tagName'] == 'INPUT') {
			var rtnValue = null;
			switch(child['type']) {
				case 'text':
					rtnValue = child['value'];
					break;
				case 'hidden':
					rtnValue = child['value'];
					break;
				default:
					rtnValue = null;
					break;
			}
			return rtnValue;
		} else if (child['tagName'] == 'LABEL') {
			return child['innerText'];
		}
		return (child.children==null)?child['innerHTML']:null;
	}
	/**
	 * ���Ը����ַ��������е�script��ǩ
	 */
	function subStrVal(val){
		var indexS = val.indexOf("<SCRIPT>");
		var indexE = val.indexOf("/SCRIPT>");
		if(indexS == -1 || indexE==-1) return val;
		
		val = val.substring(0,indexS)+val.substring(indexE+8);
		return subStrVal(val);
	}
	/**
	 * ����Excel_����Ԫ�أ��˷�����domת�������еĻص�����ͨ��true/false�����߼������֧
	 * <p>{true:��ʾ��dom��Ҫ������;false:��ʾ���ᱻ����}</p>
	 */
	function filterElem(elem) {
		if (elem['tagName'] == 'INPUT') {
			return false;
		} else if (elem['tagName'] == 'LABEL') {
			return false;
		} else if (elem['tagName'] == 'SELECT') {
			return false;
		} else if (elem['tagName'] == 'A') {
			return false;
		} else if (elem['tagName'] == 'TEXTAREA') {
			return false;
		} else if(elem['tagName'] == 'TD' || elem['tagName'] == 'TH') {
			// ������ѡ��ĵ�Ԫ�����
			var firstLevelChild = elem.children;
			if(firstLevelChild.length>0) {
				var secLevelChild = firstLevelChild[0].children;
				if(secLevelChild.length>0) {
					if(typeof(secLevelChild[0].type)!='undefined' && secLevelChild[0].type=='checkbox') 
						return false;
				}
			}
		}
		// ����Ԫ�ز����
		if(elem.style.display=='none') {
			return false;
		}
		return true;
	}
	return {
		"sayHello":function() {
			alert('Hello');
		},
		"ergodicTableDom":function(tableElemId) {
			var tableElemObj = document.getElementById(tableElemId);
			if (!tableElemObj) {
				return null;
			}
			var root = new DomTree(null, tableElemObj, null);
			root.addAttr('border','1');
			getChildren(root);
			//debug(root.toHTML(filerElem));
			return root;
		},
		"exportHtmlToExcel":function(domId) {
			var domRoot = this.ergodicTableDom(domId);
			//ȡ����������
			var htmlStr = domRoot.toHTML(filterElem);
			if (!htmlStr) {
				throw "û����ȡ���������ݣ�"; 
			}
			try {
				var excelObj = new ActiveXObject("Excel.Application");
				var excelWorkBook = excelObj.workbooks.add();
				var excelWorkBookSheet = excelWorkBook.worksheets(1);
				excelObj.DisplayAlerts=false;
				window.clipboardData.setData("Text", htmlStr);
				excelWorkBook.worksheets(1).Paste;
				excelWorkBook.worksheets(1).Columns.AutoFit;
				excelWorkBook.worksheets(1).Rows.AutoFit;
				excelObj.visible=true;
			} catch (e) {
				alert(e.message);
			}			
		}
	}
}();
nstc.util.exportUtil = tmpObj;