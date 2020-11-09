import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

const getConfig = ({ output, isMinify }) => {
  return {
    input: 'src/lib/index.ts',
    output: {
      file: output,
      format: 'esm',
      sourcemap: true,
    },
    plugins: [typescript({ module: 'esnext' }), ...(isMinify ? [terser()] : [])],
  };
};

export default [
  getConfig({ output: 'dist/lib/index.mjs' }),
  getConfig({ output: 'dist/lib/index.min.mjs', isMinify: true }),
];
