# grunt-model-settings

> Grunt plugin for build models rules functions from json/yaml files

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
        return ((/^sat|^sun/i).test(this.attributes.dayOfWeekName) || (/6/i).test(this.attributes.dayOfWeek) || this.isSunday())
    },
    isSunday: function () {
        return ((/7/i).test(this.attributes.dayOfWeek))
    }
};

```
