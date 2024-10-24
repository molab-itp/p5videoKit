//
//
let c19_url_root = 'https://jht1493.net/COVID-19-Impact/Dashboard/a0/c_data/';
let c19_series = {
  USA: 'world/c_series/United_States.json',
  JA: 'world/c_series/Jamaica.json',
  GY: 'world/c_series/Guyana.json',
  NY: 'world/c_subs/United_States/c_series/New_York.json',
  NYC: 'nyc/c_series/_totals.json',
  BKLYN: 'nyc/c_series/Brooklyn.json',
};

eff_ticker.prototype.load_json = function () {
  this.json_loaded = 0;
  // let url = 'https://epvisual.com/COVID-19-Impact/Dashboard/a0/c_data/world/c_series/United_States.json';
  // let url = 'https://jht1493.net/COVID-19-Impact/Dashboard/a0/c_data/world/c_series/United_States.json';
  let url = c19_url_root + c19_series[this.locale];
  // console.log('load_json url', url);
  console.log('load_json locale', this.locale);
  loadJSON(url, (data) => {
    // console.log('load_json data last', JSON.stringify(data[data.length - 1]));
    // console.log('data.length', data.length);
    // console.log('load_count', this.load_count);
    this.json_loaded = 1;
    this.load_count++;
    this.data_index_start = 0;
    this.cycle_done = 0;
    this.a_data = data;
    this.prepare_data();

    this.total_deaths = this.a_data[this.a_data.length - 1].Deaths;

    if (this.most_lost_ndays) {
      this.a_data = this.sort_data(this.most_lost_ndays);
    }

    this.data_index_down = this.a_data.length;
    this.data_index_up = -1;

    if (this.start_date) {
      this.data_index_down = this.find_start_date(this.start_date);
      this.data_index_up = this.data_index_down;
    }
    if (this.data_index_offset) {
      this.data_index_down = this.data_index_offset + 1;
      this.data_index_up = this.data_index_down;
    }

    this.select_entry();
  });
};

eff_ticker.prototype.find_start_date = function (start_date) {
  console.log('find_start_date start_date', start_date);
  let index = this.a_data.findIndex((item) => item.on == start_date);
  console.log('find_start_date index', index);
  if (index >= 0) return index + 1;
  return this.a_data.length;
};

eff_ticker.prototype.select_entry = function () {
  let ent1;
  let select_down = () => {
    do {
      this.data_index_down--;
      if (this.data_index_down < 1) {
        this.data_index_down = this.a_data.length - 1;
        this.cycle_done = 1;
      }
      this.data_index = this.data_index_down;
      ent1 = this.a_data[this.data_index];
      this.a_count = ent1.count;
      // console.log('select_entry data_index', this.data_index, ent1);
    } while (this.a_count < 1);
  };
  let select_up = () => {
    do {
      this.data_index_up++;
      if (this.data_index_up >= this.a_data.length) {
        this.data_index_up = 0;
        this.cycle_done = 1;
      }
      this.data_index = this.data_index_up;
      ent1 = this.a_data[this.data_index];
      this.a_count = ent1.count;
      // console.log('select_entry data_index', this.data_index, ent1);
    } while (this.a_count < 1);
  };
  if (this.day_next == 0) select_down();
  else select_up();
  console.log('select_entry day_next', this.day_next, 'data_index_up', this.data_index_up);
  console.log('select_entry ent1.on', ent1.on);
  // console.log('select_entry', ent1.on, new Date());
  this.a_date = ent1.on;
  // let s = this.a_count > 1 ? 's' : '';
  if (this.day_next == 0 || this.display_single_date) {
    let title = this.locale + ' COVID-19 Memorial';
    let lineEnd = '\n\n';
    // if (title.length >= this.nchars_wide * 2) {
    //   lineEnd = '\n';
    // }
    // console.log('select_entry title', title, title.length);
    this.a_string = title + lineEnd + this.a_date + '\n';
    this.a_string_date_end_index = this.a_string.length - 1;
    // this.a_string = 'USA COVID-19 Memorial\n\n' + this.a_date + '\n';
    // this.a_string = this.a_date + '\n' + this.a_count + '\n';
    // this.panel_top += this.dot_y + this.char_len + this.y_margin * 2;
    let ydiff = this.dot_y + this.char_len * 2; // + this.y_margin * 2;
    if (this.display_single_date) {
      let ydiff = this.char_len * 2;
      this.panel_top = this.y_margin + this.char_len;
      this.panel_top += ydiff;
      // console.log('ydiff', ydiff, 'panel_top', this.panel_top);
      // this.a_string += '\nUSA Death' + s + '\n' + this.a_postfix;
      this.a_string += '\nLives lost' + '\n' + this.a_postfix;
      // this.y_top = this.char_len * 4;
    } else {
      this.panel_top += ydiff;
    }
  } else {
    if (this.day_next == 1) {
      this.panel_top += this.dot_y + this.char_len + this.y_margin * 2;
      this.y_top = this.char_len * 4;
    }
    // this.a_string = this.a_date + '\n' + this.a_count + '\n\nUSA Death' + s + '\n' + this.a_postfix;
    // this.a_string = this.a_date + '\n' + '\nUSA Death' + s + '\n' + this.a_postfix;
    this.a_string = this.a_date + '\n';
    this.a_string_date_end_index = this.a_string.length - 1;
    this.a_string += '\nLives lost' + '\n' + this.a_postfix;
    if (this.display_tall) {
      this.y_top = this.panel_top - this.char_len;
    }
  }
  this.day_next++;
  this.end_index = this.a_string.length - 1;
  this.begin_day();
};

// set ent.count to number of Deaths for that day
eff_ticker.prototype.prepare_data = function () {
  let ent0 = { Deaths: 0 };
  for (let index = 0; index < this.a_data.length; index++) {
    let ent1 = this.a_data[index];
    if (!ent1.Deaths) ent1.Deaths = 0;
    let count = ent1.Deaths - ent0.Deaths;
    ent1.count = count;
    ent1.index = index;
    ent0 = ent1;
  }
};

eff_ticker.prototype.sort_data = function (ndays) {
  console.log('sort_data ndays', ndays);
  let data = this.a_data.slice();
  data.sort((ent0, ent1) => ent0.count - ent1.count);
  // Show top n in console
  let n = 7;
  for (let index = 0; index < n; index++) {
    let ent = data[data.length - 1 - index];
    console.log(ent.on, ent.count, 'index=' + ent.index);
  }
  if (ndays > 0) {
    // Remove low entries to leave top ndays
    data.splice(0, data.length - ndays);
  }
  // Remove top most entry if recorded on first day
  // to exclude NYC 2020-05-18 start date
  let ent = data[data.length - 1];
  if (ent.index == 0) {
    console.log('Excluding ', ent.on, ent.count, 'index', ent.index);
    data.splice(data.length - 1, 1);
  }
  return data;
};

eff_ticker.prototype.download_data = function (locale) {
  // let data = this.sort_data();
  let data = this.a_data;
  let arr = [];
  for (let index = 0; index < data.length; index++) {
    let ent = data[index];
    if (ent.on) {
      arr.push(`${ent.on}, ${ent.count}, ${ent.index}`);
    }
  }
  // console.log('arr', arr);
  console.log('download_data arr.length', arr.length);
  saveStrings(arr, `covid-19-lost-${locale}.txt`);
  // saveJSON(data, 'covid-19-lost.json');
  // saveStrings(list, filename, [extension], [isCRLF])
};

// -- 2023-03-05 23:37:09
// 2020-04-16 4605 85
// 2021-01-20 4408 364
// 2021-01-12 4349 356
// 2021-01-08 4224 352
// 2021-12-22 4185 700
// 2022-02-04 4126 744
// 2022-01-28 4093 737
// 2021-01-21 4063 365
// 2021-01-27 4061 371
// 2021-01-26 4012 370

// -- 2022-02-08 13:06:51
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
