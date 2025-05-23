//
// import { a_ } from '../let/a_state.js';

export class PadLayout {
  constructor(a_) {
    this.tiled = a_.ui.patch_layout !== 'Single';
    let iurect = { width, height, x0: 0, y0: 0 };
    this.io = Object.assign({}, iurect);
    let io = this.io;
    if (!this.tiled) return;
    let pl = a_.ui.patch_layout.split('x');
    let dw = parseFloat(pl[0]);
    let dh = parseFloat(pl[1]);
    io.xs = Math.floor(io.width / dw);
    io.ys = Math.floor(io.height / dh);
    io.x = 0;
    io.y = 0;
    // ui_log('pad_layout io', io);
  }
  next() {
    let io = this.io;
    if (!this.tiled) return io;
    let result = { x0: io.x, y0: io.y, width: io.xs, height: io.ys };
    io.x += io.xs;
    if (io.x + io.xs / 2 >= io.width) {
      io.x = 0;
      io.y += io.ys;
      if (io.y >= io.height) {
        io.y = 0;
      }
    }
    return result;
  }
}
