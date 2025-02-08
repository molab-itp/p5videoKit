//
//
import { p5videoKit } from '../a/a_p5videoKit.js';

// import { a_ } from '../let/a_state.js';
// import { effectMeta_find } from '../core/effectMeta.js';
// import { ui_patch_update } from '../core-ui/ui_patch_bar.js';
// import { patch_remove_ipatch, patch_update_effIndex } from '../a/patch_inst.js';
// import { patch_create_other } from '../core-ui/ui_patch_create.js';

// import { ui_div_empty } from '../core-ui/ui_tools.js';

p5videoKit.prototype.ui_patch_eff_panes = async function () {
  //
  // if (this.a_.hide_ui_option) return;
  let droot = this.ui_div_empty('ipatch_eff');
  for (let ipatch = 0; ipatch < this.a_.ui.patches.length; ipatch++) {
    await this.create_patch(droot, ipatch);
  }
};

p5videoKit.prototype.create_patch = async function (droot, ipatch) {
  let div = this.ui_div_empty('patch_' + ipatch);
  droot.child(div);
  let aPatch = this.a_.ui.patches[ipatch];
  if (!aPatch.eff_props) {
    aPatch.eff_props = {};
  }
  // this.a_.ui.patches: [{ eff_spec: { ipatch: 0, imedia: 1, eff_label: 'show' } }],

  this.create_patch_selection(aPatch, ipatch, div);

  this.create_media_selection(aPatch, div);

  this.create_checkbox(aPatch, div, 'pipe', 'ipipe');

  this.create_checkbox(aPatch, div, 'hide', 'ihide');

  this.create_remove_patch(ipatch, div);

  await this.create_settings(aPatch, div);
};

p5videoKit.prototype.create_remove_patch = function (ipatch, div) {
  let nthis = this;
  let btn = createButton('Remove').mousePressed(function () {
    nthis.patch_remove_ipatch(ipatch);
  });
  div.child(btn);
};

p5videoKit.prototype.create_checkbox = function (aPatch, div, label, prop) {
  let chk = createCheckbox(label, aPatch.eff_spec[prop]);
  div.child(chk);
  chk.style('display:inline');
  let nthis = this;
  chk.changed(function () {
    let state = this.checked() ? 1 : 0;
    aPatch.eff_spec[prop] = state;
    nthis.ui_patch_update(aPatch);
  });
};

p5videoKit.prototype.create_patch_selection = async function (aPatch, ipatch, div) {
  let span = createSpan(`Effect${ipatch + 1}: `);
  div.child(span);
  let aSel = createSelect();
  div.child(aSel);
  // let lastGroup;
  for (let ii = 0; ii < this.a_.effectMetas.length; ii++) {
    let ent = this.a_.effectMetas[ii];
    let label = ent.ui_label || ent.label;
    let isel = ii;
    if (ent.ui_label) {
      isel = ii;
      label = ent.ui_label;
    } else {
      isel = -1;
      label = ent.label;
    }
    aSel.option(label, ii);
  }
  let effMeta = await this.effectMeta_find(aPatch.eff_spec.eff_label);
  let effIndex = effMeta.index;
  console.log('create_patch_selection effIndex', effIndex);
  aSel.selected(effIndex);
  let nthis = this;
  aSel.changed(function () {
    let effIndex = parseFloat(this.value());
    if (effIndex >= 0) {
      nthis.patch_update_effIndex(aPatch, effIndex);
    }
  });
};

p5videoKit.prototype.create_media_selection = function (aPatch, div) {
  // let span = createSpan(` Device${ipatch}: `);
  let span = createSpan(` Source: `);
  div.child(span);
  let aSel = createSelect();
  div.child(aSel);
  for (let ii = 0; ii < this.a_.mediaDivs.length; ii++) {
    aSel.option(this.a_.mediaDivs[ii].label, ii);
  }
  aSel.selected(aPatch.eff_spec.imedia);
  let nthis = this;
  aSel.changed(function () {
    let ii = this.value();
    aPatch.eff_spec.imedia = parseFloat(ii);
    nthis.ui_patch_update(aPatch);
  });
};

p5videoKit.prototype.create_settings = async function (aPatch, div) {
  // console.log('create_settings aPatch', aPatch);
  let effMeta = await this.effectMeta_find(aPatch.eff_spec.eff_label);
  if (effMeta.factory) {
    this.create_ui_for_meta(aPatch, div, effMeta.factory.meta_props);
  } else {
    console.log('create_settings MISSING factory effMeta', effMeta);
  }
  // Get props for imported module via import_factory
  // if (aPatch.import_factory) {
  //   create_ui_for_meta(aPatch.import_factory.meta_props);
  // }
  this.div_break(div);
  this.div_break(div);
};

p5videoKit.prototype.create_ui_for_meta = function (aPatch, div, meta) {
  if (Array.isArray(meta)) {
    this.create_ui_for_meta_arr(aPatch, div, meta);
  } else {
    this.create_ui_for_meta_dict(aPatch, div, meta);
  }
};

p5videoKit.prototype.create_ui_for_meta_arr = function (aPatch, div, arr) {
  let issueBreak = 1;
  for (let ent of arr) {
    if (issueBreak) {
      this.div_break(div);
    }
    let prop = ent.prop;
    issueBreak = this.patch_create_other(aPatch, div, prop, ent, issueBreak);
  }
};

p5videoKit.prototype.create_ui_for_meta_dict = function (aPatch, div, dict) {
  let issueBreak = 1;
  for (let prop in dict) {
    // eg. items = factor: [10, 50, 100 ... ]
    let items = dict[prop];
    if (prop.substring(0, 1) === '_') {
      prop = prop.substring(1);
      issueBreak = 1;
    }
    if (issueBreak) {
      this.div_break(div);
    }
    if (Array.isArray(items)) {
      // eg. items = factor: [10, 50, 100 ... ]
      this.patch_create_selection(aPatch, div, prop, items, issueBreak);
      issueBreak = 0;
    } else {
      // eg: _next: { button: next_action }
      issueBreak = this.patch_create_other(aPatch, div, prop, items, issueBreak);
    }
  }
};

p5videoKit.prototype.patch_create_selection = function (aPatch, div, prop, arr, issueBreak, defaultLabel) {
  // console.log('patch_create_selection prop', prop, 'arr', arr);
  let label = defaultLabel || prop;
  let span = createSpan(` ${label}:`);
  div.child(span);
  if (issueBreak) {
    span.style('margin-left', '10px');
  }
  let aSel = createSelect();
  div.child(aSel);
  for (let ii = 0; ii < arr.length; ii++) {
    aSel.option(arr[ii]);
  }
  // Get prop value or use issueBreak in arr as default if missing
  let aVal = aPatch.eff_props[prop];
  if (aVal === undefined) {
    aVal = arr[0];
    aPatch.eff_props[prop] = aVal;
  }
  let isNum = typeof aVal === 'number';
  // console.log('patch_create_selection prop', prop, 'aVal', aVal, 'isNum', isNum);
  aSel.selected(aVal);
  let nthis = this;
  aSel.changed(function () {
    let aVal = this.value();
    if (isNum) aVal = parseFloat(aVal);
    aPatch.eff_props[prop] = aVal;
    nthis.ui_patch_update(aPatch);
  });
  return aSel;
};

p5videoKit.prototype.patch_index1 = function (ind) {
  return this.a_.patch_instances[ind - 1];
};

p5videoKit.prototype.div_break = function (div) {
  div.child(createElement('br'));
};
