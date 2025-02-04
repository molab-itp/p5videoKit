//
import { p5videoKit } from '../a/p5videoKit.js?v=410';
import { patch_inst_deinit } from '../a/patch_inst.js?v=410';

import { a_ } from '../let/a_state.js?v=410';
import { effectMeta_find, factory_prop_inits } from '../core/effectMeta.js?v=410';
import { image_scaled_pad } from '../util/image.js?v=410';
import { PeriodTimer } from '../util/PeriodTimer.js?v=410';

p5videoKit.prototype.PeriodTimer = PeriodTimer;

// "urect": {
//   "width": 1920,
//   "height": 1080,
//   "x0": 0,
//   "y0": 0
// }

//
// let eff = videoKit.createEffect( 'bestill', 1, urect, {factor: 20} )
// imedia is mediaDiv indext or effect.output
// videoKit.createEffect({ eff_label, imedia, urect, props, eff_spec })
//
p5videoKit.prototype.createEffect = function ({ eff_label, imedia, urect, props, eff_spec }) {
  if (!eff_spec) eff_spec = { eff_label, imedia, urect };
  let media;
  let input;
  media = this.mediaDivAt(imedia);
  if (media) {
    input = media.capture;
  }
  // if (typeof imedia === 'number') {
  //   // select input by number
  //   media = this.mediaDivAt(imedia);
  //   if (media) {
  //     input = media.capture;
  //   }
  // } else {
  //   input = imedia;
  // }
  let effMeta = effectMeta_find(eff_label);
  let defaultProps = factory_prop_inits(effMeta.factory);
  let videoKit = this;
  let init = Object.assign(defaultProps, { videoKit, eff_spec, input, media }, props);
  // !!@ From patch_inst_create
  //     let init = Object.assign({ videoKit, eff_spec, input, media }, eff_props);
  // console.log('createEffect effMeta', effMeta);
  return new effMeta.factory(init);
};

//
// videoKit.updateEffect(eff, { imedia, urect });
// p5videoKit.prototype.updateEffect = function (eff, { imedia, urect }) {
//   // console.log('updateEffect eff', eff, 'imedia', imedia, 'urect', urect);
//   let media = this.mediaDivAt(imedia);
//   if (media) {
//     let input = media.capture;
//     eff.media = media;
//     eff.input = input;
//   }
//   eff.eff_spec.urect = urect;
// };
//

//
// return 1 if input ready
// videoKit.layerCopyInput(layer, { imedia, urect })
// videoKit.layerCopyInput(layer, { input, urect })
// videoKit.layerCopyInput(layer, { imedia, input, urect, fitWidth })
//
p5videoKit.prototype.layerCopyInput = function (layer, { imedia, input, urect, fitWidth }) {
  if (imedia !== undefined) {
    let media = this.mediaDivAt(imedia);
    if (!media || !media.ready('layerCopyInput')) {
      // console.log('layerCopyInput NOT Ready imedia', imedia, 'media', media);
      // console.log('layerCopyInput NOT Ready imedia', imedia);
      return 0;
    }
    input = media.capture;
  } else if (!input) {
    console.log('layerCopyInput input MISSING', input);
    return 0;
  }
  let sx = 0;
  let sy = 0;
  let sw = input.width;
  let sh = input.height;
  let { x0, y0, width, height } = urect;
  // Fill background will top right pixel from input
  layer.copy(input, sx, sy, 1, 1, x0, y0, width, height);
  let dw = height * (sw / sh);
  let x1 = Math.floor(x0 + (width - dw) / 2);
  let dh = height;
  if (fitWidth) {
    x1 = x0;
    dw = width;
    dh = width * (sh / sw);
    if (dh > height) {
      sh = sh * (height / dh);
      dh = height;
    }
  }
  layer.copy(input, sx, sy, sw, sh, x1, y0, dw, dh);
  return 1;
};

//
// videoKit.layerCopyEffect( layer, eff  )
//
p5videoKit.prototype.layerCopyEffect = function (layer, eff) {
  // console.log('layerCopyEffect eff', eff);
  eff.prepareOutput();
  if (!eff.output) return;
  let input = eff.output;
  let sx = 0;
  let sy = 0;
  let sw = input.width;
  let sh = input.height;
  let { x0, y0, width, height } = eff.eff_spec.urect;
  let dw = height * (sw / sh);
  let x1 = Math.floor(x0 + (width - dw) / 2);
  layer.copy(input, sx, sy, sw, sh, x1, y0, dw, height);
};

// p5videoKit.patch_inst_create(eff_label, imedia, ipatch, eff_spec, eff_props)

// "eff_spec": {
//   "ipatch": 0,
//   "imedia": 0,
//   "eff_label": "image",
//   "urect": {
//     "width": 960,
//     "height": 540,
//     "x0": 0,
//     "y0": 0
//   }

// p5videoKit.prototype.factoryPropInits = function (eff_label, init_props = {}) {
//   let effMeta = effectMeta_find(eff_label);
//   if (!effMeta) {
//     console.log('factory_prop_inits no effMeta');
//     return init_props;
//   }
//   // console.log('factory_prop_inits effMeta', effMeta);
//   return factory_prop_inits(effMeta.factory, init_props);
// };

//
// process input --> output
// videoKit.prepareOutput(eff)
//
p5videoKit.prototype.prepareOutput = function (eff) {
  eff.prepareOutput();
};

// videoKit.deinitEffect
p5videoKit.prototype.deinitEffect = function (eff) {
  patch_inst_deinit(eff);
};

//
// videoKit.ouputToCanvas( eff  )
//
p5videoKit.prototype.ouputToCanvas = function (eff) {
  if (eff.output) {
    image_scaled_pad(eff.output, eff.eff_spec.urect);
  }
};

//
// let n = videoKit.mediaDivCount()
//
p5videoKit.prototype.mediaDivCount = function () {
  return a_.mediaDivs.length;
};

//
// videoKit.mediaDivLiveIndex()
//
p5videoKit.prototype.mediaDivLiveIndex = function () {
  console.log('mediaDivLiveIndex lastMediaDivIndex', a_.lastMediaDivIndex);
  return a_.lastMediaDivIndex || 0;
};

//
// mediaDiv = videoKit.mediaDeviceAt(index)
//
p5videoKit.prototype.mediaDivAt = function (index) {
  return a_.mediaDivs[index];
};

p5videoKit.prototype.mouse_event_check = function (inst) {
  if (inst.mouseDragged) {
    this.mouseDragged_inst = inst;
  }
  if (inst.mouseReleased) {
    this.mouseReleased_inst = inst;
  }
};

p5videoKit.prototype.mouseDragged = function () {
  if (this.mouseDragged_inst) {
    this.mouseDragged_inst.mouseDragged();
  }
};

p5videoKit.prototype.mouseReleased = function () {
  if (this.mouseReleased_inst) {
    this.mouseReleased_inst.mouseReleased();
  }
};
