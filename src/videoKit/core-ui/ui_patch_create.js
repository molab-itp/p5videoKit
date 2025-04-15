//
//
import { p5videoKit } from '../a/a_p5videoKit.js';

// import { a_ } from '../let/a_state.js';
// import { ui_patch_update } from '../core-ui/ui_patch_bar.js';
// import { div_break } from '../core-ui/ui_patch_eff.js';

// style:
// text_input:
// message:
// button:
// slider:

// { button: next_action }

// message_prop1: {
//   message: 'An example effect',
// },

// text_prop: {
//   text_input: 'Hello world!',
// },

// _movie_url: {
//   style: 'width:80%',
//   // text_input: './external/media/webdb/jht/IMG_4491.JPEG',
//   text_input: './external/media/p5videoKit-gallery-yoyo/live_gallery',
// },

// slider1_prop: {
//   style: 'width:20%',
//   slider: { min: 0, max: 100 },
// },

// {
//   prop: 'num_prop2',
//   label: 'prop2',
//   selection: ['red', 'green', 'yellow'],
// };

p5videoKit.prototype.patch_create_other = function (aPatch, div, prop, items, issueBreak) {
  // ui_log('create_other prop', prop, 'items', items);
  let breakSeen = 0;
  let ent = { aPatch, div, prop };
  for (let iprop in items) {
    let item = items[iprop];
    ent.item = item;
    // ui_log('create_other iprop', iprop, 'item', item);
    switch (iprop) {
      case 'style':
        ent.defaultStyle = item;
        break;
      case 'label':
        ent.defaultLabel = item;
        break;
      case 'default':
        ent.defaultValue = item;
        break;
    }
  }
  for (let iprop in items) {
    let item = items[iprop];
    ent.item = item;
    // ui_log('create_other iprop', iprop, 'item', item);
    switch (iprop) {
      case 'style':
      case 'label':
      case 'default':
        break;
      // case 'style':
      //   ent.defaultStyle = item;
      //   break;
      // case 'label':
      //   ent.defaultLabel = item;
      //   break;
      case 'button':
        ent.div.child(createSpan(' '));
        let label = ent.defaultLabel || prop;
        ent.elm = createButton(label).mousePressed(() => {
          this.button_action(item, aPatch);
        });
        ent.div.child(ent.elm);
        break;
      case 'textInput':
      case 'text_input': // legacy
        create_textInput(this, ent);
        break;
      case 'span':
      case 'message': // legacy
        ent.elm = createSpan(` ${item}`);
        ent.div.child(ent.elm);
        break;
      case 'slider':
        create_slider(this, ent);
        break;
      case 'selection':
        create_selection(this, ent);
        break;
      case 'prop':
        break;
      case 'br':
        breakSeen = 1;
        break;
      default:
        ui_log('create_other !!@ Unkown type=' + iprop);
        break;
    }
  }
  if (ent.elm) {
    if (issueBreak) {
      let firstElm = ent.labelSpan || ent.elm;
      firstElm.style('margin-left:10px');
    }
    if (ent.defaultStyle) {
      ent.elm.style(ent.defaultStyle);
    }
    return breakSeen; // maybe break
  } else {
    // items = {} for break on next entry
    return 1; // issueBreak
  }
};

p5videoKit.prototype.button_action = function (item, aPatch) {
  let inst = this.a_.patch_instances[aPatch.eff_spec.ipatch];
  item(inst, aPatch);
};

function create_default_label(ent) {
  let { div, prop, defaultLabel } = ent;
  defaultLabel = defaultLabel || prop;
  if (defaultLabel) {
    let span = createSpan(` ${defaultLabel}:`);
    div.child(span);
    ent.labelSpan = span;
  }
}

function create_textInput(nthis, ent) {
  // ui_log('createTextInput ent', ent);
  let { item, aPatch, div, prop } = ent;
  create_default_label(ent);
  let oldVal = aPatch.eff_props[prop];
  if (oldVal === undefined) {
    oldVal = '' + item;
    aPatch.eff_props[prop] = oldVal;
  }
  ent.elm = createInput(oldVal).input(function () {
    let aVal = this.value();
    ui_log('text_input ' + aVal);
    aPatch.eff_props[prop] = aVal;
    nthis.ui_patch_update(aPatch);
  });
  ent.div.child(ent.elm);
}

function create_selection(nthis, ent) {
  // ui_log('create_selection ent', ent);
  let { item, aPatch, div, prop } = ent;
  create_default_label(ent);
  let arr = item;
  let aSel = createSelect();
  div.child(aSel);
  for (let ii = 0; ii < arr.length; ii++) {
    aSel.option(arr[ii]);
  }
  // Get prop value or use first in arr as default if missing
  let aVal = aPatch.eff_props[prop];
  if (aVal === undefined) {
    aVal = arr[0];
    aPatch.eff_props[prop] = aVal;
  }
  let isNum = typeof aVal === 'number';
  // ui_log('patch_create_selection prop', prop, 'aVal', aVal, 'isNum', isNum);
  if (aVal === null) {
    aVal = '';
  }
  aSel.selected(aVal);
  aSel.changed(function () {
    let aVal = this.value();
    if (isNum) aVal = parseFloat(aVal);
    aPatch.eff_props[prop] = aVal;
    nthis.ui_patch_update(aPatch);
  });
  ent.elm = aSel;
}

// ent = { aPatch, div, prop, item };
// item = {min: 0, max: 100}
function create_slider(nthis, ent) {
  // ui_log('create_slider ent', ent);
  let { item, aPatch, div, prop } = ent;
  create_default_label(ent);
  let min = item.min || 0;
  let max = item.max || 1.0;
  let step = item.step || 0; // could be undefined
  let oldVal = aPatch.eff_props[prop];
  // ui_log('create_slider oldVal', oldVal);
  if (oldVal === undefined) {
    if (ent.defaultValue !== undefined) {
      oldVal = ent.defaultValue;
    } else {
      oldVal = min + (max - min) / 2;
    }
    aPatch.eff_props[prop] = oldVal;
  }
  // ui_log('create_slider oldVal ', oldVal, 'type', typeof oldVal);

  let valSpan = createSpan(formatNumber(oldVal));
  // ui_log('create_slider valSpan', valSpan);
  // createSlider(min, max, [value], [step])
  ent.elm = createSlider(min, max, oldVal, step).input(function () {
    let aVal = this.value();
    // ui_log('create_slider aVal ', aVal, 'type', typeof aVal);
    aPatch.eff_props[prop] = aVal;
    nthis.ui_patch_update(aPatch);
    valSpan.elt.innerHTML = formatNumber(aVal) + '';
  });
  div.child(ent.elm);
  div.child(valSpan);
}

function formatNumber(num) {
  let prec = 1000;
  return int(num * prec) / prec;
}
