// Property conditions/valiators/rules
//
// local requires
var make_schema_error = require('./error.js').make_schema_error


module.exports = {
    Required: function(field_name) {
        function _required(obj) {
            if(!obj.hasOwnProperty(field_name)) {
                throw make_schema_error(`Property "${val}" is required.`)
            }
            return field_name
        }
        return _required
    },

    Optional: function(field_name) {
        function _optional(obj) { 
            if(!obj.hasOwnProperty(field_name)) {
                var err = new Error()
                err.is_optional = true
                throw err
            }
            return field_name
        }
        return _optional
    },

    AtLeastNOf: function(this_field, field_names, n) {
        // Passed object must have at least 'n' of the 
        // array of field names given.
        function _atleastnof(obj) {
            var count = 0
            for(const k in obj) {
                if(field_names.indexOf(k) !== -1) {
                    count+=1
                }
            }
            if(count < n) {
                throw make_schema_error(`Could not find ${n} property names.`)
            }
            return this_field
        }
        return _atleastnof
    }
}
            
