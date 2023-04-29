//

export default class eff_ticker {
  static meta_props = [
    { prop: 'display_copy_right', selection: [0, 1] },
    { prop: 'locale', selection: ['USA', 'BKYN', 'JA'] },
    { prop: 'most_lost_ndays', selection: [0, 31, 100, -1], br: 1 },
    // { prop: 'window_mode', selection: [0, 1] },
    // { prop: 'start_date', textInput: '2020-04-16' },
    { prop: 'start_date', selection: ['', '2020-04-16'] },
    {
      prop: 'dump',
      button: (inst, aPatch) => {
        inst.dump_action(aPatch);
      },
    },
  ];
  constructor(props) {
    Object.assign(this, props);

    this.width = this.eff_spec.urect.width;
    this.height = this.eff_spec.urect.height;
    this.output = createGraphics(width, height);
    // console.log('width', this.width);

    this.window_mode = this.most_lost_ndays != 0;

    // dynamic import - so we don't take a import hit until actually used.
    import('./sub/sketch.js?v={{vers}}')
      .then((module) => {
        // console.log('eff_ticker module', module);
        this.init();
      })
      .catch((err) => {
        console.log('eff_ticker err', err);
      });
  }
  prepareOutput() {
    console.log('eff_ticker prepareOutput stub');
  }
}

window.eff_ticker = eff_ticker;
// global class eff_ticker becomes the base for other methods, eg.
//  eff_ticker.prototype.init = function () {
// example of converting mult-script global to class methods.
