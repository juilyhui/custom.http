
// $(document).ready(function(){
//     ready();
// });
(function($){

    //function ready(){
    
    /*
        模态框
        initModal() 向body里追加模态框模板，close按钮触发closeModal();
        showModel() 向模板里追加标题，并显示模板
        closeModal() 隐藏模板
     */
    var modalBox={
        initModal:function(){ 
            var self=this; 
            // var tpl="<div id='modal-tpl' style='display:none'>\
            //     <div class='modal-content'>\
            //         <h3></h3>\
            //         <button class='close'>close</button>\
            //     </div>\
            // </div>";
            var tpl="<style>\
                    #modal-tpl{\
                        position: fixed;\
                        width: 100%;\
                        height: 100%;\
                        top: 0px;\
                        left: 0px;\
                        background: rgba(0,0,0,0.2);\
                    }\
                </style>\
                <div id='modal-tpl' style='display:none'>\
                    <div  class='alert alert-custom-little' >\
                        <div class='alert-top'></div>\
                        <div class='alert-title'>\
                            <img class='alert-title-left pull-left' src='./img/alert-left.png'>\
                            <div class='alert-title-info pull-left'>\
                              <div class='alert-line'></div>\
                            </div>\
                            <img class='alert-title-right pull-left' src='./img/alert-right.png'>\
                        </div>\
                        <div class='alert-content'>\
                            <div class='alert-info-custom'>\
                              <i class='modal-icon'></i>\
                              <div class='modal-text'>200</div>\
                            </div>\
                            <form>\
                              <button type='button' class='modal-closebtn btn custom-btn-little custom-btn-brown'>确认</button>\
                            </form>\
                        </div>\
                    </div>\
                </div>";
            $("body").append(tpl);
            $("#modal-tpl .modal-closebtn").click(function(){self.closeModal()}); 
        },
        showModal:function(name,icon){
            $("#modal-tpl .modal-icon ").addClass(icon);
            $("#modal-tpl .modal-text ").html(name);
            $("#modal-tpl").attr("style","display:block");
        }, 
        closeModal:function(){ 
            $("#modal-tpl").attr("style","display:none");

        }, 
    }
    //初始化模态框模板
    modalBox.initModal(); 


    var _Http = {};
    var globalData = {};//全局数据,请求时会发送

    var Request=function(method,url,params){
        this.method=method || "POST";
        this.url=url || "";
        this.async=params.async || false;
        this.data = (params.data) || {};
        this.headers = params.headers || [];
        this.dataType = params.dataType || 'json';

    };
    Request.prototype.initFunc=function(buttonEvent){
        $.ajaxSetup( {
            beforeSend :  function( xhr, settings ) {
                //禁用submit类型按钮
                 //loading开始
                $(globalData.loadingDiv).show();
                if(buttonEvent)
                    $(buttonEvent.target).attr("disabled",true);
            }, 
            
            complete : function(){
                //loading结束
                $(globalData.loadingDiv).hide();
                if(buttonEvent)
                    $(buttonEvent.target).attr("disabled",false);
            },
        })
        return this;
    };
    Request.prototype.successObj=function(obj){
        this.successObj=obj;
        return this;
    };
    Request.prototype.errObj=function(obj){
        this.errObj=obj;
        return this;
    };

    Request.prototype.send = function (success, error) {
        var self = this;
        var param = {
            url: this.url,
            type: this.method,
            contentType: "application/json",
        };

        if (this.async) {
            param.async = this.async;
        }
        //设置响应数据类型
        
        if (this.dataType) {
            param.dataType = this.dataType;
        }
  
        //设置发送数据
        if (this.data && typeof this.data !== 'function') {
            param.data = JSON.stringify(this.data);
        }
  
        //set headers
        if (this.headers && typeof this.headers !== 'function' && JSON.stringify(this.headers).length > 2) {
            param.headers = this.headers;
        }
        /*
            对成功/失败不同返回状态的处理
            
            如果存在成功/失败对象（key值代表状态），
            1.if(key[isModal] == default) 调用默认模态框
            2.if(key[isModal] && key[isModal] != default) 调用key[isModal]对应的bootstrap模态框

            如果需要对其他状态进行统一处理，key值为other，调用模态框规则同上

            最后返回成功/失败回调函数
         */
        $.ajax(param).success(function(req){
            if(self.successObj&&self.successObj[req.re]){
                var currentStatus = self.successObj[req.re];
                selectModal(currentStatus);
            }else if(self.successObj&&self.successObj['other']){

                var currentStatus = self.successObj['other'];
                selectModal(currentStatus);
            }
            success(req); 

        }).error(function(err){
            if(self.errObj&&self.errObj[err.re]){
                var currentStatus = self.errObj[err.re];
                selectModal(currentStatus);

            }else if(self.errObj&&self.errObj['other']){
                var currentStatus = self.errObj['other'];
                console.log("err other")
                selectModal(currentStatus);
            }
            error(err);
        });
    }

    //发送post请求
    //$http.post("url",data).send(success(),error());
    _Http.post = function (url,data) {
        return new Request("POST",url,data);
    };

    //发送get请求
    _Http.get = function (url,data) {
        return new Request("GET",url,data);
    };
    /**
     * 设置全局请求值
     * name -- {loadingDiv:用户loading元素}
     */
    _Http.global = function (name) {
        if (!name) return;
        $.extend(globalData,name);
        return _Http;
    };

    //返回$http
    this.$http=_Http;

    //选择用默认还是自定义模态框
    function selectModal(currentStatus){
        if(currentStatus.isModal=='default'){
            //调用默认弹出框
            modalBox.showModal(currentStatus.name,currentStatus.icon);
        }else if(currentStatus.isModal){
            //调用自定义弹出框
            $(currentStatus.isModal).modal('show')
        }
    }
//};
})(jQuery);


