//

export class Pane {
  // { backgImg, x0, y0, z0, width, height, initCentered, refBox, regionIndex }
  constructor(props) {
    //
    Object.assign(this, props);

    if (!this.regionIndex) this.regionIndex = 0;

    // console.log('Pane', this.label, 'width', this.width, 'height', this.height);

    // panX
    // panY
    // zoomIndex
    // zoomRatio

    this.pan_init();

    if (this.initCentered) {
      this.pan_center();
    }

    this.focusRect_init();

    this.anim_init();
  }

  render() {
    // must step values before render
    this.anim.stepValues();
    this.render_backgImg();
    if (this.anim.running) {
      // animation is running, don't touch props
      // this.focus_pan();
    } else if (this.refBox) {
      // when not animating show focus rect
      this.focus_focusRect();
      this.focusRect.render();
    }
  }

  // let targetProps = { panX: 1, panY: 1, zoomIndex: 1 };
  // pan_updateZoom(newValue) {

  focus() {
    this.focus_pan();
    this.focus_focusRect();
  }

  focus_animated() {
    this.anim.initValues({ panX: this.panX, panY: this.panY, zoomIndex: this.zoomIndex });
    if (this.regionIndex == 1) {
      let zoomOutIndex = 2.0;
      this.anim.addChange(3, { panX: this.panX, panY: this.panY, zoomIndex: this.zoomIndex }); // Pause
      this.focus_pan();
      this.focus_focusRect();
      this.anim.addChange(1, { panX: this.panX, panY: this.panY, zoomIndex: this.zoomIndex }); // pan and zoom
      this.anim.addChange(0, { panZoomIndex: this.zoomIndex }); // Pause
      this.anim.addChange(2, { panZoomIndex: zoomOutIndex }); // Zoom out
      this.anim.addChange(2, { panZoomIndex: zoomOutIndex }); // Pause
      this.anim.addChange(1, { panZoomIndex: this.zoomIndex }); // zoom in
    } else {
      this.focus_pan();
      this.focus_focusRect();
      this.anim.addChange(1.0, { panX: this.panX, panY: this.panY, zoomIndex: this.zoomIndex });
    }
  }

  anim_init() {
    this.anim = new Anim({ target: this });
  }

  focusRect_init() {
    let x0 = 0;
    let y0 = 0;
    let width = 0;
    let height = 0;
    let stroke = color(234, 171, 126); // color('yellow');
    let strokeWeight = 2;
    let shadowBlur = 15;
    let shadowColor = color(234, 171, 126); // color('white');
    this.focusRect = new Rect({ x0, y0, width, height, stroke, strokeWeight, shadowBlur, shadowColor });
  }

  render_backgImg() {
    let cm = this.canvasMap();
    let backgImg = this.backgImg;
    // zoom background image to the full width of the canvas
    let dx = this.x0;
    let dy = this.y0;
    let sx = this.panX;
    let sy = this.panY;
    image(backgImg, dx, dy, cm.dWidth, cm.dHeight, sx, sy, cm.sWidth, cm.sHeight);
  }

  // image(img, x, y, [width], [height])
  // image(img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight], [fit], [xAlign], [yAlign])

  set zoomIndex(newValue) {
    this._zoomIndex = newValue;
    this.zoomRatio = 1 / newValue;
  }

  get zoomIndex() {
    return this._zoomIndex;
  }

  set panZoomIndex(newValue) {
    this.pan_updateZoom(newValue);
  }

  get panZoomIndex() {
    return this._zoomIndex;
  }

  refEntry() {
    if (!this.refBox) {
      return { label: '', i: 0, regions: [{ x: 0, y: 0, w: this.width, h: this.height, z: 1 }] };
    }
    return this.refBox.refEntry();
  }

  get label() {
    return 'pane' + this.regionIndex;
  }

  region() {
    let ent = this.refEntry();
    let rg = ent.regions[this.regionIndex];
    // console.log(this.label, 'rg', JSON.stringify(rg));
    return rg;
  }

  focus_pan() {
    let rg = this.region();
    this.zoomIndex = rg.z;
    let cm = this.canvasMap();
    // console.log('focus cm', JSON.stringify(cm));
    // let x = rg.x + rg.w * 0.5 - cm.sWidth * 0.5;
    // let y = rg.y + rg.h * 0.5 - cm.sHeight * 0.5;
    // this.panX = floor(x);
    // this.panY = floor(y);
    this.panX = floor(rg.x + (rg.w - cm.sWidth) * 0.5);
    this.panY = floor(rg.y + (rg.h - cm.sHeight) * 0.5);
    // console.log('focus rg', JSON.stringify(rg));
  }

  focus_focusRect() {
    let rg = this.region();
    let crg = this.rgToCanvas(rg);
    this.focusRect.x0 = crg.x;
    this.focusRect.y0 = crg.y;
    this.focusRect.width = crg.w;
    this.focusRect.height = crg.h;
  }

  touchPoint(x, y) {
    let xhit = this.x0 < x && x < this.x0 + this.width;
    let yhit = this.y0 < y && y < this.y0 + this.height;
    return xhit && yhit;
  }

  pan_updateZoom(newValue) {
    let oRatio = this.zoomRatio;
    this.zoomIndex = newValue;

    let ww = this.backgImg.width;
    let hh = this.backgImg.height;

    let oW = floor(ww * oRatio * 0.5);
    let oH = floor(hh * oRatio * 0.5);

    let nW = floor(ww * this.zoomRatio * 0.5);
    let nH = floor(hh * this.zoomRatio * 0.5);

    this.panX = this.panX + oW - nW;
    this.panY = this.panY + oH - nH;
  }

  pan_init() {
    this.panX = 0;
    this.panY = 0;
    this.zoomIndex = this.z0;
    this.zoomRatio = 1 / this.zoomIndex;
  }

  pan_center() {
    this.zoomIndex = this.z0;

    let cm = this.canvasMap();

    this.panX = floor((cm.ww - cm.sWidth) * 0.5);
    this.panY = floor((cm.hh - cm.sHeight) * 0.5);
  }

  // { dWidth, dHeight, sWidth, sHeight, ww, hh };
  canvasMap() {
    let backgImg = this.backgImg;
    let ww = backgImg.width;
    let hh = backgImg.height;
    let rr = hh / ww;

    let dWidth = this.width;
    let dHeight = floor(dWidth * rr);
    if (dHeight < this.height) {
      dHeight = this.height;
      dWidth = floor(dHeight / rr);
    }

    let sWidth = floor(ww * this.zoomRatio);
    let sHeight = floor(hh * this.zoomRatio);
    if (this.width < dWidth) {
      let dr = this.width / dWidth;
      dWidth = this.width;
      sWidth = floor(sWidth * dr);
    }

    return { dWidth, dHeight, sWidth, sHeight, ww, hh };
  }

  mousePressed() {
    // console.log('Pane mousePressed', this.label);
    this.panX0 = mouseX;
    this.panY0 = mouseY;
  }

  mouseDragged() {
    this.panX += this.panX0 - mouseX;
    this.panY += this.panY0 - mouseY;
    this.panX0 = mouseX;
    this.panY0 = mouseY;
  }

  mouseReleased() {
    // console.log('Pane mouseReleased', this.label);
  }

  updateRefEntry(mouseXYs) {
    let ent = this.refEntry();

    if (mouseXYs.length >= 2) {
      this.updateEnt(ent, mouseXYs);
    } else {
      ent.regions[this.regionIndex].z = this.zoomIndex;
    }

    this.refBox.save_localStorage();
  }

  rgToCanvas(rg) {
    // map from screen to image coordinates

    let cm = this.canvasMap();
    let wr = cm.dWidth / cm.sWidth;
    let hr = cm.dHeight / cm.sHeight;

    // solve for ment.x
    // let x = floor((ment.x - this.x0) * rw) + this.panX;
    // let y = floor((ment.y - this.y0) * rh) + this.panY;

    let x = floor((rg.x - this.panX) * wr + this.x0);
    let y = floor((rg.y - this.panY) * hr + this.y0);
    let w = floor(rg.w * wr);
    let h = floor(rg.h * hr);

    return { x, y, w, h };
  }

  updateEnt(ent, mouseXYs) {
    // map from image to screen coordinates
    let cm = this.canvasMap();
    let rw = cm.sWidth / cm.dWidth;
    let rh = cm.sHeight / cm.dHeight;
    let regions = [];
    for (let ment of mouseXYs) {
      let x = floor((ment.x - this.x0) * rw) + this.panX;
      let y = floor((ment.y - this.y0) * rh) + this.panY;
      regions.push({ x, y });
    }
    if (regions[0].x > regions[1].x) {
      let temp = regions[1].x;
      regions[1].x = regions[0].x;
      regions[0].x = temp;
    }
    if (regions[0].y > regions[1].y) {
      let temp = regions[1].y;
      regions[1].y = regions[0].y;
      regions[0].y = temp;
    }
    let x = regions[0].x;
    let y = regions[0].y;
    let w = regions[1].x - x;
    let h = regions[1].y - y;
    let z = this.zoomIndex;
    ent.regions[this.regionIndex] = { x, y, w, h, z };
  }
}

globalThis.Pane = Pane;
