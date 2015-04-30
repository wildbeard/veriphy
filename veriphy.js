/*
    Author: Press
<<<<<<< HEAD
    Date: 04/30/2015
    Description: Validate user input in forms. Stop the world from inputting bad stuff.
    Version: 2.0
=======
    Date: 02/06/2015
    Description: Validate user input in forms. Stop the world from inputting bad stuff.
    Version: 2.0
    Notes: Let's play off of data-attributes more for specific type of validation or parameters to play by.
>>>>>>> origin/master
*/

function Veriphy(options) {

    // Global properties
    this.form = options.form;
    this.errorMsg = options.errorMsg || 'The field is required and cannot be left blank.';
    this.errorContainer = options.errorContainer || 'console';
    this.errorClass = options.errorClass || 'invalid'; // Class to apply to the errorContainer.
    this.inputContainer = options.InputContainer || this.form + ' :input'; // The element containing the input - for error/success
    this.firstInvalid = null;
    this.errorShown = false;
    
    // Functions
    this.reset = function() {
        // Resets the form.
        this.firstInvalid = null;
        this.errorShown = false;
        if ( this.inputContainer != 'input' ) {
            $(this.inputContainer).removeCLass(this.errorClass);
        } else {
            $(this.inputContainer).removeClass(this.errorClass);
        }
        $(this.errorContainer).html('');
    }; // End reset()
    
    this.validateForm = function() {
        // This will be our entry point.
    };
    
<<<<<<< HEAD
}
=======
};
>>>>>>> origin/master
