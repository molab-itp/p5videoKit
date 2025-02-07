//
import { p5videoKit } from '../a/a_p5videoKit.js?v=413';

import eff_bestill from '../effects/eff_bestill.js';
import eff_bright from '../effects/eff_bright.js';
import eff_circle from '../effects/eff_circle.js';
import eff_delaunay from '../effects/eff_delaunay.js';
import eff_diff from '../effects/eff_diff.js';
import eff_face_mesh from '../effects/eff_face_mesh.js';
import eff_grid from '../effects/eff_grid.js';
import eff_maze from '../effects/eff_maze.js';
import eff_none from '../effects/eff_none.js';
import eff_phyllotaxis from '../effects/eff_phyllotaxis.js';
import eff_pose_net from '../effects/eff_pose_net.js';
import eff_show from '../effects/eff_show.js';
import eff_sketchy from '../effects/eff_sketchy.js';
import eff_slant_scan from '../effects/eff_slant_scan.js';
import eff_triangle from '../effects/eff_triangle.js';
import eff_ticker from '../effects/ticker/eff_ticker.js';

//
// videoKit.recordVideo({ save_name, fps, duration })
//
p5videoKit.prototype.register_effects = function () {
  //
  console.log('register_effect_base');
  this.register_effect('bestill', eff_bestill);
  this.register_effect('bright', eff_bright);
  this.register_effect('circle', eff_circle);
  this.register_effect('delaunay', eff_delaunay);
  this.register_effect('diff', eff_diff);
  this.register_effect('face_mesh', eff_face_mesh);
  this.register_effect('grid', eff_grid);
  this.register_effect('maze', eff_maze);
  this.register_effect('none', eff_none);
  this.register_effect('phyllotaxis', eff_phyllotaxis);
  this.register_effect('pose_net', eff_pose_net);
  this.register_effect('show', eff_show);
  this.register_effect('sketchy', eff_sketchy);
  this.register_effect('slant_scan', eff_slant_scan);
  this.register_effect('triangle', eff_triangle);
  this.register_effect('ticker', eff_ticker);
};

p5videoKit.prototype.register_effect = function (label, factory) {
  //
  let index = this.a_.effectMetas.length;
  let effMeta = { label, factory, index };
  this.a_.effectMetaDict[label] = effMeta;
  this.a_.effectMetas.push(effMeta);
};

let effs = [
  { label: 'bestill', import_path: 'videoKit/effects/eff_bestill.js' },
  { label: 'bright', import_path: 'videoKit/effects/eff_bright.js' },
  { label: 'circle', import_path: 'videoKit/effects/eff_circle.js' },
  { label: 'delaunay', import_path: 'videoKit/effects/eff_delaunay.js' },
  { label: 'diff', import_path: 'videoKit/effects/eff_diff.js' },
  { label: 'face_mesh', import_path: 'videoKit/effects/bset/eff_face_mesh.js' },
  { label: 'grid', import_path: 'videoKit/effects/eff_grid.js' },
  { label: 'maze', import_path: 'videoKit/effects/eff_maze.js' },
  { label: 'none', import_path: 'videoKit/effects/eff_none.js' },
  { label: 'phyllotaxis', import_path: 'videoKit/effects/eff_phyllotaxis.js' },
  { label: 'pose_net', import_path: 'videoKit/effects/eff_pose_net.js' },
  { label: 'show', import_path: 'videoKit/effects/eff_show.js' },
  { label: 'sketchy', import_path: 'videoKit/effects/eff_sketchy.js' },
  { label: 'slant_scan', import_path: 'videoKit/effects/eff_slant_scan.js' },
  { label: 'slit_scan', import_path: 'videoKit/effects/eff_slit_scan.js' },
  { label: 'triangle', import_path: 'videoKit/effects/eff_triangle.js' },
  { label: 'ticker', import_path: 'videoKit/effects/ticker/eff_ticker.js' },
  // { label: 'mov', import_path: 'videoKit/effects/eff_mov.js' },
  // { label: 'bestill_mo', import_path: 'videoKit/effects/eff_bestill_mo.js' },
  // { label: 'bodypix', import_path: 'videoKit/effects/eff_bodypix.js' },
  // { label: 'tile_clock', import_path: 'videoKit/effects/eff_tile_clock.js' },
  // { label: 'tile_live', import_path: 'videoKit/effects/eff_tile_live.js' },
  // { label: 'image', import_path: 'videoKit/effects/eff_image.js' },
  // { label: 'image_mesh', import_path: 'videoKit/effects/eff_image_mesh.js' },
  // { label: 'image_url', import_path: 'videoKit/effects/eff_image_url.js' },
  // { label: 'face_band', import_path: 'videoKit/effects/fft/eff_face_band.js' },
  // { label: 'fft_graph', import_path: 'videoKit/effects/fft/eff_fft_graph.js' },
  // { label: 'fft_polar', import_path: 'videoKit/effects/fft/eff_fft_polar.js' },
  // { label: 'loop', import_path: 'videoKit/effects/eff_loop.js' },
];

// export let a_effectMetas = [
//   { label: 'bestill', import_path: xx, factory: xxx },
// ];
