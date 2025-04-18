import { PeriodTimer } from '../util/PeriodTimer.js';
import { image_copy, image_move } from '../util/image.js';
import eff_bestill from '../effects/eff_bestill.js';

export default class eff_diff {
  static meta_props = {
    threshold: [16, 1, 2, 4, 8, 16, 32, 64, 128, 200],
    period: [0, 0, 0.5, 1, 2, 5, 10, 20, 30, 60],
    back_color: ['clear', 'rgb(0,0,0)', 'rgb(50,50,50)', 'rgb(100,100,100)', 'rgb(200,200,200)', 'rgb(255,255,255)'],
    smooth: [0, 10, 1, 5, 10, 50, 100, 200],
    hold: [0, 0.001, 0.005, 0.01, 0.5, 1, 5, 10, 20],
  };
  constructor(props) {
    Object.assign(this, props);
    this.init();
  }
  prepareOutput() {
    this.diff_prepareOutput();
    if (this.period) {
      this.period_timer.check(() => {
        this.inited = 0;
        this.iimage = 0;
      });
    }
  }
  init() {
    this.period_timer = new PeriodTimer(this.period);
    let image1 = createImage(this.input.width, this.input.height);
    let image2 = createImage(image1.width, image1.height);
    this.diffimage = createImage(image1.width, image1.height);
    if (this.hold) {
      this.hold_level = this.hold / 100;
      this.output = createImage(image1.width, image1.height);
    } else {
      this.output = this.diffimage;
    }
    this.images = [image1, image2];
    this.iimage = 0;
    if (this.back_color === 'clear') {
      this.back_color_arr = [0, 0, 0, 0];
    } else {
      let col = color(this.back_color);
      // ui_log('back_color', this.back_color, 'col', col);
      this.back_color_arr = [];
      this.back_color_arr[0] = red(col);
      this.back_color_arr[1] = green(col);
      this.back_color_arr[2] = blue(col);
      this.back_color_arr[3] = 255;
    }
    if (this.smooth) {
      this.smooth_init();
    }
    this.maxdiff = image1.width * image1.height;
  }
  diff_prepareOutput() {
    if (!this.inited) {
      this.image_init();
      return;
    }
    // ui_log('diff_render iimage', this.iimage);
    let image1 = this.images[this.iimage];
    image_copy({ to: image1, from: this.input });
    this.iimage = (this.iimage + 1) % 2;
    let image2 = this.images[this.iimage];
    let diffimage = this.diffimage;
    image1.loadPixels();
    image2.loadPixels();
    diffimage.loadPixels();
    let w = image1.width;
    let h = image1.height;
    let threshold = this.threshold * 3;
    let back_color_arr = this.back_color_arr;
    let diff;
    let ndiff = 0;
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        let ii = (w * y + x) * 4;
        diff =
          Math.abs(image2.pixels[ii + 0] - image1.pixels[ii + 0]) +
          Math.abs(image2.pixels[ii + 1] - image1.pixels[ii + 1]) +
          Math.abs(image2.pixels[ii + 2] - image1.pixels[ii + 2]);
        if (diff > threshold) {
          diffimage.pixels[ii + 0] = image1.pixels[ii + 0];
          diffimage.pixels[ii + 1] = image1.pixels[ii + 1];
          diffimage.pixels[ii + 2] = image1.pixels[ii + 2];
          diffimage.pixels[ii + 3] = 255;
          ndiff++;
        } else {
          diffimage.pixels[ii + 0] = back_color_arr[0];
          diffimage.pixels[ii + 1] = back_color_arr[1];
          diffimage.pixels[ii + 2] = back_color_arr[2];
          diffimage.pixels[ii + 3] = back_color_arr[3];
        }
      }
    }
    diffimage.updatePixels();
    if (this.hold) {
      let r = round(ndiff / this.maxdiff, 4);
      // ui_log('diff_render r', r, 'hold_level', this.hold_level);
      if (r > this.hold_level) {
        image_move({ to: this.output, from: this.diffimage });
      }
    }
    if (this.smooth) {
      this.smooth_prepareOutput();
    }
  }
  image_init() {
    this.inited = 1;
    let image2 = this.images[(this.iimage + 1) % 2];
    // ui_log('image_init iimage', this.iimage, 'image2', image2);
    image_copy({ to: image2, from: this.input });
  }
  // -- smooth --
  smooth_init() {
    // this.stillf = [this.smooth, this.smooth, this.smooth];
    // this.buf = [];
    this.bestill = new eff_bestill({
      input: this.output,
      factor: this.smooth,
    });
  }
  smooth_prepareOutput() {
    this.bestill.bestill_prepareOutput();
    image_copy({ to: this.output, from: this.bestill.output });
  }
}
