// Tests for validator.js
// Required and Optional are well covered in schema tests
// Just perform test on un-tested atLeastNOf

// Third-party requires
var assert = require('assert');

// sut require
var isString = require('../../index.js').isString
var Schema = require('../../index.js').Schema
var {Required, Optional, AtLeastNOf} = require('../../index.js')

suite("Test properties.AtLeastNOf", function() {

    test("None found", function(done) {
        var sut = new Schema([
            [AtLeastNOf('name', ['pool', 'fool'], 1),  isString()],
            [Optional('label'),  isString()],
            [Optional('group'),  isString()],
            [Optional('from'),  isString()],
            [Optional('to'),  isString()],
        ]);
        sut.throw_errors = true
	const arg = {
            name: "Figs",
            from: '$0.75',
	}
        const expectation = new Error('Could not find 1 property names.')
        expectation.isSchemaError = true
        assert.throws(() =>sut.validate(arg), expectation);
        done();
    });

    test("One found", function(done) {
        var sut = new Schema([
            [Required('name'),  isString()],
            [Required('label'),  isString()],
            [Optional('group'),  isString()],
            [Optional('from', ['from', 'to'], 1),  isString()],
            [Optional('to'),  isString()],
        ]);
        sut.throw_errors = true
        const expectation = {
	    name: 'Figily',
            label: "Figs",
            from: '$0.75',
        };
        assert.deepStrictEqual(sut.validate(expectation), expectation);
        done();
    });
});
