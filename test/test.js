var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.templates_concat = {
    setUp: function (done) {
        'use strict';

        // setup here if necessary
        done();
    },
    testIt: function (test) {
        'use strict';

        test.expect(1);

        var actual = (grunt.file.read('test/AppTest/build.js') || '').replace(/[ \t]+/g, ''),
            expected = (grunt.file.read('test/expected/build.js') || '').replace(/[ \t]+/g, '');
        test.equal(actual, expected, 'Build file isn`t like an expected');

        test.done();
    }
};
