var testRule = require('stylelint-test-rule-tape');
var plugin = require('../index');

function acceptCase(code){
    return {
        code: '.' + code + ' {}'
    }
}

function rejectCase(code, message){
    return {
        code: '.' + code + ' {}',
        message: 'Expected class name "' + code + '" to ' + message + '. (' + plugin.ruleName + ')'
    }
}

testRule(plugin.rule, {
    ruleName: plugin.ruleName,
    config: 'B__E--M',
    skipBasicChecks: true,
    accept: [
        acceptCase('block__element--modifier'),
        acceptCase('block__element'),
        acceptCase('block__element1'),
        acceptCase('block--modifier'),
        acceptCase('block--modifier1'),
        acceptCase('block')
    ],
    reject: [
        rejectCase('', 'not blank'),
        rejectCase('Block', 'not contain upper cased letters'),
        rejectCase('block__Element', 'not contain upper cased letters'),
        rejectCase('block__element--Modifier', 'not contain upper cased letters'),

        rejectCase('1block__element--modifier', 'starts with lower cased letters [a-z]'),
        rejectCase('block__-element--modifier', 'starts with lower cased letters [a-z]'),
        rejectCase('block__1element--modifier', 'starts with lower cased letters [a-z]'),
        rejectCase('block__element--_modifier', 'starts with lower cased letters [a-z]'),
        rejectCase('block__element--1modifier', 'starts with lower cased letters [a-z]'),

        rejectCase('block-__element--modifier', 'ends with lower cased letters [a-z] or numbers [0-9]'),
        rejectCase('block__element_--modifier', 'ends with lower cased letters [a-z] or numbers [0-9]'),
        rejectCase('block__element--modifier_', 'ends with lower cased letters [a-z] or numbers [0-9]'),

        rejectCase('__element--modifier', 'not contain blank name'),
        rejectCase('__--modifier', 'not contain blank name'),
        rejectCase('__--', 'not contain blank name'),
        rejectCase('block__--modifier', 'not contain blank name'),
        rejectCase('block__--', 'not contain blank name'),
        rejectCase('block__element--', 'not contain blank name'),

        rejectCase('block__element__element2--modifier', 'use the [block]__[element]--[modifier] syntax'),
        rejectCase('block__element--modifier--modifier2', 'use the [block]__[element]--[modifier] syntax'),
    ]
});

testRule(plugin.rule, {
    ruleName: plugin.ruleName,
    config: 'B__E_M',
    skipBasicChecks: true,
    accept: [
        acceptCase('block__element_modifier'),
        acceptCase('block__element'),
        acceptCase('block__element1'),
        acceptCase('block_modifier'),
        acceptCase('block_modifier1'),
        acceptCase('block')
    ],
    reject: [
        rejectCase('', 'not blank'),
        rejectCase('Block', 'not contain upper cased letters'),
        rejectCase('block__Element', 'not contain upper cased letters'),
        rejectCase('block__element_Modifier', 'not contain upper cased letters'),

        rejectCase('1block__element_modifier', 'starts with lower cased letters [a-z]'),
        rejectCase('block__-element_modifier', 'starts with lower cased letters [a-z]'),
        rejectCase('block__1element_modifier', 'starts with lower cased letters [a-z]'),
        rejectCase('block__element_-modifier', 'starts with lower cased letters [a-z]'),
        rejectCase('block__element_1modifier', 'starts with lower cased letters [a-z]'),

        rejectCase('block-__element_modifier', 'ends with lower cased letters [a-z] or numbers [0-9]'),
        rejectCase('block__element-_modifier', 'ends with lower cased letters [a-z] or numbers [0-9]'),
        rejectCase('block__element_modifier_', 'ends with lower cased letters [a-z] or numbers [0-9]'),

        rejectCase('__element_modifier', 'not contain blank name'),
        rejectCase('___modifier', 'not contain blank name'),
        rejectCase('___', 'not contain blank name'),
        rejectCase('block___modifier', 'not contain blank name'),
        rejectCase('block___', 'not contain blank name'),
        rejectCase('block__element_', 'not contain blank name'),

        rejectCase('block__element_modifier_modifier2', 'use the [block]__[element]_[modifier] syntax')
    ]
});