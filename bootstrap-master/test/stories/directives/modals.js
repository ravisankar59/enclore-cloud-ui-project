btnmodals:{
    value:function (name) {
        return $('div[ng-controller="ModalDemoCtrl"] button:nth-of-type(' + name +')');
    }
},

modaldisplay:{
    get: function(){
        return $('body[ng-controller="MainCtrl"] div.modal div.modal-dialog div.modal-content');
    }
},
modalitems:{
    get:function(){
        return $$('body[ng-controller="MainCtrl"] div.modal div.modal-dialog div.modal-content div.modal-body ul li');
    }
},
selectmodalitem:{
    value:function(name){
        return $('body[ng-controller="MainCtrl"] div.modal div.modal-dialog div.modal-content div.modal-body ul li:nth-of-type(' +name+ ') a.ng-binding');
    }
},
selectedmodalitem:{
    get:function(){
        return $('body[ng-controller="MainCtrl"] div.modal div.modal-dialog div.modal-content div.modal-body b');
    }
},
footermodalbutton:{
    value:function(name){
        return $('body[ng-controller="MainCtrl"] div.modal div.modal-dialog div.modal-footer button:nth-of-type(' + name +')');
    }
},
selectedmodal:{
    get:function(){
        return $('div[ng-controller="ModalDemoCtrl"] div.ng-binding');
    }
},