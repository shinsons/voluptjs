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
  isSubSet,
  arrayOf,
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
  });

  await t.test('not regular expression', () => {
    try {
      new Schema([
        [Required('re'), matchRe('/^.+s')]
      ]);
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

test('Test validators.isSubSet', async (t) =>{

  let sut;
  t.before(() => { 
    sut = new Schema([
      [Required('roles'), isSubSet(['striper', 'nurse', 'doctor'])]
    ]);
  });

  await t.test('valid', () => {
    const expectation = {roles: ['striper', 'nurse']};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
  });
  
  await t.test('invalid not in definition', () => {
    const expectation = new Error('roles: "yeah" is not in striper,nurse,doctor');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({roles: ['yeah']}), expectation);
  });

  await t.test('invalid not Set castable', () => {
    assert.throws(
      () => sut.validate({roles: 10}),
      new TypeError('number 10 is not iterable (cannot read property Symbol(Symbol.iterator))')
    );
  });

});

test('Test validators.arrayOf Schema', async (t) =>{

  let sut;
  t.before(() => { 
    sut = new Schema([
      [Required('mob'), arrayOf( 
        new Schema([
          [Required('name'), isString()],
          [Required('role'), isString()]
        ])
      )]
    ]);
  });

  await t.test('one valid', () => {
    const expectation = { mob: [{ name: 'gravano', role: 'rat' }]};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
  });
  
  await t.test('multiple valid', () => {
    const expectation = { mob: [
      { name: 'gravano', role: 'rat' },
      { name: 'soprano', role: 'actor' }
    ]};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
  });

  await t.test('not an array', () => {
    const expectation = new Error('mob: "10" is either not an array or is empty.');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({ mob: 10 }), expectation); 
  });

  await t.test('not valid content', () => {
    const expectation = new Error('mob: "[object Object],[object Object]" threw: role: "8.9" is not a string.');
    expectation.isSchemaError = true;
    const toValidate = { mob: [
      { name: 'gravano', role: 8.9 },
      { name: 'soprano', role: 'actor' }
    ]};
    assert.throws(() => sut.validate(toValidate), expectation); 
  });

});

test('Test validators.arrayOf validator', async (t) =>{

  let sut;
  t.before(() => { 
    sut = new Schema([
      [Required('cheese'), arrayOf(isString())]
    ]);
  });

  await t.test('one valid', () => {
    const expectation = { cheese: ['grueyre']};
    assert.deepStrictEqual(sut.validate(expectation), expectation);
  });
  
  await t.test('multiple valid', () => {
    const expectation = { cheese: ['cheddar', 'american'] };
    assert.deepStrictEqual(sut.validate(expectation), expectation);
  });

  await t.test('not an array', () => {
    const expectation = new Error('cheese: "fotty" is either not an array or is empty.');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({ cheese: 'fotty' }), expectation); 
  });

  await t.test('not valid content', () => {
    const expectation = new Error('cheese: "stilton,[object Object]" threw: cheese: "[object Object]" is not a string.');
    expectation.isSchemaError = true;
    assert.throws(() => sut.validate({ cheese: ['stilton', { supply: 'bad'}] }), expectation); 
  });

});

test('Test validators.mustMatch', async (t) =>{

  let sut;
  t.before(() => {
    sut = new Schema([
      [Required('liberty'), mustMatch('giveme')],
      [Optional('giveme'), isString()]

    ]);
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
