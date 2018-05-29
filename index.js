'use strict';
var stylelint = require('stylelint');
var resolvedNestedSelector = require('postcss-resolve-nested-selector');
var extractCssClasses = require('css-selector-classes');

var ruleName = 'plugin/bem-style';
var messages = stylelint.utils.ruleMessages(ruleName, {
    expected: function (selector, expectedSelector) {
        return 'Expected class name "' + selector + '" to ' + expectedSelector + '.';
    }
});

/**
 * parse separator from user-specified format
 * @param primaryOption
 * @param secondaryOptionObject
 * @return {{element: string, modifier: string}}
 */
function parseSeparator(primaryOption, secondaryOptionObject) {
    var format = '';
    if (primaryOption) {
        format = primaryOption;
    } else if (secondaryOptionObject) {
        format = secondaryOptionObject.format;
    }
    format = format || 'B__E--M';

    var matched = format.match(/B([^BEM]+)E([^BEM]+)M/) || ['', '', ''];
    var separator = {
        element: matched[1],
        modifier: matched[2]
    };

    if (!separator.element || !separator.modifier) {
        throw new Error('Invalid separator: ' + JSON.stringify(separator));
    }

    return separator;
}

function isNullOrUndefined(text) {
    return undefined == text || null == text;
}


module.exports = stylelint.createPlugin(ruleName, function (primaryOption, secondaryOptionObject) {
    var separator = parseSeparator(primaryOption, secondaryOptionObject);

    return function plugin(root, result) {
        var validOptions = stylelint.utils.validateOptions({
            ruleName: ruleName,
            result: result,
            actual: primaryOption
        });

        if (!validOptions) {
            return;
        }

        var report = createReporter(ruleName, result);

        var classNameErrorCache = {};
        root.walkRules(function (rule) {
            // Skip keyframes
            if (/keyframes/.test(rule.parent.name)) {
                return;
            }
            rule.selectors.forEach(function (selector) {
                if (selector.indexOf('(') !== -1 && (selector.indexOf(':') === -1 || selector.indexOf('@') !== -1)) {
                    // Skip less mixins
                    return;
                }else if(/::/.test(selector)){
                    // Skip pseudos
                    return;
                }
                resolvedNestedSelector(selector, rule).forEach(function (resolvedSelector) {
                    var classNames = [];
                    try {
                        // Remove ampersand from inner sass mixins and parse the class names
                        classNames = extractCssClasses(resolvedSelector.replace(/&\s*/ig, ''));
                    } catch (e) {
                        report(rule, e.message);
                    }
                    classNames.forEach(function (className) {
                        if (classNameErrorCache[className] === undefined) {
                            classNameErrorCache[className] = getClassNameErrors(className, rule);
                        }
                        if (classNameErrorCache[className]) {
                            report(rule, messages.expected(className, classNameErrorCache[className]));
                        }
                    });
                });
            });
        });
    };

    /**
     * split className
     * @param {string} fullClassName the class name
     * @return {[blockName, elementName, modifierName]}
     */
    function parseClassName(fullClassName) {
        var blockName = undefined;
        var elementName = undefined;
        var modifierName = undefined;

        var array = fullClassName.split(separator.element);
        if (array.length == 1) {
            elementName = undefined;

            array = array[0].split(separator.modifier);
            blockName = array[0];
            modifierName = array.length > 1 ? array.slice(1).join(separator.modifier) : undefined;
        } else {
            blockName = array[0];

            var rest = array.slice(1).join(separator.element);
            array = rest.split(separator.modifier);
            elementName = array[0];
            modifierName = array.length > 1 ? array.slice(1).join(separator.modifier) : undefined;
        }

        return [blockName, elementName, modifierName];
    }

    /**
     * Helper for error messages to tell the correct syntax
     *
     * @param {string} className the class name
     * @returns {string} valid syntax
     */
    function getValidSyntax(className) {
        var parsedNames = parseClassName(className);

        // Try to guess the namespaces or use the first one
        var validSyntax = '[block]';
        if (!isNullOrUndefined(parsedNames[1])) {
            validSyntax += separator.element + '[element]';
        }

        if (!isNullOrUndefined(parsedNames[2])) {
            validSyntax += separator.modifier + '[modifier]';
        }

        return validSyntax;
    }

    /**
     * Validates the given className and returns the error if it's not valid
     * @param {string} className - the name of the class e.g. 'a-button'
     * @returns {string} error message
     */
    function getClassNameErrors(className) {
        if (!className) {
            return 'not blank';
        } else if (/[A-Z]/.test(className)) {
            return 'not contain upper cased letters';
        }

        var parsedClassName = parseClassName(className);
        console.log('***************', className, ' -> ', JSON.stringify(parsedClassName));
        var containSeparator = createSeparatorChecker(separator);

        if (parsedClassName.some(hasEmptyText)) {
            return 'not contain blank name';
        } else if (parsedClassName.some(isIllegalStart)) {
            return 'starts with lower cased letters [a-z]';
        } else if (parsedClassName.some(isIllegalEnd)) {
            return 'ends with lower cased letters [a-z] or numbers [0-9]';
        } else if (parsedClassName.some(containSeparator)) {
            return 'use the ' + getValidSyntax(className) + ' syntax';
        }

        function isIllegalStart(name) {
            return /^[^a-z]/.test(name);
        }

        function isIllegalEnd(name) {
            return /[^a-z0-9]$/.test(name);
        }

        function hasEmptyText(name) {
            return '' == name || /\s/.test(name);
        }

        function createSeparatorChecker(separator) {
            //  name should not contain separator
            var regex = new RegExp('(' + [separator.element, separator.modifier].join('|') + ')');

            return function (name) {
                return regex.test(name);
            };
        }
    }

    function createReporter(ruleName, result) {
        return function (rule, message) {
            stylelint.utils.report({
                ruleName: ruleName,
                result: result,
                node: rule,
                message: message
            });
        }
    }
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;