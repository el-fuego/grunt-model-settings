/*
 * grunt-model-settings
 * https://github.com/el-fuego/grunt-model-settings
 *
 * Copyright (c) 2013 Yuriy Pulyaev
 * Licensed under the MIT license.
 */
module.exports = function (grunt) {
    'use strict';

    var options,
        reservedWords = [
            'true',
            'false',
            'null'
        ];

    /**
     * Read and parse file structure
     * @param filePath {String}
     * @returns {Object}
     */
    function getSettings(filePath) {

        if ((/\.json$/i).test(filePath)) {
            return grunt.file.readJSON(filePath);
        }

        if ((/\.ya?ml/i).test(filePath)) {
            return grunt.file.readYAML(filePath);
        }

        grunt.log.error('can`t recognize file type: ' + filePath);
    }


    /**
     * Add () to method names
     * @param rule {string}
     * @returns {*}
     */
    function addMethodCalls(rule) {
        return rule.replace(/([a-z_0-9]+)(\s|\)|$)/gi, options.functionsScope + '.$1()$2');
    }


    /**
     * Return rule like (/some/i).test(this.attributes.name)
     * @param attributeName
     * @param rules
     * @returns {string}
     */
    function buildRegExpRule(attributeName, rules) {
        return '(/' + (rules instanceof Array ? rules.join('|') : rules) +
            '/i).test(' + options.attributesScope + '.' + attributeName + ')';
    }


    /**
     * Build rules Array
     * @param data {[{Object|String}]|String}
     * 'firstMethod && secondMethod'
     * ['firstMethod', 'secondMethod']
     * [{attributeName: ['rule1', 'rule2']}, ..]
     *
     * @returns [{String}]
     */
    function getRules(data) {
        var i = 0, attributeName, l, rules = [];

        if (data === undefined) {
            return [];
        }
        // make function return true|false|null
        if (data === null || typeof(data) === 'boolean') {
            return [data + ''];
        }
        if (typeof data === 'string') {

            // make function return true|false|null
            // if data is string
            if (reservedWords.indexOf(data) >= 0) {
                return [data];
            }
            return [addMethodCalls(data)];
        }
        for (l = data.length; i < l; i++) {
            // "methodName"
            if (typeof data[i] === 'string') {
                rules.push(addMethodCalls(data[i]));
            // {attributeName: [], ..}
            } else {

                for (attributeName in data[i]) {
                    rules.push(buildRegExpRule(attributeName, data[i][attributeName]));
                }
            }
        }

        return rules;
    }


    /**
     *
     * @param data {Object|String}
     * @param [data.include] see getRule(data)
     * @param [data.exclude] see getRule(data
     * @returns {string}
     */
    function getFunction(data) {

        var rules = [],
            includeRules,
            excludeRules;

        // data = '(firstMethod && secondMethod) || thirdMethod' || true
        if (typeof data === 'string' || data == null || typeof data === 'boolean') {
            rules.push(getRules(data));

        // data = { include: [..], exclude: [..] }
        } else {
            includeRules = getRules(data.includeAny);
            if (includeRules.length) {
                rules.push('(' + includeRules.join(' || ') + ')');
            }
            excludeRules = getRules(data.excludeAny);
            if (excludeRules.length) {
                rules.push('!(' + excludeRules.join(' || ') + ')');
            }
        }

        return options.rulePrefix + rules.join(' && ') + options.rulePostfix;
    }


    /**
     * Build string with functions definitions
     * @param functions {Object}
     * @returns {string}
     */
    function joinFunctions(functions) {
        var i, functionsList = [];

        if (options.singleDefinition) {
            for (i in functions) {
                functionsList.push(i + ': ' + functions[i]);
            }
            return options.prefix + ' = {\n' + functionsList.join(',\n') + '\n};';
        }

        for (i in functions) {
            functionsList.push(options.prefix + '.' + i + ' = ' + functions[i]);
        }
        return functionsList.join(';\n\n') + ';';
    }


    grunt.registerMultiTask('modelSettings', 'Make methods from settings files', function () {

        options = this.options({
            prefix: 'Model.prototype',
            singleDefinition: true,
            rulePrefix: 'function () {\n return ',
            rulePostfix: ';\n}',
            functionsScope: 'this',
            attributesScope: 'this.attributes'
        });

        this.files.forEach(function (file) {
            // {
            //  prop: {..},
            //  ..
            // }
            var settings = {},
                i;

            file.src.forEach(function (path) {
                grunt.log.writeln(path);
                grunt.util._.extend(settings, getSettings(path));
                grunt.log.ok();
            });

            // build rules functions
            for (i in settings) {
                settings[i] = getFunction(settings[i]);
            }

            // write file(s)
            grunt.file.write(file.dest, joinFunctions(settings));
        });

    });
};
