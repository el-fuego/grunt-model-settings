/*
 * grunt-model-settings
 * https://github.com/denis/grunt-templates-concat
 *
 * Copyright (c) 2013 Yuriy Pulyaev
 * Licensed under the MIT license.
 */


module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            project: [
                'Gruntfile.js',
                'tasks/{**/,}*.js',
                '<%= nodeunit.tests %>'
            ]
        },

        // Configuration to be run (and then tested).
        modelSettings: {
            test: {
                options: {
                    prefix: 'Model.prototype',
                    // true:   {prefix} = {prop1: function(){..}, prop1: function(){..}}
                    // false:  {prefix}.prop1 = function(){..}; {prefix}.prop2 = function(){..}
                    singleDefinition: true
                },
                src:  [
                    'test/AppTest/*.{yaml,yml,json}'
                ],
                dest: 'test/AppTest/build.js'
            }
        },

        jsbeautifier: {
            files: [
                "test/AppTest/build.js"
            ],
            options: {
                js: {
                    braceStyle:              "collapse",
                    breakChainedMethods:     false,
                    e4x:                     false,
                    evalCode:                false,
                    indentChar:              " ",
                    indentLevel:             0,
                    indentSize:              4,
                    indentWithTabs:          false,
                    jslintHappy:             true,
                    keepArrayIndentation:    false,
                    keepFunctionIndentation: false,
                    maxPreserveNewlines:     10,
                    preserveNewlines:        true,
                    spaceBeforeConditional:  true,
                    spaceInParen:            false,
                    unescapeStrings:         false,
                    wrapLineLength:          0
                }
            }
        },

        test: {
            mergedOptions: {
                firstAttr: 'old',
                secondAttr: 'old'
            },
            array: ['old']
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['modelSettings:test', 'jsbeautifier', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint:project', 'test']);

};
