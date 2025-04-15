//
import { p5videoKit } from '../a/a_p5videoKit.js';
//
// videoKit = await p5videoKit_init(config, p5_instance)
//
export function p5videoKit_init(config, p5_instance = p5.instance) {
  //
  ui_log('p5videoKit_init config', config, 'p5_instance', !!p5_instance);
  // ui_log('p5videoKit_init config', config, 'p5_instance', p5_instance);
  let videoKit = new p5videoKit(config, p5_instance);
  return videoKit;
}
globalThis.p5videoKit_init = p5videoKit_init;
// p5videoKit_init explict global needed for browser non-module reference

import '../a/a_setup.js';
import '../a/createEffect.js';
import '../a/createEffect.js';
import '../a/dice_dapi.js';
import '../a/effectMeta.js';
import '../a/patch_inst.js';
import '../a/record_video.js';
import '../a/register_effects.js';

import '../core/a_init.js';
import '../core/create_mediaDevices.js';
import '../core/create_mediaDiv.js';
import '../core/liveMedia_attach.js';
import '../core/reset_video_clear_locals.js';
import '../core/store_url_parse.js';

import '../core-ui/a_ui_create.js';
import '../core-ui/PadLayout.js';
import '../core-ui/ui_canvas.js';
import '../core-ui/ui_capture.js';
import '../core-ui/ui_chat.js';
import '../core-ui/ui_live.js';
import '../core-ui/ui_message.js';
import '../core-ui/ui_patch_bar.js';
import '../core-ui/ui_patch_create.js';
import '../core-ui/ui_patch_eff.js';
import '../core-ui/ui_prop.js';
import '../core-ui/ui_render.js';
import '../core-ui/ui_restore.js';
import '../core-ui/ui_tools.js';

// import 'p5';

// ui_log('a_lib p5', p5);

// id_console_ul

function ui_log(...args) {
  console.log(...args);
}
globalThis.ui_log = ui_log;

function ui_verbose(...args) {
  // ui_log(...args);
}
globalThis.ui_verbose = ui_verbose;
