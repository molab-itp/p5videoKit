//
import { a_ } from '../let/a_state.js?v=413';

// Set a ui property that's stored into local storage
export function ui_prop_set(prop, value) {
  a_.ui[prop] = value;
  let str = JSON.stringify([value]);
  store_set('a_.ui_' + prop, str);
}

// Get or set a ui property that's stored into local storage
function ui_prop_ref(prop, value) {
  if (value === undefined) {
    return a_.ui[prop];
  } else {
    a_.ui[prop] = value;
    let str = JSON.stringify([value]);
    store_set('a_.ui_' + prop, str);
  }
}

// Return prefixed property name
// eg.
function store_ref(prop) {
  // Store-A
  // 0123456
  return a_.store_prefix + a_.store_name.substring(6, 7) + prop.substring(1);
}

export function store_set(prop, value) {
  localStorage.setItem(store_ref(prop), value);
}

export function store_get(prop) {
  return localStorage.getItem(store_ref(prop));
}

export function store_remove(prop) {
  return localStorage.removeItem(store_ref(prop));
}

export function store_clear_all() {
  localStorage.clear();
}

export function ui_message(msg, opt) {
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
}

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
