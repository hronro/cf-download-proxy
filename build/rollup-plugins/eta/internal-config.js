// @ts-check

/**
 * @typedef { import('eta/dist/types/compile').TemplateFunction } ITemplateFunction
 */

const templates = (function createTemplates () {
  /**
   * @type { Record<string, ITemplateFunction | undefined> }
   */
  let cache = Object.create(null)

  return {
    /**
     * @param { string } key
     * @param { ITemplateFunction } val
     */
    define (key, val) {
      cache[key] = val
    },

    /**
     * @param { string } key
     */
    get (key) {
      return cache[key]
    },

    /**
     * @param { string } key
     */
    remove (key) {
      delete cache[key]
    },

    reset () {
      cache = Object.create(null)
    }
  }
})()

const escMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}

/**
 * @param { string } s
 * @returns { string }
 */
function replaceChar (s) {
  return escMap[s]
}

/**
 * @param { any } str
 * @returns { string }
 */
function XMLEscape (str) {
  // To deal with XSS. Based on Escape implementations of Mustache.JS and Marko, then customized.
  const newStr = String(str)

  if (/[&<>"']/.test(newStr)) {
    return newStr.replace(/[&<>"']/g, replaceChar)
  } else {
    return newStr
  }
}

/**
 * @param { string } templateName
 * @param { object } data 
 */
function include (templateName, data) {
  const template = templates.get(templateName)

  if (template == null) {
    throw new Error(`Can not find template \`${templateName}\``)
  }

  return template(data, config)
}

/**
 * @typedef { import('eta/dist/types/config').EtaConfig } IEtaConfig
 */

/**
 * @type { IEtaConfig }
 */
export const config = {
  async: false,
  autoEscape: true,
  autoTrim: [false, 'nl'],
  cache: true,
  e: XMLEscape,
  include,
  includeFile: include,
  parse: {
    exec: '',
    interpolate: '=',
    raw: '~'
  },
  plugins: [],
  rmWhitespace: true,
  tags: ['<%', '%>'],
  // @ts-ignore
  templates,
  useWith: false,
  varName: 'it'
}
