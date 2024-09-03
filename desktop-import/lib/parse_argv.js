//
import path from 'path';
import fs from 'fs';

// npm run start -- --screen 2 --restart_time 18:09:00
// --restart_time
//  restart at given time
// --restart_period
//  restart every period
// --u
//  store prefix to partition localstorage
// --s
//  use given settings
// --h
//  hide ui
// --ddebug
//  endable debugging
// --full
//  enter full screen
// --screen
//  select 1 of n monitors. 1 is first monitor
// --root
//  url for html to load
//  default ../src/index.html
// --download_path
//  path to download files
//  default ~/Downloads
// --limit-download n
//  limit download save to n files
//
// Ref: src/videoKit/core/store_url_parse.js
//
export function parse_argv(my, argv) {
  for (let index = 2; index < argv.length; index++) {
    let val = argv[index];
    switch (val) {
      case '--mo_app':
        my.mo_app = parseFloat(argv[++index]);
        break;
      case '--room':
        my.room = argv[++index];
        break;
      case '--portrait':
        my.portrait = parseFloat(argv[++index]);
        break;
      case '--width_trim':
        my.width_trim = parseFloat(argv[++index]);
        break;
      case '--restart_time':
        my.opt.restart_time = argv[++index];
        break;
      case '--restart_period':
        my.opt.restart_period = argv[++index];
        break;
      case '--h':
        my.opt.h = argv[++index];
        break;
      case '--d':
        my.opt.d = argv[++index];
        break;
      case '--u':
        my.opt.u = argv[++index];
        break;
      case '--s':
        // select settings and hide ui
        my.opt.s = argv[++index];
        break;
      case '--ddebug':
        my.opt.debug = true;
        my.opt.h = 0;
        break;
      case '--full':
        my.opt.fullScreen = true;
        break;
      case '--screen':
        my.opt.index = argv[++index];
        break;
      case '--root':
        my.root_index_path = argv[++index];
        my.root_index_path = decodeURIComponent(my.root_index_path);
        console.log('root_index_path:', my.root_index_path);
        break;
      case '--download_path':
        my.download_path = argv[++index];
        my.download_path = decodeURIComponent(my.download_path);
        my.download_path = path.resolve(process.env.HOME, my.download_path);
        console.log('download_path: ', my.download_path);
        let res = fs.mkdirSync(my.download_path, { recursive: true });
        console.log('download_path res', res);
        break;
      case '--download-limit':
        my.download_limit = parseFloat(argv[++index]);
        console.log('download_limit', my.download_limit);
        break;
      default:
        console.log('Unknown arg val', val);
        break;
    }
  }
}
