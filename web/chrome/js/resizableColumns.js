function resizableColumns(){
	var tTD; //�����洢��ǰ���Ŀ�ȵ�Table Cell,��������ƶ���������
	var tables=document.getElementsByTagName('table');
	var ti;
	var table;
	var FixTable;
	for(ti=0;ti<tables.length;ti++){
		if($(tables[ti]).attr('isEditColumn')=='true') {
			table = tables[ti];
			for (j = 0; j < table.rows[0].cells.length; j++) {
				if (table.rows[0].cells[j].getAttribute("banedit") == "true") {
					continue;
				}
				table.rows[0].cells[j].mouseDown = false;
				table.rows[0].cells[j].onmousedown = function () {
					//��¼��Ԫ��
					tTD = this;
					if (FixTable) {
						tTD = table.rows[0].cells[j];
					}
					if (event.offsetX > tTD.offsetWidth - 10) {
						tTD.mouseDown = true;
						tTD.oldX = event.x;
						tTD.oldWidth = tTD.offsetWidth;
					}
					//��¼Table���
					//table = tTD; while (table.tagName != ��TABLE') table = table.parentElement;
					//tTD.tableWidth = table.offsetWidth;
				};
				table.onmouseup = function () {
					//������ȵ���
					if (tTD == undefined) tTD = this;
					tTD.mouseDown = false;
					tTD.style.cursor = 'default';
				};
				table.rows[0].cells[j].onmousemove = function () {
					if (!tTD || !tTD.mouseDown) {
						//���������ʽ
						if (event.offsetX > this.offsetWidth - 10)
							this.style.cursor = 'col-resize';
						else {
							if (this.getElementsByTagName("span").length > 0) {
								this.style.cursor = 'pointer';
							} else {
								this.style.cursor = 'default';
							}
						}
					}
					//ȡ���ݴ��Table Cell
					if (tTD == undefined) tTD = this;
					//�������
					if (tTD.mouseDown != null && tTD.mouseDown == true) {
						tTD.style.cursor = 'default';
						if (tTD.oldWidth + (event.x - tTD.oldX) > 0)
							tTD.width = tTD.oldWidth + (event.x - tTD.oldX);
						//�����п�
						tTD.style.width = tTD.width;
						tTD.style.cursor = 'col-resize';
						//���������е�ÿ��Cell
						table = tTD;
						while (table.tagName != 'TABLE') table = table.parentElement;
						//for (j = 0; j < table.rows.length; j++) {
							table.rows[0].cells[tTD.cellIndex].width = tTD.width;
						//}
						//����������
						//table.width = tTD.tableWidth + (tTD.offsetWidth �C tTD.oldWidth);
						//table.style.width = table.width;
					}
				};
			}
		} else if ($(tables[ti]).attr('isEditColumnFixed')=='true') {
			FixTable = tables[ti];
			table = tables[ti].parentNode.previousSibling.firstChild;
			/*var tbody = tables[ti].getElementsByTagName("tbody")[0].cloneNode(true);
			 if (table.getElementsByTagName("tbody")[0]) {
			 table.removeChild(table.getElementsByTagName("tbody")[0]);
			 }
			 table.appendChild(tbody);
			 table.parentNode.style.height = table.getElementsByTagName("thead")[0].getElementsByTagName("th")[0].clientHeight;
			 table.parentNode.style.overflow = "hidden";*/
			for (j = 0; j < table.rows[0].cells.length; j++) {
				if (table.rows[0].cells[j].getAttribute("banedit") == "true") {
					continue;
				}
				table.rows[0].cells[j].mouseDown = false;
				table.rows[0].cells[j].onmousedown = function () {
					//��¼��Ԫ��
					tTD = this;
					if (event.offsetX > tTD.offsetWidth - 10) {
						tTD.mouseDown = true;
						tTD.oldX = event.x;
						tTD.oldWidth = tTD.offsetWidth;
					}

					//��¼Table���
					//table = tTD; while (table.tagName != ��TABLE') table = table.parentElement;
					//tTD.tableWidth = table.offsetWidth;
				};
				table.onmouseup = function () {
					// ������ȵ����󣬱�֤�̶���ͷ�п�С����ͨ��ͷ������������
					try {
						for (var i = 0; i < table.rows[0].cells.length; i++) {
							table.rows[0].cells[i].style.width = FixTable.rows[0].cells[i].offsetWidth;
							FixTable.rows[0].cells[i].style.width = table.rows[0].cells[i].style.width;
						}
						table.style.width = FixTable.parentNode.clientWidth;
					} catch (e) {
					}
					//������ȵ���
					if (tTD == undefined) tTD = this;
					tTD.mouseDown = false;
					tTD.style.cursor = 'default';
					try {
						fixTableObj.keetDefault();
						//$(window).resize();
					} catch (e) {}
				};
				table.rows[0].cells[j].onmousemove = function () {
					if (!tTD || !tTD.mouseDown) {
						//���������ʽ
						if (event.offsetX > this.offsetWidth - 10) {
							this.style.cursor = 'col-resize';
						} else {
							if (this.getElementsByTagName("span").length > 0) {
								this.style.cursor = 'pointer';
							} else {
								this.style.cursor = 'default';
							}
						}
					}
					//ȡ���ݴ��Table Cell
					if (tTD == undefined) tTD = this;
					//�������
					if (tTD.mouseDown != null && tTD.mouseDown == true) {
						table.parentNode.style.width = FixTable.parentNode.clientWidth;
						tTD.style.cursor = 'default';
						if (tTD.oldWidth + (event.x - tTD.oldX) > 0)
							tTD.width = tTD.oldWidth + (event.x - tTD.oldX);
						//�����п�
						tTD.style.width = tTD.width;
						tTD.style.cursor = 'col-resize';
						//���������е�ÿ��Cell
						table = tTD;
						while (table.tagName != 'TABLE') table = table.parentElement;
						for (var i = 0; i < table.rows[0].cells.length; i++) {
							FixTable.rows[0].cells[i].style.width = table.rows[0].cells[i].style.width;
						}

						//����������
						//table.width = tTD.tableWidth + (tTD.offsetWidth �C tTD.oldWidth);
						//table.style.width = table.width;
					}
				};
			}
		}
	}
}