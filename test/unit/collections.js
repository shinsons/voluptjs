// Tests for collections.js

// Third-party requires
const assert = require('assert');

// sut requires
const {
  isString,
  isNumber,
  oneOf,
  All,
  Any
} = require('../../index.js');
const Schema = require('../../index.js').Schema;
const Required = require('../../index.js').Required;

suite('Test collections.All', function() {
  const sut = new Schema([
    [Required('liberty'), All(isString(), oneOf(['death', 'liberty']))]
  ]);
  sut.throw_errors = true;

  test('valid', function(done) {
    const expectation = {liberty: 'death'};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
    done();
  });

  test('invalid', function(done) {
    const expectation = new Error('liberty: "wagon" is not one of death,liberty');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({liberty: 'wagon'}), expectation);
    done();
  });

});

suite('Test collections.Any', function() {

  const sut = new Schema([
    [Required('message'), Any(isNumber(), isString())]
  ]);
  sut.throw_errors = true;

  test('valid', function(done) {
    const expectation = {message: 123.45};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
    done();
  });

  test('invalid', function(done) {
    const expectation = new Error('message: "" is not a string.');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({message: []}), expectation);
    done();
  });

});

