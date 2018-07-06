"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var assert = require("assert");
var __1 = require("../");
function expect(msg, input, expect, opts) {
    if (opts === void 0) { opts = {}; }
    var options = {
        query: tslib_1.__assign({ tagRules: __1.defaultTagRules.concat('css2') }, opts)
    };
    it(msg, function () {
        var minified = __1.default.call(options, input, null, null);
        assert.equal(minified.trim(), expect.trim());
    });
}
describe('parser', function () {
    expect('simple', "\n    css`\n      display: block;\n    `\n    css2`\n\n\n      display: block;\n\n\n      `\n  ", "\n    css`display:block;`\n    css2`display:block;`\n  ");
    expect('interpolation', "\n    css`\n      display: block;\n      background: url('aa bb') cc dd 1px;\n      ${ c }\n    `\n    css`\n      display: block;\n      background: url('aa bb') cc dd 1px;\n      ${ c };\n    `\n    injectGlobal`\n\n\n    display: block;\n      background: url('aa bb') cc dd 1px;\n      ${ c }\n\n      box-shadow: ${a} ${b}px ${c}px ${d};\n\n      color: ${  e  };\n\n\n\n      .aa {\n        display: block;\n        ${ f };\n        color: ${  e  };\n        & > h2 {\n          color: ${  e  };\n        }\n      }\n    `\n  ", "\n    css`display:block;background:url('aa bb') cc dd 1px;${ c } `\n    css`display:block;background:url('aa bb') cc dd 1px;${ c };`\n    injectGlobal`display:block;background:url('aa bb') cc dd 1px;${ c } box-shadow:${a} ${b}px ${c}px ${d};color:${  e  };.aa{display:block;${ f };color:${  e  };&>h2{color:${  e  };}}`\n  ");
    expect('styled', "\n      styled.div`\n        display: block;\n      `\n      styled(Button)`\n        display: block;\n      `\n  ", "\n      styled.div`display:block;`\n      styled(Button)`display:block;`\n  ");
});
//# sourceMappingURL=index.test.js.map