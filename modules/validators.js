/**
 * Validators and Schema definitions.
 */

// third-party requires
var moment = require('moment');

// local requires
var makeSchemaError = require('./error.js').makeSchemaError;

module.exports = {
  
  isNull: function() {
    /**
     * Returns function that determines if a value is null or not.
     * @param {any} val the value from the configured field.
     * @param {object}} obj the object being validated.
     * @returns (function} the validation function.
     */
    function _isnull(val, obj) {
      if (val === null) {
        return val
      }
      else {
        throw makeSchemaError('"' + val + '" is not null.');
      }
    }
    return _isnull
  },

  isBoolean: function() {
    /**
     * Returns function that determines if a value is boolen or not
     * @param {any} val the value from the configured field.
     * @param {object}} obj the object being validated.
     * @returns (function} the validation function.
     */
    function _isboolean(val, obj) {
      if (typeof val === 'boolean') {
        return val
      }
      else {
        throw makeSchemaError('"' + val + '" is not a boolean.');
      }
    }
    return _isboolean
  },

  isArray: function() {
    function _isarray(val, obj) {
      if ({}.toString.call(val) === '[object Array]') {
        return val
      }
      else {
        throw makeSchemaError('"' + val + '" is not an array.');
      }
    }
    return _isarray
  },


  isString: function() {
    function _isstring(val, obj) {
      if (typeof val === 'string') {
        return val
      }
      else {
        throw makeSchemaError('"' + val + '" is not a string.');
      }
    }
    return _isstring
  },

  isDate: function() {
    function _isdate(val, obj) {
      if (!moment(val).isValid()) {
        throw makeSchemaError('"' + val + '" is not a valid date.');
      }
      return val
    }
    return _isdate
  },

  isInteger: function() {
    function _isinteger(val, obj) {
      if (typeof val === 'number' && !isNaN(val) && val % 1 === 0) {
        return val
      }
      else {
        throw makeSchemaError('"' + val + '" is not an integer.');
      }
    }
    return _isinteger
  },

  isNumber: function() {
    function _isnumber(val, obj) {
      if (typeof val === 'number' && !isNaN(val)) {
        return val
      }
      else {
        throw makeSchemaError('"' + val + '" is not a number.');
      }
    }
    return _isnumber
  },

  oneOf: function(def) {
    function _oneof(val, obj) {
      if (def.indexOf(val) === -1) {
        throw makeSchemaError('"' + val + '" is not one of ' + def.toString());
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
      throw makeSchemaError('"' + val + '" does not appear to have any html tags.')
    }
    return _ishtml
  },

  // values of this field and passed in field must match.
  mustMatch: function(field_name) {
    function _mustmatch(val, obj) {
      if(obj[field_name] !== val) {
        throw makeSchemaError('"' + val + '" is not identical to value of "' + field_name + '"')
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
        throw makeSchemaError('"' + val + '" is identical to value of "' + field_name + '"')
      }
      return val
    }
    return _mustnotmatch
  }
};
