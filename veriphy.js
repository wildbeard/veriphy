/*
    Author: Preston Haddock
    Date: 02/06/2015
    Description: Validate user input in forms. Stop the world from inputting bad stuff.
    Version: 0.2.0
    Notes: Let's play off of data-attributes more for specific type of validation or parameters to play by.
*/

var Veriphy = function(options) {
    
    this.form = options.form; // If they don't specify the form throw an error.
    this.errorMsg = options.errorMsg || "The selected input is invalid.";
    this.errorContainer = options.errorContainer || 'console';
    this.firstInvalid = null;
    this.errorShown = false;
    
};

Veriphy.prototype = {
    
    reset: function() {
        // Resets the form validation to revalidate the form.
        this.firstInvalid = null;
        this.errorShown = false;
        $(this.form+' :input').removeClass('invalid');
        $(this.errorContainer).html('');
    },
    
    validateForm: function() {
      
        var v = this;
        v.reset();
        $(v.form + ' :input').each(function() {
            v.validateField($(this));
        });
        
        if ( v.firstInvalid == null ) {
            return true;   
        } else {
            return false;
        }
            },
    
    validateField: function(obj) {
        
        var type = obj.attr('type'), isValid;
        
        if ( type === 'text' ) {
            if ( obj.data('veriphy-type') && obj.data('veriphy-type') == 'creditcard' ) {
                if ( !this.validateCC(obj) ) {
                    this.setErrorMsg().markInvalid(obj);   
                }
            } else if ( obj.data('veriphy-type') && obj.data('veriphy-type') == 'date' ) {
                if ( !this.validateDate(obj) ) {
                    this.setErrorMsg().markInvalid(obj);   
                }
            }
            if ( !this.validateText(obj) ) {
                this.setErrorMsg().markInvalid(obj);
            }
        }
        
    },
    
    validateText: function(obj) {
        
        var text = obj.val();
        
        if ( obj.attr('required') ) {
        
            if ( obj.data('veriphy-minlength') && text.length < obj.data('veriphy-minlength') ) {
                this.errorMsg = "Selected input is too short."
                this.setInvalid(obj);
                return false;
            } else if ( obj.attr('maxlength') && text.length > obj.attr('maxlength') ) {
                this.errorMsg = "Selected input is too long."
                return false;
            } else {
                return true;   
            }
            
        } else {
            return true;
        }
        
    },
    
    validateCC: function(obj) {
      
        var text = obj.val(),
            regex = /[0-9]{16}/;
        
        if ( regex.test(text) ) {
            return true; 
        } else {
            this.errorMsg = "Invalid credit card number.";
            this.setInvalid(obj);
            return false;
        }
        
    },
    
    validateDate: function(obj) {
      
        var text = obj.val(),
            regex = /([01-12]{2}\/[01-31]{2}\/[1-2][0-9]{3})/;
        
        // Eventually support multily formats for DOB but for now mm/dd/yy
        if ( regex.test(text) ) {
            return true;
        } else {
            this.errorMsg = "Invalid date.";
            this.setInvalid(obj);
            return false;
        }
        
    },
    
    setErrorMsg: function() {
        
        if ( this.errorContainer === 'console' ) {
            console.log(error);   
        } else {
            if ( !this.errorShown ) {
                $(this.errorContainer).append(this.errorMsg + '<br />');
                this.errorShown = true;
            }
        }
        
        return this;
        
    },
    
    markInvalid: function(obj) {
        
        obj.addClass('invalid');
        if ( this.firstInvalid == obj ) {
            $(obj).focus();   
        }
        return this;
        
    },
    
    setInvalid: function(obj) {
        
        if ( this.firstInvalid == null ) {
            this.firstInvalid = obj;
        }
        
        return this;
        
    },
    
    testFunc: function() {
        //alert('Test Function');   
    }
    
};