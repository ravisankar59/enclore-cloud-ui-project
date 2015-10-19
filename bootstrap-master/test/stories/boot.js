var bootPage = require('../pages/boot-page');
var expect = require('chai').use(require('chai-as-promised')).expect;
describe('bootstrape page', function() {
	
	before(function() {
	    bootPage.go();
	});

	it('should have the right page url', function() {
        expect(browser.getCurrentUrl()).to.eventually.contain('http://localhost:8000/');
  });

  it('should have the right browser title', function() {
    	expect(browser.getTitle()).to.eventually.equal('Angular directives for Bootstrap');
  });

  describe('bootstrap functionalities', function() {
  	it('should have the right items', function() {
        
  		expect(bootPage.uiboot.getText()).to.eventually.equal('UI Bootstrap');
      expect(bootPage.directive.getText()).to.eventually.equal('Directives');
    });
  });

  describe('directives functionalites', function() {
    before(function() {
      bootPage.go();
      bootPage.directive.click();

    });
    describe('Accordion functionalites', function() {
      it('should show the inputs enable accordion', function() {
        expect(bootPage.selectmenu('Accordion').isEnabled()).to.eventually.be.true;
      });

      it('should have the all button text @dev', function() {
        expect(bootPage.topbottonstext('status.open = !status.open').getText()).to.eventually.equal('Toggle last panel');
        expect(bootPage.topbottonstext('status.isFirstDisabled = ! status.isFirstDisabled').getText())
          .to.eventually.equal('Enable / Disable first panel');
        expect(bootPage.header('Static Header, initially expanded').getText()).to.eventually.equal('Static Header, initially expanded');
        expect(bootPage.header('Dynamic Group Header - 1').getText()).to.eventually.equal('Dynamic Group Header - 1');
        expect(bootPage.header('Dynamic Group Header - 2').getText()).to.eventually.equal('Dynamic Group Header - 2');
        expect(bootPage.header('Dynamic Body Content').getText()).to.eventually.equal('Dynamic Body Content');
        expect(bootPage.header('Custom template').getText()).to.eventually.equal('Custom template');
        expect(bootPage.header('Delete account').getText()).to.eventually.equal('Delete account');
        expect(bootPage.markup.getText()).to.eventually.equal('I can have markup, too!');
      });
      
      it('should display the toggle button functionalites', function() {
        bootPage.topbottonstext('status.open = !status.open').click();
        expect(bootPage.markuptext.isDisplayed()).to.eventually.be.true;
        bootPage.topbottonstext('status.open = !status.open').click();
        expect(bootPage.markuptext.isDisplayed()).to.eventually.be.false;    
      });

      it.skip('should display the enable/disable first  button functionalites', function() {
        bootPage.topbottonstext('status.isFirstDisabled = ! status.isFirstDisabled').click();
        expect(bootPage.header('Static Header, initially expanded').click().isSelected()).to.eventually.be.false;
        bootPage.topbottonstext('status.isFirstDisabled = ! status.isFirstDisabled').click();
        expect(bootPage.header('Static Header, initially expanded').isSelected()).to.eventually.be.true;
      });

      it('should display the static header button functionalities', function() {
        bootPage.header('Static Header, initially expanded').click();    
        expect(bootPage.headertext('Static Header, initially expanded').isDisplayed()).to.eventually.be.true;
        bootPage.header('Static Header, initially expanded').click();
        expect(bootPage.headertext('Static Header, initially expanded').isDisplayed()).to.eventually.be.false;
      });

      it('should display the dynamic header one button functionalities', function() {
        bootPage.header('Dynamic Group Header - 1').click();    
        expect(bootPage.headertext('Dynamic Group Header - 1').isDisplayed()).to.eventually.be.true;
        bootPage.header('Dynamic Group Header - 1').click();
        expect(bootPage.headertext('Dynamic Group Header - 1').isDisplayed()).to.eventually.be.false;
      });

      it('should display the dynamic header two button functionalities', function() {
        bootPage.header('Dynamic Group Header - 2').click();    
        expect(bootPage.headertext('Dynamic Group Header - 2').isDisplayed()).to.eventually.be.true;
        bootPage.header('Dynamic Group Header - 2').click();
        expect(bootPage.headertext('Dynamic Group Header - 2').isDisplayed()).to.eventually.be.false;
      });

      it('should display the Dynamic Body Content button functionalities', function() {
        bootPage.header('Dynamic Body Content').click();    
        expect(bootPage.paragraphtext('Dynamic Body Content').isDisplayed()).to.eventually.be.true;
        bootPage.header('Dynamic Body Content').click();
        expect(bootPage.paragraphtext('Dynamic Body Content').isDisplayed()).to.eventually.be.false;
      });

      it('should display the Custom template button functionalities', function() {
        bootPage.header('Custom template').click();    
        expect(bootPage.headertext('Custom template').isDisplayed()).to.eventually.be.true;
        bootPage.header('Custom template').click();
        expect(bootPage.headertext('Custom template').isDisplayed()).to.eventually.be.false;
      });

      it('should display the Delete button functionalities', function() {
        bootPage.header('Delete account').click();    
        expect(bootPage.paragraphtext('Delete account').isDisplayed()).to.eventually.be.true;
        bootPage.header('Delete account').click();
        expect(bootPage.paragraphtext('Delete account').isDisplayed()).to.eventually.be.false;
      });

      it('should display the Custom template button functionalities', function() {
        bootPage.markup.click();    
        expect(bootPage.markuptext.isDisplayed()).to.eventually.be.true;
        bootPage.markup.click();
        expect(bootPage.markuptext.isDisplayed()).to.eventually.be.false;
      });

      it('should have the all the buttons inside lable text', function(){
        bootPage.topbottonstext('status.open = !status.open').click();
        expect(bootPage.markuptext.getText()).to.eventually.equal('This is just some content to illustrate fancy headings.');
        bootPage.header('Static Header, initially expanded').click();
        expect(bootPage.headertext('Static Header, initially expanded').getText())
        .to.eventually.equal('This content is straight in the template.');
        bootPage.header('Dynamic Group Header - 1').click();
        expect(bootPage.headertext('Dynamic Group Header - 1').getText()).to.eventually.equal('Dynamic Group Body - 1');
        bootPage.header('Dynamic Group Header - 2').click();
        expect(bootPage.headertext('Dynamic Group Header - 2').getText()).to.eventually.equal('Dynamic Group Body - 2');
        bootPage.header('Dynamic Body Content').click();
        expect(bootPage.paragraphtext('Dynamic Body Content').getText()).to.eventually.equal('The body of the uib-accordion group grows to fit the contents');
        bootPage.header('Custom template').click();
        expect(bootPage.headertext('Custom template').getText()).to.eventually.equal('Hello');
        bootPage.header('Delete account').click();
        expect(bootPage.paragraphtext('Delete account').getText()).to.eventually.equal('Please, to delete your account, click the button below');
        bootPage.markup.click();
        expect(bootPage.markuptext.getText()).to.eventually.equal('This is just some content to illustrate fancy headings.');
      });

      it('should have the list of items in dynamic body', function(){
        /*var a = bootPage.listitems;
        console.log(a);*/
        expect(bootPage.listitems.count()).to.eventually.equal(3);
        bootPage.header('Dynamic Body Content').click(); 
        bootPage.additem.click();
        expect(bootPage.listitems.count()).to.eventually.equal(4);
      });

      it('should have the items text in dynamic body', function(){
        expect(bootPage.listitems.get(0).getText()).to.eventually.equal('Item 1');
        expect(bootPage.listitems.get(1).getText()).to.eventually.equal('Item 2');
        expect(bootPage.listitems.get(2).getText()).to.eventually.equal('Item 3');
        expect(bootPage.listitems.get(3).getText()).to.eventually.equal('Item 4');
      });

    });
    describe('Alert functionalites', function() {
      before(function() {
        bootPage.go();
        bootPage.directive.click();
      });

      it('should show the inputs enable Alert', function() {
        expect(bootPage.selectmenu('Alert').isEnabled()).to.eventually.be.true;
      });
      it('should have the list of alerts in Alert', function(){
        expect(bootPage.alertitemlist.count()).to.eventually.equal(2);
        bootPage.addalert.click();
        expect(bootPage.alertitemlist.count()).to.eventually.equal(3);
      });
       it('should have the all the text in Alert', function(){
        expect(bootPage.alerts('danger').getText()).to.eventually.equal('Oh snap! Change a few things up and try submitting again.');
        expect(bootPage.alerts('success').getText()).to.eventually.equal('Well done! You successfully read this important alert message.');
        expect(bootPage.alerts('').getText()).to.eventually.equal('Another alert!');
        expect(bootPage.alerttext.getText()).to.eventually.equal('A happy alert!');
      });
      it('should close the alert item', function(){
        //var row = bootPage.listitems.get(0);
        bootPage.deletealert('danger').click();
        expect(bootPage.alertitemlist.count()).to.eventually.equal(2);
      }); 
    });
    describe('Buttons functionalites', function() {
      before(function() {
        bootPage.go();
        bootPage.directive.click();
      });

      it('should show the inputs enable buttons @dev', function() {
        expect(bootPage.selectmenu('Buttons').isEnabled()).to.eventually.be.true;
      });

      it('should have the singletoggle text', function(){
        expect(bootPage.alltext.get(0).getText()).to.eventually.equal('1');
        bootPage.buttons('singleModel').click();
        expect(bootPage.alltext.get(0).getText()).to.eventually.equal('0');
      });


      it('should have the checkbox text', function(){
        expect(bootPage.alltext.get(1).getText()).to.eventually.equal('Model: {"left":false,"middle":true,"right":false}');
        expect(bootPage.alltext.get(2).getText()).to.eventually.equal('Results: ["middle"]');
        bootPage.buttons('checkModel.middle').click();
        expect(bootPage.alltext.get(1).getText()).to.eventually.equal('Model: {"left":false,"middle":false,"right":false}');
        expect(bootPage.alltext.get(2).getText()).to.eventually.equal('Results: []');
        bootPage.buttons('checkModel.left').click();
        expect(bootPage.alltext.get(1).getText()).to.eventually.equal('Model: {"left":true,"middle":false,"right":false}');
        expect(bootPage.alltext.get(2).getText()).to.eventually.equal('Results: ["left"]');
        bootPage.buttons('checkModel.right').click();
        expect(bootPage.alltext.get(1).getText()).to.eventually.equal('Model: {"left":true,"middle":false,"right":true}');
        expect(bootPage.alltext.get(2).getText()).to.eventually.equal('Results: ["left","right"]');
      });

      it('should have the radioModel text', function(){
        
        expect(bootPage.alltext.get(3).getText()).to.eventually.equal('Middle');
        bootPage.radiobuttons.get(3).click();
         //console.log(a);
        expect(bootPage.alltext.get(3).getText()).to.eventually.equal('Left');
        bootPage.radiobuttons.get(4).click();
        expect(bootPage.alltext.get(3).getText()).to.eventually.equal('Middle');
        bootPage.radiobuttons.get(5).click();
        expect(bootPage.alltext.get(3).getText()).to.eventually.equal('Right');
        bootPage.radiobuttons.get(6).click();
        expect(bootPage.alltext.get(3).getText()).to.eventually.equal('Left');
        bootPage.radiobuttons.get(7).click();
        expect(bootPage.alltext.get(3).getText()).to.eventually.equal('Middle');
        bootPage.radiobuttons.get(8).click();
        expect(bootPage.alltext.get(3).getText()).to.eventually.equal('Right');
      });
    });

    describe('Carousel functionalites', function() {
      before(function() {
        bootPage.go();
        bootPage.directive.click();
      });
      it('should show the inputs enable Carousel', function() {
        expect(bootPage.selectmenu('Carousel').isEnabled()).to.eventually.be.true;
      });
      it('should have a image text', function() {
        bootPage.intervel;
        expect(bootPage.imagetext.get(0).getText()).to.eventually.equal('Slide 0');
        bootPage.nextimage.click();
        expect(bootPage.imagetext.get(1).getText()).to.eventually.equal('Slide 1');
        bootPage.nextimage.click();
        expect(bootPage.imagetext.get(2).getText()).to.eventually.equal('Slide 2');
        bootPage.nextimage.click();
        expect(bootPage.imagetext.get(3).getText()).to.eventually.equal('Slide 3');
        bootPage.previousimage.click();
        expect(bootPage.imagetext.get(2).getText()).to.eventually.equal('Slide 2');
        bootPage.previousimage.click();
        expect(bootPage.imagetext.get(1).getText()).to.eventually.equal('Slide 1');
        bootPage.previousimage.click();
        expect(bootPage.imagetext.get(0).getText()).to.eventually.equal('Slide 0');

      });
      it('should filter all slides', function(){
        expect(bootPage.imagecount.count()).to.eventually.equal(4);
        bootPage.addslide.click();
        expect(bootPage.imagecount.count()).to.eventually.equal(5);
      });
      it.skip('should disable slide looping', function(){
        bootPage.disableslideloop.click();
        //var a = bootPage.nextimage;
        //console.log(a);

        //expect(bootPage.nextimage.isSelected()).to.eventually.be.false;
      });


    });
    describe('Collapse functionalites', function() {
      before(function() {
        bootPage.go();
        bootPage.directive.click();
      });
      it('should show the inputs enable Collapse', function() {
        expect(bootPage.selectmenu('Collapse').isEnabled()).to.eventually.be.true;
      });
      it('should have collapse content text',function(){
        expect(bootPage.collapsetext.getText()).to.eventually.equal('Some content');
      });
      it('should dispaly toggle collapse button functionalites', function() {
        expect(bootPage.collapsetext.isDisplayed()).to.eventually.be.true;
        bootPage.collapsebutton.click();
        expect(bootPage.collapsetext.isDisplayed()).to.eventually.be.false;
      });

    });
    /*describe('Datepicker functionalites', function() {
      before(function() {
        bootPage.go();
        bootPage.directive.click();
      });
      it('should show the inputs enable Datepicker', function() {
        expect(bootPage.selectmenu('Datepicker').isEnabled()).to.eventually.be.true;
      });
      it('should have the currect text',function() {
        expect(bootPage.datepickertext.getText()).to.eventually.equal('Selected date is: Friday, October 9, 2015');
        bootPage.tablebutton.click();
        expect(bootPage.datepickertext.getText()).to.eventually.equal('Selected date is: Wednesday, October 21, 2015');
        bootPage.popup;
        expect(bootPage.datepickertext.getText()).to.eventually.equal('Selected date is: Sunday, October 25, 2015');
        bootPage.popupbutton.click();
        bootPage.turnleft.click();
        //bootPage.popuptext.click();
        //expect(bootPage.datepickertext.getText()).to.eventually.equal('Selected date is: Wednesday, September 30, 2015');
        //bootPage.popupbutton.click();
        //bootPage.turnright.click();
        //bootPage.popupdate.click();
        //expect(bootPage.datepickertext.getText()).to.eventually.equal('Selected date is: Thursday, October 29, 2015');

      });
      /* it.only('should have a formate', function() {
        //expect(bootPage.formate.getText()).to.eventually.equal('28-September-2015');
        bootPage.formateselect.click();
        //expect(bootPage.formateselect.count()).to.eventually.equal(4);
      }); */ 
      
      /*it('should have the  date button text', function() {
        bootPage.datebuttonone.click();
        //browser.sleep(10000);
        expect(bootPage.datepickertext.getText()).to.eventually.equal('Selected date is: Friday, October 9, 2015');
        bootPage.datebuttontwo.click();
        expect(bootPage.datepickertext.getText()).to.eventually.equal('Selected date is: Monday, August 24, 2009');
        bootPage.datebuttonthree.click();
        expect(bootPage.datepickertext.getText()).to.eventually.equal('Selected date is: ');
        
      });
    });*/
    describe('Dropdown', function() {
      before(function() {
        bootPage.go();
        bootPage.directive.click();
      });
      it('should show the inputs enable Dropdown ', function() {
        expect(bootPage.selectmenu('Dropdown').isEnabled()).to.eventually.be.true;
      });
      it('should display the simple dropdown button functionalites', function(){
        bootPage.dropdown('simple-dropdown').click();
        expect(bootPage.clicklinkdisplay.isDisplayed()).to.eventually.be.true;
        bootPage.dropdown('simple-dropdown').click();
        expect(bootPage.clicklinkdisplay.isDisplayed()).to.eventually.be.false;
      });
      it('should have the simple dropdown items',function() {
        bootPage.dropdown('simple-dropdown').click();
        expect(bootPage.clicklinkitems.count()).to.eventually.equal(3);
      });
      it('should have the simple dropdown items text',function() {
        //bootPage.dropdown('simple-dropdown').click();
        expect(bootPage.clicklinkitems.get(0).getText()).to.eventually.equal('The first choice!');
        expect(bootPage.clicklinkitems.get(1).getText()).to.eventually.equal('And another choice for you.');
        expect(bootPage.clicklinkitems.get(2).getText()).to.eventually.equal('but wait! A third!');
        bootPage.chooseitem.click();
        
      });

      it('should display the button dropdown functionalites',function(){
        bootPage.buttontypedropdown(1).click();
        expect(bootPage.buttonsdisplay(1).isDisplayed()).to.eventually.be.true;
        bootPage.buttontypedropdown(1).click();
        expect(bootPage.buttonsdisplay(1).isDisplayed()).to.eventually.be.false;
       
      });
      it('should have the button dropdown items', function(){
        bootPage.buttontypedropdown(1).click();
        expect(bootPage.buttonsitems(1).count()).to.eventually.equal(5);
       
      });
      it('should have the button dropdown items text',function(){
        //bootPage.buttontypedropdown(1).click();
        expect(bootPage.buttonsitems(1).get(0).getText()).to.eventually.equal('Action');
        expect(bootPage.buttonsitems(1).get(1).getText()).to.eventually.equal('Another action');
        expect(bootPage.buttonsitems(1).get(2).getText()).to.eventually.equal('Something else here');
        expect(bootPage.buttonsitems(1).get(3).getText()).to.eventually.equal('');
        expect(bootPage.buttonsitems(1).get(4).getText()).to.eventually.equal('Separated link');
        bootPage.buttonsitems(1).get(2).click();
        //browser.sleep(10000);
      });
      it('should display the action dropdown functionalites', function(){
        bootPage.actiondropdown.click();
        expect(bootPage.buttonsdisplay(2).isDisplayed()).to.eventually.be.true;
        bootPage.actiondropdown.click();
        expect(bootPage.buttonsdisplay(2).isDisplayed()).to.eventually.be.false;
        //browser.sleep(10000);
      });
      it('should have the Action dropdown items', function(){
        bootPage.actiondropdown.click();
        expect(bootPage.buttonsitems(2).count()).to.eventually.equal(5);
       
      });

      it('should have the Action dropdown items text',function(){
        //bootPage.actiondropdown.click();
        expect(bootPage.buttonsitems(2).get(0).getText()).to.eventually.equal('Action');
        expect(bootPage.buttonsitems(2).get(1).getText()).to.eventually.equal('Another action');
        expect(bootPage.buttonsitems(2).get(2).getText()).to.eventually.equal('Something else here');
        expect(bootPage.buttonsitems(2).get(3).getText()).to.eventually.equal('');
        expect(bootPage.buttonsitems(2).get(4).getText()).to.eventually.equal('Separated link');
        bootPage.buttonsitems(2).get(2).click();
        //browser.sleep(10000);
      });

      it('should display the body dropdown functionalites',function(){
        bootPage.buttontypedropdown(3).click();
        expect(bootPage.bodydropdown.isDisplayed()).to.eventually.be.true;
        bootPage.buttontypedropdown(3).click();
        expect(bootPage.bodydropdown.isDisplayed()).to.eventually.be.false;
        //browser.sleep(10000);
      });

      it('should have the body dropdown items', function(){
        bootPage.buttontypedropdown(3).click();
        expect(bootPage.bodydropdownitems.count()).to.eventually.equal(5);
       
      });

      it('should have the body dropdown items text', function(){
        //bootPage.buttontypedropdown(3).click();
        expect(bootPage.bodydropdownitems.get(0).getText()).to.eventually.equal('Action');
        expect(bootPage.bodydropdownitems.get(1).getText()).to.eventually.equal('Another action');
        expect(bootPage.bodydropdownitems.get(2).getText()).to.eventually.equal('Something else here');
        expect(bootPage.bodydropdownitems.get(3).getText()).to.eventually.equal('');
        expect(bootPage.bodydropdownitems.get(4).getText()).to.eventually.equal('Separated link');
        bootPage.bodydropdownitems.get(4).click();
      });

      it('should display the template dropdown functionalites',function(){
        bootPage.buttontypedropdown(4).click();
        expect(bootPage.buttonsdisplay(4).isDisplayed()).to.eventually.be.true;
        bootPage.buttontypedropdown(4).click();
        expect(bootPage.buttonsdisplay(4).isDisplayed()).to.eventually.be.false;
      });

      it('should have the template items', function(){
        bootPage.buttontypedropdown(4).click();
        expect(bootPage.buttonsitems(4).count()).to.eventually.equal(5);
      });

      it('should have the template items text', function(){
        //bootPage.buttontypedropdown(4).click();
        expect(bootPage.buttonsitems(4).get(0).getText()).to.eventually.equal('Action in Template');
        expect(bootPage.buttonsitems(4).get(1).getText()).to.eventually.equal('Another action in Template');
        expect(bootPage.buttonsitems(4).get(2).getText()).to.eventually.equal('Something else here');
        expect(bootPage.buttonsitems(4).get(3).getText()).to.eventually.equal('');
        expect(bootPage.buttonsitems(4).get(4).getText()).to.eventually.equal('Separated link in Template');
        bootPage.template.click();
        //console.log(a);
        //browser.sleep(10000);
      });

      it('should display the toggle button functionalites', function(){
        bootPage.dropdownbuttons(1).click();
        expect(bootPage.buttonsdisplay(1).isDisplayed()).to.eventually.be.true;
        bootPage.dropdownbuttons(1).click();
        expect(bootPage.buttonsdisplay(1).isDisplayed()).to.eventually.be.false;
      });
      it.skip('should enable/disable the dropdown functionalites', function(){
        bootPage.dropdownbuttons(2).click();
        bootPage.dropdownbuttons(2).click();
        //browser.sleep(10000);
      });
      it('should display the keyword navigation functionalites',function(){
        bootPage.buttontypedropdown(5).click();
        expect(bootPage.buttonsdisplay(5).isDisplayed()).to.eventually.be.true;
        bootPage.buttontypedropdown(5).click();
        expect(bootPage.buttonsdisplay(5).isDisplayed()).to.eventually.be.false;
      });
      it('should have the keyword navigation items', function(){
        bootPage.buttontypedropdown(5).click();
        expect(bootPage.buttonsitems(5).count()).to.eventually.equal(5);
      });
      it('should have the keyword navigation items text', function(){
        //bootPage.buttontypedropdown(5).click();
        expect(bootPage.buttonsitems(5).get(0).getText()).to.eventually.equal('Action');
        expect(bootPage.buttonsitems(5).get(1).getText()).to.eventually.equal('Another action');
        expect(bootPage.buttonsitems(5).get(2).getText()).to.eventually.equal('Something else here');
        expect(bootPage.buttonsitems(5).get(3).getText()).to.eventually.equal('');
        expect(bootPage.buttonsitems(5).get(4).getText()).to.eventually.equal('Separated link');
        bootPage.buttonsitems(5).get(4).click();
        //browser.sleep(10000);
      });
    })
    describe('Modal  functionalites', function() {
      before(function() {
        bootPage.go();
        bootPage.directive.click();
      });

      it('should show the inputs enable Modal', function() {
        expect(bootPage.selectmenu('Modal').isEnabled()).to.eventually.be.true;
      });
      it('should display the open modal', function() {
        bootPage.btnmodals(1).click();
        expect(bootPage.modaldisplay.isDisplayed()).to.eventually.be.true;
        //browser.sleep(10000);
      });
      it('should have the list of open modal items', function() {
        //bootPage.btnopen(1).click();
        expect(bootPage.modalitems.count()).to.eventually.equal(3);
      });
      it('should have the list of open modal items text', function() {
        //bootPage.btnopen(1).click();
        expect(bootPage.modalitems.get(0).getText()).to.eventually.equal('item1');
        expect(bootPage.modalitems.get(1).getText()).to.eventually.equal('item2');
        expect(bootPage.modalitems.get(2).getText()).to.eventually.equal('item3');
      });
      it('should have the selected open modal item text', function() {
        //bootPage.btnopen(1).click();
        expect(bootPage.selectedmodalitem.getText()).to.eventually.equal('item1');
        bootPage.selectmodalitem(2).click();
        expect(bootPage.selectedmodalitem.getText()).to.eventually.equal('item2');
        bootPage.footermodalbutton(1).click();
        expect(bootPage.selectedmodal.getText()).to.eventually.equal('Selection from a modal: item2');
        //browser.sleep(10000);
      });
      it('should display the large modal', function() {
        bootPage.btnmodals(2).click();
        expect(bootPage.modaldisplay.isDisplayed()).to.eventually.be.true;
        //browser.sleep(10000);
      });
      it('should have the list of open modal items', function() {
        //bootPage.btnopen(1).click();
        expect(bootPage.modalitems.count()).to.eventually.equal(3);
      });
      it('should have the list of large modal items text', function() {
        //bootPage.btnmodals(2).click();
        expect(bootPage.modalitems.get(0).getText()).to.eventually.equal('item1');
        expect(bootPage.modalitems.get(1).getText()).to.eventually.equal('item2');
        expect(bootPage.modalitems.get(2).getText()).to.eventually.equal('item3');
      });
      it('should have the selected open modal item text', function() {
        //bootPage.btnopen(1).click();
        expect(bootPage.selectedmodalitem.getText()).to.eventually.equal('item1');
        bootPage.selectmodalitem(3).click();
        expect(bootPage.selectedmodalitem.getText()).to.eventually.equal('item3');
        bootPage.footermodalbutton(1).click();
        expect(bootPage.selectedmodal.getText()).to.eventually.equal('Selection from a modal: item3');
        //browser.sleep(10000);
      });

      it('should display the small modal', function() {
        bootPage.btnmodals(3).click();
        expect(bootPage.modaldisplay.isDisplayed()).to.eventually.be.true;
        //browser.sleep(10000);
      });
      it('should have the list of small modal items', function() {
        //bootPage.btnopen(1).click();
        expect(bootPage.modalitems.count()).to.eventually.equal(3);
      });
      it('should have the list of small modal items text', function() {
        //bootPage.btnmodals(2).click();
        expect(bootPage.modalitems.get(0).getText()).to.eventually.equal('item1');
        expect(bootPage.modalitems.get(1).getText()).to.eventually.equal('item2');
        expect(bootPage.modalitems.get(2).getText()).to.eventually.equal('item3');
      });
      it('should have the selected small modal item text', function() {
        //bootPage.btnopen(1).click();
        expect(bootPage.selectedmodalitem.getText()).to.eventually.equal('item1');
        bootPage.selectmodalitem(2).click();
        expect(bootPage.selectedmodalitem.getText()).to.eventually.equal('item2');
        bootPage.footermodalbutton(2).click();
        bootPage.btnmodals(3).click();
        bootPage.selectmodalitem(3).click();
        expect(bootPage.selectedmodalitem.getText()).to.eventually.equal('item3');
        bootPage.footermodalbutton(1).click();
        expect(bootPage.selectedmodal.getText()).to.eventually.equal('Selection from a modal: item3');
        //browser.sleep(10000);
      });
      it('should have the toogle animation button text', function() {
        expect(bootPage.btnmodals(4).getText()).to.eventually.equal('Toggle Animation (true)');
        bootPage.btnmodals(4).click();
        expect(bootPage.btnmodals(4).getText()).to.eventually.equal('Toggle Animation (false)');
      });

    });
    describe('Pagination  functionalites', function() {
      before(function() {
        bootPage.go();
        bootPage.directive.click();
      });

      it('should show the inputs enable Pagination', function() {
        expect(bootPage.selectmenu('Pagination').isEnabled()).to.eventually.be.true;
      });
      it('should have the Pagination default page text', function() {
        expect(bootPage.defaulttext.getText()).to.eventually.equal('The selected page no: 4');
        bootPage.paginationlistone(8).click();
        expect(bootPage.defaulttext.getText()).to.eventually.equal('The selected page no: 7');
        bootPage.paginationlistone(1).click();
        expect(bootPage.defaulttext.getText()).to.eventually.equal('The selected page no: 6');
        bootPage.paginationlistone(1).click();
        expect(bootPage.defaulttext.getText()).to.eventually.equal('The selected page no: 5');
        bootPage.paginationlistone(9).click();
        expect(bootPage.defaulttext.getText()).to.eventually.equal('The selected page no: 6');
        bootPage.setpage.click();
        expect(bootPage.defaulttext.getText()).to.eventually.equal('The selected page no: 3');
        bootPage.pager(2).click();
        expect(bootPage.defaulttext.getText()).to.eventually.equal('The selected page no: 4');
        bootPage.pager(1).click();
        expect(bootPage.defaulttext.getText()).to.eventually.equal('The selected page no: 3');
      });
      it('should have the maximum visible button text',function() {
        expect(bootPage.visiblebuttontext.getText()).to.eventually.equal('Page: 1 / 18');
        bootPage.visiblebuttonlist(7).click();
        expect(bootPage.visiblebuttontext.getText()).to.eventually.equal('Page: 5 / 18');
        bootPage.visiblebuttonlist(1).click();
        expect(bootPage.visiblebuttontext.getText()).to.eventually.equal('Page: 1 / 18');
        bootPage.visiblebuttonlist(7).click();
        expect(bootPage.visiblebuttontext.getText()).to.eventually.equal('Page: 5 / 18');
        bootPage.visiblebuttonlist(2).click();
        expect(bootPage.visiblebuttontext.getText()).to.eventually.equal('Page: 4 / 18');
        bootPage.visiblebuttonlist(8).click();
        expect(bootPage.visiblebuttontext.getText()).to.eventually.equal('Page: 5 / 18');
        bootPage.visiblebuttonlist(9).click();
        expect(bootPage.visiblebuttontext.getText()).to.eventually.equal('Page: 18 / 18');
      });

      
      
    });
    describe('Popover', function() {
      before(function() {
        bootPage.go();
        bootPage.directive.click();
      });
      it('should show the inputs enable Popover', function() {
        expect(bootPage.selectmenu('Popover').isEnabled()).to.eventually.be.true;
      });
      it('should display the dynamic and template popover',function() {
        bootPage.popovertext;
        bootPage.popovertitle;
        bootPage.popovertemplate;
        bootPage.popoverbutton(1).click();
        //browser.sleep(10000);
        expect(bootPage.dynamicpopover.isDisplayed()).to.eventually.be.true;
        bootPage.popoverbutton(2).click();
        expect(bootPage.popoverdisplay(5).isDisplayed()).to.eventually.be.true;
      });
      it('should have dynamic and template popover text',function() {
        //bootPage.popoverbutton(1).click();
        expect(bootPage.dynamicpoptitletext('h3').getText()).to.eventually.equal('UI BOOTSTRAP');
        expect(bootPage.dynamicpoptitletext('div').getText()).to.eventually.equal('hello,bootstrap');
        expect(bootPage.poptemplatetitletext.getText()).to.eventually.equal('UI BOOTSTRAP');
        expect(bootPage.templatepopuptext.getText()).to.eventually.equal('hello,bootstrap');


      });
      it('should display popover placements',function() {
        bootPage.popoverbutton(3).click();
        expect(bootPage.popoverdisplay(6).isDisplayed()).to.eventually.be.true;
        bootPage.popoverbutton(4).click();
        expect(bootPage.popoverdisplay(7).isDisplayed()).to.eventually.be.true;
        bootPage.popoverbutton(5).click();
        expect(bootPage.popoverdisplay(8).isDisplayed()).to.eventually.be.true;
        bootPage.popoverbutton(6).click();
        expect(bootPage.popoverdisplay(9).isDisplayed()).to.eventually.be.true;
        var row = bootPage.mouseenterbutton;
        bootPage.mouseenter(row);
        bootPage.clickbutton.click();
        //browser.sleep(10000);

      });
      it('should display the fading and title text', function() {
        bootPage.popoverbutton(7).click();   
        expect(bootPage.popoverdisplay(10).isDisplayed()).to.eventually.be.true; 
        bootPage.popoverbutton(8).click();
        expect(bootPage.popoverdisplay(11).isDisplayed()).to.eventually.be.true;
      });
      
      

    });

    describe('Progressbar', function() {
      before(function() {
        bootPage.go();
        bootPage.directive.click();
      });
      it('should show the inputs enable Progressbar', function() {
        expect(bootPage.selectmenu('Progressbar').isEnabled()).to.eventually.be.true;
      });
      it('should have static progressbar text', function(){
        expect(bootPage.staticprogressbar.getText()).to.eventually.equal('22%');
        expect(bootPage.staticbar.getText()).to.eventually.equal('166 / 200');
        
        bootPage.progressbutton.click();
        bootPage.progressbutton.click();
        bootPage.stackedbutton.click();
        bootPage.stackedbutton.click();
        //browser.sleep(10000);
      });
    });

    describe('Rating', function() {
      before(function() {
        bootPage.go();
        bootPage.directive.click();
      });
      it('should show the inputs enable Rating', function() {
        expect(bootPage.selectmenu('Rating').isEnabled()).to.eventually.be.true;
      });
      it('should have the default rate ',function() {
        expect(bootPage.ratetext('b').getText()).to.eventually.equal('7');
        expect(bootPage.ratetext('i').getText()).to.eventually.equal('false');
        bootPage.rating(5).click()
        expect(bootPage.ratetext('b').getText()).to.eventually.equal('5');
        bootPage.ratebutton(1).click();
        expect(bootPage.ratetext('b').getText()).to.eventually.equal('0');
        bootPage.ratebutton(2).click();
        expect(bootPage.ratetext('i').getText()).to.eventually.equal('true');
      });
      it('should have the custom icon rate',function(){
          expect(bootPage.customrate.getText()).to.eventually.equal('(Rate: 5)');
          bootPage.customrateselect(12).click();
          expect(bootPage.customrate.getText()).to.eventually.equal('(Rate: 12)');
          expect(bootPage.customtext.getText()).to.eventually.equal('(Rate: 2)');
          bootPage.custom(4).click();
          expect(bootPage.customtext.getText()).to.eventually.equal('(Rate: 4)');
      });

    });
    describe('Tabs', function() {
      before(function() {
        bootPage.go();
        bootPage.directive.click();
      });
      it('should show the inputs enable Tabs', function() {
        expect(bootPage.selectmenu('Tabs').isEnabled()).to.eventually.be.true;
      });
      it('should have the content',function(){
        expect(bootPage.tab(1).getText()).to.eventually.equal('Static content');
        bootPage.selecttab(1).click();
        //browser.sleep(10000);
        expect(bootPage.tab(3).getText()).to.eventually.equal('Dynamic content 1');
        bootPage.selecttab(2).click();
        expect(bootPage.tab(4).getText()).to.eventually.equal('Dynamic content 2');
        bootPage.enabletab.click();
        //browser.sleep(10000);
      });
      it('should have the vertical content',function(){
        expect(bootPage.verticalcontent(1).getText()).to.eventually.equal('Vertical content 1');
        bootPage.verticalselect(2).click();
        expect(bootPage.verticalcontent(2).getText()).to.eventually.equal('Vertical content 2');
        //browser.sleep(10000);
      });
      it('should have the justfide content',function(){
        expect(bootPage.justifiedcontent(1).getText()).to.eventually.equal('Justified content');
        bootPage.justifiedselect(2).click();
        expect(bootPage.justifiedcontent(2).getText()).to.eventually.equal('Short Labeled Justified content');
        bootPage.justifiedselect(3).click();
        expect(bootPage.justifiedcontent(3).getText()).to.eventually.equal('Long Labeled Justified content');
      });


    });

    describe('Timepicker', function() {
      before(function() {
        bootPage.go();
        bootPage.directive.click();
      });
      it('should show the inputs enable Timepicker', function() {
        expect(bootPage.selectmenu('Timepicker').isEnabled()).to.eventually.be.true;
      });
      it('should have the time ',function(){
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        
        //console.log(datevalue);
        //var now = new Date();
        //var name = now.getHours();
        //var min = now.getMinutes();


        expect(bootPage.timepickertext.getText()).to.eventually.equal('Time is: '+strTime+'');
        bootPage.timechange.click();
        var hours = hours + 1 ;
        var hours = hours > 12 ? hours - 12 : hours;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        expect(bootPage.timepickertext.getText()).to.eventually.equal('Time is: '+strTime+'');
        bootPage.hoursstep.click();
        bootPage.timechange.click();
        var hours = hours + 1 ;
        var hours = hours > 12 ? hours - 12 : hours;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        expect(bootPage.timepickertext.getText()).to.eventually.equal('Time is: '+strTime+'');
        bootPage.minutesstep.click();
        //bootPage.minuteschange.click();

        //bootPage.timepickerchange.click();
        //expect(bootPage.timepickertext.getText()).to.eventually.equal('Time is: 8:07 AM');
      });
      it.skip('should have display the meridian', function(){
        
        expect(bootPage.meridiandisplay.isDisplayed()).to.eventually.be.true;
        bootPage.timebuttons(1).click();
        expect(bootPage.meridiandisplay.isDisplayed()).to.eventually.be.false;
      });
      it('should have default time', function(){
        bootPage.timebuttons(2).click();
        expect(bootPage.timepickertext.getText()).to.eventually.equal('Time is: 2:00 PM');

      });
      it('should have clear the time',function(){
        bootPage.timebuttons(3).click();
        expect(bootPage.timepickertext.getText()).to.eventually.equal('Time is: ');
      });


    });
    describe('Tooltip', function() {
      before(function() {
        bootPage.go();
        bootPage.directive.click();
      });
      it('should show the inputs enable Tooltip', function() {
        expect(bootPage.selectmenu('Tooltip').isEnabled()).to.eventually.be.true;
      });
      it('should have  the tootip text', function() {
        bootPage.addtooltip;
        bootPage.addpopuptooltip;
        expect(bootPage.tooltiptext(1).getText()).to.eventually.equal('static');
      });
      it('shoud have display the tooltip', function(){
        var rows = bootPage.tooltiptext(1);
        //browser.sleep(1000);
        expect(bootPage.tooltipdisplay(rows).isDisplayed()).to.eventually.be.true;
        var rows = bootPage.tooltiptext(2);
        expect(bootPage.tooltipdisplay(rows).isDisplayed()).to.eventually.be.true;
        var rows = bootPage.tooltiptext(3);
        browser.sleep(100);
        expect(bootPage.tooltipdisplay(rows).isDisplayed()).to.eventually.be.true;
        var rows = bootPage.tooltiptext(4);
        browser.sleep(100);
        expect(bootPage.tooltipdisplay(rows).isDisplayed()).to.eventually.be.true;
        var rows = bootPage.tooltiptext(5);
        browser.sleep(100);
        expect(bootPage.tooltipdisplay(rows).isDisplayed()).to.eventually.be.true;
        var rows = bootPage.tooltiptext(6);
        expect(bootPage.tooltipdisplay(rows).isDisplayed()).to.eventually.be.true;
        var rows = bootPage.tooltiptext(7);
        expect(bootPage.tooltipdisplay(rows).isDisplayed()).to.eventually.be.true;
        var rows = bootPage.tooltipcheck(2);
        expect(bootPage.tooltipcheckdisplay(rows).isDisplayed()).to.eventually.be.true;
        var rows = bootPage.tooltipcheck(3);
        expect(bootPage.tooltipcustomcheck(rows).isDisplayed()).to.eventually.be.true;
        bootPage.tooltipclick(1).click();
        //browser.sleep(100);
        expect(bootPage.tooltipclickdisplay.isDisplayed()).to.eventually.be.true;
        var rows = bootPage.tooltipclick(2);
        expect(bootPage.disabletooltip(rows).isDisplayed()).to.eventually.be.true;
        var rows = bootPage.tooltipclick(2).click();
        bootPage.adddisabletooltip(rows); 
        //browser.sleep(10000);
        //expect(bootPage.tooltipclick(2).isEnabled()).to.eventually.be.true;
      });
    });

    describe('Typeahead', function() {
      before(function() {
        bootPage.go();
        bootPage.directive.click();
      });
      it('should show the inputs enable Typeahead', function() {
        expect(bootPage.selectmenu('Typeahead').isEnabled()).to.eventually.be.true;
      });
      it('should have the typeahead text',function() {
        expect(bootPage.typeaheadtext(1).getText()).to.eventually.equal('Model: ');
        bootPage.addstaticdata;
        expect(bootPage.typeaheadtext(1).getText()).to.eventually.equal('Model: "bootstrap"');
        bootPage.addasynchronousdata;
        bootPage.addasyncdata.click();
        //browser.sleep(10000);
        expect(bootPage.typeaheadtext(2).getText()).to.eventually.equal('Model: "India"');
        bootPage.addcustomtemplate;
        bootPage.addcustomdata.click();
        expect(bootPage.typeaheadtext(3).getText()).to.eventually.equal('Model: {\n  "name": "California",\n  "flag": "0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png"\n}');

      });

    });

    
    
  });
});