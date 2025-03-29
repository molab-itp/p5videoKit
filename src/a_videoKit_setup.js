//

function videoKit_setup() {
  //
  videoKit = p5videoKit_init(videoKit_config);

  videoKit.save_canvas_handler = save_canvas_handler;

  videoKit.import_effect_handler = import_effect_handler;
}

let videoKit_config = {
  // effects for import, will appear at top of the effect menu

  // an EFFECT can have many PROPERTIES specific to the effect
  // for example canvas size, color, cell size,
  // to see this, choose "circle" in Effect1 and Effect2,
  // then choose different properties like number of circles per frame
  // or the video source

  // the "effects" array creates a pull-down menu
  // which offers a first selection of effects added to the VideoKit library,
  // you could add some more !!!!

  effects: [
    { label: 'a_example_props', import_path: 'effects/eff_a_example_props.js' },
    { label: 'a_my_example', import_path: 'effects/eff_a_my_example.js' },
    { label: 'a_slit_scan', import_path: 'effects/eff_a_slit_scan.js' },
    { label: 'live_gallery', import_path: 'effects/eff_live_gallery.js' },
    { label: 'live_tile_host', import_path: 'effects/eff_live_tile_host.js' },
    { label: 'maze_spin', import_path: 'effects/maze_spin/eff_maze_spin.js' },
    { label: 'movie_grid', import_path: 'effects/eff_movie_grid.js' },
    { label: 'ncell', import_path: 'effects/eff_ncell.js' },
    { label: 'shader_clamp', import_path: 'effects/eff_shader_clamp.js' },
    { label: 'shader_ripple', import_path: 'effects/eff_shader_ripple.js' },
    { label: 'skin_tone_main', import_path: 'effects/eff_skin_tone_main.js' },
    { label: 'bbtest', import_path: 'effects/eff_bbtest.js', ui_label: 'bbtest' },
    { label: 'ticker', import_path: 'effects/ticker/eff_ticker.js', ui_label: 'ticker' },
  ],

  // settings for import, will appear in the settings menu

  // SETTINGS will load a save .json file with predefined values
  // for all the settings associated with the effect
  // "settings" is an array of

  settings: [
    { label: '2x2-maze-facemesh', import_path: 'settings/2x2-maze-facemesh.json' },
    { label: '2x2-maze-spin-alpha-2-line-truchet', import_path: 'settings/2x2-maze-spin-alpha-2-line-truchet.json' },
    { label: '2x2-maze-spin-cycle-0-1-2-alpha-30', import_path: 'settings/2x2-maze-spin-cycle-0-1-2-alpha-30.json' },
    { label: '2x2-maze-spin-cycle-0-1-2', import_path: 'settings/2x2-maze-spin-cycle-0-1-2.json' },
    { label: 'covid-ticker-2023', import_path: 'settings/covid-ticker-2023.json' },
    { label: 'delaunay-alpha-5', import_path: 'settings/delaunay-alpha-5.json' },
    { label: 'live-tile-3x6-face-mesh', import_path: 'settings/live-tile-3x6-face-mesh.json' },
    { label: 'maze-spin-QR', import_path: 'settings/maze-spin-QR.json' },
    { label: 'maze-spin-guest', import_path: 'settings/maze-spin-guest.json' },
    { label: 'maze-spin-truchet-hd-tight', import_path: 'settings/maze-spin-truchet-hd-tight.json' },
    { label: 'skin-tone-guest', import_path: 'settings/skin-tone-guest.json' },
    { label: 'skin-tone-main-qr', import_path: 'settings/skin-tone-main-qr.json' },
    { label: 'slit scan circle', import_path: 'settings/slit scan circle.json' },
    { label: 'slitscan-mazespin', import_path: 'settings/slitscan-mazespin.json' },
    { label: 'test-pattern-maze_sping-truchet', import_path: 'settings/test-pattern-maze_sping-truchet.json' },
    { label: 'videoKit', import_path: 'settings/videoKit.json' },
    { label: 'bbtest', import_path: 'settings/bbtest.json' },
  ],
};

function ui_log(...args) {
  console.log(...args);
}

function ui_verbose(...args) {
  // console.log(...args);
}

// --
// for debugging
let a_import_err;

// effMeta
// { label, import_path, factory, index }

function import_effect_handler(effMeta) {
  return import('./' + effMeta.import_path);
}
