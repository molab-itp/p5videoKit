//
//

// import { a_ } from '../let/a_state.js';
import { PeriodTimer } from '../util/PeriodTimer.js';
// import { patch_index1 } from '../core-ui/ui_patch_eff.js';

export default class eff_tile_live {
  static meta_props = {
    // ncell: [1, 2, 3, 4, 5, 6, 7, 8],
    // cells: [[2, 2]],
    // cells: [
    //   [2, 2],
    //   [3, 3],
    //   [4, 4],
    // ],
    ncell: [2, 3, 4],
    icell: 0,
    ncell_max: 4,
    period: [5, -1, 0, 0.5, 1, 2, 3, 4, 5, 6, 10, 20, 30, 60],
    next: {
      button: (ent, aPatch) => {
        ent.next_action(aPatch);
      },
    },
    prev: {
      button: (ent, aPatch) => {
        ent.previous_action(aPatch);
      },
    },
    ifirst: [1, 2],
    _freeze_patch: [0, 1],
    livem_cycle: [0, 1],
    show_all: [1, 0],
  };
  constructor(props) {
    Object.assign(this, props);
    this.init();
    // stash instance for debugging
    tile_inst = this;
  }
  prepareOutput() {
    this.check_patches();
    if (this.freeze_patch && this.wasFrozen) {
      this.draw_freeze();
    } else {
      this.draw_frame();
    }
    if (this.advancePending) {
      if (this.livem_cycle) {
        this.livem_step();
      } else {
        this.draw_step();
      }
      // this.draw_step();
      // this.trigger_index = (this.trigger_index + 1) % this.trigger_count;
      this.advancePending = 0;
    }
    // ui_log( 'this.wasFrozen', this.wasFrozen, 'advancePending', this.advancePending, 'got_freeze', this.got_freeze );
    this.period_timer.check(() => {
      this.iperiod++;
      if (this.freeze_patch) {
        if (!this.wasFrozen) {
          this.capture_freeze();
        }
      } else {
        this.advancePending = 1;
      }
    });
    // this.check_tile_op_que();
  }
  livem_step() {
    if (!this.livem_cycle) return;
    let ipatch = this.eff_spec.ipatch;
    // ui_log('livem_step ipatch', ipatch);
    let uiPatch = this.videoKit.a_.ui.patches[ipatch];
    let imedia = uiPatch.eff_spec.imedia;
    if (imedia >= this.videoKit.a_.mediaDivs.length) {
      imedia = this.ifirst;
    }
    imedia = (imedia + 1) % this.videoKit.a_.mediaDivs.length;
    if (imedia < this.ifirst) imedia = this.ifirst;
    if (imedia >= this.videoKit.a_.mediaDivs.length) imedia = uiPatch.eff_spec.imedia;
    let change = uiPatch.eff_spec.imedia !== imedia;
    if (change) {
      // ui_log('livem_step draw_step old imedia', uiPatch.eff_spec.imedia, 'new', imedia);
      uiPatch.eff_spec.imedia = imedia;
      this.draw_step();
    }
    // this.check_mediaDivs();
  }
  check_mediaDivs() {
    let omp_len = this.old_mediaDivs_length;
    if (omp_len != this.videoKit.a_.mediaDivs.length) {
      this.old_mediaDivs_length = this.videoKit.a_.mediaDivs.length;
      // 0 = Canvas
      // 1 = local camera
      // 2 = first livemedia source
      let nsrc = this.videoKit.a_.mediaDivs.length - this.ifirst;
      // if (nsrc <= 1) {
      //   this.cells = [1, 1];
      // } else if (nsrc <= 2) {
      //   this.cells = [2, 1];
      // } else if (nsrc <= 4) {
      //   this.cells = [2, 2];
      // } else {
      //   // 5 or more livemedia source
      //   this.cells = [3, 3];
      // }
      // this.x = 0;
      // this.y = 0;
      // this.init_step();
    }
  }
  init() {
    this.wasFrozen = 0;
    this.iperiod = 0;
    this.period_timer = new PeriodTimer(this.period);
    let { width, height } = this.eff_spec.urect;
    // ui_log('eff_tile_live width, height', width, height);
    this.twidth = width;
    this.theight = height;
    this.output = createGraphics(this.twidth, this.theight);
    // ui_log('eff_tile_live twidth theight', this.twidth, this.theight);
    this.x = 0;
    this.y = 0;
    this.init_step();
  }
  init_step() {
    // let [xn, yn] = this.cells;
    let xn = this.ncell;
    let yn = this.ncell;
    // ui_log('eff_tile_live this.ncell', this.ncell);
    this.xstep = Math.floor(this.twidth / xn);
    this.ystep = Math.floor(this.theight / yn);
    // ui_log('eff_tile_live xn yn', xn, yn);
    // ui_log('eff_tile_live xstep ystep', this.xstep, this.ystep);
    this.img_freeze = createImage(this.xstep, this.ystep);
  }
  draw_frame() {
    if (this.show_all) {
      this.draw_all();
    } else {
      this.draw_single(this.input);
    }
  }
  draw_all() {
    this.check_mediaDivs();
    let ipatch = this.eff_spec.ipatch;
    let uiPatch = this.videoKit.a_.ui.patches[ipatch];
    let imedia = uiPatch.eff_spec.imedia % this.videoKit.a_.mediaDivs.length;
    if (imedia != uiPatch.eff_spec.imedia) {
      return;
    }
    let more = this.videoKit.a_.mediaDivs.length - this.ifirst;
    let input = this.input;
    let savex = this.x;
    let savey = this.y;
    let nimedia = imedia;
    while (more > 0) {
      this.draw_single(input);
      nimedia = (nimedia + 1) % this.videoKit.a_.mediaDivs.length;
      if (nimedia < this.ifirst) nimedia = this.ifirst;
      let media = this.videoKit.a_.mediaDivs[nimedia];
      input = media.capture;
      //more = nimedia != imedia;
      more--;
      this.draw_step();
      // ui_log('draw_all more', more, 'nimedia', nimedia);
    }
    this.x = savex;
    this.y = savey;
  }
  draw_single(simg) {
    // let simg = this.src_image();
    // let simg = this.input;
    if (this.advancePending) return;
    if (!this.media.ready()) {
      ui_log('draw_single NOT Ready imedia', this.eff_spec.imedia);
      return;
    }
    let sx = 0;
    let sy = 0;
    let sw = simg.width;
    let sh = simg.height;
    let { x, y, xstep, ystep } = this;
    // Fill background space
    this.output.copy(simg, sx, sy, 1, 1, x, y, xstep, ystep);
    let dw = ystep * (sw / sh);
    let x1 = Math.floor(x + (xstep - dw) / 2);
    // draw input preserving aspect ratio
    this.output.copy(simg, sx, sy, sw, sh, x1, y, dw, ystep);
    // this.output.copy(simg, sx, sy, sw, sh, x, y, xstep, ystep);
    // copy(srcImage, sx, sy, sw, sh, dx, dy, dw, dh)
    this.last_x = x;
    this.last_y = y;
    // ui_log('eff_tile_live last x y', this.last_x, this.last_y);
  }

  patch_stepper() {
    this.advancePending = 1;
  }
  draw_step(dir) {
    // if (this.show_all) return;
    if (!dir) dir = 1;
    // let [xn, yn] = this.cells;
    let xn = this.ncell;
    let yn = this.ncell;
    this.x += this.xstep * dir;
    if (this.x + this.xstep / 2 >= this.output.width || this.x < 0) {
      if (this.x < 0) {
        this.x = this.xstep * (xn - 1);
      } else {
        this.x = 0;
      }
      this.y += this.ystep * dir;
      if (this.y < 0) {
        this.y = this.ystep * (yn - 1);
      }
      if (this.y >= this.output.height) {
        this.y = 0;
      }
    }
    // ui_log('eff_tile_live x y', this.x, this.y);
    // ui_log('eff_tile_live xstep ystep', this.xstep, this.ystep);
  }
  src_image() {
    return this.input;
  }
  next_action(aPatch) {
    this.draw_step();
  }
  previous_action(aPatch) {
    this.draw_step(-1);
  }
  check_patches() {
    if (this.freeze_patch) {
      let src = this.videoKit.patch_index1(this.freeze_patch);
      if (src) {
        // ui_log('src.frozen', src.frozen);
        if (!this.wasFrozen && src.frozen) {
          this.advancePending = 1;
        }
        this.wasFrozen = src.frozen;
      }
    }
  }
  draw_freeze() {
    let simg = this.img_freeze;
    let sx = 0;
    let sy = 0;
    let sw = simg.width;
    let sh = simg.height;
    let { xstep, ystep } = this;
    let x = this.last_x;
    let y = this.last_y;
    this.output.copy(simg, sx, sy, sw, sh, x, y, xstep, ystep);
  }
  capture_freeze() {
    let dimg = this.img_freeze;
    let { xstep, ystep } = this;
    let sx = this.last_x;
    let sy = this.last_y;
    dimg.copy(this.output, sx, sy, xstep, ystep, 0, 0, dimg.width, dimg.height);
    // this.got_freeze = this.iperiod;
  }
  // check_tile_op_que() {
  //   // tile_op_que
  //   let opt = tile_op_que.splice(0, 1);
  //   if (opt.length < 1) return;
  //   let op = opt[0];
  //   ui_log('check_tile_op_que op', op);
  // }
}

let tile_inst;
