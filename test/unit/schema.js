// Tests for schema.js

// Third-party requires
var assert = require('assert');

// sut require
var Schema = require('../../index.js').Schema;
var {isString, mustNotMatch, isNull, Any, All} = require('../../index.js');
var {Required, Optional} = require('../../index.js');

suite('Test Schema.validate', function() {

  test('null object not valid.', function(done) {
    const sut = new Schema([[Required('one'), isNull()]]);
    sut.throw_errors = true;
    const expectation = new Error('Property "one" is required.');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate(null), expectation);
    done();
  });

  test('empty object', function(done) {
    var sut = new Schema([
      [Optional('name'),  isString()],
      [Optional('label'),  isString()],
      [Optional('group'),  isString()],
      [Optional('from'),  isString()],
      [Optional('to'),  isString()]
    ]);
    sut.throw_errors = true;
    const expectation = new Error('An empty object isn\'t valid.');
    expectation.isSchemaError = true;
    assert.throws(() =>sut.validate({}), expectation);
    done();
  });

  test('null valid', function(done) {
    var sut = new Schema([
      [Optional('name'),  Any(isNull(), isString())],
      [Optional('label'),  isString()]
    ]);
    sut.throw_errors = true;
    const expectation = {
      name: null,
      label: 'probably not the right answer'
    };
    assert.deepStrictEqual(sut.validate(expectation), expectation);
    done();

  });

  test('Optional/Required mixed keys  all valid', function(done) {
    var sut = new Schema([
      [Optional('name'),  isString()],
      [Required('label'),  isString()],
      [Optional('group'),  isString()],
      [Required('from'),  isString()],
      [Required('to'),  isString()],
    ]);
    sut.throw_errors = true;
    const expectation = {
      label: 'Figs',
      from: '$0.75',
      to: '$1.00'
    };
    assert.deepStrictEqual(sut.validate(expectation), expectation);
    done();
  });

  test('several keys one invalid.', function(done) {
    var sut = new Schema([
      [Optional('name'),  isString()],
      [Required('label'),  isString()],
      [Optional('group'),  isString()],
      [Required('from'),  isString()],
      [Required('to'),  isString()],
    ]);
    sut.throw_errors = true;
    const arg = {
      label: [],
      from: '$0.75',
      to: '$1.00'
    };
    const expectation = new Error('"" is not a string.');
    expectation.isSchemaError = true;
    assert.throws(()=>sut.validate(arg), expectation);
    done();
  });

  test('multiple validators one invalid.', function(done) {
    var sut = new Schema([
      [Optional('name'),  isString()],
      [Required('label'),  All(mustNotMatch('name'), isString())],
      [Optional('group'),  isString()],
      [Required('from'),  isString()],
      [Required('to'),  isString()],
    ]);
    sut.throw_errors = true;
    const arg = {
      name: 'dolla',
      label: 'dolla',
      from: '$0.75',
      to: '$1.00'
    };
    const expectation = new Error('"dolla" is identical to value of "name"');
    expectation.isSchemaError = true;
    assert.throws(()=>sut.validate(arg), expectation);
    done();
  });
});
