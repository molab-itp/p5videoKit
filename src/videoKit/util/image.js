//
// copies the image to the src at full dimensions
export function image_copy({ to, from }) {
  // ui_log('image_copy to', to, 'from', from);
  // !!@ post p5js 1.8.0 in src/image/pixels.js/_copyHelper
  // loadPixels removed
  from.loadPixels();
  to.copy(from, 0, 0, from.width, from.height, 0, 0, to.width, to.height);
}
// image.copy(fromImage, sx, sy, sw, sh, dx, dy, dw, dh)

// Copy the pixels from src to dest.
// Use when src has alpha that you want to preserve in dest
export function image_move({ to: dest, from: src }) {
  dest.loadPixels();
  src.loadPixels();
  let dpixels = dest.pixels;
  let spixels = src.pixels;
  let n = dpixels.length;
  if (n != spixels.length) {
    ui_log('image_move!!@ lengths differ', n, spixels.length);
    return;
  }
  while (n-- > 0) dpixels[n] = spixels[n];
  dest.updatePixels();
}

function image_scaled(img) {
  let w = width;
  let h = height;
  let w2 = img.width;
  let h2 = img.height;
  let hw = h2 / w2;
  if (hw < 1) {
    h = w * hw;
  } else {
    w = h / hw;
  }
  image(img, 0, 0, w, h, 0, 0, w2, h2);
}

// image_scaled_pad(img, urect, { flushRight })
export function image_scaled_pad(img, urect, opts) {
  opts = opts || {};
  let flushRight = opts.flushRight;
  let fliph = opts.fliph;
  let flipv = opts.flipv;
  if (!urect) urect = { width, height, x0: 0, y0: 0 };
  let pw = urect.width;
  let ph = urect.height;
  let iw = img.width;
  let ih = img.height;
  let rr = ih / iw;
  if (ph == ih) {
    // If pad height matches image don't scale - for data-posenet
  } else if (rr < 1) {
    ph = pw * rr;
  } else {
    pw = ph / rr;
  }
  // ui_log('urect.width', urect.width, 'iw', iw, 'ih', ih, 'pw', pw, 'ph', ph);
  // urect.width 270 iw 640 ih 480 pw 270 ph 480
  let dx = urect.x0;
  let dy = urect.y0;
  if (flushRight) {
    dx = dx + (urect.width - pw) / 2;
  }
  if (fliph || flipv) {
    push();
    translate(fliph ? dx + pw : 0, flipv ? dy + ph : 0);
    scale(fliph ? -1 : 1, flipv ? -1 : 1);
    if (fliph) dx = 0;
    if (flipv) dy = 0;
    image(img, dx, dy, pw, ph, 0, 0, iw, ih);
    pop();
  } else {
    image(img, dx, dy, pw, ph, 0, 0, iw, ih);
  }
}

export function image_scaled_layer(layer, img, urect, align_center, flip_h) {
  if (!img) return;
  if (!urect) urect = { width, height, x0: 0, y0: 0 };
  let pw = urect.width;
  let ph = urect.height;
  let iw = img.width;
  let ih = img.height;
  let rr = ih / iw;
  let dx = 0;
  let dy = 0;
  if (rr < 1) {
    ph = pw * rr;
    if (align_center) {
      dy = dy + (urect.height - ph) / 2;
    }
  } else {
    pw = ph / rr;
    if (align_center) {
      dx = dx + (urect.width - pw) / 2;
    }
  }
  // ui_log('layer iw', iw, 'ih', ih, 'pw', pw, 'ph', ph);
  if (flip_h) {
    layer.push();
    layer.scale(-1, 1);
  }
  layer.clear();
  // layer.image(img, dx, dy, pw, ph, 0, 0, iw, ih);
  if (flip_h) {
    dx = -pw;
  }
  layer.image(img, dx, dy, pw, ph, 0, 0, iw, ih);
  if (flip_h) {
    layer.pop();
  }
  // scale(-1, 1);
  // image(img, -width, 0);
}

function image_scaled_pad_source(img, urect, src) {
  ui_log('image_scaled_pad_source src', JSON.stringify(src));
  if (!urect) urect = { width, height, x0: 0, y0: 0 };
  let pw = urect.width;
  let ph = urect.height;
  let iw = img.width;
  let ih = img.height;
  let rr = ih / iw;
  if (rr < 1) {
    ph = pw * rr;
  } else {
    pw = ph / rr;
  }
  let dx = urect.x0;
  let dy = urect.y0;
  let sx = src.x;
  let sy = src.y;
  let sw = src.width;
  let sh = src.height;
  image(img, dx, dy, pw, ph, sx, sy, sw, sh);
}

// image(img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight])
