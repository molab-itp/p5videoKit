//

import { image_copy_to } from '../../util/image.js?v=407';

export default class eff_bestill_mo {
  static meta_props = {
    //
    factor: [10, 1, 5, 10, 20, 40, 50, 100, 200, 500, 1000, 2000, 3000, 5000, 10000],
    mirror: [0, 1],
    report: [0, 1],
  };

  constructor(props) {
    Object.assign(this, props);
    this.init();
  }
  prepareOutput() {
    if (this.mirror) {
      this.bestill_render_mirror();
    } else {
      this.bestill_prepareOutput();
    }
  }
  init() {
    this.stillf = [this.factor, this.factor, this.factor];
    let input = this.input;
    this.output = createImage(input.width, input.height);
    this.srcimage = createImage(this.output.width, this.output.height);
    this.srcimage2 = createImage(this.output.width, this.output.height);
    this.buf = [];
    // console.log('eff_bestill stillf', this.stillf);
  }
  bestill_prepareOutput() {
    // console.log('bestill_render this', this);
    if (!this.inited) {
      this.buf_init();
      return;
    }
    let { output, srcimage, buf, srcimage2 } = this;
    image_copy_to(srcimage, this.input);
    srcimage.loadPixels();
    output.loadPixels();
    srcimage2.loadPixels();
    // let rf = this.stillf[0];
    // let bf = this.stillf[1];
    // let gf = this.stillf[2];
    // let rm = rf - 1;
    // let bm = bf - 1;
    // let gm = gf - 1;
    let msum = 1 / (srcimage.width * srcimage.height);
    let sum = 0;
    let ff = this.factor;
    let fm = ff - 1;
    let w = srcimage.width;
    let h = srcimage.height;
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        let ii = (w * y + x) * 4;
        buf[ii] = (buf[ii] * fm + srcimage.pixels[ii]) / ff;
        buf[ii + 1] = (buf[ii + 1] * fm + srcimage.pixels[ii + 1]) / ff;
        buf[ii + 2] = (buf[ii + 2] * fm + srcimage.pixels[ii + 2]) / ff;
        output.pixels[ii] = buf[ii];
        output.pixels[ii + 1] = buf[ii + 1];
        output.pixels[ii + 2] = buf[ii + 2];
        sum +=
          srcimage2.pixels[ii] -
          srcimage.pixels[ii] +
          (srcimage2.pixels[ii + 1] - srcimage.pixels[ii + 1]) +
          (srcimage2.pixels[ii + 2] - srcimage.pixels[ii + 2]);
      }
    }
    output.updatePixels();
    if (frameCount % 20 == 0) {
      image_copy_to(srcimage2, srcimage);
    }
    globalThis.sum = sum;
    globalThis.bestillThis = this;
    sum *= msum;
    if (this.report && abs(sum) > 1) {
      console.log('sum', sum, 'frameCount', frameCount);
    }
  }
  bestill_render_mirror() {
    // console.log('bestill_render this', this);
    if (!this.inited) {
      this.buf_init();
      return;
    }
    let { output, srcimage, buf } = this;
    image_copy_to(srcimage, this.input);
    srcimage.loadPixels();
    output.loadPixels();
    let rf = this.stillf[0];
    let bf = this.stillf[1];
    let gf = this.stillf[2];
    let rm = rf - 1;
    let bm = bf - 1;
    let gm = gf - 1;
    let w = srcimage.width;
    let h = srcimage.height;
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        let ii = (w * y + x) * 4;
        let jj = (w * y + (w - 1 - x)) * 4;
        buf[ii + 0] = (buf[ii + 0] * rm + srcimage.pixels[ii + 0]) / rf;
        buf[ii + 1] = (buf[ii + 1] * bm + srcimage.pixels[ii + 1]) / bf;
        buf[ii + 2] = (buf[ii + 2] * gm + srcimage.pixels[ii + 2]) / gf;
        output.pixels[jj + 0] = buf[ii + 0];
        output.pixels[jj + 1] = buf[ii + 1];
        output.pixels[jj + 2] = buf[ii + 2];
      }
    }
    output.updatePixels();
  }
  buf_init() {
    this.inited = 1;
    let { buf, output } = this;
    let w = output.width;
    let h = output.height;
    image_copy_to(output, this.input);
    output.loadPixels();
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        let ii = (w * y + x) * 4;
        buf[ii + 0] = output.pixels[ii + 0];
        buf[ii + 1] = output.pixels[ii + 1];
        buf[ii + 2] = output.pixels[ii + 2];
      }
    }
  }
}
// window.eff_bestill = eff_bestill;
