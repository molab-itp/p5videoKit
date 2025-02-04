// p5LiveVideo example dashboard
// https://github.com/jht1493/p5videoKit
//
let videoKit; // home for library routines

p5.disableFriendlyErrors = true; // disables FES to improve performance

let my = {};
globalThis.my = my;

function setup() {
  // Report startup time for debugging
  let lapse = window.performance.now() - a_start_now;
  console.log('setup lapse', lapse);
  // indicate how long it took to load everything

  // Lowest pixel density for performance
  pixelDensity(1);

  // Need some starting dimensions for canvas.
  // Make it small, size will get adjusted by UI (user interface) later in startup
  my.canvas = createCanvas(100, 100);

  // must call createCanvas before new p5videoKit

  // videoKit = new p5videoKit(a_config);

  videoKit = p5videoKit_init(a_config);

  videoKit.save_canvas_handler = save_canvas_handler;

  setup_dbase();
}

function draw() {
  videoKit.draw();
}

let a_config = {
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
    { label: 'test-pattern-maze_sping-truchet', import_path: 'settings/test-pattern-maze_sping-truchet.json' },
    { label: 'videoKit', import_path: 'settings/videoKit.json' },
    { label: 'bbtest', import_path: 'settings/bbtest.json' },
  ],
};

// https://editor.p5js.org/shawn/sketches/jZQ64AMJc
// p5LiveMedia Test Video
// https://github.com/vanevery/p5LiveMedia

function ui_log(...args) {
  console.log(...args);
}

function ui_verbose(...args) {
  // console.log(...args);
}

function test_settings_restore() {
  console.log('test_restore');
  store_restore_from(aSettings);
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
        mirror: 0,
        report: 1,
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
