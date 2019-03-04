// Tests for validators.js

// Third-party requires
var assert = require('assert');

// sut requires
var {
  isArray,
  isString,
  isDate,
  isInteger,
  isNumber,
  oneOf,
  mustMatch,
  mustNotMatch,

} = require('../../index.js');
var Schema = require('../../index.js').Schema;
var {Required, Optional} = require('../../index.js');

suite('Test validators.isArray', function() {

  var sut = new Schema([
    [Required('arr'), isArray()]
  ]);
  sut.throw_errors = true;

  test('valid', function(done) {
    const expectation = {arr: [1,2,3]};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
    done();
  });

  test('invalid', function(done) {
    const expectation = new Error('"1" is not an array.');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({arr: 1}), expectation);
    done();
  });

});

suite('Test validators.isNumber', function() {

  var sut = new Schema([
    [Required('message'), isNumber()]
  ]);
  sut.throw_errors = true;

  test('valid', function(done) {
    const expectation = {message: 123.45};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
    done();
  });

  test('invalid', function(done) {
    const expectation = new Error('"" is not a number.');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({message: []}), expectation);
    done();
  });

});

suite('Test validators.isInteger', function() {

  var sut = new Schema([
    [Required('danumber'), isInteger()]
  ]);
  sut.throw_errors = true;

  test('valid', function(done) {
    const expectation = {danumber: 123};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
    done();
  });

  test('invalid', function(done) {
    const expectation = new Error('"123.45" is not an integer.');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({danumber: 123.45}), expectation);
    done();
  });

});

suite('Test validators.isString', function() {

  var sut = new Schema([
    [Required('message'), isString()]
  ]);
  sut.throw_errors = true;

  test('valid', function(done) {
    const expectation = {message: 'Harry Halladay'};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
    done();
  });

  test('invalid', function(done) {
    const expectation = new Error('"" is not a string.');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({message: []}), expectation);
    done();
  });

});

suite('Test validators.isDate', function() {

  var sut = new Schema([
    [Required('date'), isDate()]
  ]);
  sut.throw_errors = true;

  test('valid', function(done) {
    const expectation = {date: '2018-06-26T23:59:59Z'};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
    done();
  });

  test('invalid', function(done) {
    const expectation = new Error('"Harry Halladay" is not a valid date.');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({date: 'Harry Halladay'}), expectation);
    done();
  });

});

suite('Test validators.oneOf', function() {

  var sut = new Schema([
    [Required('liberty'), oneOf(['death', 'liberty'])]
  ]);
  sut.throw_errors = true;

  test('valid', function(done) {
    const expectation = {liberty: 'death'};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
    done();
  });

  test('invalid', function(done) {
    const expectation = new Error('"" is not one of death,liberty');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({liberty: []}), expectation);
    done();
  });

});

suite('Test validators.mustMatch', function() {

  var sut = new Schema([
    [Required('liberty'), mustMatch('giveme')],
    [Optional('giveme'), isString()]

  ]);
  sut.throw_errors = true;

  test('valid', function(done) {
    const expectation = {liberty: 'death', giveme: 'death'};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
    done();
  });

  test('invalid', function(done) {
    const expectation = new Error('"pillz" is not identical to value of "giveme"');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({liberty: 'pillz', giveme: []}), expectation);
    done();
  });

});

suite('Test validators.mustNotMatch', function() {

  var sut = new Schema([
    [Required('liberty'), mustNotMatch('giveme')],
    [Optional('giveme'), isString()]

  ]);
  sut.throw_errors = true;

  test('valid', function(done) {
    const expectation = {liberty: [], giveme: 'death'};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
    done();
  });

  test('invalid', function(done) {
    const expectation = new Error('"death" is identical to value of "giveme"');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({liberty: 'death', giveme: 'death'}), expectation);
    done();
  });

});
