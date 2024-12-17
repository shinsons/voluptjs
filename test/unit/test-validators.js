// Tests for validators.js

// Built-in imports
import assert from 'assert';
import  test from 'node:test';


// sut requires
import {
  isArray,
  isString,
  isDate,
  isInteger,
  isNumber,
  matchRe,
  oneOf,
  mustMatch,
  mustNotMatch,
  Schema,
  Required,
  Optional

} from '../../index.js';

test('Test validators.isArray', async (t) => {
  
  let sut;
  t.before(() => {
    sut = new Schema([
      [Required('arr'), isArray()]
    ]);
    sut.throw_errors = true;
  });

  await t.test('valid', () => {
    const expectation = {arr: [1,2,3]};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
  });

  await t.test('invalid', () => {
    const expectation = new Error('arr: "1" is not an array.');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({arr: 1}), expectation);
  });

});

test('Test validators.isNumber', async (t) =>{

  let sut;
  t.before(() => {
    sut = new Schema([
      [Required('message'), isNumber()]
    ]);
    sut.throw_errors = true;
  });

  await t.test('valid', () => {
    const expectation = {message: 123.45};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
  });

  await t.test('invalid', () => {
    const expectation = new Error('message: "" is not a number.');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({message: []}), expectation);
  });

});

test('Test validators.isInteger', async (t) =>{

  let sut;
  t.before(() => {
    sut = new Schema([
      [Required('danumber'), isInteger()]
    ]);
    sut.throw_errors = true;
  });

  await t.test('valid', () => {
    const expectation = {danumber: 123};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
  });

  await t.test('invalid', () => {
    const expectation = new Error('danumber: "123.45" is not an integer.');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({danumber: 123.45}), expectation);
  });

});

test('Test validators.isString', async (t) =>{

  let sut;
  t.before(() => {
    sut = new Schema([
      [Required('message'), isString()]
    ]);
    sut.throw_errors = true;
  });

  await t.test('valid', () => {
    const expectation = {message: 'Harry Halladay'};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
    
  });

  await t.test('invalid', () => {
    const expectation = new Error('message: "" is not a string.');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({message: []}), expectation);
    
  });

});

test('Test validators.isDate', async (t) =>{

  let sut;
  t.before(() => {
    sut = new Schema([
      [Required('date'), isDate()]
    ]);
    sut.throw_errors = true;
  });

  await t.test('valid', () => {
    const expectation = { date:  new Date('2018-06-26T23:59:59Z') };
    assert.deepStrictEqual(sut.validate(expectation), expectation);
  });

  await t.test('invalid', () => {
    const expectation = new Error(
      'date: "Harry Halladay" is not a valid date.'
    );
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({date: 'Harry Halladay'}), expectation);
  });
});

test('Test validators.matchRe', async (t) =>{

  let sut;
  t.before(() => {
    sut = new Schema([
      [Required('re'), matchRe(/^.+s$/)]
    ]);
    sut.throw_errors = true;
  });

  await t.test('not regular expression', () => {
    try {
      const invalid = new Schema([
        [Required('re'), matchRe('/^.+s')]
      ]);
      invalid.throw_errors = true;
      assert.fail('Invalid RegExp did not throw.');
    }
    catch(e) {
      assert.strictEqual(
        e.message, 'the value "/^.+s" is not a regular expression.'
      );
    }
  });

  await t.test('valid', () => {
    const expectation = {re: 'poops'};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
  });

  await t.test('invalid', () => {
    const expectation = new Error(
      're: "1000" does not match /^.+s$/.'
    );
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({re: 1000}), expectation);
  });

});

test('Test validators.oneOf', async (t) =>{

  let sut;
  t.before(() => {
    sut = new Schema([
      [Required('liberty'), oneOf(['death', 'liberty'])]
    ]);
    sut.throw_errors = true;
  });

  await t.test('valid', () => {
    const expectation = {liberty: 'death'};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
  });

  await t.test('invalid', () => {
    const expectation = new Error('liberty: "" is not one of death,liberty');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({liberty: []}), expectation);
  });

});

test('Test validators.oneOf with callable', async (t) =>{

  let sut;
  t.before(() => { 
    function DoctorEvil() {
      this.name = 'Evil';
      this.threaten = () =>{
        return ['one', 'million', 'dollars'];
      };
    }
    const evilette = new DoctorEvil();
    sut = new Schema([
      [Required('line'), oneOf(evilette.threaten.bind(evilette))]
    ]);
    sut.throw_errors = true;
  });

  await t.test('valid', () => {
    const expectation = {line: 'million'};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
  });

  await t.test('invalid', () => {
    const expectation = new Error('line: "yeah" is not one of one,million,dollars');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({line: 'yeah'}), expectation);
  });

});

test('Test validators.mustMatch', async (t) =>{

  let sut;
  t.before(() => {
    sut = new Schema([
      [Required('liberty'), mustMatch('giveme')],
      [Optional('giveme'), isString()]

    ]);
    sut.throw_errors = true;
  });

  await t.test('valid', () => {
    const expectation = {liberty: 'death', giveme: 'death'};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
  });

  await t.test('invalid', () => {
    const expectation = new Error(
      'liberty: "pillz" is not identical to value of "giveme"'
    );
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate(
      {liberty: 'pillz', giveme: []}), expectation
    );
  });

});

test('Test validators.mustNotMatch', async (t) =>{

  let sut;
  t.before(() => {
    sut = new Schema([
      [Required('liberty'), mustNotMatch('giveme')],
      [Optional('giveme'), isString()]

    ]);
    sut.throw_errors = true;
  });

  await t.test('valid', () => {
    const expectation = {liberty: [], giveme: 'death'};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
  });

  await t.test('invalid', () => {
    const expectation = new Error(
      'liberty: "death" is identical to value of "giveme"'
    );
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate(
      {liberty: 'death', giveme: 'death'}), expectation
    );
  });

});
