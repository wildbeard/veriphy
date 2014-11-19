/*
    Author: Wild Beard
    Date Created: 09/30/2014
    Last Updated: 11/19/2014
    Description: 
    A totally awesome and not overly complicated way to validate forms. (Sarcasm?)
    Notes:
    When passing in a regex as a string you must first escape the first \, so \w becomes \\w. Or you know, just pass in the regex \w.
    Debating on where to place credit card validation: numbers or text...Seems obvious but still..
    Will need to do checking for compareto, if it has a compareto on ANY input type, do the compare.
    Version: 1.6
*/

var hasError = false;
var firstInvalid = null;

var veriphy = function(options) {
    
    this.formContainer = options.formContainer || "#theForm";
    this.emailPattern = options.emailPattern || /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
    this.phonePattern = options.phonePattern || /(\([0-9]{3}\) |\([0-9]{3}\)\s*?)[0-9]{3}[-\s*]?[0-9]{4}/g;
    this.errorMsg = options.errorMsg || 'Input error. Please correct the error(s) before continuing.';
    this.errorContainer = options.errorContainer || 'console';
    this.scrollOffset = options.offset || 25;
    this.errorMarker = options.errorMarker || '.error-marker';
    this.errorClass = options.errorClass || 'invalid-input';
    this.validClass = options.validClass || 'valid-input'; // Unused ( 1.5 )
    this.minLength = options.minLength || 8;  // Used on password and text validation
    this.maxLength = options.maxLength || 25; // As of 1.5+ used on the following: text validation :(
    this.hasErrorMsg = false;
    // Created a function to reset all the changing variables such as firstInvalid and error messages.
    // This is used in checkAllInputs() to reset the form so things will be re-checked.
    this.reset = reset;
    
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
        v.reset();
        
        $(v.formContainer + ' input, ' + v.formContainer + ' select').each(function(i) {
           
            var obj = $(this);
            
            v.validateField(obj);
            
        });
        
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
        var x;
            
        if ( type == 'text' ) {
            if ( obj.data('veriphy-type') == 'dob' ) {
                x = validateDOB(obj, v);
            } else {
                x = validateText(obj, v);
            }
            if ( !x && v.getFirstInvalid() == null ) {
                v.setFirstInvalid(obj);
            } else {
                if ( !x ) {
                    v.markInvalid(obj.attr('name'));
                }
            }
        } else if ( type == 'email' ) {
            if ( !validateEmail(obj, v) && v.getFirstInvalid() == null ) {
                v.setFirstInvalid(obj);
            } else {
                if ( !validateEmail(obj, v) ) {
                    v.markInvalid(obj.attr('name'));   
                }
            }
        } else if ( type == 'radio' || type == 'checkbox' ) {
            if ( !validateRadio(obj, v) && v.getFirstInvalid() == null ) {
                v.setFirstInvalid(obj);
            } else {
                if ( !validateRadio(obj, v) ) {
                    v.markInvalid(obj.attr('name'));   
                }
            }                    
        } else if ( obj.is('select') ) {
            x = validateSelects(obj, v);
            if ( !x && v.getFirstInvalid() == null ) {
                v.setFirstInvalid(obj);
            } else {
                if ( !x ) {
                    v.markInvalid(obj.attr('name'));   
                }
            }
        } else if ( type == 'number' ) {
            x = validateNumbers(obj, v);
            if ( !x && v.getFirstInvalid() == null ) {
                v.setFirstInvalid(obj);   
            } else {
                if ( !x ) {
                    v.markInvalid(obj.attr('name'));
                }
            }
        } else if ( type === 'password' ) { 
            if ( !validatePassword(obj, v) && v.getFirstInvalid() == null ) {
                v.setFirstInvalid(obj);
            } else {
                validatePassword(obj, v);   
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
        
        var cssClass = this.errorClass;
        
        if ( typeof obj === 'undefined' ) {
            console.log('scrollToElement() requires that the input\'s name be provided.');
            return false;
        }
        
        if ( obj instanceof Object ) {
            var v = this;
            obj.focus().closest(v.errorMarker).addClass(cssClass);
            $('html, body').animate({
                scrollTop: obj.offset().top - this.scrollOffset
            }, 'slow');
            
        } else {
            var theName = "[name='" + obj + "']";
            $(theName).focus().closest(v.errorMarker).addClass(cssClass);
            $('html, body').animate({
            scrollTop: $(theName).offset().top - this.scrollOffset
            }, 'slow');
        }
        
    }, // End scrollToElement()
    
    markInvalid: function(invalidFields, scrollTo) {
     
        // If scrollTo is true we will scroll to the first, or only, input
        if ( invalidFields instanceof Array ) {
            for ( i = 0; i < invalidFields.length; i++ ) {
                $('[name="' + invalidFields[i] + '"]').closest(this.errorMarker).addClass(this.errorClass);
            }
            if ( scrollTo ) {
                this.scrollToElement(invalidFields[0]);   
            }
        } else {
            //console.log('Markin\' Invalid: ' + invalidFields);
            $('[name="' + invalidFields + '"]').closest(this.errorMarker).addClass(this.errorClass);
            if ( scrollTo ) {
               this.scrollToElement(invalidFields); 
            }
        } 
        
    }
    
} // End prototype { }

// Begin internal functions

function validateText(obj, v) {
    
    var opts = obj.data(), req = obj.attr('required'), l = 0;
    
    for ( var z in opts ) {
        l++;
    }
    
    if ( obj.data("veriphy-type") == "phone" ) {
        if ( ( req && obj.val().length == 0 ) || ( req && obj.val() == " " ) ) {
            v.setErrorMessage('The selected field is required and cannot be left blank.');
            return false;
        }
        if ( req && !regexTest(v.phonePattern, obj.val()) ) {
            v.setErrorMessage('Phone number is in an improper format. Try something like: (555) 555-5555.');
            return false;
        } else if ( !req && !regexTest(v.phonePattern, obj.val()) ) {
            v.setErrorMessage('Phone number is in an improper format. Try something like: (555) 555-5555.');
            return false;
        }
    }
    
    if ( req ) {
        if ( (l == 0 && obj.val().length == 0) || (l == 0 && obj.val() == " ") || ( obj.val().length == 0 || obj.val() == " " ) ) {
            v.setErrorMessage('The selected field is required and cannot be left blank.');
            return false;
        } else {
            // There were options so we're going to figure out what they are here
            var min, max, compare, regex;
            for ( var z in opts ) {
                switch (z) {

                    case "veriphyMinlength":
                        min = opts[z];
                    break;

                    case "veriphyMaxlength":
                        max = opts[z];
                    break;

                    case "veriphyRegex":
                        regex = opts[z];
                    break;

                    case "veriphyCompare":
                        compare = opts[z];
                    break;

                }
            } // End for
            
            // Validate the character count.
            if ( ( min && max ) && ( obj.val().length >= min && obj.val().length <= max ) ) {
                if ( /^\s+$/.test(obj.val()) ) {
                    v.setErrorMessage('The selected input is required but only contains spaces.');
                    return false;
                } else if ( regex ) {
                    if ( !regexTest(regex, obj.val() ) ) {
                        v.setErrorMessage('The selected input is not valid and must be corrected.');
                        return false;
                    }
                }
            } else if ( max && obj.val().length > max ) {
                v.setErrorMessage('The selected input exceeds the max character length of ' + max);
                return false;
            } else if ( min && obj.val().length < min ) {
                v.setErrorMessage('The selected input is less than the minimum character length of ' + min);
                return false;
            } 
            
            // Validate compare
            if ( compare ) {
                if ( !compareVals(obj, $('[name="' + compare + '"]')) ) {
                    v.setErrorMessage('The selected input does not match it\'s partner input.');
                    return false;
                }
            }
            
        } // End if req else
        
    } // End if required
    
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
    
    // Used for credit card validation. Simple. Is it 0-9 and contain no special characters?
    // Could probably just be simplified to the regex tester. However it wouldn't be able to tell you what went wrong.
    // Well unless you provided different regex for each circumstance.
    if ( obj.data("veriphy-type") == "creditcard" && obj.attr("required") ) {
        
        var regex = new RegExp(/[0-9]{16}/g);
        
        if ( obj.val().length < 16 && obj.val().length > 1 ) {
            console.log('Credit card is required and isn\'t long enough. Length: ' + obj.val().length + ' Required Length: 16');
            return false;   
        } else if ( obj.val().length > 16 ) {
            console.log('The selected input is too long exceeding the max length of 16.');
            return false;  
        } else if ( obj.val().length == 0 || obj.val() == " " ) {
            console.log('This field is required and cannot be left blank.');
            return false;   
        } else if ( !regexTest(regex, obj.val()) ) {
            console.log('The selected input contains invalid characters.');
            return false;
        }
        
    } else {
        return true;   
    }
    
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
            obj.closest(v.errorMarker).removeClass(v.errorClass);
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

function validatePassword(obj, v) {
    
    var cTo, mLength;
    
    // If it can't the compare data, don't compare
    if ( !obj.data('veriphy-compare') && !obj.attr('required') ) {
        return true; // Not required and no compare return true - pretty dumb - Seriously password isn't required? Whatever.
    } else if ( !obj.attr('required') ) {
        return true; // Not required so just return true - What kind of password isn't required..?
    } else if ( obj.data('veriphy-compare') || obj.attr('required') ) {
        
        if ( obj.data('veriphy-minlength') ) {
            mLength = obj.data('veriphy-minlength');   
        } else {
            mLength = v.minLength;
        }
        
        if ( obj.data('veriphy-compare') ) {
            
            cTo = obj.data('veriphy-compare');
            
            // Required and it has something to compare to!
            if ( obj.val().length == 0 || obj.val().length < mLength ) {
                v.setErrorMessage('Password is either empty or does not meet minimum length.');
                v.markInvalid(obj.attr('name'));
                return false; // Wasn't long enough/empty
            } else if ( obj.val() != $('[name="' + cTo + '"]').val() ) {
                v.setErrorMessage('Passwords do not match.');
                v.markInvalid(obj.attr('name'));
                return false;
            } else if ( obj.val() === $('[name="' + cTo + '"').val() ) {
                return true; // Passwords match and meet requirements   
            }
        } else {
            if ( obj.val().length != 0 && obj.val().length >= mLength ) {
                return true;   
            } else {
                v.markInvalid(obj.attr('name'));
                v.setErrorMessage('Password was either empty or was not long enough.');
                return false;
            }
        }
    }
    
} // End validatePassword

function compareVals(obj1, obj2) {
    
    if ( obj1.val() != obj2.val() ) {
        return false;
    } else {
        return true;
    }
    
}

function regexTest(regex, str) {
    
    var reg;
    if ( regex instanceof RegExp ) {
        reg = new RegExp(regex);
    } else {
        reg = new RegExp(regex, "g");
    }
    
    if ( reg.test(str) ) {
        return true;
    } else {
        return false;
    }
    
}

function reset() {
    $(this.errorMarker).removeClass(this.errorClass);
    $(this.errorContainer).html('');
    this.setFirstInvalid(null);
    this.setHasMsg(false);
}

function validateDOB(obj, v) {
    
    // dobMax = Can't be any older than this.
    // dobMin = Can't be any younger than this.
    var dobMin, dobMax, dob = new Date(obj.val()), curr= new Date(), age, regex = new RegExp(/[01-12]{2}\/[01-31]{2}\/[1-2][0-9]{3}/g);
    curr = curr.getFullYear();
    
    if ( !obj.attr('required') ) {
        // Not required but still need to make sure it is in a decent format
        if ( regexTest(regex, obj.val()) ) {
            return true;   
        } else {
            v.setErrorMessage('The input was in the improper format. Please try mm/dd/yyyy ex: 01/23/2000.');
            return false;
        }
    } else {
        // It is required let's do some stuff here!
        if ( regexTest(regex, obj.val()) ) {
            // Passed regex test now let's do other validation.
            
            if ( obj.data('veriphy-mindob') && obj.data('veriphy-maxdob') ) {
                // They have an age group requirement.
                dobMin = new Date(obj.data('veriphy-mindob')).getFullYear();
                dobMax = new Date(obj.data('veriphy-maxdob')).getFullYear();
                age = curr - dob.getFullYear();
                
                if ( age <= ( curr - dobMax ) && age >= ( curr - dobMin ) ) {
                    // They meet the strict age requirements. Good for them.
                    return true;  
                } else {
                    v.setErrorMessage('You must be born between ' + dobMax + ' and ' + dobMin + '.');
                    return false;
                }
                
            } else if ( obj.data('veriphy-maxdob') ) {
                // They have a max age requirement.
                dobMax = new Date(obj.data('veriphy-maxdob')).getFullYear();
                age = curr - dob.getFullYear();
                if ( age > ( curr - dobMax ) ) {
                    v.setErrorMessage('You do not meet the age requirements. You must be younger than ' + ( curr - dobMax ) + ' years old.');
                    return false;
                }
            } else if ( obj.data('veriphy-mindob') ) {
                dobMin = new Date(obj.data('veriphy-mindob')).getFullYear();
                age = curr - dob.getFullYear();
                if ( age < ( curr - dobMin ) ) {
                    v.setErrorMessage('You do not meet the age requirements. You must be at least ' + ( curr - dobMin ) + ' years old.');
                    return false;
                }
            } else if ( !obj.data('veriphy-mindob') && !obj.data('veriphy-maxdob') ) {
                // They don't have either min or max dob specified.
                // That means we can't do crap with it and since it passed regex we have to return true.
                return true;   
            }
            
        } else {
            // Failed regex test
            v.setErrorMessage('The input was in the improper format. Please try mm/dd/yyyy ex: 01/23/2000.');
            return false;
        }
    }
    
} // End validateDOB()