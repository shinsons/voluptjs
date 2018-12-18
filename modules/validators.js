// Validators and Schema definitions.

// third-party requires
var moment = require("moment")

// local requires
var make_schema_error = require('./error.js').make_schema_error

module.exports = {
    isBoolean: function() {
        function _isboolean(val, obj) {
            if(typeof val === "boolean"){
                return val
            }
            else {
                throw make_schema_error(`"${val}" is not a boolean.`);
            }
        }
        return _isboolean
    },

    isArray: function() {
        function _isarray(val, obj) {
            if({}.toString.call(val) === '[object Array]'){
                return val
            }
            else {
                throw make_schema_error(`"${val}" is not an array.`);
            }
        }
        return _isarray
    },


    isString: function() {
        function _isstring(val, obj) {
            if(typeof val === 'string'){
                return val
            }
            else {
                throw make_schema_error(`"${val}" is not a string.`);
            }
        }
        return _isstring
    },

    isDate: function() {
        function _isdate(val, obj) {
            if(!moment(val).isValid()) {
                throw make_schema_error(`"${val}" is not a valid date.`);
            }
            return val
        }
        return _isdate
    },

    isInteger: function() {
        function _isinteger(val, obj) {
            if(typeof val === 'number' && !isNaN(val) && val % 1 === 0){
                return val
            }
            else {
                throw make_schema_error(`"${val}" is not an integer.`);
            }
        }
        return _isinteger
    },

    isNumber: function() {
        function _isnumber(val, obj) {
            if(typeof val === 'number' && !isNaN(val)){
                return val
            }
            else {
                throw make_schema_error(`"${val}" is not a number.`);
            }
        }
        return _isnumber
    }, 

    oneOf: function(def) {
        function _oneof(val, obj) {
            if(def.indexOf(val) === -1){
                throw make_schema_error(`"${val}" is not one of ${def}`);
            }
            return val
        }
        return _oneof
    },

    isHTML: function() {
        function _ishtml(val, obj) {
            if(typeof val === 'string' && val.match(/<\/|\/>|<br>/)) {
                return val
            }
            throw make_schema_error(`"${val}" does not appear to have any html tags.`)
        }
        return _ishtml
    },

    // values of this field and passed in field must match.
    mustMatch: function(field_name) {
        function _mustmatch(val, obj) {
            if(obj[field_name] !== val) {
                throw make_schema_error(`"${val}" is not identical to value of "${field_name}"`)
            }
            return val
        }
        return _mustmatch
    },
    // values of this field and passed in field must not match.
    mustNotMatch: function(field_name) {
        function _mustnotmatch(val, obj) {
            // If a property doesn't exist/undefined then it by 
            // definition doesn't match .... 
            if(obj[field_name] === val) {
                throw make_schema_error(`"${val}" is identical to value of "${field_name}"`)
            }
            return val
        }
        return _mustnotmatch
    }
}
