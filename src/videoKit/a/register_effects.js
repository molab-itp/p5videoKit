//
import { p5videoKit } from '../a/a_p5videoKit.js';

import eff_bestill from '../effects/eff_bestill.js';
import eff_bright from '../effects/eff_bright.js';
import eff_circle from '../effects/eff_circle.js';
import eff_delaunay from '../effects/eff_delaunay.js';
import eff_diff from '../effects/eff_diff.js';
import eff_face_mesh from '../effects/eff_face_mesh.js';
import eff_grid from '../effects/eff_grid.js';
import eff_maze from '../effects/eff_maze.js';
import eff_image_url from '../effects/eff_image_url.js';
import eff_none from '../effects/eff_none.js';
import eff_phyllotaxis from '../effects/eff_phyllotaxis.js';
import eff_pose_net from '../effects/eff_pose_net.js';
import eff_show from '../effects/eff_show.js';
import eff_sketchy from '../effects/eff_sketchy.js';
import eff_slant_scan from '../effects/eff_slant_scan.js';
import eff_slit_scan from '../effects/eff_slit_scan.js';
import eff_triangle from '../effects/eff_triangle.js';

// retire pending
import eff_bestill_mo from '../effects/eff_bestill_mo.js';
import eff_bodypix from '../effects/eff_bodypix.js';
import eff_tile_clock from '../effects/eff_tile_clock.js';
import eff_tile_live from '../effects/eff_tile_live.js';
import eff_image from '../effects/eff_image.js';
import eff_image_mesh from '../effects/eff_image_mesh.js';
import eff_face_band from '../effects/eff_face_band.js';
import eff_fft_graph from '../effects/eff_fft_graph.js';
import eff_fft_polar from '../effects/eff_fft_polar.js';
import eff_loop from '../effects/eff_loop.js';

p5videoKit.prototype.register_effects = function () {
  //
  console.log('register_effects --- ');
  this.register_effect('bestill', eff_bestill);
  this.register_effect('bright', eff_bright);
  this.register_effect('circle', eff_circle);
  this.register_effect('delaunay', eff_delaunay);
  this.register_effect('diff', eff_diff);
  this.register_effect('face_mesh', eff_face_mesh);
  this.register_effect('grid', eff_grid);
  this.register_effect('image_url', eff_image_url);
  this.register_effect('maze', eff_maze);
  this.register_effect('none', eff_none);
  this.register_effect('phyllotaxis', eff_phyllotaxis);
  this.register_effect('pose_net', eff_pose_net);
  this.register_effect('show', eff_show);
  this.register_effect('sketchy', eff_sketchy);
  this.register_effect('slant_scan', eff_slant_scan);
  this.register_effect('slit_scan', eff_slit_scan);
  this.register_effect('triangle', eff_triangle);
  //
  // retire pending
  this.register_effect('eff_bestill_mo', eff_bestill_mo);
  this.register_effect('eff_bodypix', eff_bodypix);
  this.register_effect('eff_tile_clock', eff_tile_clock);
  this.register_effect('eff_tile_live', eff_tile_live);
  this.register_effect('eff_image', eff_image);
  this.register_effect('eff_image_mesh', eff_image_mesh);
  this.register_effect('eff_face_band', eff_face_band);
  this.register_effect('eff_fft_graph', eff_fft_graph);
  this.register_effect('eff_fft_polar', eff_fft_polar);
  this.register_effect('eff_loop', eff_loop);
};

p5videoKit.prototype.register_effect = function (label, factory) {
  //
  let index = this.a_.effectMetas.length;
  let effMeta = { label, factory, index };
  this.a_.effectMetaDict[label] = effMeta;
  this.a_.effectMetas.push(effMeta);
  console.log('register_effect index', index, label);
};

// not used - for reference
let unsed_eff = [
  // { label: 'ticker', import_path: 'videoKit/effects/ticker/eff_ticker.js' },
  // { label: 'mov', import_path: 'videoKit/effects/eff_mov.js' },
];
