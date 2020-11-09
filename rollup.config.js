import typescript from '@rollup/plugin-typescript';
import minify from 'rollup-plugin-babel-minify';

const getConfig = ({ output, isMinify }) => {
  return {
    input: 'src/lib/index.ts',
    output: {
      // dir: 'dist',
      file: output,
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      typescript({
        module: 'esnext',
      }),
      ...(isMinify
        ? [
            minify({
              comments: false,
            }),
          ]
        : []),
    ],
  };
};

export default [
  getConfig({ output: 'dist/lib/index.mjs' }),
  getConfig({ output: 'dist/lib/index.min.mjs', isMinify: true }),
];
