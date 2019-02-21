"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var loaderUtils = require("loader-utils");
require("./types");
exports.defaultTagRules = ['css', 'injectGlobal', /^styled(\.[a-z]+|\(([A-Z][a-z]+|['"][a-z]+["'])\))$/];
function minifyCss(css) {
    css = css.replace(/\/\/.*?\n/g, '\n')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .trim();
    var newCss = css
        .replace(/([;}])\s*\n\s*/g, '$1')
        .replace(/\s*([{,;:+>~])\s*/g, '$1');
    return newCss;
}
function tryFindTag(line) {
    line = line.trim();
    var m = line.match(/^\s*(?:(?:(?:var|const|let)\s+)?[a-zA-Z\$_]+\s*=\s*)?(.+?)`$/);
    if (m)
        return m[1];
    return;
}
function isCSSTag(tag, tagRules) {
    if (!tag)
        return false;
    for (var _i = 0, tagRules_1 = tagRules; _i < tagRules_1.length; _i++) {
        var rule = tagRules_1[_i];
        if (typeof rule === 'string') {
            if (rule === tag) {
                return true;
            }
        }
        else if (typeof rule === 'function') {
            if (rule(tag)) {
                return true;
            }
        }
        else if (rule instanceof RegExp) {
            if (rule.test(tag)) {
                return true;
            }
        }
    }
    return false;
}
function minifyCssInJs(content, options) {
    if (options === void 0) { options = {}; }
    var lines = content.split("\n");
    var tagRules = options.tagRules || exports.defaultTagRules;
    var isCss = false;
    var newContents = [];
    var css = '';
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        line = line.trim();
        if (isCss && line === '`') { // end
            isCss = false;
            newContents[newContents.length - 1] += minifyCss(css) + '`';
        }
        else if (isCss) { // css lines
            css += line + '\n';
        }
        else { // find cssinjs
            var tag = tryFindTag(line);
            if (tag && isCSSTag(tag, tagRules)) {
                isCss = true;
                css = '';
            }
            newContents.push(line);
        }
    }
    return newContents.join('\n');
}
function loader(content, map, meta) {
    var options = loaderUtils.getOptions(this) || {};
    return minifyCssInJs(content, options);
}
exports.default = loader;
//# sourceMappingURL=index.js.map