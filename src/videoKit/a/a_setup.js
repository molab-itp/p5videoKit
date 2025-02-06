//
import { p5videoKit } from '../a/a_p5videoKit.js?v=413';

// import { a_ } from '../let/a_state.js?v=413';
// import { ui_restore_store } from '../core-ui/ui_restore.js?v=413';
// import { init_mediaDivs } from '../core/create_mediaDiv.js?v=413';
// import { ui_create, update_ui } from '../core-ui/a_ui_create.js?v=413';
// import { media_enum } from '../core/create_mediaDevices.js?v=413';
// import { pad_layout_update } from '../core-ui/ui_patch_bar.js?v=413';
// import { livem_restore } from '../core-ui/ui_live.js?v=413';
// import { patch_index1 } from '../core-ui/ui_patch_eff.js?v=413';
// import { image_scaled_pad } from '../util/image.js?v=413';

//
// called by init
// videoKit.setup(options)
//
p5videoKit.prototype.setup = async function (options) {
  //
  this.ui_message('loading...');
  //
  this.a_.videoKit = this;
  this.a_.my_canvas = this.my_canvas;
  //
  // this.ui_restore_store(effects, settings, (sizeResult) => {
  let sizeResult = await this.ui_restore_store(options);

  console.log('videoKit setup sizeResult', sizeResult);
  resizeCanvas(sizeResult.width, sizeResult.height);

  this.init_mediaDivs();

  this.ui_create();

  // console.log('this.a_.ui.hold_capture', this.a_.ui.hold_capture);
  if (!this.a_.ui.hold_capture) {
    // console.log('this.a_.ui.hold_capture media_enum', this.a_.ui.hold_capture);
    this.media_enum();
  }

  this.livem_restore();

  this.ui_message('');

  this.a_initDone = 1;
};

//
// called by main sketch.js draw function
// videoKit.draw()
//
p5videoKit.prototype.draw = function () {
  // console.log('p5videoKit draw');
  if (!this.a_initStarted) {
    this.a_initStarted = 1;
    this.init();
  }
  if (!this.a_initDone) {
    console.log('p5videoKit draw init not done');
    return;
  }
  this.set_background();
  stroke(255);
  if (!this.a_.ui.urects_count) {
    console.log('draw this.a_.ui.urects_count', this.a_.ui.urects_count);
    this.pad_layout_update();
  }
  let prior;
  for (let ipatch = 0; ipatch < this.a_.ui.patches.length; ipatch++) {
    prior = this.draw_patch(ipatch, prior);
  }
  this.update_ui();
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

//
// videoKit.draw_patch(ipatch, prior)
//
p5videoKit.prototype.draw_patch = function (ipatch, prior) {
  let uiPatch = this.a_.ui.patches[ipatch];
  // console.log('draw ipatch', ipatch, 'uiPatch', uiPatch);
  let eff_spec = uiPatch.eff_spec;
  let { eff_label, imedia } = eff_spec;
  // if (imedia >= this.a_.mediaDivs.length) {
  //   console.log('draw_patch zeroing imedia', imedia, 'this.a_.mediaDivs.length', this.a_.mediaDivs.length);
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
    this.image_scaled_pad(inst.output, eff_spec.urect);
  }
  return inst;
};

//
// videoKit.set_background()
//
p5videoKit.prototype.set_background = function () {
  let bg = this.a_.ui.back_color;
  // console.log('set_background this.a_.ui.back_color', this.a_.ui.back_color);
  if (!bg) {
    clear();
    return;
  }
  if (bg < 0) {
    let src = this.patch_index1(-bg);
    if (src && src.avg_color) {
      bg = src.avg_color;
    }
  }
  background(bg);
};
