//
//
import { p5videoKit } from '../a/a_p5videoKit.js?v=413';

// import { ui_message as u_ui_message } from '../core-ui/ui_message.js?v=413';

// for progress message from tasks like facemesh that may take time to load
// imsg in index.html <div id="imsg" ....

//
// videoKit.ui_message(msg, opt)
//
p5videoKit.prototype.ui_message = function (msg, opt) {
  console.log('ui_message msg', msg);
  // console.log('ui_message msg', msg, 'opt', opt);
  if (opt && opt.initTimer) {
    dice.startTime = window.performance.now();
  }
  let imsg = select('#imsg');
  if (!imsg) return;
  if (msg) {
    msg = ' [ ' + msg + ' ] ';
    msgText = msg;
    if (msgIntervalId > 0) {
      clearInterval(msgIntervalId);
    }
    msgIntervalId = setInterval(report_message, msgIntervalPeriod);
  } else {
    if (msgIntervalId > 0) {
      clearInterval(msgIntervalId);
      msgIntervalId = -1;
    }
  }
  imsg.html(msg);
  imsg.style(msg ? 'display:inline' : 'display:none');
};

let msgIntervalId = -1;
let msgIntervalPeriod = 100;
let msgText;

// Lapse time as seconds since dice.startTime
function report_message() {
  let imsg = select('#imsg');
  if (!imsg) return;
  let lapse = window.performance.now() - dice.startTime;
  lapse = lapse / 1000;
  lapse = Math.floor(lapse * 100) / 100;
  let msg = lapse + ' ' + msgText;
  imsg.html(msg);
  imsg.style(msg ? 'display:inline' : 'display:none');
}
