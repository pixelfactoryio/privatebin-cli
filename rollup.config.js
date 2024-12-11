import typescript from '@rollup/plugin-typescript';
import shebang from 'rollup-plugin-preserve-shebang';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const getConfig = ({ input, output, plugins }) => {
  return {
    input: input ? input : 'src/lib/index.ts',
    output: {
      dir: 'dist',
      sourcemap: true,
      name: 'privatebin',
      ...output,
    },
    plugins: [
      ...(plugins ? plugins : []),
      typescript({ declaration: true, declarationDir: 'dist/types', module: 'esnext' }),
    ],
  };
};

export default [
  // ES Module
  getConfig({ output: { entryFileNames: 'module/index.mjs', format: 'esm' } }),
  getConfig({ output: { entryFileNames: 'module/index.min.mjs', format: 'esm' }, plugins: [terser()] }),

  // Browser UMD
  getConfig({
    output: { entryFileNames: 'browser/index.js', format: 'umd' },
    plugins: [nodeResolve({ browser: true }), commonjs(), json()],
  }),
  getConfig({
    output: { entryFileNames: 'browser/index.min.js', format: 'umd' },
    plugins: [nodeResolve({ browser: true }), commonjs(), json(), terser()],
  }),

  // CommonJS
  getConfig({ output: { entryFileNames: 'main/index.js', format: 'cjs' } }),
  getConfig({ output: { entryFileNames: 'main/index.min.js', format: 'cjs' }, plugins: [terser()] }),

  // Binary
  getConfig({
    input: 'src/cmd/index.ts',
    output: { entryFileNames: 'bin/privatebin.js', format: 'cjs', sourcemap: false },
    plugins: [shebang(), nodeResolve({ preferBuiltins: true }), commonjs(), json(), terser()],
  }),
];
