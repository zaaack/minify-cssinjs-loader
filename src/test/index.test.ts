import * as assert from 'assert'
import loader, { Options, defaultTagRules } from '../'

function expect(msg: string, input: string, expect: string, opts: Options = {}) {
  let options = {
    query: {
      tagRules: defaultTagRules.concat('css2'),
      ...opts
    }
  }
  it(msg, () => {
    let minified = loader.call(options, input, null, null)
    assert.equal(minified.trim(), expect.trim().split('\n').map(s => s.trim()).join('\n'))
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

      color: \${ e };



      .aa {
        display: block;
        \${ f };
        color: \${ e };
        & > h2 {
          color: \${ e };
        }
      }
    \`
  `, `
    css\`display:block;background:url('aa bb') cc dd 1px;\${c }\`
    css\`display:block;background:url('aa bb') cc dd 1px;\${c };\`
    injectGlobal\`display:block;background:url('aa bb') cc dd 1px;\${c }box-shadow:\${a} \${b}px \${c}px \${d};color:\${e };.aa{display:block;\${f };color:\${e };&>h2{color:\${e };}}\`
  `)

  expect('styled', `
      styled.div\`
        display: block;
      \`
      styled(Button)\`
        display: block;
      \`
  `, `
      styled.div\`display:block;\`
      styled(Button)\`display:block;\`
  `)

  expect('comments', `
      styled.div\`
        // js
        // css
        display: block; // what
      \`
      styled(Button)\`
        /* awesome */
        display: block;
        /** awesome */
        /*

        aaa

        */
      \`
  `, `
      styled.div\`display:block;\`
      styled(Button)\`display:block;\`
  `)

  expect('nest', `
  let rootCss = css\`
    \${colors.map(s => \`color: \${s};\`)}
    color: red;
  \`
  `, `let rootCss = css\`\${colors.map(s =>\`color:\${s};\`)}color:red;\``)
})
