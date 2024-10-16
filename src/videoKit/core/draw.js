//
import { ui_restore_store } from '../core-ui/ui_restore.js?v={{vers}}';
import { init_mediaDivs } from './create_mediaDiv.js?v={{vers}}';
import { ui_create, update_ui, ui_message } from '../core-ui/a_ui_create.js?v={{vers}}';
import { media_enum } from './create_mediaDevices.js?v={{vers}}';
import { pad_layout_update } from '../core-ui/ui_patch_bar.js?v={{vers}}';
import { livem_restore } from '../core-ui/ui_live.js?v={{vers}}';
import { patch_index1 } from '../core-ui/ui_patch_eff.js?v={{vers}}';
import { image_scaled_pad } from '../util/image.js?v={{vers}}';

p5videoKit.prototype.setup = function (options, resolve) {
  ui_message('loading...');
  a_.videoKit = this;
  a_.my_canvas = this.my_canvas;
  // ui_restore_store(effects, settings, (sizeResult) => {
  ui_restore_store(options, (sizeResult) => {
    console.log('videoKit setup sizeResult', sizeResult);
    resizeCanvas(sizeResult.width, sizeResult.height);

    init_mediaDivs();

    // a_.hide_ui_option = 0;
    // if (!a_.hide_ui_option) {
    ui_create();
    // }

    // console.log('a_.ui.hold_capture', a_.ui.hold_capture);
    if (!a_.ui.hold_capture) {
      // console.log('a_.ui.hold_capture media_enum', a_.ui.hold_capture);
      media_enum();
    }

    livem_restore();

    ui_message('');

    this.a_initDone = 1;

    resolve();
  });
};

p5videoKit.prototype.draw = function () {
  // console.log('p5videoKit draw');
  if (!this.a_initDone) {
    console.log('p5videoKit draw init not done');
    return;
  }
  this.set_background();
  stroke(255);
  if (!a_.ui.urects_count) {
    console.log('draw a_.ui.urects_count', a_.ui.urects_count);
    pad_layout_update();
  }
  let prior;
  for (let ipatch = 0; ipatch < a_.ui.patches.length; ipatch++) {
    prior = this.draw_patch(ipatch, prior);
  }
  update_ui();
};

// {
//   "eff_spec": {
//     "ipatch": 2,
//     "imedia": 0,
//     "eff_label": "bestill",
//     "urect": {
//       "width": 1920,
//       "height": 1080,
//       "x0": 0,
//       "y0": 0
//     }
//   },
//   "eff_props": {
//     "factor": 20,
//     "mirror": 0
//   }
// }

p5videoKit.prototype.draw_patch = function (ipatch, prior) {
  let uiPatch = a_.ui.patches[ipatch];
  // console.log('draw ipatch', ipatch, 'uiPatch', uiPatch);
  let eff_spec = uiPatch.eff_spec;
  let { eff_label, imedia } = eff_spec;
  // if (imedia >= a_.mediaDivs.length) {
  //   console.log('draw_patch zeroing imedia', imedia, 'a_.mediaDivs.length', a_.mediaDivs.length);
  //   imedia = 0;
  // }
  let inst = this.patch_inst_create(eff_label, imedia, ipatch, eff_spec, uiPatch.eff_props);

  if (!inst) return;
  if (eff_spec.ipipe && prior && prior.output) {
    // players must use the current value of .input
    // for pipe to work
    inst.input = prior.output;
  }
  inst.prepareOutput();
  if (!eff_spec.ihide && inst.output) {
    image_scaled_pad(inst.output, eff_spec.urect);
  }
  return inst;
};

p5videoKit.prototype.set_background = function () {
  let bg = a_.ui.back_color;
  // console.log('set_background a_.ui.back_color', a_.ui.back_color);
  if (!bg) {
    clear();
    return;
  }
  if (bg < 0) {
    let src = patch_index1(-bg);
    if (src && src.avg_color) {
      bg = src.avg_color;
    }
  }
  background(bg);
};
