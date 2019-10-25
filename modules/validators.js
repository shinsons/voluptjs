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
     * @returns (function} the validation function.
     */
    function _isnull(val, schema, prop_name) {
      if (val === null) {
        return val;
      }
      else {
        throw makeSchemaError(prop_name + ': "' + val + '" is not null.');
      }
    }
    return _isnull;
  },

  isBoolean: function() {
    /**
     * Returns function that determines if a value is boolen or not
     * @param {any} val the value from the configured field.
     * @returns (function} the validation function.
     */
    function _isboolean(val, schema, prop_name) {
      if (typeof val === 'boolean') {
        return val;
      }
      else {
        throw makeSchemaError(prop_name + ': "' + val + '" is not a boolean.');
      }
    }
    return _isboolean;
  },

  isArray: function() {
    /**
     * Returns function that determines if a value is an array or not.
     * @param {any} val the value from the configured field.
     * @returns (function} the validation function.
     */
    function _isarray(val, schema, prop_name) {
      if ({}.toString.call(val) === '[object Array]') {
        return val;
      }
      else {
        throw makeSchemaError(prop_name + ': "' + val + '" is not an array.');
      }
    }
    return _isarray;
  },


  isString: function() {
    /**
     * Returns function that determines if a value is a string or not.
     * @param {any} val the value from the configured field.
     * @returns (function} the validation function.
     */
    function _isstring(val, schema, prop_name) {
      if (typeof val === 'string') {
        return val;
      }
      else {
        throw makeSchemaError(prop_name + ': "' + val + '" is not a string.');
      }
    }
    return _isstring;
  },

  isDate: function() {
    /**
     * Returns function that determines if a value can be coerced into a
     * momentjs object or not.
     * @param {any} val the value from the configured field.
     * @returns (function} the validation function.
     */
    function _isdate(val, schema, prop_name) {
      const err = makeSchemaError(
        prop_name + ': "' + val + '" is not a valid date.'
      );
      // swallow Moment errors
      try {
        if (!moment(val).isValid()) {
          throw err;
        }
        return val;
      }
      catch(e) {
        throw err
      }
    }
    return _isdate;
  },

  isInteger: function() {
    /**
     * Returns function that determines if a value is an integer or not.
     * @param {any} val the value from the configured field.
     * @returns (function} the validation function.
     */
    function _isinteger(val, schema, prop_name) {
      if (typeof val === 'number' && !isNaN(val) && val % 1 === 0) {
        return val;
      }
      else {
        throw makeSchemaError(
          prop_name + ': "' + val + '" is not an integer.'
        );
      }
    }
    return _isinteger;
  },

  isNumber: function() {
    /**
     * Returns function that determines if a value is a Javascript Number 
     * or not.
     * @param {any} val the value from the configured field.
     * @returns (function} the validation function.
     */
    function _isnumber(val, schema, prop_name) {
      if (typeof val === 'number' && !isNaN(val)) {
        return val;
      }
      else {
        throw makeSchemaError(prop_name + ': "' + val + '" is not a number.');
      }
    }
    return _isnumber;
  },

  oneOf: function(def) {
    /**
     * Returns function that determines if a value is one of the provided 
     * values in the passed in array.
     * @param {any} val the value from the configured field.
     * @returns (function} the validation function.
     */
    function _oneof(val, schema, prop_name) {
      if (def.indexOf(val) === -1) {
        throw makeSchemaError(
          prop_name + ': "' + val + '" is not one of ' + def.toString());
      }
      return val;
    }
    return _oneof;
  },

  isHTML: function() {
    /**
     * Returns function that determines if a value appears to be an HTML tag.
     * @param {any} val the value from the configured field.
     * @returns (function} the validation function.
     */
    function _ishtml(val, schema, prop_name) {
      if(typeof val === 'string' && val.match(/<\/|\/>|<br>/)) {
        return val;
      }
      throw makeSchemaError(
        prop_name + ': "' + val + '" does not appear to have any html tags.'
      );
    }
    return _ishtml;
  },

  mustMatch: function(field_name) {
    /**
     * Returns function that determines if the value matches the value 
     * of the named field in the same object.
     * @param {any} val the value from the configured field.
     * @returns (function} the validation function.
     */
    function _mustmatch(val, schema, prop_name) {
      if(schema[field_name] !== val) {
        throw makeSchemaError(
          prop_name + ': "' + val + '" is not identical to value of "' + 
          field_name + '"'
        );
      }
      return val;
    }
    return _mustmatch;
  },

  mustNotMatch: function(field_name) {
    /**
     * Returns function that determines if the value does not match  the 
     * value of the named field in the same object.
     * @param {any} val the value from the configured field.
     * @returns (function} the validation function.
     */
    function _mustnotmatch(val, schema, prop_name) {
      // If a property doesn't exist/undefined then it by
      // definition doesn't match ....
      if(schema[field_name] === val) {
        throw makeSchemaError(
          prop_name + ': "' + val + '" is identical to value of "' + 
          field_name + '"'
        );
      }
      return val;
    }
    return _mustnotmatch;
  }
};
