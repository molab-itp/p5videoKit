//

// establish settings and reload page
function videoKit_settings_init() {
  console.log('videoKit_settings');
  //
  // page will reload to take settings
  videoKit.store_restore_from(aSettings);
}

let aSettings = {
  setting: '',
  comment: 'bestill_mo to be here - 4k 2x2',
  back_color: 200,
  room_name: 'VideoKit-Room-1',
  patch_layout: '2x2',
  canvas_size: '3840x2160',
  capture_size: '1920x1080',
  render_size: 'Canvas',
  chat_name: 'jht',
  chat_chk: 0,
  live_index: 0,
  live_chk: 0,
  urects_lock: 0,
  urects_count: 4,
  canvas_resize_ref: '',
  canvas_data_chk: 0,
  mediaDiv_states: [
    null,
    {
      vis: 0,
      mute: 1,
    },
    {
      vis: 0,
      mute: 1,
    },
  ],
  patches: [
    {
      eff_spec: {
        ipatch: 0,
        imedia: 1,
        eff_label: 'bestill_mo',
        urect: {
          x0: 0,
          y0: 0,
          width: 1920,
          height: 1080,
        },
      },
      eff_props: {
        factor: 10,
        mirror: 1,
        report: 1,
        frameCountMod: 20,
        activitySumLevel: 1,
      },
    },
    {
      eff_spec: {
        ipatch: 1,
        imedia: 1,
        eff_label: 'bestill',
        urect: {
          x0: 1920,
          y0: 0,
          width: 1920,
          height: 1080,
        },
      },
      eff_props: {
        factor: 10,
        mirror: 0,
      },
    },
    {
      eff_spec: {
        ipatch: 2,
        imedia: 1,
        eff_label: 'bestill',
        urect: {
          x0: 0,
          y0: 1080,
          width: 1920,
          height: 1080,
        },
      },
      eff_props: {
        factor: 200,
        mirror: 0,
      },
    },
    {
      eff_spec: {
        ipatch: 3,
        imedia: 1,
        eff_label: 'bestill',
        urect: {
          x0: 1920,
          y0: 1080,
          width: 1920,
          height: 1080,
        },
      },
      eff_props: {
        factor: 500,
        mirror: 1,
      },
    },
  ],
};
