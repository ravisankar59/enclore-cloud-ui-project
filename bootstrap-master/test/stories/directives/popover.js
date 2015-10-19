popovertext:{
    get:function(){
        var popover = $('div[ng-controller="PopoverDemoCtrl"] div:nth-of-type(1) input');
        popover.clear();
        popover.sendKeys('hello,bootstrap');
    }
},
popovertitle:{
    get:function(){
        var poptitle = $('div[ng-controller="PopoverDemoCtrl"] div:nth-of-type(2) input');
        poptitle.clear();
        poptitle.sendKeys('UI BOOTSTRAP');
    }
},
popovertemplate:{
    get:function(){
        var poptemplate = $('div[ng-controller="PopoverDemoCtrl"] div:nth-of-type(3) input');
        poptemplate.clear();
        poptemplate.sendKeys('myPopoverTemplate.html');
    }
},
popoverbutton:{
    value:function(name){
        return $('div[ng-controller="PopoverDemoCtrl"] button:nth-of-type(' + name + ')');
    }
},
dynamicpopover:{
    get:function(){
        return $('div[ng-controller="PopoverDemoCtrl"] div.popover');
    }
},
popoverdisplay:{
    value:function(name){
        return $('div[ng-controller="PopoverDemoCtrl"] div:nth-of-type('+name+').popover');
    }
},
dynamicpoptitletext:{
    value:function(name){
        return $('div[ng-controller="PopoverDemoCtrl"] div:nth-of-type(4).popover div.popover-inner '+name+'');
    }
},
poptemplatetitletext:{
    get:function(){
        return $('div[ng-controller="PopoverDemoCtrl"] div:nth-of-type(5).popover div.popover-inner h3')
    }
},
templatepopuptext:{
    get:function(){
        return $('div[ng-controller="PopoverDemoCtrl"] div:nth-of-type(5).popover div.popover-inner div div');
    }
},
mouseenterbutton:{
    get:function(){
        return $('div[ng-controller="PopoverDemoCtrl"] p button');
    }
},

mouseenter:{
    value:function(row){
        browser.actions().mouseMove(row).perform();
        //row.$('div[ng-controller="PopoverDemoCtrl"] p div.popover');

    }
},

clickbutton:{
    get:function(){
        return $('div[ng-controller="PopoverDemoCtrl"] input[value="Click me!"]');
    }
},