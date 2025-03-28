//

import eff_ticker from '../eff_ticker.js';

//
eff_ticker.prototype.let_init = function () {
  // console.log('let_init test_fast', this.test_fast, typeof this.test_fast);
  this.a_run = 1;
  // this.test_fast = 0;
  this.test_fast_n = 100;
  this.a_count = 3750;
  this.draw_bit_delay = 1;
  this.a_paused;
  this.page_pause_secs = 10;
  this.a_string = this.a_count + ' USA\nDeaths on\n2020-12-30\n';
  this.nchars_wide = 12;
  this.a_data;
  this.data_index;
  // to heal we must remember
  this.a_postfix = '\nto heal\nwe must\nremember';
  this.n_lines = 6;
  this.cycle_time;
  this.last_count;
  this.cycle_start_time;
  this.day_start;
  this.start_index = 0;
  this.end_index = this.a_string.length - 1;
  this.a_string_index = this.start_index;
  this.pix_len;
  this.char_len;
  this.x_margin;
  this.y_margin;
  this.x_pos;
  this.y_pos;
  this.y_top;
  this.x_right;
  this.a_char;
  this.a_bytes;
  this.bit_index;
  this.byte_index;
  this.a_x;
  this.a_y;
  this.a_byte;
  this.cursor_x;
  this.cursor_y;
  this.bit_count;
  this.a_rev = 0;
  this.bottom_color;
  this.a_date;
  this.cycle_done = 0;
  this.panel_len;
  this.dot_x;
  this.dot_y;
  this.dot_count;
  // this.dot_colors = ['gray', 'lightgray'];
  this.dot_colors = [
    'white',
    'white',
    // [128, 128, 128, 255],
    // [211, 211, 211, 255],
  ];
  this.dot_cindex = 0;
  this.panel_right, this.panel_width, this.panel_top, this.panel_height;
  this.a_state = 'draw_bit';
  this.a_down = 0;
  this.a_dir = 'down';
  // this.a_dir = 'up';
  this.data_index_start;
  this.data_index_offset = 0;
  this.data_index_end;
  this.data_index_down;
  this.data_index_up;
  this.load_count = 0;
  this.json_loaded = 0;
  this.day_next = 0;
  this.bottom_color = 'white';
  this.panel_len = this.width / 2;
  // console.log('panel_len', this.panel_len);
  this.pix_len = this.panel_len / (this.nchars_wide * 8);
  this.char_len = 8 * this.pix_len;
  this.x_margin = this.pix_len;
  this.y_margin = this.pix_len;
  this.x_pos = this.x_margin;
  this.y_top = this.y_margin;
  this.y_pos = this.y_top;
  this.panel_right = this.panel_len + this.x_margin;
  this.panel_width = this.width - this.panel_right - this.x_margin;
  this.panel_top = this.y_margin + this.char_len;
  this.panel_height = this.height - 3 * this.y_margin;
  this.dot_x = 0;
  this.dot_y = 0;
  this.dot_count = 0;
  this.dot_count_total = 0;
  this.dot_panel_max = Math.floor(this.panel_width / this.pix_len) * Math.floor(this.panel_height / this.pix_len);
  this.cycle_start_time = millis();
  this.a_state = 'draw_bit';
  this.a_paused = 0;
  this.dot_cindex = 0;
  let nlines = Math.floor(this.panel_height / (this.pix_len * 8));
  // console.log('dot_panel_max', this.dot_panel_max);
  // console.log('panel_height', this.panel_height);
  // console.log('pix_len', this.pix_len);
  // console.log('nlines', nlines);
  // console.log('let_init char_len', this.char_len);
  this.day_next = 0;
};

// 2020-04-16 4607 85
// 2021-01-20 4442 364
// 2021-01-12 4389 356
// 2021-01-08 4189 352
// 2022-02-04 4154 744 **
// 2021-01-21 4137 365
// 2021-01-27 4128 371
// 2022-01-26 4068 735 **
// 2021-01-07 4028 351
// 2021-01-13 4018 357

eff_ticker.prototype.cycle_init = function () {
  this.y_pos = this.y_top;
  this.x_pos = this.x_margin;
};
