// const fs = require('fs-extra');
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import { get_build_vers, build_ver_run, set_updateBuild } from './build_ver.js';

for (let index = 0; index < process.argv.length; index++) {
  // console.log(index, process.argv[index]);
  let val = process.argv[index];
  if (val == '--prod') {
    set_updateBuild(1);
  } else if (val == '--dev') {
    set_updateBuild(0);
  }
}

import build_webdb from './build_webdb.js';
import build_settings from './build_settings.js';
import build_effectMetas from './build_effectMetas.js';
import build_sketch from './build_sketch.js';

// source files that will have ?v=<buildnumber> updated
const buildnum_files = ['./index.html', './effects/', './videoKit/'];

const root_path = join(__dirname, '..');
const src_path = join(root_path, 'src');
const buildnum_path = 'gen/build_ver.txt';
let build_ver = get_build_vers(src_path, buildnum_path);

// const webdbPath = '../webdb';
const webdbPath = 'external/media/webdb';
const imagesOutPath = 'videoKit/let/a_images.js';
build_webdb(src_path, webdbPath, imagesOutPath);

let settingMetas;
let effectsMetas;

{
  let args = {
    src_path,
    settings: 'videoKit/settings',
    settingIndexPath: 'videoKit/settings.html',
    settingMetasPath: 'videoKit/let/a_settingMetas.js',
    indexPrefix: '../index.html',
  };
  build_settings(args);
}

{
  let args = {
    src_path,
    settings: 'settings',
    settingIndexPath: 'gen/settings.html',
    indexPrefix: '../index.html',
  };
  build_settings(args);
  settingMetas = args.metas;
}

{
  let args = {
    src_path,
    effectMetasPath: 'videoKit/let/a_effectMetas.js',
    mods: 'videoKit/effects',
  };
  // const effectMetasPath = 'videoKit/let/a_effectMetas.js';
  // build_effectMetas(src_path, effectMetasPath, 'videoKit/effects');
  build_effectMetas(args);
}

{
  let args = {
    src_path,
    mods: 'effects',
  };
  build_effectMetas(args);
  effectsMetas = args.metas;
}

build_ver_run(src_path, buildnum_path, build_ver, buildnum_files);

// console.log('settingMetas', settingMetas);
// console.log('effectsMetas', effectsMetas);

{
  let sketchPath = 'sketch.js';
  let sketchSavedPath = 'gen/sketch.js';
  let args = {
    src_path,
    sketchPath,
    sketchSavedPath,
    effectsMetas,
    settingMetas,
  };
  build_sketch(args);
}
