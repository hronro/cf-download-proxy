import { createFilter } from '@rollup/pluginutils'

/**
 * @typedef { import('@rollup/pluginutils').FilterPattern } IFilterPattern
 */

/**
 * @typedef { { include: IFilterPattern, exclude?: IFilterPattern } } IOptions
 */

/**
 * @param { IOptions } options
 * @return { import('rollup').Plugin }
 */
export default function etaPlugin (options) {
  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'raw-content',
    transform (code, id) {
      if (!filter(id)) {
        return undefined
      } else {
        const escapedCode = code
          .replace(/'/g, '\\\'')
          .replace(/(\r\n|\n|\r)/g, '\\n')
        const source =
`const content = '${escapedCode}'
export default content`

        return source
      }
    }
  }
}
