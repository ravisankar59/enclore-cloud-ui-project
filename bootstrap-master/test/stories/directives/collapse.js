collapsetext:{
	get:function(){
		return $('div[ng-controller="CollapseDemoCtrl"] div[uib-collapse="isCollapsed"] .well');
	}
},
collapsebutton:{
	get:function(){
		return $('div[ng-controller="CollapseDemoCtrl"] button');
	}
},