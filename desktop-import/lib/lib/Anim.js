//
export class Anim {
  // { target, loop, time, action }
  //
  constructor(props) {
    //
    Object.assign(this, props);
    // convert time from seconds to milliseconds
    this.time *= 1000;
    this.running = 0;
    this.startTime = Date.now();
  }

  start() {
    this.startTime = Date.now();
    this.running = 1;
  }

  updateTime(newTime) {
    // convert time from seconds to milliseconds
    this.time = newTime * 1000;
  }

  restart() {
    if (this.running) {
      this.start();
    }
  }

  // { action, loop  }
  step(args) {
    let action = this.action;
    let loop = this.loop;
    if (args) {
      if (args.action != undefined) action = args.action;
      if (args.loop != undefined) loop = args.loop;
    }
    let now = Date.now();
    let lapse = now - this.startTime;
    if (lapse > this.time) {
      this.startTime = now;
      this.running = loop;
      if (action && this.running) {
        action();
      }
    }
  }

  lapse() {
    let now = Date.now();
    let lapse = now - this.startTime;
    return lapse / 1000.0;
  }

  // target
  // values { panX, panY, zoomIndex, zoomRatio  }
  //   initValues
  //   endValues
  //     start + (end - start) * perCent
  // startTime

  // Establish starting values
  //  eg: values: { panX:1, panY:1, zoomIndex:1, zoomRatio:1 }
  initValues(values) {
    this.changes = [];
    this.changes.push({ values });
    this.startTime = Date.now();
    this.running = 1;
    this.changeIndex = 0;
  }

  // Establish ending values
  addChange(time, values) {
    // convert time from seconds to milliseconds
    time *= 1000;
    this.changes.push({ time, values });
    // console.log('addChange changes n', this.changes.length, 'running', this.running);
  }

  // Update targetProps in target object for given time
  stepValues() {
    if (!this.running) {
      // console.log('stepValues return changeIndex', this.changeIndex, 'running', this.running);
      return;
    }
    let last = this.changes[this.changeIndex];
    let next = this.changes[this.changeIndex + 1];
    let lastValues = last.values;
    let nextValues = next.values;
    let time = next.time;
    if (time <= 0) {
      for (let prop in nextValues) {
        this.target[prop] = nextValues[prop];
      }
      this.nextChange();
      return;
    }
    let perCent = (Date.now() - this.startTime) / time;
    if (perCent >= 1.0) {
      perCent = 1.0;
      this.nextChange();
    }
    // console.log('perCent', perCent);
    for (let prop in nextValues) {
      let last = lastValues[prop];
      let next = nextValues[prop];
      if (last == undefined) {
        // console.log(this.target.regionIndex, 'changeIndex', this.changeIndex, 'continue prop', prop, 'last', last);
        this.target[prop] = next;
        continue;
      }
      let val = last + (next - last) * perCent;
      // console.log('prop', prop, 'last', last, 'next', next, 'val', val);
      this.target[prop] = val;
    }
  }

  nextChange() {
    this.changeIndex++;
    this.startTime = Date.now();
    if (this.changeIndex >= this.changes.length - 1) {
      this.running = 0;
    }
    // console.log(this.target.regionIndex, 'stepValues changeIndex', this.changeIndex, 'running', this.running);
  }

  // Update targetProps to the ending values and mark animation as done
  // finish() {
  //   for (let prop in this.targetProps) {
  //     this.target[prop] = this._endValues[prop];
  //   }
  //   this.running = 0;
  //   console.log('finish changeIndex', this.changeIndex, 'running', this.running);
  // }
}

globalThis.Anim = Anim;
