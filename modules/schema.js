// Schema definition

// local requires
var makeSchemaError = require('./error.js').makeSchemaError

module.exports = {
    Schema: function(definition) {
    
    	this.is_schema = true;

        this.throw_errors = false;

        this.errors = [];
        
        this._map = new Map(definition)

        this._run_validator = function(property, validator, obj) {
            try {
              return validator(obj[property], obj);
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

        this.validate = function(obj) {
            // empty objects aren't valid
            if(obj && Object.keys(obj).length === 0 && obj.constructor === Object) {
                throw makeSchemaError('An empty object isn\'t valid.');
            };
            var valid = {}
            // keys not in definition are automatically dropped.
            for (var [kobj, validator] of this._map.entries()) {
                // entire obj is passed in in-case validator wants
                // to inspect other properties to determine validity.
                try {
                    var k = kobj(obj)
                }
                catch(err) {
                    if(err.is_optional) {
                        continue
                    }
                    if(this.throw_errors) {
                        throw err;
                    }
                    else {
                        this.errors.push(err);
                        continue
                    }
                }
                if(validator.is_schema) {
                    valid[k] = validator.validate(obj[k], obj)
                }
                else {
                    var result 
                    // run multiple validators
                    if({}.toString.call(validator) === '[object Array]') {
                        for(var i in validator) {
                            result = this._run_validator(k, validator[i], obj)
                        }
                    }
                    else {
                        result = this._run_validator(k, validator, obj)
                    }

                }
                valid[k] = result
            }
            return valid
        }
    }
}
