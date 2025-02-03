//

export default class eff_ticker {
  static meta_props = [
    { prop: 'display_copy_right', selection: [0, 1] },
    { prop: 'locale', selection: ['USA', 'NY', 'NYC', 'BKLYN', 'JA', 'GY'], br: 1 },
    { prop: 'display_tall', selection: [0, 1] },
    { prop: 'display_single_date', selection: [0, 1] },
    { prop: 'most_lost_ndays', selection: [0, 31, 100, -1], br: 1 },
    // { prop: 'start_date', textInput: '2020-04-16' },
    {
      prop: 'start_date',
      selection: [
        '', //
        '2020-04-16', // 4605, 85 -- USA most lives lost
        '2022-02-08', // 3001, 748
        '2020-11-20', // 2002, 303
        '2020-10-29', // 1002, 281
        '2022-07-23', // 102, 913
        '2020-03-18', // 10, 56
        '2020-02-29', // 1, 38
      ],
    },
    {
      prop: 'dump',
      button: (inst, aPatch) => {
        inst.dump_action(aPatch);
      },
    },
    {
      prop: 'toggleRun',
      button: (inst, aPatch) => {
        inst.a_run = !inst.a_run;
        console.log('eff_ticker a_run', inst.a_run);
      },
    },
    {
      prop: 'toggleJump',
      button: (inst, aPatch) => {
        if (inst.day_next < 100) {
          inst.day_next = inst.a_data.length - 30;
        } else {
          inst.day_next = 0;
        }
        console.log('eff_ticker day_next', inst.day_next);
      },
    },
    { prop: 'test_fast', selection: [0, 1, 2, 4] },
    { prop: 'test_skip_pause', selection: [0, 1] },
  ];
  constructor(props) {
    Object.assign(this, props);

    this.width = this.eff_spec.urect.width;
    this.height = this.eff_spec.urect.height;
    this.output = createGraphics(width, height);
    // console.log('width', this.width);

    // this.display_single_date = this.most_lost_ndays != 0;

    // dynamic import - so we don't take a import hit until actually used.
    import('./sub/sketch.js')
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
