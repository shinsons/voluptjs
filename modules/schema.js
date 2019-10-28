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
      try {
        return validator(obj[property], obj, property);
      }
      catch(err) {
        if(self.throw_errors) {
          throw err;
        }
        else {
          self.errors.push(err);
        }
      }
    };

    self.validate = function(obj) {
      // empty objects aren't valid
      if(obj && Object.keys(obj).length === 0 && obj.constructor === Object) {
        throw makeSchemaError('An empty object isn\'t valid.');
      }
      var valid = {};
      // keys not in definition are automatically dropped.
      for (var [kobj, validator] of self._map.entries()) {
        // entire obj is passed in, in case validator wants
        // to inspect other properties to determine validity.
        try {
          var k = kobj(obj);
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
        if(validator.is_schema) {
          valid[k] = validator.validate(obj[k], obj);
        }
        else {
          let result; 
          // run multiple validators
          if(validator.constructor.name === 'Collection') {
            try {
              result = validator.outcome(k, obj);
            }
            catch (err) {
              if(self.throw_errors) {
                throw err;
              }
              else {
                self.errors.push(err);
              }
            }
          }
          else {
            result = self._run_validator(k, validator, obj);
          }
          valid[k] = result;
        }
      }
      return valid;
    };
  }
};
