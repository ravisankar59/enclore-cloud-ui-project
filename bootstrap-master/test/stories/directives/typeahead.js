meridiandisplay:{
    get:function(){
        return $('div[ng-controller="TimepickerDemoCtrl"] table tbody tr:nth-of-type(2) td:nth-of-type(3)');
    }
},

typeaheadtext:{
    value:function(name){
        return $('div[ng-controller="TypeaheadCtrl"] pre:nth-of-type('+name+')');
    }
},
addstaticdata:{
    get:function(){
        var data = $('div[ng-controller="TypeaheadCtrl"] input:nth-of-type(1)');
        return data.sendKeys('bootstrap');
    }
},
addasynchronousdata:{
    get:function(){
        var add = $('div[ng-controller="TypeaheadCtrl"] input:nth-of-type(2)');
        return add.sendKeys('india');
    }
},
addasyncdata:{
    get:function(){
        return $('div[ng-controller="TypeaheadCtrl"] ul:nth-of-type(2) li a');
    }
},

addcustomtemplate:{
    get:function(){
        var customtemp = $('div[ng-controller="TypeaheadCtrl"] input:nth-of-type(3)');
        return customtemp.sendKeys('California');

    }
},
addcustomdata:{
    get:function(){
        return $('div[ng-controller="TypeaheadCtrl"] ul:nth-of-type(3) li a');
    }
},