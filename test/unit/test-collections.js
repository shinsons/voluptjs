// Tests for collections.js

// Built-in imports
import assert from 'assert';
import  test from 'node:test';

// sut imports 
import {
  isString,
  isNumber,
  oneOf,
  All,
  Any,
  Required,
  Schema
} from '../../index.js';
/* Even though none of the callables are async, the test rig assumes
 * async code and async/await tokens appear necessary to successfully
 * run the `before` subtest hook. If this proves to become untrue in the
 * future, please remove the spurious async/await tokens.
 */

test('Test collections.All', async (t) => {
  let sut;
  t.before(() => { 
    sut = new Schema([
      [Required('liberty'), All(isString(), oneOf(['death', 'liberty']))]
    ]);
    sut.throw_errors = true;
  });

  await t.test('valid', () => {
    const expectation = {liberty: 'death'};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
  });

  await t.test('invalid', () => {
    const expectation = new Error('liberty: "wagon" is not one of death,liberty');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({liberty: 'wagon'}), expectation);
  });

});

test('Test collections.Any', async (t) => {
  let sut;
  t.before( () => { 
    sut = new Schema([
      [Required('message'), Any(isNumber(), isString())]
    ]);
    sut.throw_errors = true;
  });

  await t.test('valid', () => {
    const expectation = {message: 123.45};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
  });

  await t.test('invalid', () => {
    const expectation = new Error('message: "" is not a string.');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({message: []}), expectation);
  });
});
