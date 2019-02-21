import * as loaderUtils from 'loader-utils'
import './types'
import * as util from 'util'


type TagRule = string | RegExp | ((v: string) => boolean)
export const defaultTagRules: TagRule[] = ['css', 'injectGlobal', 'keyframes', /^styled(\.[a-z]+|\(([A-Z][a-z]+|['"][a-z]+["'])\))$/]

function minifyCss(css: string) {
  css = css.replace(/\/\/.*?\n/g, '\n')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .trim()
  let newCss = css
    .replace(/([;}])\s*\n\s*/g, '$1')
    .replace(/\s*([{,;:+>~])\s*/g, '$1')
  return newCss
}

function tryFindTag(line: string) {
  line = line.trim()
  let m = line.match(/^\s*(?:(?:(?:var|const|let)\s+)?[a-zA-Z\$_]+\s*=\s*)?(.+?)`$/)
  if (m) return m[1]
  return
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

export interface Options {
  tagRules?: TagRule[]
}
function minifyCssInJs(content: string, options: Options = {}) {
  let lines = content.split(`\n`)
  let tagRules = options.tagRules || defaultTagRules
  let isCss = false
  let newContents = [] as string[]
  let css = ''
  for (let line of lines) {
    line = line.trim()
    if (isCss && line === '`') { // end
      isCss = false
      newContents[newContents.length - 1] += minifyCss(css) + '`'
    } else if (isCss) { // css lines
      css += line + '\n'
    } else { // find cssinjs
      let tag = tryFindTag(line)
      if (tag && isCSSTag(tag, tagRules)) {
        isCss = true
        css = ''
      }
      newContents.push(line)
    }
  }
  return newContents.join('\n')
}
function loader (content, map, meta) {
  let options: Options = loaderUtils.getOptions(this) || {}
  return minifyCssInJs(content, options)
}

export default loader
