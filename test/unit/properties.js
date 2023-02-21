// Tests for properties.js

// Third-party requires
const assert = require('assert');

// sut requires
const { isString } = require('../../index.js');
const Schema = require('../../index.js').Schema;
const { Required, Optional, OneOf } = require('../../index.js');

suite('Test properties.Optional', function() {
  const sut = new Schema([
    [Optional('name'),  isString()],
    [Required('label'),  isString()],
    [Optional('group'),  isString()],
    [Required('from'),  isString()],
    [Required('to'),  isString()],
  ]);
  sut.throw_errors = true;

  test('field present, another not present', function(done) {
    const expectation = {
      name: 'oz',
      label: 'yes',
      from: '$0.75',
      to: '$1.00'
    };
    assert.deepStrictEqual(sut.validate(expectation), expectation);
    done();
  });

  test('field present invalid', function(done) {
    const payload = {
      name: 1234,
      label: 'yes',
      from: '$0.75',
      to: '$1.00'
    };
    const expectation = new Error('name: "1234" is not a string.');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate(payload), expectation);
    done();
  });

  test('field property present', function(done) {
    assert.strictEqual(
      Array.from(sut._map.entries())[0][0].field,
      'name'
    )
    done();
  });
});

suite('Test properties.Required', function() {

  test('field missing', function(done) {
   
    const sut = new Schema([
      [Optional('name'),  isString()],
      [Required('label'),  isString()],
      [Optional('group'),  isString()],
      [Required('from'),  isString()],
      [Required('to'),  isString()],
    ]);
    sut.throw_errors = true;

    const payload = {
      name: 'pants',
      from: '$0.75',
      to: '$1.00'
    };
    const expectation = new Error('Property "label" is required.');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate(payload), expectation);
    assert.strictEqual(
      Array.from(sut._map.entries())[0][0].field,
      'name'
    );
    done();
  });
});

suite('Test properties.OneOf', function() {

  test('regex field matches and valid', function(done) {
    
    const sut = new Schema([
      [Optional('name'),  isString()],
      [OneOf(/^\w{2}$/),  isString()],
      [Optional('group'),  isString()],
      [Required('from'),  isString()],
    ]);
    const expectation = {
      name: 'oz',
      ww: 'yes',
      from: '$0.75',
    };
    sut.throw_errors = true;
    assert.deepStrictEqual(sut.validate(expectation), expectation);
    assert.equal(
      Array.from(sut._map.entries())[1][0].field.toString(),
      /^\w{2}$/.toString()
    );
    done();
  });
  
  test('regex field no match  and valid', function(done) {
    
    const sut = new Schema([
      [Optional('name'),  isString()],
      [OneOf(/^\w{2}$/),  isString()],
      [Optional('group'),  isString()],
      [Required('from'),  isString()],
    ]);
    sut.throw_errors = true;
    const payload = {
      name: 'pants',
      from: '$0.75',
      label: '$1.00'
    };
    const expectation = new Error('No property matches RegExp /^\\w{2}$/.');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate(payload), expectation);
    done();

  });
  
  test('multiple regex field matches, one valid, one not.', function(done) {
    
    const sut = new Schema([
      [Optional('name'),  isString()],
      [OneOf(/^\w{2}$/),  isString()],
      [Optional('group'),  isString()],
      [Required('from'),  isString()],
    ]);
    sut.throw_errors = true;
    const payload = {
      name: 'oz',
      ww: 'yes',
      to: 1234,
      from: '$0.75',
    };
    const expectation = new Error('to: "1234" is not a string.');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate(payload), expectation);
    done();

  });
});
