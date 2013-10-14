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