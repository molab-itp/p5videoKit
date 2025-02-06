//
//
import { p5videoKit } from '../a/a_p5videoKit.js?v=413';

//
// import { a_ } from '../let/a_state.js?v=413';

// Set a ui property that's stored into local storage
p5videoKit.prototype.ui_prop_set = function (prop, value) {
  this.a_.ui[prop] = value;
  let str = JSON.stringify([value]);
  this.store_set('a_.ui_' + prop, str);
};

// Get or set a ui property that's stored into local storage
function ui_prop_ref(prop, value) {
  if (value === undefined) {
    return this.a_.ui[prop];
  } else {
    this.a_.ui[prop] = value;
    let str = JSON.stringify([value]);
    this.store_set('a_.ui_' + prop, str);
  }
}

// Return prefixed property name
// eg.
p5videoKit.prototype.store_ref = function (prop) {
  // Store-A
  // 0123456
  return this.a_.store_prefix + this.a_.store_name.substring(6, 7) + prop.substring(1);
};

p5videoKit.prototype.store_set = function (prop, value) {
  localStorage.setItem(this.store_ref(prop), value);
};

p5videoKit.prototype.store_get = function (prop) {
  return localStorage.getItem(this.store_ref(prop));
};

p5videoKit.prototype.store_remove = function (prop) {
  return localStorage.removeItem(this.store_ref(prop));
};

p5videoKit.prototype.store_clear_all = function () {
  localStorage.clear();
};
