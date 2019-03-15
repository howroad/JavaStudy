var Navigation = function () {
    this.windowName = "";   // �����ڵ�name
    this.portalWindowName = "content";  // �Ż����ڵ�name
    this.smartPageIframe = false;
    this.show = false;      // �Ƿ���ʾ����
    this.isGlbPage = false; // �Ƿ���ȫ��ҳ�棬�򵯳���ҳ�桢IFRAMEҳ��
    this.buttonData = "";   // ������ť����
    this.title = "";
    this.icon = "";
    this.ppid = "";
    this.init();
};

Navigation.prototype.init = function () {
    var navHtml, ele;
    try {
        this.isShowNav();
        this.isGlbPage = this.isGlobePage();
        this.smartPageIframe = this.getSmartPageIframe();
        if (this.show && this.isGlbPage) {
            navHtml = this.createHtml(true);
            ele = document.createElement("<div id='top-nav-bar' class='top-nav-bar'></div>");
            ele.innerHTML = navHtml;
            this.setCenter(false);
            document.body.insertBefore(ele, document.getElementsByTagName("center")[0]);
        } else if (this.show && !this.isGlbPage) {
            navHtml = this.createHtml(false);
            ele = document.createElement("<div id='bottom-nav-bar' class='bottom-nav-bar'></div>");
            ele.innerHTML = navHtml;
            this.setCenter(true);
            document.body.insertBefore(ele, document.getElementsByTagName("center")[0].nextSibling);
            ele.getElementsByTagName("input")[0].style.borderLeft = "0px";
        }
    } catch (e) {

    }
};

/*
* ������������center����ʽ
* */
Navigation.prototype.setCenter = function (isWin) {
    var centerEle = document.getElementsByTagName("center")[0];
    if (isWin) {
        centerEle.style.paddingBottom = "0px";
        centerEle.style.overflow = "auto";
        centerEle.style.height = "90%";
        /*document.getElementById("form-main-table").style.paddingLeft = "0px";*///��������÷ŵ�smartpage�е�onload�����
    } else {
        centerEle.style.paddingBottom = "46px";
        document.body.style.overflow = "hidden";
    }
};

/*
 * ��ȡ��IFRAME��NAMEֵ�������жϵ�ǰҳ�������Ŀ��
 * */
Navigation.prototype.getIframeName = function () {
    return document.parentWindow.name;
};

/*
 * ��ȡIFRAME��smartPageIframeֵ���ж��Ƿ���ҳ���е�Iframe
 * */
Navigation.prototype.getSmartPageIframe = function () {
    var name = document.parentWindow.name;
    return name.indexOf("iframe_") == 0 ? false : true;
};
/*
 * �ж�ȫ�ְ�ť��������ȷ���Ƿ���Ҫ��ʾ����
 * */
Navigation.prototype.isShowNav = function () {
    this.buttonData = this.getButtonData();
    /*return this.buttonData == "" ? false : (this.buttonData["pageButton"].length == 0 ? false : true);*/
};

/*
 * �ж�ҳ���Ƿ����Ż���IFRAME�У�����ǣ�����ʾ���������������ʾ������
 * */
Navigation.prototype.isGlobePage = function () {
    this.windowName = this.getIframeName();
    return this.windowName == this.portalWindowName ? true : false;
};

/*
 * ����������HTML�������ʽ
 * */
Navigation.prototype.createHtml = function (globe) {
    var html = "<div id='page-nav-icon' class='"+(globe ? 'page-nav-icon' : 'page-nav-icon-bottom')+"'>" +
        "<img src=" + this.icon + " />" +
        "</div>" +
        "<div id='page-nav-name' class='"+(globe ? 'page-nav-name' : 'page-nav-name-bottom')+"'>" + this.title + "</div>" +
        "<div id='page-nav-center' class='"+(globe ? 'page-nav-center' : 'page-nav-center-bottom')+"'></div>" +
        "<div id='page-nav-btn' class='"+(globe ? 'page-nav-btn' : (this.smartPageIframe ? 'page-nav-btn-bottom' : 'page-nav-btn-center'))+"'>" +
        this.createButton() +
        "</div>";
    return html;
};

/*
 * ����������ť��HTML
 * */
Navigation.prototype.createButton = function () {
    //{"pageButton":[{"name":"����","id":"reset"},{"name":"�ύ","id":"submit"}]}
    var length = this.buttonData["pageButton"].length,
        buttonHtml = "";
    if (length == 0) {
        this.show = false;
    } else {
        for (var i=0; i<length; i++) {
            buttonHtml += this.getButtonHtml(this.buttonData["pageButton"][i]);
        }
    }
    return buttonHtml;
};

/*
 * ��ȡ��һ��ť��HTML
 * */
Navigation.prototype.getButtonHtml = function (obj) {
    var html = "",
        type = obj.name,
        id = obj.id;
    switch (id) {
        case "reset":   // ����
            html = "<input type='button' class='button3 button' value='����' id='"+ this.ppid + "." +
                id+"' name='"+type+"' onmouseover='smartForm_bt_onmouseover(this)' onmouseout='smartForm_bt_onmouseout(this)' " +
                "onclick='"+(obj.custom || "smartForm_glb_reset(this)")+"' />";
            break;
        case "submit":  // �ύ
            html = "<input type='button' class='button12 button' value='�ύ' id='"+ this.ppid + "." +
                id+"' name='"+type+"' onmouseover='smartForm_bt_onmouseover(this)' onmouseout='smartForm_bt_onmouseout(this)' " +
                "onclick='"+(obj.custom || "smartForm_glb_submit(this)")+"' />";
            break;
        case "save":  // ����
            html = "<input type='button' class='button2 button' value='����' id='"+ this.ppid + "." +
                id+"' name='"+type+"' onmouseover='smartForm_bt_onmouseover(this)' onmouseout='smartForm_bt_onmouseout(this)' " +
                "onclick='"+(obj.custom || "smartForm_glb_save(this)")+"' />";
            break;
        case "search":  // ����
            html = "<input type='button' class='button23 button' value='����' id='"+
                id+"' name='"+type+"' onmouseover='smartForm_bt_onmouseover(this)' onmouseout='smartForm_bt_onmouseout(this)' " +
                "onclick='smartForm_glb_search()' />";
            break;
        default :  // ��ͨ
            html = "<input type='button' class='buttonDef button' value='"+type+"' id='"+
                id+"' name='"+type+"' onmouseover='smartForm_bt_onmouseover(this)' onmouseout='smartForm_bt_onmouseout(this)' " +
                "onclick='"+(obj.custom || "")+"' />";
            break;
    }
    return html;
};

/*
 * ��ȡ������ť����
 * */
Navigation.prototype.getButtonData = function () {
    var ele = document.getElementById("globalToolbarData");
    var data = ele.getAttribute("toobalButtonData");
    var ret = data == "" ? "" : (typeof data == "object" ? data : JSON.parse(data));
    this.title = ele.getAttribute("pageTitle");
    this.icon = ele.getAttribute("imgPath");
    this.ppid = ele.getAttribute("ppid");
    this.show = ele.getAttribute("isDisplay") == 1 ? true : false;
    return ret;
};

/*
 * ��̬����һ�����ذ�ť������form��
 * */
function createFormEle(ele) {
    var obj = document.createElement("input");
    obj.type = "hidden";
    obj.id = ele.id;
    document.forms[0].appendChild(obj);
    return obj;
}

/*
 * ȫ�ְ�ť-����
 * */
function smartForm_glb_save(ele) {
    var obj = createFormEle(ele);
    smartForm_doSave(obj);
}

/*
 * ȫ�ְ�ť-����
 * */
function smartForm_glb_reset(ele) {
    var obj = createFormEle(ele);
    smartForm_doClear(obj);
}

/*
 * ȫ�ְ�ť-�ύ
 * */
function smartForm_glb_submit(ele) {
    var obj = createFormEle(ele);
    smartForm_doSubmit(obj);
}

/*
 * ȫ�ְ�ť-����
 * */
function smartForm_glb_search() {
    if ($(".search-hide-fixed .QueryUnitDiv").length == 0) {
        return;
    }
    if ($(".search-hide-fixed .unit_title_close").length == 0) {
        $(".search-hide-fixed .DefaultTitleBar").css({"background-color": "transparent", "height": "39px", "line-height": "37px"});
        $(".search-hide-fixed .DefaultTitleBar-title").css({"color": "#444444", "font-size": "16px", "font-weight": "normal", "padding-left": "7px"});
        $(".search-hide-fixed .unit_title").append("<div class='unit_title_close' onclick='$(\".search-hide-fixed\").hide();' onmouseover='this.className=\"unit_title_close_on\"' onmouseout='this.className=\"unit_title_close\"'></div>");

        $(".search-hide-fixed .QueryBottomToolBar").css({"height": "40px"});
        $(".search-hide-fixed .QueryBottomToolBar td").css({"text-align": "center"});
        $(".search-hide-fixed .QueryBottomToolBar td input").css({"background": "", "padding-left": "0", "width": "auto", "font-size": "16px", "color": "#127fcc"}).mouseover(function () {
            this.style.color = "#59b0ed";
        }).mouseout(function () {
            this.style.color = "#127fcc";
        });
    }
    if ($(".search-hide-fixed").is(":hidden")) {
        $(".search-hide-fixed").show();
    } else {
        $(".search-hide-fixed").hide();
    }
}