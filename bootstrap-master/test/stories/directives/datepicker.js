datepickertext:{
    get:function(){
        return $('div[ng-controller="DatepickerDemoCtrl"] pre');
    }
},

tablebutton:{
    get:function(){
        return $('table[role="grid"] tbody tr:nth-of-type(4) td:nth-of-type(5) button[ng-click="select(dt.date)"]');
    }
},
popup:{
    get:function(){
        var a = $('div.col-md-6 p.input-group input[type="text"]');
        a.clear();
        return a.sendKeys('25-October-2015');

    }
},
popupbutton:{
    get:function(){
        return $('span.input-group-btn button[ng-click="open($event)"]');
    }
},
turnleft:{
    get:function(){
        return $('div.row div:nth-of-type(1) ul.dropdown-menu li:nth-of-type(1) div table[role="grid"] thead tr:nth-of-type(1) th button[ng-click="move(-1)"]');
    }
},
popuptext:{
    get:function(){
        return $('div.row div:nth-of-type(1) ul.dropdown-menu li:nth-of-type(1) div table[role="grid"] tbody tr:nth-of-type(5) td:nth-of-type(4) button[ng-click="select(dt.date)"]');
    }
},
turnright:{
    get:function(){
        return $('div.row div:nth-of-type(2) ul.dropdown-menu li:nth-of-type(1) div table[role="grid"] thead tr:nth-of-type(1) th button[ng-click="move(1)"]')
    }
},
popupdate:{
    get:function(){
        return $('div.row div:nth-of-type(2) ul.dropdown-menu li:nth-of-type(1) div table[role="grid"] tbody tr:nth-of-type(5) td:nth-of-type(5) button[ng-click="select(dt.date)"]');
    }
},
formate:{
    get:function(){
        return $('div.row div.col-md-6 select[ng-options="f for f in formats"]');
    }
},

formateselect:{
    get:function(){
        return $('div.row div.col-md-6 select[ng-options="f for f in formats"] option[value="string:dd.MM.yyyy"]');
    }
},

datebuttonone:{
    get: function () {
        return $('div[ng-controller="DatepickerDemoCtrl"] button:nth-of-type(1)[ng-click="today()"]');
    }
},
datebuttontwo:{
    get:function(){
        return $('div[ng-controller="DatepickerDemoCtrl"] button:nth-of-type(2)');
    }
},
datebuttonthree:{
    get:function(){
        return $('div[ng-controller="DatepickerDemoCtrl"] button:nth-of-type(3)[ng-click="clear()"]');
    }
},