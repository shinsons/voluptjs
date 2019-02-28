// Collection prototype and instances
//

function Collection() {
  let self = this;
 
  self.validators = [...arguments];

  self._run_validators = function(property, obj) {
    let errors = []
    debugger
    for(let i in self.validators) {
      try {
        self.validators[i](obj[property], obj);
      }
      catch(err) {
        errors.push(err)
      }
    }
    return errors
  };
};

function All() {
  function _all() {
    let self = this;

    self.outcome = function(property, obj) {
      debugger
      let errors = self._run_validators(property, obj);
      if (errors.length !== 0) {
        throw errors.pop()
      }
      return obj[property]
    };
  };
  _all.prototype = new Collection(...arguments);
  return new _all()
};


function Any() {
  function _any() {
    let self = this;

    self.outcome = function(property, obj) {
      let errors = self._run_validators(property, obj);
      if (errors.length === self.validators.length) {
        throw errors.pop()
      }
      return obj[property]
    };
  };
  _any.prototype = new Collection(...arguments);
  return new _any()
};

module.exports = { All, Any };
