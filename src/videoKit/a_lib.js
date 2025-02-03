//
// for lib reference
// https://molab-itp.github.io/p5moRelease/videoKit/368/a_lib.js
// <script type="module" src="./videoKit/a_lib.js"></script>

import { p5videoKit } from './p5videoKit.js';

import './core/a_main.js';

//
// my.dbase = await mo_dbase_init(my)
//
export async function p5videoKit_init(config, p5_instance = p5.instance) {
  console.log('p5videoKit_init config', config, 'p5_instance', p5_instance);
  let vk = new p5videoKit(config, p5_instance);
  await vk.init(config);
  return vk;
}
globalThis.p5videoKit_init = p5videoKit_init;
// explict global needed for browser non-module reference

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
