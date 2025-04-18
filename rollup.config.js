// rollup.config.js

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/videoKit/a/a_lib.js', // Entry point of your library
  output: [
    {
      // inlineDynamicImports: true,
      file: 'dist/p5videoKit.cjs.js',
      // dir: 'dist/p5videoKit.cjs',
      format: 'cjs', // CommonJS for Node.js
      sourcemap: true,
    },
    {
      // inlineDynamicImports: true,
      file: 'dist/p5videoKit.esm.js',
      // dir: 'dist/p5videoKit.esm',
      format: 'es', // ES Module for modern bundlers
      sourcemap: true,
    },
    {
      file: 'dist/p5videoKit.umd.js',
      // dir: 'dist/p5videoKit.umd',
      format: 'umd', // UMD for browsers and Node.js
      name: 'videoKit_', // Global variable name when used in browsers
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(), // Resolve dependencies from node_modules
    commonjs(), // Convert CommonJS modules to ES6
    terser(), // Minify the output for production
  ],
};

// !!@ must be at top level
// https://firebase.google.com/docs/web/module-bundling?authuser=0&hl=en#using_firebase_with_rollup

/*

rollup is not appropriate for videoKit
due to dynamic imports of effects and settings
and Circular dependencies

*/
