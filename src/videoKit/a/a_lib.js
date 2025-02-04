//
import { p5videoKit } from '../a/p5videoKit.js?v=412';

import '../a/a_setup.js?v=412';
import '../a/createEffect.js?v=412';
import '../a/patch_inst.js?v=412';
import '../a/record_video.js?v=412';

//
// videoKit = await p5videoKit_init(config, p5_instance)
//
export function p5videoKit_init(config, p5_instance = p5.instance) {
  //
  console.log('p5videoKit_init config', config, 'p5_instance', p5_instance);
  let videoKit = new p5videoKit(config, p5_instance);
  return videoKit;
}
globalThis.p5videoKit_init = p5videoKit_init;
// p5videoKit_init explict global needed for browser non-module reference

//
// dice.dapi
//  used on mobile device to communicate with native code
//
let dice = { warning: 0 };
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

//
// called by videoKit.draw once only based on this.a_initStarted
// videoKit.init()
//
p5videoKit.prototype.init = async function () {
  //
  await this.setup(this.config);

  // Report startup lapse time
  let init_lapse = window.performance.now() - dice.startTime;
  dice.dapi('stats', { init_lapse });
};
