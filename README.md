# grunt-model-settings

> Grunt plugin for build models rules functions from json/yaml files

It can be used for named rules declarations of statuses, types and another unreadable or preset model attributes.

```yaml
isWeekend:
  includeAny:                           Model.isWeekend = function () {
    dayOfWeekName:           ->             return (/^sat|^sun/i).test(this.dayOfWeekName);
      - '^sat'                          }
      - '^sun'
```


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
**Model.prototype** = { isWeekend: function () {...} };




___
### How to start
<a href="https://github.com/el-fuego/grunt-model-settings/tree/master/test/AppTest">Sample project structure</a>


##### Installation

```shell
npm install grunt-model-settings --save-dev
```

##### 1 Create the file(s) with rules definitions.
You can use single or many declarations per file. Example with logic at comments:
```yaml
isWeekend:              # rule method name
  includeAny:           # list type (includeAny or excludeAny)
    - dayOfWeekName:    # attribute name
      - '^sat'          # attribute values as RegExp partial
      - '^sun'
    - dayOfWeek: '6'    
    - isSunday          # another method call
isSunday:
  includeAny:
    - dayOfWeek: 7
```


##### 2 Add modelSettings section to your Grunfile
see <a href="#grunt-model-settings">Usage Example</a>


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




<br/>
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

if **true** rules will be concated to object:
```js
Model.prototype = {
    isWeekend: function () {...},
    isSunday:  function () {...}
};
```

if **false** rules will be defined as functions:
```js
Model.prototype.isWeekend: function () {...};
Model.prototype.isSunday:  function () {...};
```
Set this attribute to **false** using <a href="https://github.com/el-fuego/grunt-concat-properties">grunt-concat-properties</a>


#### options.rulePrefix
Type: `String`
Default value: `function () {\n return `

String before rule body:<br/>
isSunday: **function () { return** ((/7/i).test(this.attributes.dayOfWeek)); }

#### options.rulePostfix
Type: `String`
Default value: `;\n}`

String after rule body:<br/>
isSunday: function () { return ((/7/i).test(this.attributes.dayOfWeek))**; }**


#### options.functionsScope
Type: `String`
Default value: `this`

String before method call:<br/>
isWeekend: function () { return **this**.isSunday(); }


#### options.attributesScope
Type: `String`
Default value: `this.attributes`

String before attribute call:<br/>
isSunday: function () { return ((/7/i).test(**this.attributes**.dayOfWeek)); }



<br/>
___
#### Recommendations
Use some like <a href="https://github.com/vkadam/grunt-jsbeautifier">grunt-jsbeautifier</a> to keep indentation at concated files
