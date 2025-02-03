import { a_ } from '../let/a_state.js?v=407';
import { a_effectMetas } from '../let/a_effectMetas.js?v=407';
import { a_settingMetas } from '../let/a_settingMetas.js?v=407';
import { effectMeta_init } from '../core/effectMeta.js?v=407';
import { ui_capture_init } from '../core-ui/ui_capture.js?v=407';
import { ui_canvas_init } from '../core-ui/ui_canvas.js?v=407';
import { store_name_restore, store_url_parse, store_save_ent } from '../core/store_url_parse.js?v=407';
import { canvas_size_default } from '../core-ui/ui_canvas.js?v=407';
import { reset_video_clear_locals } from '../core/reset_video_clear_locals.js?v=407';
import { ui_present_window } from '../core-ui/a_ui_create.js?v=407';
import { store_set, store_get, store_remove } from '../core-ui/ui_prop.js?v=407';

// import { ui_render_size_init } from '../core-ui/ui_render.js?v=407';
//
// let effects = [
//   { label: 'example', import_path: 'module/eff_example', menu: 1 },

// Restore a_.ui settings from local storage
export async function ui_restore_store({ effects, settings, hide_ui }) {
  // export  function ui_restore_store({ effects, settings, hide_ui }, sizeResult) {
  //
  // if (!effects || !settings) {
  //   console.log('ui_restore_store INVALID args');
  //   console.log('ui_restore_store effects', effects);
  //   console.log('ui_restore_store settings', settings);
  // }
  effects = effects || [];
  settings = settings || [];

  // a_.hide_ui_option = hide_ui;
  // effects.length == 0 && settings.length == 0;

  let start = window.performance.now();

  if (!store_name_restore() && !window.location.search) {
    // First session init
    if (!a_.store_name) a_.store_name = 'Store-A';
    console.log('ui_restore_store a_.store_name', a_.store_name);
    reset_video_clear_locals(a_.store_name);
    return;
  }
  // a_.effectMetas = effects.concat(a_effectMetas);
  a_.effectMetas = effects.concat([{ label: '----' }], a_effectMetas);

  // a_.settingMetas = settings.concat(a_settingMetas);
  a_.settingMetas = settings;

  await effectMeta_init();

  await settingMetas_init();

  ui_capture_init();

  ui_canvas_init();

  // ui_render_size_init();

  let urlResult = await store_url_parse();

  if (!urlResult.uiSet) {
    store_restore_ver();
    // store_restore_mo_dbase_flag();
    store_restore_canvas_lock();
    store_restore_ui(urlResult.settings);
  }
  let sizeResult = canvas_size_default();

  let lapse = window.performance.now() - start;
  console.log('ui_restore lapse', lapse);

  return sizeResult;
}

async function settingMetas_init() {
  a_.settings = [{ setting: '' }];
  let imports = [];
  let index = 1;
  for (let sete of a_.settingMetas) {
    imports.push(setting_import(sete, index));
    index++;
  }
  // console.log('settingMetas_init imports', imports);
  await Promise.allSettled(imports);
}

// set = { label: '0-club', import_path: 'settings/baked/0-club.json' }
//
function setting_import(sete, index) {
  let url = './' + sete.import_path + '';
  // console.log('setting_import url', url);
  return new Promise((resolve, reject) => {
    loadJSON(
      url,
      (setting) => {
        // console.log('setting_import setting', setting);
        setting.setting = sete.label;
        a_.settings[index] = setting;
        resolve();
      },
      (err) => {
        console.log('setting_import error url', url, 'error', err);
        console.log('setting_import error index', index);
        a_.settings[index] = { setting: 'Missing' };
        reject(err);
      }
    );
  });
}

// function store_restore_mo_dbase_flag() {
//   let val = store_get('a_.mo_dbase_flag');
//   if (val) {
//     a_.mo_dbase_flag = parseFloat(val);
//     console.log('store_restore_mo_dbase_flag ', a_.mo_dbase_flag);
//   }
// }

function store_restore_canvas_lock() {
  let val = store_get('a_.canvas_size_lock');
  if (val) {
    a_.canvas_size_lock = parseFloat(val);
  }
}

function store_restore_ui(settings) {
  // console.log('store_restore_ui settings', settings);
  // Force pads to be re-calculated
  a_.ui.urects_count = 0;
  a_.ui.urects_lock = 0;
  if (settings) {
    store_restore_settings(settings);
  } else {
    store_restore_store_get();
  }
  if (a_.chat_name) {
    a_.ui.chat_name = a_.chat_name;
  }
}

function store_restore_settings(settings) {
  a_.ui = settings;
  store_save_ent(settings);
  if (a_.hideui) {
    let delay = 3000;
    setTimeout(ui_present_window, delay);
  }
}

function store_restore_store_get() {
  for (let prop in a_.ui) {
    let valu = store_get('a_.ui_' + prop);
    if (valu !== null) {
      valu = JSON.parse(valu);
      if (Array.isArray(valu)) {
        valu = valu[0];
        a_.ui[prop] = valu;
      } else {
        console.log('store_restore_store_get skipping prop=' + prop + ' valu=' + valu);
      }
      // console.log('store_restore_store_get prop', prop, 'valu', valu);
    }
  }
}

function store_restore_ver() {
  let ver = store_get('a_.store_ver');
  if (ver !== a_.store_ver) {
    console.log('store_restore_ver reset ver=' + ver);
    store_set('a_.store_ver', a_.store_ver);
    // Version diff, clear out all properties
    for (let prop in a_.ui) {
      store_remove(prop);
    }
  }
}
