//
import { p5videoKit } from '../a/a_p5videoKit.js';

// import { a_ } from '../let/a_state.js';
// import { ui_restore_store } from '../core-ui/ui_restore.js';
// import { init_mediaDivs } from '../core/create_mediaDiv.js';
// import { ui_create, update_ui } from '../core-ui/a_ui_create.js';
// import { media_enum } from '../core/create_mediaDevices.js';
// import { pad_layout_update } from '../core-ui/ui_patch_bar.js';
// import { livem_restore } from '../core-ui/ui_live.js';
// import { patch_index1 } from '../core-ui/ui_patch_eff.js';
import { image_scaled_pad } from '../util/image.js';

//
// called by main sketch.js draw function
// videoKit.draw()
//
p5videoKit.prototype.draw = function () {
  // ui_log('p5videoKit draw');
  if (!this.a_initStarted) {
    this.a_initStarted = 1;
    this.init();
  }
  if (!this.a_initDone) {
    // ui_log('p5videoKit draw init not done');
    return;
  }
  this.set_background();
  stroke(255);
  if (!this.a_.ui.urects_count) {
    ui_log('draw this.a_.ui.urects_count', this.a_.ui.urects_count);
    this.pad_layout_update();
  }
  let prior;
  for (let ipatch = 0; ipatch < this.a_.ui.patches.length; ipatch++) {
    prior = this.draw_patch(ipatch, prior);
  }
  this.update_ui();
};

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

//
// called by init
// videoKit.setup(options)
//
p5videoKit.prototype.setup = async function (options) {
  //
  this.ui_message('loading...');
  //
  // this.videoKit = this;
  //
  // this.ui_restore_store(effects, settings, (sizeResult) => {
  let sizeResult = await this.ui_restore_store(options);

  // ui_log('videoKit setup sizeResult', sizeResult);
  resizeCanvas(sizeResult.width, sizeResult.height);

  this.init_mediaDivs(options);

  this.ui_create();

  // ui_log('a_.ui.hold_capture', this.a_.ui.hold_capture);
  if (!this.a_.ui.hold_capture) {
    // ui_log('a_.ui.hold_capture media_enum', this.a_.ui.hold_capture);
    this.media_enum();
  }

  this.livem_restore();

  this.ui_message('');

  this.a_initDone = 1;
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
p5videoKit.prototype.draw_patch = async function (ipatch, prior) {
  let uiPatch = this.a_.ui.patches[ipatch];
  // ui_log('draw ipatch', ipatch, 'uiPatch', uiPatch);
  let eff_spec = uiPatch.eff_spec;
  let { eff_label, imedia } = eff_spec;
  // if (imedia >= this.a_.mediaDivs.length) {
  //   ui_log('draw_patch zeroing imedia', imedia, 'a_.mediaDivs.length', this.a_.mediaDivs.length);
  //   imedia = 0;
  // }
  let inst = await this.patch_inst_create(eff_label, imedia, ipatch, eff_spec, uiPatch.eff_props);

  if (!inst) return;
  if (eff_spec.ipipe && prior && prior.output) {
    // players must use the current value of .input
    // for pipe to work
    inst.input = prior.output;
  }
  inst.prepareOutput();
  if (!eff_spec.ihide && inst.output) {
    let opt = { fliph: eff_spec.ifliph, flipv: eff_spec.iflipv };
    image_scaled_pad(inst.output, eff_spec.urect, opt);
  }
  return inst;
};

//
// videoKit.set_background()
//
p5videoKit.prototype.set_background = function () {
  let bg = this.a_.ui.back_color;
  // ui_log('set_background this.a_.ui.back_color', this.a_.ui.back_color);
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
