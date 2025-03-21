//
export function a_init() {
  return {
    app_ver: 'Present ',
    store_ver: '6',
    store_name: 'Store-A',
    store_prefix: '',
    canvas_size_lock: 0,
    // mo_dbase_flag: 0,
    hideui: 0, // Default is to hide using with s= settings
    chat_name: '', // chat name from url param c
    ui: {
      setting: '',
      comment: '',
      back_color: 200,
      room_name: 'VideoKit-Room-1',
      patch_layout: 'Single',
      canvas_size: '960x540',
      // capture_size: '480x270',
      capture_size: 'default',
      render_size: 'Canvas',
      chat_name: 'jht',
      chat_chk: 0,
      live_index: 0,
      live_chk: 0,
      urects_lock: 0,
      urects_count: 0,
      canvas_resize_ref: '',
      canvas_data_chk: 0,
      audio_enabled: 0,
      mediaDiv_states: [],
      patches: [{ eff_spec: { ipatch: 0, imedia: 1, eff_label: 'show' } }],
    },
    settings: [],
    patch_instances: [],
    mediaDivs: [],
  };
}
// !!@ For debugging
// globalThis.a_ = a_;
