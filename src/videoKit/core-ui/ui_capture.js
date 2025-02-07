//
//
import { p5videoKit } from '../a/a_p5videoKit.js';

// import { a_ } from '../let/a_state.js';
// import { init_size_in } from '../core-ui/ui_canvas.js';
// import { ui_prop_set } from '../core-ui/ui_prop.js';
// import { media_reset } from '../core/create_mediaDevices.js';
// import { patch_instances_clear_all } from '../a/patch_inst.js';
// import { ui_div_append } from '../core-ui/ui_tools.js';

p5videoKit.prototype.ui_capture_size = function (div) {
  let html = `
  <span> Capture Size: </span>
  <select id=icapture_size>
    ${capture_size_options(a_capture_sizes)}
  </select>
  `;

  function capture_size_options(sizes) {
    let arr = sizes.map((se) => `<option value="${se.label}">${se.label}</option>`);
    return arr.join('');
  }

  this.ui_div_append(div, html);

  let icapture_size = window.icapture_size;
  let se = this.get_capture_size();
  icapture_size.selectedIndex = se.index;
  // Can not use arrow funtion here to get this
  icapture_size.addEventListener('change', () => {
    this.capture_size_change();
  });
};

p5videoKit.prototype.capture_size_change = function () {
  console.log('capture_size change value', this.value);
  let value = this.value;
  this.ui_prop_set('capture_size', value);
  this.media_reset();
  this.patch_instances_clear_all();
};

// <span> Capture Size: </span>
// <select>
//   <option value="default">default</option>
//   <option value="320x240">320x240</option>
//   <option value="480x270">480x270</option>
//   <option value="640x480">640x480</option>
//   <option value="960x540">960x540</option>
//   <option value="1920x1080">1920x1080</option>
//   <option value="20x15">20x15</option>
//   <option value="40x30">40x30</option>
//   <option value="80x60">80x60</option>
//   <option value="160x120">160x120</option>
// </select>
//

p5videoKit.prototype.ui_capture_init = function () {
  a_capture_sizes_dict = this.init_size_in(a_capture_sizes);
};

p5videoKit.prototype.get_capture_size = function () {
  let se = a_capture_sizes_dict[this.a_.ui.capture_size];
  // console.log('get_capture_size index', this.a_.ui.capture_sizei, 'se', se);
  if (se) return se;
  return a_capture_sizes[1];
};

let a_capture_sizes_dict;

let a_capture_sizes = [
  {
    label: 'default',
  },
  {
    width: 320,
    height: 240,
  },
  {
    width: 480,
    height: 270,
  },
  {
    width: 270,
    height: 480,
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
    width: 1920,
    height: 1080,
  },
  {
    width: 3840,
    height: 2160,
  },
  {
    width: 20,
    height: 15,
  },
  {
    width: 40,
    height: 30,
  },
  {
    width: 80,
    height: 60,
  },
  {
    width: 160,
    height: 120,
  },
];
