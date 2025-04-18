//
//
import { p5videoKit } from '../a/a_p5videoKit.js';

// import { a_ } from '../let/a_state.js';
// import { ui_prop_set } from '../core-ui/ui_prop.js';
// import { store_set } from '../core-ui/ui_prop.js';
// import { ui_window_refresh } from '../core-ui/a_ui_create.js';
// import { ui_div_append } from '../core-ui/ui_tools.js';

p5videoKit.prototype.ui_canvas_div = function (div) {
  let html = `
  <span>[Canvas Size: </span>
  <select id=icanvas_size>
    ${canvas_size_options(a_canvas_sizes)}
  </select>
  <div style="display: inline">
    <input type="checkbox" id="icanvas_lock" />
    <label for="icanvas_lock">Lock]</label>
  </div>
  `;
  function canvas_size_options(sizes) {
    let arr = sizes.map((se) => `<option value="${se.label}">${se.label}</option>`);
    return arr.join('');
  }
  this.ui_div_append(div, html);

  let icanvas_size = window.icanvas_size;
  let se = this.canvas_size_default();
  icanvas_size.selectedIndex = se.index;
  // Can not use arrow funtion here to get this
  icanvas_size.addEventListener('change', canvs_size_change);
  let nthis = this;
  function canvs_size_change() {
    let index = this.selectedIndex;
    // ui_log('icanvas_size change this', this);
    // ui_log('icanvas_size change index', index);
    let se = a_canvas_sizes[index];
    if (se.func) {
      se.func();
    } else if (se.width) {
      nthis.ui_prop_set('canvas_size', se.label);
      resizeCanvas(se.width, se.height);
    } else {
      ui_log('No canvas size in se', se);
    }
    nthis.ui_window_refresh();
  }
  let icanvas_lock = window.icanvas_lock;
  icanvas_lock.checked = this.a_.canvas_size_lock;
  icanvas_lock.addEventListener('change', check_lock_change);
  function check_lock_change() {
    // ui_log('icanvas_lock change this', this);
    let state = this.checked;
    nthis.a_.canvas_size_lock = state ? 1 : 0;
    nthis.store_set('a_.canvas_size_lock', nthis.a_.canvas_size_lock + '');
  }
};

// <option value="320x240">320x240</option>
// <option value="480x270">480x270</option>
// <option value="640x480">640x480</option>
// <option value="960x540">960x540</option>
// <option value="1920x1080">1920x1080</option>
// <option value="540x960">540x960</option>
// <option value="1080x1920">1080x1920</option>
// <option value="2160x3840">2160x3840</option>
// <option value="Window">Window</option>
// <option value="Full Screen">Full Screen</option>
//

p5videoKit.prototype.ui_canvas_init = function () {
  a_canvas_sizes_dict = this.init_size_in(a_canvas_sizes);
};

p5videoKit.prototype.canvas_size_default = function () {
  let sz = a_canvas_sizes_dict[this.a_.ui.canvas_size];
  // ui_log('canvas_sizei canvas_size', this.a_.ui.canvas_size, 'sz', sz);
  if (sz) return sz;
  return a_canvas_sizes[0];
};

// not this, but allow access in other files
p5videoKit.prototype.init_size_in = function (sizes) {
  let dict = {};
  let index = 0;
  for (let se of sizes) {
    if (!se.label) {
      // label eg. 960x540
      se.label = se.width + 'x' + se.height;
    }
    se.index = index;
    dict[se.label] = se;
    index++;
  }
  return dict;
};

// 1920x1080 --> { width: 1920, height: 1080 }
p5videoKit.prototype.str_to_width_height = function (str) {
  let pl = str.split('x');
  let width = parseFloat(pl[0]);
  let height = parseFloat(pl[1]);
  return { width, height };
};

p5videoKit.prototype.toggleFullScreen = function () {
  if (!document.documentElement.requestFullscreen) {
    ui_log('NO document.documentElement.requestFullscreen');
    return;
  }
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};

// {
//   width: 1280,
//   height: 480,
// },
// {
//   width: 1280,
//   height: 960,
// },
// {
//   width: 1920,
//   height: 1440,
// },
// {
//   width: 1080,
//   height: 1920,
// },
// {
//   width: 960,
//   height: 720,
// },
// {
//   width: 1600,
//   height: 1200,
// },

let a_canvas_sizes_dict;

let a_canvas_sizes = [
  {
    width: 320,
    height: 240,
  },
  {
    width: 480,
    height: 270,
  },
  {
    width: 640,
    height: 480,
  },
  {
    width: 960,
    height: 540,
  },
  {
    width: 1280,
    height: 720,
  },
  {
    width: 1920,
    height: 1080,
  },
  {
    width: 3840,
    height: 2160,
  },
  {
    width: 270,
    height: 480,
  },
  {
    width: 480,
    height: 640,
  },
  {
    width: 540,
    height: 960,
  },
  {
    width: 1080,
    height: 1920,
  },
  {
    width: 2160,
    height: 3840,
  },
  {
    label: 'Window',
    func: function () {
      resizeCanvas(windowWidth, windowHeight);
    },
  },
  {
    label: 'Display',
    func: function () {
      resizeCanvas(displayWidth, displayHeight);
    },
  },
  {
    label: 'Full Screen',
    func: () => {
      // this.toggleFullScreen();
      resizeCanvas(windowWidth, windowHeight);
    },
  },
];
