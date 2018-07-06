import * as assert from 'assert'
import loader, { Options } from '../'

function expect(msg: string, input: string, expect: string, opts: Options = {}) {
  let options = {
    query: {
      tagRules: ['css2', 'css', 'injectGlobal'],
      ...opts
    }
  }
  it(msg, () => {
    let minified = loader.call(options, input, null, null)
    assert.equal(minified.trim(), expect.trim())
  })
}

describe('parser', () => {
  expect('simple', `
    css\`
      display: block;
    \`
    css2\`


      display: block;


      \`
  `, `
    css\`display:block;\`
    css2\`display:block;\`
  `)
  expect('interpolation', `
    css\`
      display: block;
      background: url('aa bb') cc dd 1px;
      \${ c }
    \`
    css\`
      display: block;
      background: url('aa bb') cc dd 1px;
      \${ c };
    \`
    injectGlobal\`


    display: block;
      background: url('aa bb') cc dd 1px;
      \${ c }

      box-shadow: \${a} \${b}px \${c}px \${d};

      color: \${  e  };



      .aa {
        display: block;
        \${ f };
        color: \${  e  };
        & > h2 {
          color: \${  e  };
        }
      }
    \`
  `, `
    css\`display:block;background:url('aa bb') cc dd 1px;\${ c } \`
    css\`display:block;background:url('aa bb') cc dd 1px;\${ c };\`
    injectGlobal\`display:block;background:url('aa bb') cc dd 1px;\${ c } box-shadow:\${a} \${b}px \${c}px \${d};color:\${  e  };.aa{display:block;\${ f };color:\${  e  };&>h2{color:\${  e  };}}\`
  `)
})