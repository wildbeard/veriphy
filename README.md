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
Bring it all together in HTML

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

Coming Soon: More Options!
=======

Will be added better support for more data-veriphy-* attributes. Additional options will be added as well. Things like maxLength, specific class to apply to invalid inputs, and maybe specifying error messages for each type of input. The last one is kind of a long shot. Also will be removing my co-dependency on Bootstrap regardless of how good it looks.
