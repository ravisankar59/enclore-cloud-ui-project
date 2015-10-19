addtooltip:{
    get:function(){
        var text = $('div[ng-controller="TooltipDemoCtrl"] div:nth-of-type(1) input');
        text.clear();
        return text.sendKeys('static');
    }
},
addpopuptooltip:{
    get:function(){
        var tool = $('div[ng-controller="TooltipDemoCtrl"] div:nth-of-type(2) input');
        tool.clear();
        return tool.sendKeys('Hello,Bootstrap!')
    }
},
tooltiptext:{
    value:function(name){
        return $('div[ng-controller="TooltipDemoCtrl"] p a:nth-of-type('+name+')');
    }
},
tooltipdisplay:{
    value:function(name){
        browser.actions().mouseMove(name).perform();
        return $('div[ng-controller="TooltipDemoCtrl"] p div');
    }
},
tooltipcheck:{
    value:function(name){
        return $('div[ng-controller="TooltipDemoCtrl"] p:nth-of-type('+name+') a');

    }
},
tooltipcheckdisplay:{
    value:function(name){
        browser.actions().mouseMove(name).perform();
        return $('div[ng-controller="TooltipDemoCtrl"] p:nth-of-type(2) div');
    }
},
tooltipcustomcheck:{
    value:function(name){
        browser.actions().mouseMove(name).perform();
        return $('div[ng-controller="TooltipDemoCtrl"] p:nth-of-type(3) div');
    }
},
tooltipclick:{
    value:function(name){
        return $('div[ng-controller="TooltipDemoCtrl"] form div:nth-of-type('+name+') input');
    }
},
tooltipclickdisplay:{
    get:function(){
        return $('div[ng-controller="TooltipDemoCtrl"] form div:nth-of-type(1) div');
    }
},
disabletooltip:{
    value:function(name){
        browser.actions().mouseMove(name).perform();
        return $('div[ng-controller="TooltipDemoCtrl"] form div:nth-of-type(2) div');
    }
},
enabletooltip:{
    get:function(){
        return $('div[ng-controller="TooltipDemoCtrl"] form div:nth-of-type(2).form-group');
    }
},
adddisabletooltip:{
    value:function(name){
        return name.sendKeys('Ui Bootstrap');
    }
},
