//
//

import { p5videoKit } from '../a/a_p5videoKit.js';

// import { a_ } from '../let/a_state.js';
// import { a_settingMetas } from '../let/a_settingMetas.js';
// import { effectMeta_init } from '../core/effectMeta.js';
// import { ui_capture_init } from '../core-ui/ui_capture.js';
// import { ui_canvas_init } from '../core-ui/ui_canvas.js';
// import { store_name_restore, store_url_parse, store_save_ent } from '../core/store_url_parse.js';
// import { canvas_size_default } from '../core-ui/ui_canvas.js';
// import { reset_video_clear_locals } from '../core/reset_video_clear_locals.js';
// import { store_set, store_get, store_remove } from '../core-ui/ui_prop.js';
// import { ui_present_window } from '../core-ui/a_ui_create.js';

// import { ui_render_size_init } from '../core-ui/ui_render.js';
//
// let effects = [
//   { label: 'example', import_path: 'module/eff_example', menu: 1 },

import { a_effectMetas } from '../let/a_effectMetas.js';

// Restore this.a_.ui settings from local storage
p5videoKit.prototype.ui_restore_store = async function ({ effects, settings }) {
  //
  // if (!effects || !settings) {
  //   console.log('ui_restore_store INVALID args');
  //   console.log('ui_restore_store effects', effects);
  //   console.log('ui_restore_store settings', settings);
  // }
  effects = effects || [];
  settings = settings || [];

  // this.a_.hide_ui_option = hide_ui;
  // effects.length == 0 && settings.length == 0;

  let start = window.performance.now();

  if (!this.store_name_restore() && !window.location.search) {
    // First session init
    if (!this.a_.store_name) this.a_.store_name = 'Store-A';
    console.log('ui_restore_store this.a_.store_name', this.a_.store_name);
    this.reset_video_clear_locals(this.a_.store_name);
    return;
  }
  // this.a_.effectMetas = effects.concat(a_effectMetas);
  this.a_.effectMetas = effects.concat([{ label: '----' }], a_effectMetas);

  // this.a_.settingMetas = settings.concat(a_settingMetas);
  this.a_.settingMetas = settings;

  await this.effectMeta_init();

  await this.settingMetas_init();

  this.register_effects();

  this.ui_capture_init();

  this.ui_canvas_init();

  // ui_render_size_init();

  let urlResult = await this.store_url_parse();

  if (!urlResult.uiSet) {
    this.store_restore_ver();
    // store_restore_mo_dbase_flag();
    this.store_restore_canvas_lock();
    this.store_restore_ui(urlResult.settings);
  }
  let sizeResult = this.canvas_size_default();

  let lapse = window.performance.now() - start;
  console.log('ui_restore lapse', lapse);

  return sizeResult;
};

p5videoKit.prototype.settingMetas_init = async function () {
  this.a_.settings = [{ setting: '' }];
  let imports = [];
  let index = 1;
  for (let sete of this.a_.settingMetas) {
    imports.push(this.setting_import(sete, index));
    index++;
  }
  // console.log('settingMetas_init imports', imports);
  await Promise.allSettled(imports);
};

// set = { label: '0-club', import_path: 'settings/baked/0-club.json' }
//
p5videoKit.prototype.setting_import = function (sete, index) {
  let url = './' + sete.import_path + '';
  // console.log('setting_import url', url);
  return new Promise((resolve, reject) => {
    loadJSON(
      url,
      (setting) => {
        // console.log('setting_import setting', setting);
        setting.setting = sete.label;
        this.a_.settings[index] = setting;
        resolve();
      },
      (err) => {
        console.log('setting_import error url', url, 'error', err);
        console.log('setting_import error index', index);
        this.a_.settings[index] = { setting: 'Missing' };
        reject(err);
      }
    );
  });
};

// function store_restore_mo_dbase_flag() {
//   let val = store_get('a_.mo_dbase_flag');
//   if (val) {
//     this.a_.mo_dbase_flag = parseFloat(val);
//     console.log('store_restore_mo_dbase_flag ', this.a_.mo_dbase_flag);
//   }
// }

p5videoKit.prototype.store_restore_canvas_lock = function () {
  let val = this.store_get('a_.canvas_size_lock');
  if (val) {
    this.a_.canvas_size_lock = parseFloat(val);
  }
};

p5videoKit.prototype.store_restore_ui = function (settings) {
  // console.log('store_restore_ui settings', settings);
  // Force pads to be re-calculated
  this.a_.ui.urects_count = 0;
  this.a_.ui.urects_lock = 0;
  if (settings) {
    this.store_restore_settings(settings);
  } else {
    this.store_restore_store_get();
  }
  if (this.a_.chat_name) {
    this.a_.ui.chat_name = this.a_.chat_name;
  }
};

p5videoKit.prototype.store_restore_settings = function (settings) {
  this.a_.ui = settings;
  this.store_save_ent(settings);
  if (this.a_.hideui) {
    let delay = 3000;
    setTimeout(() => {
      this.ui_present_window();
    }, delay);
  }
};

p5videoKit.prototype.store_restore_store_get = function () {
  for (let prop in this.a_.ui) {
    let valu = this.store_get('a_.ui_' + prop);
    if (valu !== null) {
      valu = JSON.parse(valu);
      if (Array.isArray(valu)) {
        valu = valu[0];
        this.a_.ui[prop] = valu;
      } else {
        console.log('store_restore_store_get skipping prop=' + prop + ' valu=' + valu);
      }
      // console.log('store_restore_store_get prop', prop, 'valu', valu);
    }
  }
};

p5videoKit.prototype.store_restore_ver = function () {
  let ver = this.store_get('a_.store_ver');
  if (ver !== this.a_.store_ver) {
    console.log('store_restore_ver reset ver=' + ver);
    this.store_set('a_.store_ver', this.a_.store_ver);
    // Version diff, clear out all properties
    for (let prop in this.a_.ui) {
      this.store_remove(prop);
    }
  }
};
