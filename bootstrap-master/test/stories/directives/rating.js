ratetext:{
    value:function(name){
        return $('div[ng-controller="RatingDemoCtrl"] pre '+name+'')
    }
},
rating:{
    value:function(name){
        return $('div[ng-controller="RatingDemoCtrl"] span i:nth-of-type('+name+')');
    }
},
ratebutton:{
    value:function(name){
        return $('div[ng-controller="RatingDemoCtrl"] button:nth-of-type('+name+')');
    }
},
customrate:{
    get:function(){
        return $('div[ng-controller="RatingDemoCtrl"] div[ng-init="x = 5"] b');
    }
},
customrateselect:{
    value:function(name){
        return $('div[ng-controller="RatingDemoCtrl"] div[ng-init="x = 5"] span i:nth-of-type('+name+')')
    }
},
customtext:{
    get:function(){
        return $('div[ng-controller="RatingDemoCtrl"] div[ng-init="y = 2"] b');
    }
},
custom:{
    value:function(name){
        return $('div[ng-controller="RatingDemoCtrl"] div[ng-init="y = 2"] span i:nth-of-type('+name+')');
    }
},