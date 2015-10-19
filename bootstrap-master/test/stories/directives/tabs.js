tab:{
    value:function(name){
        return $('div[ng-controller="TabsDemoCtrl"] div.ng-isolate-scope div.tab-content div:nth-of-type(' + name + ') span');
    }
},
selecttab:{
    value:function(name){
        return $('div[ng-controller="TabsDemoCtrl"] p:nth-of-type(2) button:nth-of-type('+name+')');
    }
},
secondtab:{
    get:function(){
        return $('div[ng-controller="TabsDemoCtrl"] div.ng-isolate-scope div.tab-content div:nth-of-type(2) span');
    }
},
enabletab:{
    get:function(){
        return $('div[ng-controller="TabsDemoCtrl"] p:nth-of-type(3) button');
    }
},
dynamictab:{
    get:function(){
        return $('div[ng-controller="TabsDemoCtrl"] div.ng-isolate-scope ul.nav li:nth-of-type(3).ng-isolate-scope');
    }
},
verticalcontent:{
    value:function(name){
        return $('div[ng-controller="TabsDemoCtrl"] div:nth-of-type(2)[vertical="true"] div.tab-content div:nth-of-type('+name+') span');
    }
},
verticalselect:{
    value:function(name){
        return $('div[ng-controller="TabsDemoCtrl"] div:nth-of-type(2)[vertical="true"] ul.nav li:nth-of-type('+ name +') a[ng-click="select()"]');
    }
},
justifiedcontent:{
    value:function(name){
        return $('div[ng-controller="TabsDemoCtrl"] div[justified="true"] div.tab-content div:nth-of-type('+name+') span');
    }
},
justifiedselect:{
    value:function(name){
        return $('div[ng-controller="TabsDemoCtrl"] div[justified="true"] ul li:nth-of-type('+name+') a');
    }
},