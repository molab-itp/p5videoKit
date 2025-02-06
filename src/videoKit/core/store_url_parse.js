//
//
import { p5videoKit } from '../a/a_p5videoKit.js?v=413';

// import { a_ } from '../let/a_state.js?v=413';
// import { pad_layout_update } from '../core-ui/ui_patch_bar.js?v=413';
// import { ui_prop_set } from '../core-ui/ui_prop.js?v=413';
// import { ui_save_fn } from '../core-ui/ui_tools.js?v=413';

// Are we setting up store from our url query?
// url parm
//  a = gather settings from param itself
//  u = store prefix
//  s = settings name, also hide ui by default
//  al/d = settings from json file
//  h = 0/1, explicit setting for hide ui
//
p5videoKit.prototype.store_url_parse = async function () {
  let uiSet = 0;
  let settings;
  let loc = window.location.href;
  let ind = loc.indexOf('?');
  if (ind >= 0) {
    let query = loc.substring(ind + 1);
    // console.log('store_url_parse query', query);
    let params = params_query(query);
    console.log('store_url_parse params', params);

    let hide_option = params.hide;
    if (hide_option) {
      this.a_.hide_ui_option = parseFloat(hide_option);
    }
    // settings encoded as json string, if present return true to avoid other settings init
    let a_str = params['a'];
    if (a_str) {
      uiSet = url_a_restore(a_str);
    }
    let u_str = params['u'];
    if (u_str) {
      this.a_.store_prefix = u_str;
      // console.log('this.a_.store_prefix', a_s.tore_prefix);
    }
    let s_str = params['s'];
    if (s_str) {
      console.log('store_url_parse s_str', s_str);
      let ent = this.a_.settings.find((ent) => ent.setting === s_str);
      settings = ent;
      console.log('store_url_parse settings', settings);
      this.a_.hideui = 1;
    }
    let h_str = params['h'];
    if (h_str) {
      this.a_.hideui = parseFloat(h_str);
    }
    let c_str = params['c'];
    if (c_str) {
      this.a_.chat_name = c_str;
    }
    // ?d=settings-sound/face-graph.json
    // ?d=settings-sound/face-posenet.json
    let d_str = params['d'];
    if (d_str) {
      let url = './' + d_str;
      settings = {};
      try {
        settings = await loadJSONAsync(url);
        if (!settings.setting) {
          settings.setting = d_str;
        }
      } catch (err) {
        console.log('loadJSON err', err);
      }
    }
  }
  // console.log('store_url_parse returning settings', settings);
  return { uiSet, settings };
};

async function loadJSONAsync(url) {
  console.log('loadJSONAsync url', url);
  return new Promise((resolve, reject) => {
    loadJSON(url, resolve, reject);
  });
}

function url_a_restore(str) {
  // decode not Needed
  // str = decodeURIComponent(str);
  if (str) {
    // console.log('store_url_parse str');
    // console.log(str);
    let ui = JSON.parse(str);
    if (!ui) {
      // console.log('store_url_parse parse failed');
    } else {
      // console.log('store_url_parse ui', ui);
      this.a_.ui = ui;
      // Reflect url parameters in local storage
      for (let prop in this.a_.ui) {
        this.ui_prop_set(prop, this.a_.ui[prop]);
      }
      return 1;
    }
  }
  return 0;
}

p5videoKit.prototype.location_noquery = function () {
  let loc = window.location.href;
  let ii = loc.indexOf('?');
  if (ii >= 0) {
    loc = loc.substring(0, ii);
  }
  return loc;
};

// Return current location this.a_.store_prefix
function location_url() {
  let loc = location_noquery();
  loc += '?';
  if (this.a_.store_prefix) {
    let ustr = encodeURIComponent(this.a_.store_prefix);
    loc += 'u=' + ustr + '&';
  }
  return loc;
}

p5videoKit.prototype.store_export_json = function () {
  store_export(0);
};
p5videoKit.prototype.store_export_url = function () {
  store_export(1);
};

function store_export(updateUrl) {
  this.pad_layout_update();
  // let fn = this.a_.ui.setting || 'setting';
  let fn = this.ui_save_fn();
  saveJSON(this.a_.ui, fn);
  let str = JSON.stringify(this.a_.ui);
  // console.log('store_export str');
  // console.log(str);
  str = encodeURIComponent(str);
  let loc = location_url();
  loc += 'a=' + str;
  // console.log('loc', loc);
  if (updateUrl) {
    window.location = loc;
  }
}

p5videoKit.prototype.store_name_restore = function () {
  let nstore = localStorage.getItem('this.a_.store_name');
  if (nstore) this.a_.store_name = nstore;
  return nstore;
};

p5videoKit.prototype.store_name_update = function (name) {
  console.log('store_name_update', name);
  localStorage.setItem('this.a_.store_name', name);
  let loc = location_url();
  window.location = loc;
};

p5videoKit.prototype.store_restore_from = function (ent) {
  console.log('store_restore_from ent', ent);
  store_save_ent(ent);
  let loc = location_url();
  console.log('store_restore_from loc', loc);
  window.location = loc;
};
// globalThis.store_restore_from = store_restore_from;

p5videoKit.prototype.store_save_ent = function (ent) {
  if (this.a_.canvas_size_lock) {
    // Canvas size is locked
    // Save reference pad per patch before we save in local storage
    console.log('store_save_ent ent', ent);
    if (ent.patches) {
      for (let patch of ent.patches) {
        patch.eff_spec.urect_ref = Object.assign({}, patch.eff_spec.urect);
      }
    }
  }
  // Save settings to local storage
  for (let prop in ent) {
    let nprop = prop;
    if (this.a_.canvas_size_lock) {
      if (prop === 'canvas_size') {
        // ui.canvas_size is replaced by this.a_.ui.canvas_resize_ref
        // to enable scaling relative to original canvas size
        nprop = 'canvas_resize_ref';
      } else if (prop === 'canvas_resize_ref') {
        continue;
      }
    }
    this.ui_prop_set(nprop, ent[prop]);
  }
  if (this.a_.canvas_size_lock) {
    // Force pad_layout_update
    this.ui_prop_set('urects_count', 0);
  } else {
    // Canvas is not locked
    // clear this.a_.ui.canvas_resize_ref to prevent scaling
    this.ui_prop_set('canvas_resize_ref', '');
  }
};

// "patches": [
//   {
//     "eff_spec": {
//       "ipatch": 0,
//       "imedia": 1,
//       "eff_label": "bestill",
//       "urect": {
//         "width": 1920,
//         "height": 1080,
//         "x0": 0,
//         "y0": 0
//       }
//     },
//     "eff_props": {
//       "factor": 200,
//       "mirror": 0
//     }
//   }
// ],

// let eff_spec_props = {
//   ipatch: 1,
//   imedia: 1,
//   eff_label: 1,
//   pad: 1,
//   urects_ref: 1,
//   ihide: 1,
//   ipipe: 1,
// };

// function store_restore_create_eff_spec(ent) {
//   // For prior version of patches recode to { src, eff }
//   let npatches = [];
//   for (let patch of ent.patches) {
//     if (patch.eff_spec) continue;
//     let eff_spec = {};
//     let eff = {};
//     for (let prop in patch) {
//       if (prop === 'ieff') continue;
//       if (eff_spec_props[prop]) {
//         eff_spec[prop] = patch[prop];
//       } else {
//         eff[prop] = patch[prop];
//       }
//     }
//     npatches.push({ eff_spec, eff });
//   }
//   if (npatches.length > 0) {
//     ent.patches = npatches;
//   }
// }

// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams

function params_query(query) {
  // eg. query='abc=foo&def=%5Basf%5D&xyz=5'
  // params={abc: "foo", def: "[asf]", xyz: "5"}
  const urlParams = new URLSearchParams(query);
  const params = Object.fromEntries(urlParams);
  return params;
}
