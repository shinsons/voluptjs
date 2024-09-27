// Tests for validators.js

// Third-party requires
const assert = require('assert');

// sut requires
const {
  isArray,
  isString,
  isDate,
  isInteger,
  isNumber,
  matchRe,
  oneOf,
  mustMatch,
  mustNotMatch,

} = require('../../index.js');
const Schema = require('../../index.js').Schema;
const {Required, Optional} = require('../../index.js');

suite('Test validators.isArray', function() {

  const sut = new Schema([
    [Required('arr'), isArray()]
  ]);
  sut.throw_errors = true;

  test('valid', function(done) {
    const expectation = {arr: [1,2,3]};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
    done();
  });

  test('invalid', function(done) {
    const expectation = new Error('arr: "1" is not an array.');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({arr: 1}), expectation);
    done();
  });

});

suite('Test validators.isNumber', function() {

  const sut = new Schema([
    [Required('message'), isNumber()]
  ]);
  sut.throw_errors = true;

  test('valid', function(done) {
    const expectation = {message: 123.45};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
    done();
  });

  test('invalid', function(done) {
    const expectation = new Error('message: "" is not a number.');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({message: []}), expectation);
    done();
  });

});

suite('Test validators.isInteger', function() {

  const sut = new Schema([
    [Required('danumber'), isInteger()]
  ]);
  sut.throw_errors = true;

  test('valid', function(done) {
    const expectation = {danumber: 123};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
    done();
  });

  test('invalid', function(done) {
    const expectation = new Error('danumber: "123.45" is not an integer.');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({danumber: 123.45}), expectation);
    done();
  });

});

suite('Test validators.isString', function() {

  const sut = new Schema([
    [Required('message'), isString()]
  ]);
  sut.throw_errors = true;

  test('valid', function(done) {
    const expectation = {message: 'Harry Halladay'};
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

suite('Test validators.isDate', function() {

  const sut = new Schema([
    [Required('date'), isDate()]
  ]);
  sut.throw_errors = true;

  test('valid', function(done) {
    const expectation = {date: '2018-06-26T23:59:59Z'};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
    done();
  });

  test('invalid', function(done) {
    const expectation = new Error(
      'date: "Harry Halladay" is not a valid date.'
    );
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({date: 'Harry Halladay'}), expectation);
    done();
  });

});

suite('Test validators.matchRe', function() {

  const sut = new Schema([
    [Required('re'), matchRe(/^.+s$/)]
  ]);
  sut.throw_errors = true;

  test('not regular expression', function(done) {
    try {
      const invalid = new Schema([
        [Required('re'), matchRe('/^.+s')]
      ]);
      invalid.throw_errors = true;
      assert.fail('Invalid RegExp did not throw.');
      done();
    }
    catch(e) {
      assert.strictEqual(
        e.message, 'the value "/^.+s" is not a regular expression.'
      );
      done();
    }
  });

  test('valid', function(done) {
    const expectation = {re: 'poops'};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
    done();
  });

  test('invalid', function(done) {
    const expectation = new Error(
      're: "1000" does not match /^.+s$/.'
    );
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({re: 1000}), expectation);
    done();
  });

});

suite('Test validators.oneOf', function() {

  const sut = new Schema([
    [Required('liberty'), oneOf(['death', 'liberty'])]
  ]);
  sut.throw_errors = true;

  test('valid', function(done) {
    const expectation = {liberty: 'death'};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
    done();
  });

  test('invalid', function(done) {
    const expectation = new Error('liberty: "" is not one of death,liberty');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({liberty: []}), expectation);
    done();
  });

});

suite('Test validators.oneOf with callable', function() {
  function DoctorEvil() {
    this.name = 'Evil';
    this.threaten = function() {
      return ['one', 'million', 'dollars']
    }
  };
  const evilette = new DoctorEvil();
  const sut = new Schema([
    [Required('line'), oneOf(evilette.threaten.bind(evilette))]
  ]);
  sut.throw_errors = true;

  test('valid', function(done) {
    const expectation = {line: 'million'};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
    done();
  });

  test('invalid', function(done) {
    const expectation = new Error('line: "yeah" is not one of one,million,dollars');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({line: 'yeah'}), expectation);
    done();
  });

});

suite('Test validators.mustMatch', function() {

  const sut = new Schema([
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
    const expectation = new Error(
      'liberty: "pillz" is not identical to value of "giveme"'
    );
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate(
      {liberty: 'pillz', giveme: []}), expectation
    );
    done();
  });

});

suite('Test validators.mustNotMatch', function() {

  const sut = new Schema([
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
    const expectation = new Error(
      'liberty: "death" is identical to value of "giveme"'
    );
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate(
      {liberty: 'death', giveme: 'death'}), expectation
    );
    done();
  });

});
