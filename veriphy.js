/*
    Author: Preston Haddock
    Date Created: 09/30/2014
    Last Updated: 10/24/2014
    Description: Used to validate forms
    Version: 1.4
*/

var hasError = false;
var firstInvalid = null;

var veriphy = function(options) {
    
    // If you don't specify a form object when creating the object you have to do it here
    // So either way you need stop being lazy and give the code what it needs to work. :)
    this.formContainer = options.formContainer || "#zzz";
    
    // You don't have to specify an email pattern because this one is amazing..sort of
    // This one is widely accepted as the 'go-to email pattern'
    this.emailPattern = options.emailPattern || /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
    
    // Stop being lazy, specifiy an error message
    // Please note that this is for fields that aren't caught in the code below and need a generic error
    this.errorMsg = options.errorMsg || 'Input error. Please correct the error(s) before continuing.';
    
    // If you don't specify a place to write out the error it is going to print it to the console
    // If it prints out to the console then the user is unaware. If the user is unaware they complain
    // When they complain they call tech support. When they call tech support your techies flip out and go on strike
    // When the techies go on strike the internet dies. Don't let the internet die.
    this.errorContainer = options.errorContainer || 'console';
    
    // Scroll this many pixels higher than the object that was bad
    // Remember: You always want the higher ground.
    this.scrollOffset = options.offset || 25;
    
    // Same thing with formContainer since not everyone uses bootstrap
    this.errorMarker = options.errorMarker || '#zzz';
    
    this.hasErrorMsg = false;
    
}

veriphy.prototype = {
 
    constructor: veriphy,
    
    setHasMsg: function(e) {
        hasError = e;
    },
    
    getHasMsg: function() {
        return hasError;  
    },
    
    setFirstInvalid: function(e) {
        firstInvalid = e;
    },
    
    getFirstInvalid: function() {
        return firstInvalid;  
    },

    checkAllInputs: function() {
        
        var v = this;
        
        // Reset all variables here
        //$('#mainForm input, #mainForm select').closest('div.form-group').removeClass('has-error');
        $(v.errorMarker).removeClass('has-error');
        $(v.errorContainer).html('');
        v.setFirstInvalid(null);
        v.setHasMsg(false);
        // End resets
        
        $(v.formContainer + ' input, ' + v.formContainer + ' select').each(function(i) {
           
            var obj = $(this);
            
            v.validateField(obj);
            
        });
        
        //console.log('FirstI: ' + v.getFirstInvalid());
        if ( v.getFirstInvalid() == null ) {
            return true;
        } else {
            v.scrollToElement(v.getFirstInvalid());
            return false;
        }
        
    }, // End checkAllInputs()
    
    validateField: function(obj) {
        
        var v = this;
        var type = obj.attr('type');
            
        if ( type == 'text' ) {
            if ( !validateText(obj, v) && v.getFirstInvalid() == null ) {
                //firstInvalid = obj;
                v.setFirstInvalid(obj);
            } else {
                if ( !validateText(obj, v) ) {
                    v.markInvalid(obj.attr('name'));
                }
            }
        } else if ( type == 'email' ) {
            if ( !validateEmail(obj, v) && v.getFirstInvalid() == null ) {
                //firstInvalid = obj;
                v.setFirstInvalid(obj);
            } else {
                if ( !validateEmail(obj, v) ) {
                    v.markInvalid(obj.attr('name'));   
                }
            }
        } else if ( type == 'radio' || type == 'checkbox' ) {
            if ( !validateRadio(obj, v) && v.getFirstInvalid() == null ) {
                //firstInvalid = obj;   
                v.setFirstInvalid(obj);
            } else {
                if ( !validateRadio(obj, v) ) {
                    v.markInvalid(obj.attr('name'));   
                }
            }                    
        } else if ( obj.is('select') ) {
            if ( !validateSelects(obj, v) && v.getFirstInvalid() == null ) {
                //firstInvalid = obj;
                v.setFirstInvalid(obj);
            } else {
                if ( !validateSelects(obj, v) ) {
                    v.markInvalid(obj.attr('name'));   
                }
            }
        } else if ( type == 'number' ) {
            if ( !validateNumbers(obj, v) && v.getFirstInvalid() == null ) {
                v.setFirstInvalid(obj);   
            } else {
                if ( !validateNumbers(obj, v) ) {
                    console.log('Marking Invalid: ' + obj.attr('name'));
                    v.markInvalid(obj.attr('name'));
                }
            }
        }
                
    }, // End validateField()
    
    setErrorMessage: function(msg, container) {
        
        msgContainer = container || this.errorContainer;
        
        if ( typeof msg === 'undefined' ) {
            // If they didn't pass the msg parameter stop.
            console.log('setErrorMessage requires the message parameter.');
            return false;
        }
        
        if ( !this.getHasMsg() ) {
            msg = "<h3 class='pull-left'><span class='glyphicon glyphicon-exclamation-sign'></span></h3>" + msg;        
            $(msgContainer).html(msg).addClass('text-danger');        
            this.setHasMsg(true);
        } else {
            //console.log('Message already set..');
        }
        
    }, // End setErrorMessage()
    
    scrollToElement: function(obj) {
        
        var cssClass = 'has-error';
        
        if ( typeof obj === 'undefined' ) {
            console.log('scrollToElement() requires that the input\'s name be provided.');
            return false;
        }
        
        if ( obj instanceof Object ) {
            var v = this;
            $('html, body').animate({
                scrollTop: obj.offset().top - this.scrollOffset
            }, 'slow', function() {
                obj.focus().closest(v.errorMarker).addClass(cssClass);
            });
            
        } else {
            var theName = "[name='" + obj + "']";
            $('html, body').animate({
            scrollTop: $(theName).offset().top - this.scrollOffset
            }, 'slow', function() {
                $(theName).focus().closest(v.errorMarker).addClass(cssClass);
            });
        }
        
    }, // End scrollToElement()
    
    markInvalid: function(invalidFields, scrollTo) {
     
        // If scrollTo is true we will scroll to the first, or only, input
        if ( invalidFields instanceof Array ) {
            for ( i = 0; i < invalidFields.length; i++ ) {
                $('[name="' + invalidFields[i] + '"]').closest(this.errorMarker).addClass('has-error');
            }
            if ( scrollTo ) {
                this.scrollToElement(invalidFields[0]);   
            }
        } else {
            //console.log('Markin\' Invalid: ' + invalidFields);
            $('[name="' + invalidFields + '"]').closest(this.errorMarker).addClass('has-error');
            if ( scrollTo ) {
               this.scrollToElement(invalidFields); 
            }
        } 
        
    }
    
} // End prototype { }

function validateText(obj, v) {
    
    // v is the context of veriphy
    
    if ( obj.attr('required') && obj.val().length == 0 ) {
        //console.log(obj.attr('name') + ': is required but is blank.');
        //console.log('Invalid!');
        v.setErrorMessage('The selected field is required and cannot be left blank.');
        return false;
    }
    
    return true;
    
} // End validateText()

function validateEmail(obj, v) {
        
    if ( obj.data('veriphy-compare') ) {
        
        var compareTo = "[name='" + obj.data('veriphy-compare') + "']";
        
        //console.log(v.emailPattern.test(obj.val()));        
        
        if ( obj.val().length == 0 || obj.val() == ' ' || $(compareTo).val().length == 0 || $(compareTo).val() == ' ' ) {            
            v.setErrorMessage('Emails cannot be left blank.');
            v.markInvalid(obj.data('veriphy-compare'));
            return false;
        } else if ( obj.val() != $(compareTo).val() ) {
            v.setErrorMessage('Emails do not match.');
            v.markInvalid(obj.data('veriphy-compare'));
            return false;
        }
        
        if ( v.emailPattern.test(obj.val()) == false ) {
            if ( !v.emailPattern.test($(compareTo).val()) ) {
                v.markInvalid(obj.data('veriphy-compare'));
            }
            v.setErrorMessage('The provided email is invalid.');
            return false;
        } else if ( !v.emailPattern.test($(compareTo).val()) ) {
            v.setErrorMessage('One of the provided emails is invalid.');
            v.markInvalid($(compareTo).attr('name'));
            return false;
        }
    } else { // End the compare start single validation
        
        if ( obj.val().length == 0 || obj.val() == ' ' ) {
            v.setErrorMessage('Email is required and cannot be left blank.');
            return false;
        } else if ( !v.emailPattern.test(obj.val()) ) {
            v.setErrorMessage('The email provided is not valid.');
            return false;
        }
        
    } // End if/else
    
    return true;
    
} // End validateEmail()

function validateSelects(obj, v) {
    
    if ( obj.attr('required') && obj[0].selectedIndex == 0 ) {
        v.markInvalid(obj.attr('name'));
        v.setErrorMessage('You must select an option.');
        return false;  
    }
    
    return true;
    
} // End validateSelects()

function validateRadio(obj, v) {
    
    if ( obj.attr('required') && !$('[name="' + obj.attr('name') + '"]').is(':checked') ) {
        v.setErrorMessage('The selected field is required and cannot be left blank.');
        return false;
    }
    
    return true;
    
} // End validateRadio()

function validateNumbers(obj, v) {
    
    if ( obj.attr('required') && obj.val().length == 0 ) {
        v.setErrorMessage('This field is required and cannot be left blank. :)');
        v.markInvalid(obj.attr('name'));
        return false;
    } else if ( obj.data('veriphy-outputto') ) {
        if ( !obj.data('veriphy-addto') || !obj.data('veriphy-outputto') ) {
            console.log('Add Money: Requirements not met.');
            v.markInvalid(obj.attr('name'));
            return false;
        } else {
            var outObj = $("[name='" + obj.data('veriphy-outputto') + "']");
            var baseVal = $("[name='" + obj.data('veriphy-addto') + "']").val();
            console.log('ASA Val: ' + baseVal + ' Local: ' + obj.val());        
            var total = parseFloat(baseVal) + parseFloat(obj.val());
            outObj.val(total.toFixed(2));
            obj.closest(v.errorMarker).removeClass('has-error');
            return true;
        }
    } else {
        return true;
    }
    
}

function addMoney(obj) {
    
    if ( !obj.data('veriphy-addto') || !obj.data('veriphy-outputto') ) {
        console.log('Add Money: Requirements not met.');
        return false;
    } else {
        
        var outObj = $("[name='" + obj.data('veriphy-outputto') + "']");
        var baseVal = $("[name='" + obj.data('veriphy-addto') + "']").val();
        
        console.log('ASA Val: ' + baseVal + ' Local: ' + obj.val());        
        var total = parseFloat(baseVal) + parseFloat(obj.val());
        outObj.val(total.toFixed(2));
        return true;
        
    }
    
}
