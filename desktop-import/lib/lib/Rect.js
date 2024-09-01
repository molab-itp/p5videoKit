//
export class Rect {
  // { x0, y0, width, height, stroke, strokeWeight, shadowBlur, shadowColor }
  constructor(props) {
    //
    Object.assign(this, props);
  }

  render() {
    noFill();
    stroke(this.stroke);
    strokeWeight(this.strokeWeight);
    // drawingContext.shadowBlur = this.shadowBlur; // 12;
    // drawingContext.shadowColor = this.shadowColor; // color(207, 7, 99);
    let corner = 5;
    rect(this.x0, this.y0, this.width, this.height, corner);
  }
}

globalThis.Rect = Rect;
