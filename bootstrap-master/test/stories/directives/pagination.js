defaulttext:{
    get:function(){
        return $('div[ng-controller="PaginationDemoCtrl"] pre.ng-binding');
    }
},

paginationlistone:{
    value:function(name){
        return $('div[ng-controller="PaginationDemoCtrl"] ul:nth-of-type(1) li:nth-of-type(' + name + ') a');
    }
},
pagination:{
    get:function(){
        return $('div[ng-controller="PaginationDemoCtrl"] ul:nth-of-type(1)');
    }
},
setpage:{
    get:function(){
        return element.all(by.css('[ng-click="setPage(3)"]'));
    }
},

pager:{
    value:function(name){
        return $('div[ng-controller="PaginationDemoCtrl"] ul:nth-of-type(5) li:nth-of-type(' + name + ') a');
    }
},
visiblebuttontext:{
    get:function(){
        return $('div[ng-controller="PaginationDemoCtrl"] pre:nth-of-type(2) ');
    }
},
visiblebuttonlist:{
    value:function(name){
        return $('div[ng-controller="PaginationDemoCtrl"] ul:nth-of-type(6) li:nth-of-type(' + name + ') a');
    }
},