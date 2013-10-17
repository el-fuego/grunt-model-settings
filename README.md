# grunt-model-settings

> Grunt plugin for build models rules functions from json/yaml files

It can be used for named rules declaration for statuses, types or another unreadable or preset model attributes


* <a href="#usage-example">Usage Example</a>
* <a href="#how-to-start">How to start</a>
* <a href="#advantage-configuring">Advantage configuring</a>
* <a href="#recommendations">Recommendations</a>


___
### Usage Example

```js
localSettings: {
    js: {
        options: {
            prefix: 'Model.prototype'
        },
        src:  [
            '*.{yaml,yml,json}'
        ],
        dest: 'build.js'
    }
};
```


#### options.prefix
Type: `String`
Default value: `''`

Namespace of your properties. Example:
*Model.prototype* = { isWeekend: function () {...} };




___
### How to start
<a href="https://github.com/el-fuego/grunt-concat-properties/tree/master/test/App">Sample project structure</a>


##### Installation

```shell
npm install grunt-model-settings --save-dev
```

Project Structure
https://github.com/el-fuego/grunt-model-settings/tree/master/test/AppTest

##### 1 Create the file with rules definitions.
Example for constructor:
```yaml
isWeekend:
  includeAny:
    - dayOfWeekName:    # -> (/^sat|^sun/i).test(dayOfWeekName)
      - '^sat'
      - '^sun'
    - dayOfWeek: '6'    # -> (/6/i).test(dayOfWeekName)
    - isSunday          # -> this.isSunday()
isSunday:
  includeAny:
    - dayOfWeek: 7      # -> (/7/i).test(dayOfWeek)
```

##### 2 Add modelSettings section to your Grunfile
see Usage Example


##### 3 Run task
```shell
grunt modelSettings
```

##### Result:
```js
Model.prototype = {
    isWeekend: function () {
        return ((/^sat|^sun/i).test(this.attributes.dayOfWeekName) || (/6/i).test(this.attributes.dayOfWeek) || this.isSunday());
    },
    isSunday: function () {
        return ((/7/i).test(this.attributes.dayOfWeek));
    }
};
```




___
### Project Structure
https://github.com/el-fuego/grunt-model-settings/tree/master/test/AppTest

Rules can be writed at JSON or YAML formats. Some example:

```yaml
isWeekend:
  includeAny:
    - dayOfWeekName:    # -> (/^sat|^sun/i).test(dayOfWeekName)
      - '^sat'
      - '^sun'
    - dayOfWeek: '6'    # -> (/6/i).test(dayOfWeekName)
    - isSunday          # -> this.isSunday()
isSunday:
  includeAny:
    - dayOfWeek: 7      # -> (/7/i).test(dayOfWeek)
```

result:

```js
Model.prototype = {
    isWeekend: function () {
        return ((/^sat|^sun/i).test(this.attributes.dayOfWeekName) || (/6/i).test(this.attributes.dayOfWeek) || this.isSunday());
    },
    isSunday: function () {
        return ((/7/i).test(this.attributes.dayOfWeek));
    }
};
```




___
### Advantage configuring

```js
grunt.initConfig({
    concatProperties: {
        myApp: {
            options: {
                prefix:           'Model.prototype'
                singleDefinition: true,
                rulePrefix:       'function () {\n return ',
                rulePostfix:      ';\n}',
                functionsScope:   'this',
                attributesScope:  'this.attributes'
            },

            src:  [
                '*.{yaml,yml,json}'
            ],
            dest: 'build.js'
        }
    }
};
```

#### options.singleDefinition
Type: `Boolean`
Default value: `true`

if *true* rules will be concated to object
```js
Model.prototype = {
    isWeekend: function () {...},
    isSunday: function () {...}
};
```

if *false* rules will be defined as functions
```js
Model.prototype.isWeekend: function () {...};
Model.prototype.isSunday:  function () {...};
```
Set this attribute to *false* using <a href="https://github.com/el-fuego/grunt-concat-properties">grunt-concat-properties</a>


#### options.rulePrefix
Type: `String`
Default value: `function () {\n return `

String before rule body:
isSunday: *function () { return* ((/7/i).test(this.attributes.dayOfWeek)); }


#### options.rulePostfix
Type: `String`
Default value: `;\n}`

String after rule body:
isSunday: function () { return ((/7/i).test(this.attributes.dayOfWeek))*; }*


#### options.functionsScope
Type: `String`
Default value: `this`

String before method call:
isWeekend: function () { return *this*.isSunday(); }


#### options.attributesScope
Type: `String`
Default value: `this.attributes`

String before attribute call:
isSunday: function () { return ((/7/i).test(*this.attributes*.dayOfWeek)); }



___
#### Recommendations
Use some like <a href="https://github.com/vkadam/grunt-jsbeautifier">grunt-jsbeautifier</a> to keep indentation at concated files
