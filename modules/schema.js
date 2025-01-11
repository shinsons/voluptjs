// Schema definition

// local imports 
import makeSchemaError from './error.js';

class Schema {
  
  constructor(definition) {
    this.is_schema = true;
    this.throw_errors = true;
    this.errors = [];
    this._map = new Map(definition);
  }

  _run_validator(property, validator, obj) {
    if(validator.is_schema) {
      // re-declare this property to ensure that no one else has
      // set this to false which will not produce proper behavior in 
      // nested schemas.
      validator.throw_errors = true;
      return validator.validate(obj[property]);
    }
    // run multiple validators
    if(validator.constructor.name === 'Collection') {
      return validator.outcome(property, obj);
    }
    return validator(obj[property], obj, property);
  }

  validate(obj) {
    // empty objects aren't valid
    if(obj && Object.keys(obj).length === 0 && obj.constructor === Object) {
      throw makeSchemaError('An empty object isn\'t valid.');
    }
    let valid = {};
    let k;
    // keys not in definition are automatically dropped.
    for (let [kobj, validator] of this._map.entries()) {
      // entire obj is passed in, in case validator wants
      // to inspect other properties to determine validity.
      try {
        k = kobj(obj);
      }
      catch(err) {
        if(err.is_optional) {
          continue;
        }
        if(this.throw_errors) {
          throw err;
        }
        else {
          this.errors.push(err);
          continue;
        }
      }
      try {
        // may match more than one property on an object. Check them all.
        if (kobj.name === '_oneof') {
          for( let p in obj) { 
            valid[p] = this._run_validator(p, validator, obj);
          }
        }
        else {
          valid[k] = this._run_validator(k, validator, obj);
        }
      }
      catch(err) {
        if(this.throw_errors) {
          throw err;
        }
        else {
          this.errors.push(err);
        }
      }
    }
    return valid;
  }
};

export { Schema };
