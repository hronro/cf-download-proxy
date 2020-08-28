// @ts-check

import { platform } from 'os'
import { readFileSync } from 'fs'

import { createFilter } from '@rollup/pluginutils'
import { compile, parse, defaultConfig as etaConfig } from 'eta'

const isWindows = platform() === 'win32'
const pathSeparators =  isWindows ? '\\' : '/'

const INTERNAL_CONFIG_MODULE_NAME = '@@@eta-config'
const INTERNAL_CONFIG_SOURCE = readFileSync(require.resolve('./rollup-plugins/eta/internal-config'), 'utf-8')

/**
 * @typedef { import('@rollup/pluginutils').FilterPattern } IFilterPattern
 */

/**
 * @typedef { { include?: IFilterPattern, exclude?: IFilterPattern, templatesDir: string } } IOptions
 */

/**
 * @param { IOptions } options
 * @return { import('rollup').Plugin }
 */
export default function etaPlugin (options) {
  const templatesDir = options.templatesDir.endsWith(pathSeparators) ?
    options.templatesDir :
    `${options.templatesDir}${pathSeparators}`

  const defaultInclude = '**.eta'
  const filter = createFilter( options.include ?? defaultInclude, options.exclude );


  /**
   * @type { Record<string, true | undefined> }
   */
  const registeredPartials = Object.create(null)

  return {
    name: 'eta',
    resolveId(source) {
      if (source === INTERNAL_CONFIG_MODULE_NAME) {
        return source
      }

      return null
    },
    load(id) {
      if (id === INTERNAL_CONFIG_MODULE_NAME) {
        return INTERNAL_CONFIG_SOURCE
      }

      return null
    },
    transform (code, id) {
      if (!filter(id)) {
        return undefined
      } else {
        if (!id.startsWith(templatesDir)) {
          throw new Error('can not use template outside `templatesDir`')
        }

        // const templateName = id.slice(templatesDir.length)

        const ast = parse(code, etaConfig)

        const templateFn = compile(code, etaConfig)
          .toString()
          .replace('function anonymous', 'export function template')

        const partials = Array.from(new Set(
          ast
            .map(node => {
              if (typeof node === 'string') {
                return null
              }

              if (node.t === 'r') {
                let matches = node.val.match(/E\.include\('(.*)'\)/)

                if (matches != null && matches[1] != null && matches[1].length > 0) {
                  return matches[1]
                }
              }

              return null
            })
            .filter(partialName => partialName != null)
        ))
        const unregisteredPartials = partials.filter(partialName => {
          if (registeredPartials[partialName] === true) {
            return false
          } else {
            registeredPartials[partialName] = true
            return true
          }
        })

        const partialImportStatements = unregisteredPartials
          .map((partialName, index) => `import { template as partialTemplate$${index} } from '${templatesDir}${pathSeparators}${partialName}'`)
          .join('\n')

        const partialDefineStatements = unregisteredPartials
          .map((partialName, index) => `config.templates.define('${partialName}', partialTemplate$${index})`)
          .join('\n')

        const source =
`import { config } from '${INTERNAL_CONFIG_MODULE_NAME}'
${partialImportStatements}

${partialDefineStatements}

${templateFn}

export default function templateFunction (data) {
  return template(data, config)
}`

        return source
      }
    }
  };
}
