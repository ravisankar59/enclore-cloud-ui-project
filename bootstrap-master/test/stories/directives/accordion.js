topbottonstext:{
	value: function (name) {
		return element(by.css('[ng-click="' + name + '"]'));
	}
},
header:{
	value: function(name){
		return $('div[heading="' + name + '"] div h4 a .ng-binding');
	}
},
markup:{
	get: function(){
		return $('div[is-open="status.open"] div h4 a .ng-scope');
	}
},
headertext:{
	value: function(name){
		return $('div[heading="' + name + '"] div div span.ng-scope');
	}
},
paragraphtext:{
    value: function(name){
    	return $('div[heading="' + name + '"] div div p.ng-scope');
    }
},
markuptext:{
	get:function(){
        return $('div[is-open="status.open"] div div span.ng-scope');
    }
},

dynamicbody:{
    get:function(){
        return $('div[heading="Dynamic Body Content"] div div.panel-body');
    }
},
additem:{
    get:function(){
        return this.dynamicbody.element(by.css('[ng-click="addItem()"]'));
    }
},
listitems:{
    get:function(){
        return element.all(by.repeater('item in items'));
    }
},