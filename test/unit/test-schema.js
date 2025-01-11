// Tests for schema.js

// Built-in imports
import assert from 'assert';
import  test from 'node:test';

// sut imports 
import {
  isString,
  mustNotMatch,
  isNull,
  Any,
  All,
  Required,
  Optional,
  Schema
} from '../../index.js';

test('Test Schema.validate', async (t) => {
  
  await t.test('null object not valid.', () => {
    const sut = new Schema([[Required('one'), isNull()]]);
    sut.throw_errors = true;
    const expectation = new Error('Property "one" is required.');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate(null), expectation);
    
  });

  await t.test('empty object', () => {
    const sut = new Schema([
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
    
  });
  
  await t.test('null valid', () => {
    const sut = new Schema([
      [Optional('name'),  Any(isNull(), isString())],
      [Optional('label'),  isString()]
    ]);
    sut.throw_errors = true;
    const expectation = {
      name: null,
      label: 'probably not the right answer'
    };
    assert.deepStrictEqual(sut.validate(expectation), expectation);
    

  });

  await t.test('Optional/Required mixed keys  all valid', () => {
    const sut = new Schema([
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
    
  });

  await t.test('several keys one invalid.', () => {
    const sut = new Schema([
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
    const expectation = new Error('label: "" is not a string.');
    expectation.isSchemaError = true;
    assert.throws(()=>sut.validate(arg), expectation);
    
  });

  await t.test('multiple validators one invalid.', () => {
    const sut = new Schema([
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
    const expectation = new Error('label: "dolla" is identical to value of "name"');
    expectation.isSchemaError = true;
    assert.throws(()=>sut.validate(arg), expectation);
  
  });
  
  await t.test('nested schema good.', () => {
    const sut = new Schema([
      [Optional('name'),  isString()],
      [Required('label'), isString()],
      [Optional('group'),  new Schema([
        [Required('name'), isString()],
        [Required('tag'), isString()]
      ])],
      [Required('from'),  isString()],
      [Required('to'),  isString()],
    ]);
    sut.throw_errors = true;
    const arg = {
      name: 'dolla',
      label: 'dolla',
      group: { name: 'first', tag: 'first' },
      from: '$0.75',
      to: '$1.00'
    };
    assert.deepStrictEqual(sut.validate(arg), arg);
  });
  
  await t.test('nested schema nested error.', () => {
    const sut = new Schema([
      [Optional('name'),  isString()],
      [Required('label'), isString()],
      [Optional('group'),  new Schema([
        [Required('name'), isString()],
        [Required('tag'), isString()]
      ])],
      [Required('from'),  isString()],
      [Required('to'),  isString()],
    ]);
    sut.throw_errors = true;
    const arg = {
      name: 'dolla',
      label: 'dolla',
      group: { name: 'first', tag: 10 },
      from: '$0.75',
      to: '$1.00'
    };
    const expectation = new Error('tag: "10" is not a string.');
    expectation.isSchemaError = true;
    assert.throws(()=>sut.validate(arg), expectation);
  });
});
