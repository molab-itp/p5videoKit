import { image_copy } from '../util/image.js';

export default class eff_bright {
  static meta_props = {
    ncell: [16, 32, 64, 128, 256, 512],
    // scale: [16, 8, 16, 32, 64],
    back_color: [0, 51, 255, -1],
    src_color: [255, 0],
    fill: [1, 0],
    invert: [1, 0],
    shape: ['rect', 'circle', 'pix'],
  };
  constructor(props) {
    Object.assign(this, props);
    this.init();
  }
  prepareOutput() {
    this.draw_it();
  }
  init() {
    let { width, height } = this.input;
    this.src = createImage(width, height);
    this.output = createGraphics(width, height);
    this.xstep = Math.floor(width / this.ncell);
    this.ystep = this.xstep;
    // ui_log('eff_bright xstep', this.xstep, this.ystep);
  }
  draw_it() {
    image_copy({ to: this.src, from: this.input });
    let layer = this.output;
    if (this.back_color < 0) {
      layer.clear();
    } else {
      layer.background(this.back_color);
    }
    layer.noStroke();
    let doRect = this.shape == 'rect';
    let doCircle = this.shape == 'circle';
    let { width, height } = this.src;
    if (!this.fill) {
      layer.fill(this.src_color);
    }
    for (let y = 0; y < height; y += this.ystep) {
      for (let x = 0; x < width; x += this.xstep) {
        let col = this.src.get(x, y);
        let bright = (col[0] + col[1] + col[2]) / 3;
        if (this.invert) bright = 255 - bright;
        let mbright = map(bright, 0, 255, 0, this.xstep);
        if (this.fill) {
          layer.fill(col);
        }
        let x1 = x + (this.xstep - mbright) / 2;
        let y1 = y + (this.ystep - mbright) / 2;
        if (doRect) {
          layer.rect(x1, y1, mbright, mbright);
        } else if (doCircle) {
          layer.ellipse(x1, y1, mbright, mbright);
        } else {
          layer.image(this.src, x1, y1, mbright, mbright, x, y, this.xstep, this.ystep);
        }
      }
    }
  }
}

// image(img, x, y, [width], [height])
// image(img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight])

// copy(video, sx, sy, sw, sh, dx, dy, dw, dh)

// https://editor.p5js.org/jht1493/sketches/XFKWbV01m
// 11.4: Brightness getpixel copy
