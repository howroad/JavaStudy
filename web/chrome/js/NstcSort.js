if (nstc == null) var nstc = {};
/*
  ������� author ���ڼ� 2008/02/24
  09.03.22 �ع����Ż����� ֧��<th onsort="������"> �ص��Ƚ�
  ��̬������tableͬ����������,ֻ��ָ��TD��sortObject����ָ���ȡֵ�Ķ���(����input�ؼ�)������ ��cell.sortObject=��̬��������input����
  ��ҳ�����ʱִ�����½ű�����
	var sorter=new syj.Sort('mainTable');
	sorter.bindCell(0,'NUMBER');
	sorter.bindCell(1,'STRING_EN',false);����б��Ѿ�����ָ��˳��false����
	sorter.bindCell(2,'STRING_CH');
	sorter.bindCell(3,'DATE');
*/
//tbName������ı���start��ʼtr�±�Ĭ��1,end����tr�±�Ĭ��0
nstc.Sort=function(tb,ftb,isFixed,iStart,iEnd){//������������,�˺�������ģ����������
    this.oTable=tb;//һ��������������Ӧһ����ʵ�ʱ�
    this.iStart=iStart==null?1:iStart;//��ͷ����Ҫ�����ǰn��
    this.iEnd=iEnd==null?0:iEnd;//��β����Ҫ����ĺ�n��
    this.orderMap={};//���ÿ������״̬��Map����
    this.compareFuncMap={};//���ÿ����������Map����

	this.heads=this.oTable.rows[0].cells;
	if(ftb!=null) {
		this.oFixedTable=ftb;//�̶���ͷ��
		this.fixedHeads=this.oFixedTable.rows[0].cells;
	}
	this.spanSrc=document.createElement("span");
	//this.spanSrc.innerHTML="��";//ռλ��/
	this.spanSrc.style["text-align"]="center";
	this.spanSrc.style["vertical-align"]="middle";
	this.spanSrc.innerHTML='<img style="vertical-align:middle" src="./SmartFormRes/js/skin/default/desc.png" />';
	this.isFixed = isFixed;//�Ƿ�Ϊ�̶���ͷ�ĳ���
}
//ָ�����������cellIdx�к��±�,desc����б��Ѿ�����trueΪ����falseΪ����,nullΪ����,type����֧��������DATE,NUMBER,STRING_EN,STRING_CH
nstc.Sort.prototype.bindCell=function(cellIdx,type,desc){	
	if(typeof(this.oFixedTable)!='undefined') {
		this.setPlaceHolder("fixed",cellIdx,type,desc);
	}else{
		//
		this.setPlaceHolder("actual",cellIdx,type,desc);
	}
}
nstc.Sort.prototype.setPlaceHolder=function(tableType,cellIdx,type,desc){
	var c=(tableType=='fixed'?this.fixedHeads[cellIdx]:this.heads[cellIdx]),o=this;
	c.style.cursor='pointer';
	
	var thisType=type;//ת�ɾֲ�������ʹ����α��������ܹ����ñհ����ԡ�
	var thisTableType = tableType;
	c.onclick=function(){
		cellIdx = this.cellIndex;
		/*if (this.getAttribute("sortType") == "desc") {
			instance.orderMap[this.cellIndex] = "asc";
		} else {
			instance.orderMap[this.cellIndex] = "desc";
		}*/
		instance.orderMap[this.cellIndex] = this.getAttribute("sortType");
		if(o.isFixed) {
			/*if(thisTableType!='fixed') {
				o.sort(this,thisType);//ʹ�ñհ��߼�
			} else {
				o.switchOrder(this.cellIndex);//�ı䵱ǰ�е�����״̬��ʶ
			}*/
			o.sort(this,thisType);//ʹ�ñհ��߼�
			o.switchOrder(this.cellIndex);//�ı䵱ǰ�е�����״̬��ʶ
		} else {
			o.sort(this,thisType);//ʹ�ñհ��߼�
		}

		if(instance.orderMap[this.cellIndex]=='desc') {
			this.getElementsByTagName("span")[0].innerHTML='<img style="vertical-align:middle"  src="./SmartFormRes/js/skin/default/desc.png"  />';
			this.setAttribute("sortType","desc");
		} else {
			this.getElementsByTagName("span")[0].innerHTML='<img style="vertical-align:middle" src="./SmartFormRes/js/skin/default/asc.png"  />';
			this.setAttribute("sortType","asc");
		}
		this.getElementsByTagName("span")[0].style.visibility='visible';
		//this.updateSymbol();
		if(o.onclickExt!=null)o.onclickExt(this);//ִ����չ��onclickExt�¼�
		this.style.cursor='pointer';
	}
	
	var f=this.spanSrc.cloneNode(true);
	f.style.visibility='hidden';
	f.style["text-align"]="center";
	f.style["vertical-align"]="middle";
	f.sortType = "";
	var instance=this;
	c.updateSymbol=function(){
		//if(instance.orderMap[cellIdx]=='desc') f.innerHTML="��";else f.innerHTML="��";
		if(instance.orderMap[this.cellIndex]=='desc') {
			f.innerHTML='<img style="vertical-align:middle"  src="./SmartFormRes/js/skin/default/desc.png"  />';
		} else {
			f.innerHTML='<img style="vertical-align:middle" src="./SmartFormRes/js/skin/default/asc.png"  />';
		}

		f.style.visibility='visible';
	}
	if(desc!=null)this.orderMap[this.cellIndex]=desc==true?'desc':'asc';
	if(this.orderMap[this.cellIndex]!=null)c.updateSymbol();
	c.onmouseover=function(){
		if(this.getAttribute("sortType")) {
			this.getElementsByTagName("span")[0].style.visibility='visible';
		}
	}
	c.onmouseout=function(){this.getElementsByTagName("span")[0].style.visibility='hidden';}
	if (c.getElementsByTagName("span").length == 0) {
		c.appendChild(f);
	}
	c.style.textIndent=f.offsetWidth;
}
nstc.Sort.prototype.sort=function(triger,type){//����������������򷽷�
    var oTbody=this.oTable.tBodies[0];
    var oRows=this.oTable.rows;//ȫ����rows(��)����
    var aRowsList=[];//��Ŵ������rows
    var aEndRowsList=[];//��ű�β����Ҫ�����rows
    var iLength=oRows.length;//��������
    if(this.iStart+this.iEnd>=iLength) return ;//����������
    var oDocFrag=document.createDocumentFragment();//����һ����ʱ�õ�dom����
    for(var i =this.iStart;i<iLength-this.iEnd;i++) {//����������Ӵ������row����
    	if(oRows[i].style.display!="none" && "0" != oRows[i].getAttribute("isSort")) {
    		aRowsList.push(oRows[i]);
    	} else {
    		aEndRowsList.push(oRows[i]);
    	}
    }
    aRowsList.sort(this.generateCompareFunc(triger,type));//���������sort�����������������
    for(var i =iLength-this.iEnd;i<iLength;i++)//��ӱ�β�����������row����
        aEndRowsList.push(oRows[i]);
	//if(this.orderMap[triger.cellIndex]==(this.isFixed?'desc':'asc')){
	if(this.orderMap[triger.cellIndex]=='asc'){
        for(var i=aRowsList.length-1;i>=0;i=i-1)//����append
            oDocFrag.appendChild(aRowsList[i]);
    }else{
        for(var i=0,iRowLength=aRowsList.length;i<iRowLength;i++)//����append
            oDocFrag.appendChild(aRowsList[i]);
    }
    for(var i=0,iRowLength=aEndRowsList.length;i<iRowLength;i++)//׷�ӱ�βû���������rows
        oDocFrag.appendChild(aEndRowsList[i]);
    oTbody.appendChild(oDocFrag);//����ʱdom����(���д����������rows)�ҵ�����
	if(!this.isFixed) {
		this.switchOrder(triger.cellIndex);//�ı䵱ǰ�е�����״̬��ʶ
	}
    oTbody=null,oRows=null,aRowsList=null,aEndRowsList=null,iLength=null,oDocFrag=null;
}
nstc.Sort.prototype.switchOrder=function(idx){
    var order=this.orderMap[idx];
    order=(order==null||order=='desc')?'asc':'desc';
    this.orderMap[idx]=order;
}
nstc.Sort.prototype.toDate=function(ds){//�ַ���ת���������� ��ʽ MM/dd/YYYY MM-dd-YYYY YYYY/MM/dd YYYY-MM-dd
    var d = new Date(Date.parse(ds));
    if (isNaN(d)){
        var arys= ds.split('-');
        d = new Date(arys[0],arys[1]-1,arys[2]);
    }
    return d;
}
nstc.Sort.prototype.getCellValue=function(cell,func){//ȡcell��ֵ
	if(cell.sortObject!=null) {
		return cell.sortObject.value!=null?cell.sortObject.value:cell.sortObject.innerText;
	}
	else {
		var val = cell.getElementsByTagName("input") ? cell.getElementsByTagName("input").item(0).value : cell.innerText;
		return !func?val:func(cell);//Ĭ��ȡtd�е�����,���ָ����onsort��ִ��onsort�еĺ���ȡֵ
	}
}
nstc.Sort.prototype.generateCompareFunc=function(triger,type){//����������
    //var idx=triger.cellIndex;//�е��±�
	var idx = getCellIndex(triger);
	var func=this.compareFuncMap[idx];//����map����,�Ҳ������½�
    if(func!=null) return func;
    var instance=this;//�հ����ò��̫����,��Ҫ������
    var onsortFunc=window[triger.onsort];//���÷���ȡ��onsort����ĺ���
    if(type=="STRING"||type=="STRING_EN"||type=="STRING_CH"){
        func=function compare(a,b){
            var x=instance.getCellValue(a.cells[idx],onsortFunc);
            var y=instance.getCellValue(b.cells[idx],onsortFunc);
            x=x==null?'':x;
            y=y==null?'':y;
            return x.localeCompare(y);//���ñ��صıȽϺ���,���ְ�����ƴ������
        }
    }else if(type=="NUMBER"){
        func=function compare(a,b){
            var x=instance.getCellValue(a.cells[idx],onsortFunc);
            var y=instance.getCellValue(b.cells[idx],onsortFunc);
			if((x==null || x=='') && y !=null && y !='')
				return -1
			else if(x!=null && x!='' && (y==null || y==''))
				return 1;	
			else{	
				x=x==null?1:x;
				y=y==null?1:y;
				x=x.replace(/[^\d|.|-]/g,"");//ȥ����-.����������ַ�
				y=y.replace(/[^\d|.|-]/g,"");
				return x*1000-y*1000;//���Ǹ�������
			}
        }
    }else if(type=="DATE"){
        func=function compare(a,b){
            var x=instance.getCellValue(a.cells[idx],onsortFunc);
            var y=instance.getCellValue(b.cells[idx],onsortFunc);
            var d='1900-01-01';
            var x=instance.toDate(x==''?d:x);
            var y=instance.toDate(y==''?d:y);
            var z=x-y;
            return z;
        }
    }
    //this.compareFuncMap[idx]=func;	// ��ʹ�û��棬��֤����ק�к�������Ȼ��ȷ
    return func;
}
