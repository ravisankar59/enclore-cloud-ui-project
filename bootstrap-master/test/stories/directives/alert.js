alertitemlist:{
    get:function(){
        return element.all(by.repeater('alert in alerts'));
    }
},
alerttext:{
    get:function(){
        return $('div.col-md-6 div.ng-scope div[style="background-color:#fa39c3;color:white;background-color:#fa39c3;color:white"] div .ng-scope');
    }
},
addalert:{
    get:function(){
        return $('div.ng-scope button[ng-click="addAlert()"]');
    }
},
alerts:{
    value:function(filter){
        return $('div.ng-scope div[type="' + filter +'"] div .ng-binding');
    }
},
deletealert:{
    value:function(filter){
        return $('div.ng-scope div[type="' + filter + '"] button[ng-click="close({$event: $event})"]');
    }
},