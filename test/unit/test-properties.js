// Tests for properties.js

// Built-in imports
import assert from 'assert';
import  test from 'node:test';

// sut imports 
import {
  isString,
  Required,
  Optional,
  OneOf,
  Schema
} from '../../index.js';

test('Test properties.Optional', async (t) => {

  let sut;
  t.before(() => { 
    sut = new Schema([
      [Optional('name'),  isString()],
      [Required('label'),  isString()],
      [Optional('group'),  isString()],
      [Required('from'),  isString()],
      [Required('to'),  isString()],
    ]);
    sut.throw_errors = true;
  });

  await t.test('field present, another not present', () => {
    const expectation = {
      name: 'oz',
      label: 'yes',
      from: '$0.75',
      to: '$1.00'
    };
    assert.deepStrictEqual(sut.validate(expectation), expectation);
  });

  await t.test('field present invalid', () => {
    const payload = {
      name: 1234,
      label: 'yes',
      from: '$0.75',
      to: '$1.00'
    };
    const expectation = new Error('name: "1234" is not a string.');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate(payload), expectation);
  });

  await t.test('field property present', () => {
    assert.strictEqual(
      Array.from(sut._map.entries())[0][0].field,
      'name'
    );
  });
});

test('Test properties.Required', async (t) => {

  await t.test('field missing', () => {
   
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
  });
});

test('Test properties.OneOf', async (t) => {

  await t.test('regex field matches and valid', () => {
    
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
  });
  
  await t.test('regex field no match  and valid', () => {
    
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
  });
  
  await t.test('multiple regex field matches, one valid, one not.', () => {
    
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
  });
});
