//
import { p5videoKit } from '../a/a_p5videoKit.js';

// import { a_ } from '../let/a_state.js';
// import { pad_layout_update, ui_refresh, ui_patch_update } from '../core-ui/ui_patch_bar.js';
// import { ui_patch_eff_panes } from '../core-ui/ui_patch_eff.js';
// import { effectMeta_find } from '../core/effectMeta.js';

// import { ui_div_empty } from '../core-ui/ui_tools.js';

//
// videoKit.patch_inst_create(eff_label, imedia, ipatch, eff_spec, eff_props)
//
p5videoKit.prototype.patch_inst_create = function (eff_label, imedia, ipatch, eff_spec, eff_props) {
  let effMeta = this.effectMeta_find(eff_label);
  if (!effMeta) {
    console.log('patch_inst_create !!@ No eff_label', eff_label);
    return;
  }
  if (!effMeta.factory) {
    console.log('patch_inst_create !!@ No factory', effMeta);
    return;
  }
  let media = this.a_.mediaDivs[imedia];
  if (!media) {
    // console.log('NO media imedia', imedia);
  } else if (!media.ready('patch_inst')) {
    // if (!media.notReadyWarningIssued) {
    //   console.log('imedia', imedia, 'NOT media.ready');
    //   media.notReadyWarningIssued = 1;
    // }
    let inst = this.a_.patch_instances[ipatch];
    // console.log('NOT media.ready inst', inst);
    if (inst && inst.livem_step) {
      console.log('livem_step imedia', imedia);
      inst.livem_step();
    }
    return;
  }
  // else if (media.notReadyWarningIssued) {
  //   console.log('imedia', imedia, 'media.ready');
  //   media.notReadyWarningIssued = 0;
  // }
  let inst = this.a_.patch_instances[ipatch];
  if (!inst) {
    if (!media) {
      // console.log('NO media for init imedia', imedia);
      if (this.a_.mediaDivs.length > 1) {
        // Wait for input to be ready if there are more than 1
        // possible live inputs
        console.log('Exit - NO media for init imedia', imedia);
        return;
      }
      // !!@ Bug - will allow inst before input ready
      // Default to canvas if no other possible inputs
      // media = this.a_.mediaDivs[0];

      // Exit until media ready
      console.log('Exit until media ready', imedia);
      return;
    }
    // !!@ TODO replace with createEffect
    let input = media.capture;
    let videoKit = this;
    let init = Object.assign({ videoKit, eff_spec, input, media }, eff_props);
    inst = new effMeta.factory(init);
    this.a_.patch_instances[ipatch] = inst;
    this.mouse_event_check(inst);
  } else if (media) {
    // !!@ for tile - seek media up to date for live device connect/disconnect
    inst.media = media;
    inst.input = media.capture;
  }
  return inst;
};

// p5videoKit.prototype.createEffect = function ({ eff_label, imedia, urect, props, eff_spec }) {

p5videoKit.prototype.patch_add = function (aPatch) {
  aPatch.eff_spec.ipatch = this.a_.ui.patches.length;
  this.a_.ui.patches.push(aPatch);
  this.ui_patch_update(aPatch);
  this.ui_refresh();
  this.pad_layout_update();
};

p5videoKit.prototype.patch_remove_ipatch = function (ipatch) {
  patch_remove_at(ipatch);
};

// Remove patch by index
function patch_remove_at(ipatch) {
  // Don't delete first patch
  // if (ipatch === 0) {
  //   return;
  // }
  this.patch_inst_update(ipatch);
  this.a_.ui.patches.splice(ipatch, 1);
  this.a_.patch_instances.splice(ipatch, 1);
  this.ui_div_empty('patch_' + ipatch);
  this.ui_patch_update();
  this.ui_refresh();
  this.pad_layout_update();
}

// Remove the last patch
function patch_remove_last() {
  let ipatch = this.a_.ui.patches.length - 1;
  patch_remove_at(ipatch);
}

p5videoKit.prototype.patch_update_effIndex = function (aPatch, effIndex) {
  let eff_spec = aPatch.eff_spec;
  let ipatch = eff_spec.ipatch;
  eff_spec.eff_label = this.a_.effectMetas[effIndex].label;
  this.a_.ui.patches[ipatch] = { eff_spec, eff_props: {} };
  this.ui_patch_update(aPatch);
  this.ui_patch_eff_panes();
};

p5videoKit.prototype.patch_instances_clear_all = function () {
  // All patch instances will be re-created on next draw
  console.log('patch_instances_clear_all');
  for (let ipatch = 0; ipatch < this.a_.patch_instances.length; ipatch++) {
    this.patch_inst_update(ipatch);
  }
  this.a_.patch_instances = [];
};

p5videoKit.prototype.patch_inst_update = function (ipatch) {
  let inst = this.a_.patch_instances[ipatch];
  // console.log('ui_patch_update inst', inst);
  // Clean up old instance before it's zaped
  this.patch_inst_deinit(inst);
};

p5videoKit.prototype.patch_inst_deinit = function (inst) {
  if (!inst) return;
  if (inst.deinit) {
    inst.deinit();
  } else if (inst.output && inst.output.remove) {
    // console.log('patch_inst_deinit REMOVING inst.output', inst.output);
    inst.output.remove();
  }
};
