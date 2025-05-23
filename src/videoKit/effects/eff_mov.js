//
//

// import { ui_patch_update } from '../core-ui/ui_patch_bar.js';
import { image_scaled_pad } from '../util/image.js';
import { PeriodTimer } from '../util/PeriodTimer.js';
import { a_images } from '../let/a_images.js';

export default class eff_mov_show {
  static meta_props = {
    group: ['covid19mov', '370-mov'],
    ifile: [0, 1, 2],
    speed: [1, 0.5, 0.2, 0.1],
    next: {
      button: (ent, aPatch) => {
        ent.next_action(aPatch);
      },
    },
    prev: {
      button: (ent, aPatch) => {
        ent.previous_action(aPatch);
      },
    },
    reset: {
      button: (ent, aPatch) => {
        ent.reset_action(aPatch);
      },
    },
    _movie_url: {
      style: 'width:80%',
      // text_input: './external/media/webdb/jht/IMG_4491.JPEG',
      text_input: './external/media/mov/record_log.webm',
    },
    _loop: [0, 1],
    period: [5, 10, 20, 30, 60],
  };
  constructor(props) {
    Object.assign(this, props);
    this.file_name = 'covid19mov/Document_Ticker-short-h.mov';
    this.init();
  }
  prepareOutput() {
    if (this.loop) {
      this.period_timer.check(() => {
        this.period_next();
      });
    }
    // ui_log('eff_mov_show', this.vid.duration(), this.vid.time());
    // image(this.vid, 0, 0, width, height);
    image_scaled_pad(this.vid, this.eff_spec.urect);
  }
  init() {
    this.predictions = [];
    this.period_timer = new PeriodTimer(this.period);
    this.load_from_group();
  }
  load_from_group() {
    let ipath = this.load_movie_options();
    ui_log('eff_mov_show ipath=' + ipath);
    // ui_log('eff_mov_show vid', this.vid);
    this.vid = createVideo(ipath, () => {
      // ui_log('eff_mov_show loaded');
      // this.vid.loop();
      this.vid.volume(0);
      this.vid.speed(this.speed);
      this.vid.play();
    });
    this.vid.onended(() => {
      // Chrome fails to play in reverse
      // this.ispeed = this.ispeed == 1 ? -1 : 1;
      ui_log('eff_mov_show onended');
      // this.vid.speed(this.speed);
      this.vid.play();
    });
    this.vid.hide();
    // this.vid.size(width, height);
    // this.vid.position(0, 0);
  }
  deinit() {
    ui_log('eff_mov_show deinit vid', this.vid);
    if (this.vid) {
      this.vid.remove();
    }
  }
  load_movie_options() {
    let ipath = this.movie_url;
    if (ipath) return ipath;
    return this.load_movie_from_group();
  }
  load_movie_from_group() {
    this.files = a_images[this.group];
    if (this.shuffle) {
      this.files = shuffle(this.files);
    }
    let file_name = this.file_name;
    if (this.ifile !== undefined) {
      ui_log('eff_mov_show this.ifile=' + this.ifile);
      if (this.ifile >= this.files.length) {
        this.ifile = this.files.length - 1;
      }
      file_name = this.group + '/' + this.files[this.ifile];
    }
    return './external/media/webdb/' + file_name;
  }
  next_action(aPatch) {
    if (!aPatch.eff_props.ifile) aPatch.eff_props.ifile = 0;
    aPatch.eff_props.ifile = (aPatch.eff_props.ifile + 1) % this.files.length;
    // if (aPatch.eff_props.ifile < 0 || aPatch.eff_props.ifile >= this.files.length - 1) aPatch.eff_props.ifile = 0;
    this.videoKit.ui_patch_update(aPatch);
  }
  previous_action(aPatch) {
    if (!aPatch.eff_props.ifile) aPatch.eff_props.ifile = 0;
    aPatch.eff_props.ifile--;
    if (aPatch.eff_props.ifile < 0) aPatch.eff_props.ifile = this.files.length - 1;
    this.videoKit.ui_patch_update(aPatch);
  }
}
