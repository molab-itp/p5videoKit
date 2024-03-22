//
// import './core/a_main.js?v={{vers}}';

export class p5videoKit {
  //
  // let effects = [
  //   { label: 'example', import_path: 'module/eff_example', menu: 1 },

  constructor(config, p5_instance = p5.instance) {
    // console.log('p5videoKit p5_instance', p5_instance);
    // To work in p5 instance mode we need to use this.p5_instance on all p5 globals
    //
    this.room_name_prefix = '';
    // this.room_name_prefix = 'dev-';
    if (!p5_instance) {
      console.log('p5videoKit !!@ no p5_instance');
    }
    this.p5_instance = p5_instance;
    this.my_canvas = p5_instance._renderer;
    if (!this.my_canvas) {
      console.log('p5videoKit !!@ no my_canvas');
    }
    this.init(config).then(() => {
      console.log('videoKit.init done');

      // Report startup lapse time
      let init_lapse = window.performance.now() - dice.startTime;
      dice.dapi('stats', { init_lapse });
      //
    });
  }

  // init({ effects, settings }) {
  init(options) {
    // this.vk_setup(options, resolve);
    //
    let inpath = './core/a_main.js?v={{vers}}';
    return new Promise((resolve, reject) => {
      import(inpath)
        .then((module) => {
          // console.log('p5videoKit module', module);
          // this.vk_setup(effects, settings, resolve);
          this.vk_setup(options, resolve);
        })
        .catch((err) => {
          console.log('p5videoKit err', err, '\n inpath', inpath);
          reject();
        });
    });
  }

  draw() {
    console.log('p5videoKit draw stub');
  }
}
window.p5videoKit = p5videoKit;

// --

let dice = { warning: 1 };
window.dice = dice;

dice.dapi = function (arg, arg2, result) {
  if (dice.debug) console.log('dice arg=' + arg + ' arg2=' + JSON.stringify(arg2));
  var opt = arg;
  if (typeof arg2 != 'undefined') {
    opt = {};
    opt[arg] = arg2;
  }
  if (typeof result == 'string') {
    opt._result_str = result;
  } else if (typeof result == 'function') {
    var rtag = dice.result_rtag + '';
    opt._result_rtag = rtag;
    dice.result_rtag++;
    dice.result_funcs[rtag] = result;
  }
  if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.dice) {
    window.webkit.messageHandlers.dice.postMessage(opt);
  } else {
    if (dice.warning) {
      console.log('dice opt=' + JSON.stringify(opt));
    }
  }
};
dice.result_funcs = {};
dice.result_rtag = 1;
dice.result_rvalue = function (rtag, value) {
  var func = dice.result_funcs[rtag];
  if (func) {
    delete dice.result_funcs[rtag];
    func(value);
  } else {
    console.log('dice.result_rvalue missing rtag=' + rtag);
  }
};

dice.startTime = window.performance.now();
