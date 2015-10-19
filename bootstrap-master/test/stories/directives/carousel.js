intervel:{
    get:function(){
        var a = element.all(by.model('myInterval')).clear();
            return a.sendKeys(0);
    }
},
imagetext:{
    get:function(){
        return $$('div.carousel-inner div.carousel-caption h4');
    }
},
nextimage:{
    get:function(){
        return element.all(by.css('[ng-click="next()"]'));
    }
},
previousimage:{
    get:function(){
        return element.all(by.css('[ng-click="prev()"]'));
    }
},
imagecount:{
    get:function(){
        return $$('div.col-md-6 div[ng-controller="CarouselDemoCtrl"] div div ol.carousel-indicators li')
    }
},
addslide:{
    get:function(){
        return element(by.css('[ng-click="addSlide()"]'));
    }
},
disableslideloop:{
    get:function(){
        return element.all(by.model('noWrapSlides'));
    }
},