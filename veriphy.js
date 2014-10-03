/*
    Author: Preston Haddock
    Date: 09/30/2014
    Description: Used to validate forms
    Version: 1.3
    Version = x.y
    x = Release
    y = Revision
    I judge y based on how many times I've deleted this POS and remade it.
*/

var hasError = false;

function veriphy(options) {
    
    this.emailPattern = options.emailPattern || /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
    
    this.errorMsg = options.errorMsg || 'Input error. Please correct the error(s) before continuing.';
    
    this.errorContainer = options.errorContainer || 'console';
    
    this.scrollOffset = options.offset || 25;
    
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

    checkAllInputs: function() {
        
        var v = this, firstInvalid = null;
        
        // Reset all variables here
        $('#mainForm input, #mainForm select').closest('div.form-group').removeClass('has-error');
        $(v.errorContainer).html('');
        v.setHasMsg(false);
        // End resets
        
        $('#mainForm input, #mainForm select').each(function(i) {
           
            var obj = $(this);
            var type = obj.attr('type');
            
            if ( type == 'text' ) {
                if ( !validateText(obj, v) && firstInvalid == null ) {
                    //console.log(obj.attr('name') + ': set as firstInvalid.');
                    //firstInvalid = obj.attr('name');
                    firstInvalid = obj;
                } else {
                    if ( !validateText(obj, v) ) {
                        v.markInvalid(obj.attr('name'));
                    }
                }
            } else if ( type == 'email' ) {
                if ( !validateEmail(obj, v) && firstInvalid == null ) {
                    //console.log(obj.attr('name') + ': set as firstInvalid.');
                    //firstInvalid = obj.attr('name');
                    firstInvalid = obj;
                } else {
                    if ( !validateEmail(obj, v) ) {
                        v.markInvalid(obj.attr('name'));   
                    }
                }
            } else if ( type == 'radio' ) {
                if ( !validateRadio(obj, v) && firstInvalid == null ) {
                    firstInvalid = obj;   
                } else {
                    if ( !validateRadio(obj, v) ) {
                        v.markInvalid(obj.attr('name'));   
                    }
                }                    
            } else if ( obj.is('select') ) {
                if ( !validateSelects(obj, v) && firstInvalid == null ) {
                    firstInvalid = obj;   
                } else {
                    if ( !validateSelects(obj, v) ) {
                        v.markInvalid(obj.attr('name'));   
                    }
                }
            }
            
        });
        
        v.scrollToElement(firstInvalid);
        
    }, // End checkAllInputs()
    
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
        
            $('html, body').animate({
                scrollTop: obj.offset().top - this.scrollOffset
            }, 'slow', function() {
                obj.focus().closest('div.form-group').addClass(cssClass);
            });
            
        } else {
            var theName = "[name='" + obj + "']";
            $('html, body').animate({
            scrollTop: $(theName).offset().top - this.scrollOffset
            }, 'slow', function() {
                $(theName).focus().closest('div.form-group').addClass(cssClass);
            });
        }
        
    }, // End scrollToElement()
    
    markInvalid: function(invalidFields, scrollTo) {
     
        // If scrollTo is true we will scroll to the first, or only, input
        if ( invalidFields instanceof Array ) {
            if ( scrollTo ) {
                this.scrollToElement(invalidFields[0]);   
            }
            for ( i = 0; i < invalidFields.length; i++ ) {
                $('[name="' + invalidFields[i] + '"]').closest('div.form-group').addClass('has-error');   
            }
        } else {
            if ( scrollTo ) {
               this.scrollToElement(invalidFields); 
            }
            $('[name="' + invalidFields + '"]').closest('div.form-group').addClass('has-error');
        } 
        
    }
    
}

function validateText(obj, v) {
    
    // v is the context of veriphy
    
    if ( obj.attr('required') && obj.val().length == 0 ) {
        //console.log(obj.attr('name') + ': is required but is blank.');
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
        v.setErrorMessage('Please select your association.');
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