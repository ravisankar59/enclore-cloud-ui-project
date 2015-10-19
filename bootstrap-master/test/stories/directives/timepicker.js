timepickertext:{
    get:function(){
        return $('div[ng-controller="TimepickerDemoCtrl"] pre');
    }
},
timechange:{
    get:function(){
        return $('div[ng-controller="TimepickerDemoCtrl"] table tbody tr td a[ng-click="incrementHours()"]');
    }
},
timepickerchange:{
    get:function(){
        return $('div[ng-controller="TimepickerDemoCtrl"] table tbody tr:nth-of-type(2) td:nth-of-type(3) button');
    }
},
minuteschange:{
    get:function(){
        return $('div[ng-controller="TimepickerDemoCtrl"] table tbody tr:nth-of-type(3) td:nth-of-type(3) a[ng-click="decrementMinutes()"]');
    }
},
hoursstep:{
    get:function(){
        return $('div[ng-controller="TimepickerDemoCtrl"] div:nth-of-type(1) div.col-xs-6 select option:nth-of-type(1)');
    }
},

minutesstep:{
    get:function(){
        return $('div[ng-controller="TimepickerDemoCtrl"] div:nth-of-type(1) div:nth-of-type(2) select option:nth-of-type(4)');
    }
},

timebuttons:{
    value:function(name){
        return $('div[ng-controller="TimepickerDemoCtrl"] button:nth-of-type('+name+')');
    }
},