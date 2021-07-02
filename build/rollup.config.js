// @ts-check

import * as path from 'path'

import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import inject from '@rollup/plugin-inject'
import alias from '@rollup/plugin-alias'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

import etaPlugin from './rollup-plugins/eta/index'
import rawContentPlugin from './rollup-plugins/raw-content'

import packageInfo from '../package.json'

/** @type { import('rollup').RollupOptions } */
const config = {
  input: 'src/index.ts',
  output: {
    file: packageInfo.main,
    format: 'iife',
  },
  plugins: [
    resolve(),
    commonjs(),
    inject({
      require: ['node-mock', 'require'],
    }),
    alias({
      entries: {
        'node-mock': path.resolve(__dirname, '../src/libs/node-mock.ts'),
        'http': path.resolve(__dirname, '../src/libs/node-mock.ts'),
      }
    }),
    rawContentPlugin({
      include: ['**.css', '**.txt'],
    }),
    typescript(),
    etaPlugin({
      templatesDir: path.resolve(__dirname, '../src/templates'),
    }),
    terser({
      format: {
        comments: false
      }
    })
  ],
}

export default config
