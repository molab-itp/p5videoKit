//
import { p5videoKit } from '../a/a_p5videoKit.js?v=413';
//
// videoKit = await p5videoKit_init(config, p5_instance)
//
export function p5videoKit_init(config, p5_instance = p5.instance) {
  //
  console.log('p5videoKit_init config', config, 'p5_instance', p5_instance);
  let videoKit = new p5videoKit(config, p5_instance);
  return videoKit;
}
globalThis.p5videoKit_init = p5videoKit_init;
// p5videoKit_init explict global needed for browser non-module reference

import '../a/a_setup.js?v=413';
import '../a/createEffect.js?v=413';
import '../a/createEffect.js?v=413';
import '../a/dice_dapi.js?v=413';
import '../a/patch_inst.js?v=413';
import '../a/record_video.js?v=413';
import '../a/register_effects.js?v=413';

import '../core/a_init.js?=v413';
import '../core/create_mediaDevices.js?=v413';
import '../core/create_mediaDiv.js?=v413';
import '../core/effectMeta.js?=v413';
import '../core/liveMedia_attach.js?=v413';
import '../core/reset_video_clear_locals.js?=v413';
import '../core/store_url_parse.js?=v413';

import '../core-ui/a_ui_create.js?=v413';
import '../core-ui/PadLayout.js?=v413';
import '../core-ui/ui_canvas.js?=v413';
import '../core-ui/ui_capture.js?=v413';
import '../core-ui/ui_chat.js?=v413';
import '../core-ui/ui_live.js?=v413';
import '../core-ui/ui_message.js?=v413';
import '../core-ui/ui_patch_bar.js?=v413';
import '../core-ui/ui_patch_create.js?=v413';
import '../core-ui/ui_patch_eff.js?=v413';
import '../core-ui/ui_prop.js?=v413';
import '../core-ui/ui_render.js?=v413';
import '../core-ui/ui_restore.js?=v413';
import '../core-ui/ui_tools.js?=v413';
