veriphy
=======

Quickly and easily validate HTML forms using Javascript and jQuery.

Overview
=======

Using veriphy is pretty straight forward. Include veriphy.js after you include jQuery, wherever that might be, initialize veriphy as an object, and pass veriphy the options you want to set. Most of the variables passed to veriphy are optional but may restrict the overal usage. Such things like the container of the form or where the error message should be displayed.

Veriphy Options
=======

```javascript
// All of these are the defaults
var v = new veriphy({
  formContainer: "#zzz",
  errorContainer: "#zzz",
  errorMarker: ".error-marker",
  errorMsg: "Default error message.",
  minLength: 8, // Minimum length of fields - currently only used for passwords
  offset: 25 // Scroll doesn't play well sometimes so you have to offset it.
});
```
Getting the HTML ready

```html
<div class="form-group error-marker">
  <label>Input Label</label>
  <input type="text" name="namesAreRequired" class="form-control" />
</div>
```
Calling forth all the files
```html
<script src="js/jquery.js"></script>
<script src="js/veriphy.js"></script>
<script>
  // All of these are the defaults
  var v = new veriphy({
    formContainer: "#zzz",
    errorContainer: "#zzz",
    errorMarker: ".error-marker",
    errorMsg: "Default error message.",
    minLength: 8, // Minimum length of fields - currently only used for passwords
    offset: 25 // Scroll doesn't play well sometimes so you have to offset it.
  });
</script>
</body>
```

data-veriphy-Options
=======

Veriphy takes advantage of the new(ish) data- attribute in HTML. With it you can specify cool things like adding money between fields, comparing two emails together, or just comparing two fields together. ( Which only works for passwords :( )

+ `data-veriphy-compare=""` - Specify the name of the field you wish to compare the current field to. Currently works with passswords and emails.
+ `data-veriphy-addto=""` - Specify the name of the field you wish to add money to. Can be output using..
+ `data-veriphy-outputto=""` - Specify the name of the field you wish to output addmoney to.
+ `data-veriphy-minlength=""` - Specify the minimum char count for the given field. Currently only works with password fields and will override the parameter in the options.

Coming Soon: More Options!
=======

Will be added better support for more data-veriphy-* attributes. Additional options will be added as well. Things like maxLength, specific class to apply to invalid inputs, and maybe specifying error messages for each type of input. The last one is kind of a long shot. Also will be removing my co-dependency on Bootstrap regardless of how good it looks.
