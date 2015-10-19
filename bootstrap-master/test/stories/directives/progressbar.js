progressbutton:{
    get:function(){
        return $('div[ng-controller="ProgressDemoCtrl"] h3 button');
    }
},
staticprogressbar:{
    get:function(){
        return $('div[ng-controller="ProgressDemoCtrl"] div.row div:nth-of-type(2) div div span');
    }
},
staticbar:{
    get:function(){
        return $('div[ng-controller="ProgressDemoCtrl"] div.row div:nth-of-type(3) div i');
    }
},
stackedbutton:{
    get:function(){
        return $('div[ng-controller="ProgressDemoCtrl"] h3:nth-of-type(3) button');
    }
}