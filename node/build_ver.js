import pkg from 'fs-extra';
const { readFileSync, writeFileSync, existsSync } = pkg;
import { join } from 'path';

import { enum_files, writeSourceFile } from './enum_files.js';

// default to prod build
let updateBuild = 1;
// --prod --> 1
// --dev  --> 0

export function set_updateBuild(flag) {
  console.log('set_updateBuild flag', flag);
  updateBuild = flag;
}

export function get_build_vers(src_path, buildnum_path) {
  buildnum_path = join(src_path, buildnum_path);
  let str = '0';
  if (existsSync(buildnum_path)) {
    str = readFileSync(buildnum_path, 'utf8');
  } else {
    console.log('read failed buildnum_path', buildnum_path);
    // return;
  }
  let current = parseFloat(str);
  let next = current + 1;
  // next = 1000;
  return { current, next };
}

// build_ver_run(buildnum_path, build_ver, src_path, buildnum_files);

export function build_ver_run(src_path, buildnum_path, build_ver, buildnum_files) {
  // buildnum_path = join(src_path, buildnum_path);
  console.log('build_ver_run updateBuild', updateBuild);
  const from_str = '\\?v=\\d+';
  const to_str = '?v=' + build_ver.next;
  const re = new RegExp(from_str, 'g');
  let nfiles = enum_files(src_path, buildnum_files);
  // console.log('nfiles', nfiles);
  console.log('build_ver_run nfiles', nfiles.length);
  let writeCount = 0;
  let skipCount = 0;
  for (let afile of nfiles) {
    // skip directory enteries
    if (!afile) continue;
    // only modify text files
    if (!(afile.endsWith('.js') || afile.endsWith('.html'))) {
      skipCount++;
      continue;
    }
    // console.log('build_ver_run afile', afile);
    const fpath = join(src_path, afile);
    const str = readFileSync(fpath, 'utf8');
    if (!str) {
      console.log('read failed fpath', fpath);
      continue;
    }
    const nstr = str.replace(re, to_str);
    if (updateBuild) {
      // console.log('build_ver_run afile', afile, 'nstr.length', nstr.length, 'str.length', str.length, nstr == str);
      // if (afile == 'videoKit/a_lib.js') {
      //   console.log('src_path', src_path);
      //   console.log('nstr=', nstr);
      // }
      // writeBuildFile(src_path, afile, nstr);
      if (nstr != str) {
        // writeBuildFile(src_path, afile, nstr);
        writeSourceFile(src_path, afile, nstr);
        writeCount++;
      }
    }
  }
  if (updateBuild) {
    writeSourceFile(src_path, buildnum_path, build_ver.next + '');
  }
  console.log('writeCount', writeCount, 'skipCount', skipCount, 'next', build_ver.next);
  // console.log('build_ver.next', build_ver.next);
}
