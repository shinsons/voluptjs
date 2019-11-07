// Schema definition

// local requires
var makeSchemaError = require('./error.js').makeSchemaError;

module.exports = {
  Schema: function(definition) {
    const self = this;  

    self.is_schema = true;

    self.throw_errors = false;

    self.errors = [];
      
    self._map = new Map(definition);

    self._run_validator = function(property, validator, obj) {
      if(validator.is_schema) {
        return validator.validate(obj[property], obj);
      }
      // run multiple validators
      if(validator.constructor.name === 'Collection') {
        return validator.outcome(property, obj);
      }
      return validator(obj[property], obj, property);
    };

    self.validate = function(obj) {
      // empty objects aren't valid
      if(obj && Object.keys(obj).length === 0 && obj.constructor === Object) {
        throw makeSchemaError('An empty object isn\'t valid.');
      }
      let valid = {};
      let k;
      // keys not in definition are automatically dropped.
      for (let [kobj, validator] of self._map.entries()) {
        // entire obj is passed in, in case validator wants
        // to inspect other properties to determine validity.
        try {
          k = kobj(obj);
        }
        catch(err) {
          if(err.is_optional) {
            continue;
          }
          if(self.throw_errors) {
            throw err;
          }
          else {
            self.errors.push(err);
            continue;
          }
        }
        try {
          // may match more than one property on an object. Check them all.
          if (kobj.name === '_oneof') {
            for( let p in obj) { 
              valid[p] = self._run_validator(p, validator, obj);
            }
          }
          else {
            valid[k] = self._run_validator(k, validator, obj);
          }
        }
        catch(err) {
          if(self.throw_errors) {
            throw err;
          }
          else {
            self.errors.push(err);
          }
        }
      }
      return valid;
    };
  }
};
