# stylelint-plugin-bem-style

A [stylelint](https://github.com/stylelint/stylelint) plugin that verifies the BEM style.
Customized BEM style supported.


## Installation
```javascript
    npm install --save-dev stylelint-plugin-bem-style
```

## Configuration
```javascript
{
    "plugins": [
        "stylelint-plugin-bem-style"
    ]
}
```
this would use [the standard BEM style](http://getbem.com/naming/).

## Example
If you wanna use the [customized BEM style defined by Tencent](https://github.com/Tencent/tmt-workflow/wiki/%E2%92%9B-%5B%E8%A7%84%E8%8C%83%5D--CSS-BEM-%E4%B9%A6%E5%86%99%E8%A7%84%E8%8C%83), use the configuration below.
```javascript
{
    "plugins": [
        "stylelint-plugin-bem-style"
    ],
    "rules": {
        "plugin/bem-style": "B__E_M"
    }
}
```

## Alternative
This plugin is designed to make the customization of BEM style possible. 

Alternative plugins, like [stylelint-selector-bem-pattern](https://github.com/simonsmith/stylelint-selector-bem-pattern) and [@namics/stylelint-bem](https://github.com/namics/stylelint-bem-namics), can be used if you use [the standard BEM style](http://getbem.com/naming/). 
