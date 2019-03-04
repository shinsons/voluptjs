// Property conditions/valiators/rules
//
// local requires
var make_schema_error = require('./error.js').make_schema_error;


module.exports = {
  Required: function(field_name) {
    function _required(obj) {
      if(!obj.hasOwnProperty(field_name)) {
        throw make_schema_error(`Property "${field_name}" is required.`);
      }
      return field_name;
    }
    return _required;
  },

  Optional: function(field_name) {
    function _optional(obj) { 
      if(!obj.hasOwnProperty(field_name)) {
        var err = new Error();
        err.is_optional = true;
        throw err;
      }
      return field_name;
    }
    return _optional;
  }
};
            
