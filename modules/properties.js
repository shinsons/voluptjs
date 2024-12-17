// Property conditions/valiators/rules
//
// local imports 
import makeSchemaError from './error.js';

export function OneOf(regex) {
  function _oneof(obj) {
    for(const p in obj) {
      if(regex.test(p)) {
        return p;
      }
    }
    throw makeSchemaError(`No property matches RegExp ${regex}.`);
  }
  _oneof.field = regex;
  return _oneof;
};

export function Required(field_name) {
  function _required(obj) {
    if(!obj || !Object.getOwnPropertyDescriptor(obj, field_name)) {
      throw makeSchemaError(`Property "${field_name}" is required.`);
    }
    return field_name;
  }
  _required.field = field_name;
  return _required;
};

export function Optional(field_name) {
  function _optional(obj) { 
    if(!obj || !Object.getOwnPropertyDescriptor(obj, field_name)) {
      var err = new Error();
      err.is_optional = true;
      throw err;
    }
    return field_name;
  }
  _optional.field = field_name;
  return _optional;
};
            
