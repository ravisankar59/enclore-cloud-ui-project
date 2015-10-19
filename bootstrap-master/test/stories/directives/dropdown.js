dropdown:{
    value: function(name){
        return element.all(by.id('' + name + ''));
    }
},
clicklinkdisplay:{
    get:function(){
        return $('div[ng-controller="DropdownCtrl"] span ul.dropdown-menu');
    }
},
clicklinkitems:{
    get:function(){
        return $$('div[ng-controller="DropdownCtrl"] span ul.dropdown-menu li');
    }
},
chooseitem:{
    get: function () {
        return this.clicklinkdisplay.element(by.cssContainingText('a','And another choice for you.')).getAttribute('href');
    }
},
buttontypedropdown:{
    value:function(name){
        return $('div[ng-controller="DropdownCtrl"] div:nth-of-type(' + name + ') button');
    }
},
buttonsdisplay:{
    value:function(name){
        return $('div[ng-controller="DropdownCtrl"] div:nth-of-type(' + name + ') ul.dropdown-menu');
    }
},
buttonsitems:{
    value:function(name){
        return $$('div[ng-controller="DropdownCtrl"] div:nth-of-type(' + name + ') ul.dropdown-menu li');
    }
},
actiondropdown:{
    get:function(){
        return $('div[ng-controller="DropdownCtrl"] div:nth-of-type(2) button:nth-of-type(2)');
    }
},
bodydropdown:{
    get:function(){
        return $('body[ng-controller="MainCtrl"] ul.dropdown-menu[aria-labelledby="btn-append-to-body"]');
    }
},
bodydropdownitems:{
    get:function () {
        return $$('body[ng-controller="MainCtrl"] ul.dropdown-menu[aria-labelledby="btn-append-to-body"] li');
    }
},

template:{
    get:function () {
        return $('div[ng-controller="DropdownCtrl"] div:nth-of-type(4) ul.dropdown-menu[role="menu"] li:nth-of-type(5) a');

    }
},

dropdownbuttons:{
    value:function (name) {
        return $('div[ng-controller="DropdownCtrl"] p button:nth-of-type(' + name + ')');
    }
},