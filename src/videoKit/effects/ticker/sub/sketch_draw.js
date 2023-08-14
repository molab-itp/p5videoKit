eff_ticker.prototype.draw_char_start = function () {
  // console.log('draw_char_start');
  this.a_char = this.a_string[this.a_string_index];
  while (this.a_char === '\n') {
    // console.log('-- draw_char_start draw_next_line');
    this.draw_next_line();
    this.next_string_index();
    if (this.a_paused) return;
    this.a_char = this.a_string[this.a_string_index];
    // console.log('a_string_index', this.a_string_index, 'a_char', this.a_char);
  }
  this.a_bytes = this.font8x8_dict[this.a_char];
  if (!this.a_bytes) {
    return;
  }
  this.a_x = this.x_pos;
  this.a_y = this.y_pos;
  this.byte_index = 0;
  this.bit_index = 0;
  this.a_byte = this.a_bytes[this.byte_index];
  this.output.erase();
  this.output.fill(0);
  this.output.rect(this.a_x, this.a_y, this.char_len * 2, this.char_len);
  this.output.noErase();
};

eff_ticker.prototype.draw_bit = function () {
  let n = 1;
  let rush = this.dot_count_reached();
  if (this.test_fast) {
    n = this.test_fast_n * this.test_fast;
  } else if (rush) {
    n = this.draw_bit_delay;
  }
  while (n-- > 0) {
    this.draw_bit_one(rush);
    if (this.a_paused) return;
  }
};

eff_ticker.prototype.draw_bit_one = function (rush) {
  let bc = this.bit_count;
  while (this.bit_count == bc) {
    if (this.bit_index < 8) {
      if (this.a_byte & (1 << this.bit_index)) {
        let dci = this.dot_cindex;
        // if (rush) dci ^= 1;
        // else {
        //   // console.log('draw_bit_one ~rush bit_count', bit_count);
        // }
        this.output.fill(this.dot_colors[dci]);
        this.draw_shape(this.a_x, this.a_y, this.pix_len, this.pix_len);
        if (!this.a_rev) this.bit_count++;
      } else {
        if (this.a_rev) {
          this.output.fill('white');
          this.draw_shape(this.a_x, this.a_y, this.pix_len, this.pix_len);
          this.bit_count++;
        }
      }
      this.bit_index += 1;
      this.a_x += this.pix_len;
    } else {
      this.bit_index = 0;
      this.byte_index += 1;
      this.a_x = this.x_pos;
      this.a_y += this.pix_len;
      if (this.byte_index < 8) {
        this.a_byte = this.a_bytes[this.byte_index];
      } else {
        // console.log('draw_bit_one draw_next_char', this.bit_count);
        this.draw_next_char();
        if (this.a_paused) return;
      }
    }
    if (this.a_paused) {
      this.draw_paused();
      return;
    }
  }
};

eff_ticker.prototype.draw_shape = function (a_x, a_y, len_x, len_y) {
  this.output.rect(a_x, a_y, len_x, len_y);
  // ellipse(a_x + len_x / 2, a_y + len_y / 2, len_x, len_y);
};

eff_ticker.prototype.draw_next_char = function () {
  // console.log('draw_next_char');
  this.next_string_index();
  if (this.a_paused) return;
  let ch = this.a_string[this.a_string_index];
  if (ch == '\n') {
    // console.log('draw_next_char ch newline');
  } else {
    this.x_pos += this.char_len;
  }
  // if (this.x_pos + this.char_len - this.x_margin > this.width) {
  if (this.x_pos + this.char_len - this.x_margin * 2 > this.width) {
    // console.log('-- draw_next_char draw_next_line');
    this.draw_next_line();
  }
  this.draw_char_start();
};

eff_ticker.prototype.next_string_index = function () {
  this.a_string_index += 1;
  if (this.a_string_index > this.end_index) {
    this.set_paused();
  }
};

eff_ticker.prototype.message_done = function () {
  return this.a_string_index > this.end_index;
};

eff_ticker.prototype.draw_next_line = function () {
  // console.log('draw_next_line x_pos', this.x_pos, 'y_pos', this.y_pos);
  this.x_pos = this.x_margin;
  this.y_pos += this.char_len;
  // if (this.y_pos + this.char_len > this.height - this.y_margin) {
  //   // this.y_pos = this.y_top;
  //   // this.a_string_index = this.start_index;
  // }
};

eff_ticker.prototype.set_last = function () {
  if (this.bit_count) this.last_count = this.bit_count;
};
