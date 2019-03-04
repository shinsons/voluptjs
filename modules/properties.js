// Property conditions/valiators/rules
//
// local requires
var makeSchemaError = require('./error.js').makeSchemaError;


module.exports = {
  Required: function(field_name) {
    function _required(obj) {
      if(!obj || !obj.hasOwnProperty(field_name)) {
        throw makeSchemaError(`Property "${field_name}" is required.`);
      }
      return field_name;
    }
    return _required;
  },

  Optional: function(field_name) {
    function _optional(obj) { 
      if(!obj || !obj.hasOwnProperty(field_name)) {
        var err = new Error();
        err.is_optional = true;
        throw err;
      }
      return field_name;
    }
    return _optional;
  }
};
            
