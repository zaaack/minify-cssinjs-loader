import * as recast from 'recast'
import * as loaderUtils from 'loader-utils'
import './types'
import cherow from 'cherow'
import * as util from 'util'

function print(o: any) {
  console.log(util.inspect(o, false, Infinity, true))
}

function walkTree(node: any, type: string, callback: (node: any) => boolean | void) {
  if (!node) {
    return
  }
  if (node.type === type) {
    let ret = callback(node)
    if (ret) {
      return true
    }
  }
  for (const key in node) {
    let children = node[key]
    if (children) {
      if (children.type || children instanceof Array) {
        if (children.type) {
          children = [children]
        }
        for (const child of children) {
          let ret = walkTree(child, type, callback)
          if (ret) {
            return true
          }
        }
      }
    }
  }
}

type TagRule = string | RegExp | ((v: string) => boolean)
export const defaultTagRules: TagRule[] = ['css', 'injectGlobal', /^styled(\.[a-z]+|\([A-Z][a-z]+\))$/]

function minifyCss(css: string | null) {
  if (!css) return css
  css = css
    .replace(/\s*(\w+)\s*:\s*([^;]+?)\s*(;|}|$)/g, '$1:$2$3')
    .replace(/\s*(\{|\}|,|;|:)\s*/g, '$1')
    .replace(/(^\s+|\s+$)/g, ' ')
  css = css.replace(/([^};]+){/g, (_, g) => {
    return g.replace(/\s*([+>~]+)\s*/g, '$1') + '{'
  })
  return css
}

function isCSSTag(tag: string, tagRules: TagRule[]): boolean {
  if (!tag) return false
  for (const rule of tagRules) {
    if (typeof rule === 'string') {
      if (rule === tag) {
        return true
      }
    } else if (typeof rule === 'function') {
      if (rule(tag)) {
        return true
      }
    } else if (rule instanceof RegExp) {
      if (rule.test(tag)) {
        return true
      }
    }
  }
  return false
}

function minifyAst(ast, tagRules: TagRule[]) {
  walkTree(ast, 'TaggedTemplateExpression', (node) => {
    if (isCSSTag((recast.print(node.tag).code || '').trim(), tagRules)) {
      walkTree(node, 'TemplateElement', (node) => {
        node.value.cooked = minifyCss(node.value.cooked)
        node.value.raw = minifyCss(node.value.raw) || ''
      })
    }
  })
}

export interface Options {
  recast?: any
  tagRules?: TagRule[]
}
function minifyCssInJs(content: string, options: Options = {}) {
  let ast = recast.parse(content, {
    parser: {
      parse(source, options) {
        return require('cherow').parseModule(
          source,
          Object.assign(options, {
            next: true,
            experimental: true,
          }),
        )
      },
      ...options.recast,
    },
  })
  minifyAst(ast, options.tagRules || defaultTagRules)
  try {
    return recast.print(ast).code
  } catch (error) {
    console.error('[minify-cssinjs-loader]', error)
  }
  return content
}
function loader (content, map, meta) {
  let options: Options = loaderUtils.getOptions(this) || {}
  return minifyCssInJs(content, options)
}

export default loader
