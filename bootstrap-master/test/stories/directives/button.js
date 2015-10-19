alltext:{
    get:function(){
        return $$('div.col-md-6 div[ng-controller="ButtonsCtrl"] pre');
    }
},
buttons:{
    value:function(filter){
            //return $('div.col-md-6 div[ng-controller="ButtonsCtrl"] button[type="button"]');
        return element.all(by.model(filter));
    }
},
radiobuttons:{
    get:function(){
        return $$('div.col-md-6 div[ng-controller="ButtonsCtrl"] div.btn-group label');
    }
},