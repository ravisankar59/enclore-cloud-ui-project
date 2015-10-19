Page = require('astrolabe').Page;
var bootPage = Page.create({
    
    url: { value: '' },

    uiboot:{
    	get: function (){
    		return $('ul .navbar-brand');
    	},
    },
    
    directive:{
    	get: function(){
    		return $('li a.dropdown-toggle');
    	}
    },

    select:{
        get: function(){
            return $('li.dropdown .dropdown-menu ');
            
        }
    },
    
    selectmenu:{
        value: function(filter){
            return this.select.element(by.cssContainingText('a', filter)).click();
        }
    },

});
module.exports = bootPage;