//
//

import { image_scaled_pad } from '../util/image.js';
// import { ui_message } from '../core-ui/ui_prop.js';

export default class eff_show {
  //
  static meta_props = {
    record_fps: [4, 6, 12, 24, 30, 60],
    record_duration: [5, 10, 20, 30, 60],
    record_start: {
      button: (ent, aPatch) => {
        ent.record_start(aPatch);
      },
    },
    record_stop: {
      button: (ent, aPatch) => {
        ent.record_stop(aPatch);
      },
    },
    record_save_name: {
      text_input: 'record_log',
    },
    record_show: [0, 1],
  };

  constructor(props) {
    Object.assign(this, props);
    this.init();
  }

  init() {
    this.record_init();
  }

  prepareOutput() {
    // ui_log('eff_show_pad prepareOutput');
    if (!this.eff_spec.ihide) {
      if (this.input) {
        let img = this.input.get();
        // ui_log('eff_show_pad prepareOutput img', img);
        let eff_spec = this.eff_spec;
        let opt = { fliph: eff_spec.ifliph, flipv: eff_spec.iflipv };
        image_scaled_pad(img, this.eff_spec.urect, opt);
      }
    } else {
      this.output = this.input;
    }
    if (this.recording) {
      let lapseSec = (Date.now() - this.start_time) / 100;
      lapseSec = Math.trunc(lapseSec) / 10;
      if (lapseSec != this.lapseSec) {
        // this.video.ui_message('Recording ' + lapseSec + ' secs');
        this.lapseSec = lapseSec;
      }
    }
    if (this.end_time < Date.now()) {
      this.end_time = Number.MAX_SAFE_INTEGER;
      this.record_stop();
    }
  }

  record_start() {
    ui_log('record_start');
    this.recorder.start();
    this.recording = 1;
    this.start_time = Date.now();
    this.end_time = Date.now() + this.record_duration * 1000;
    this.lapseSec = -1;
    // ui_log('record_start Date.now()', Date.now());
    // ui_log('record_start record_duration', this.record_duration);
    // ui_log('record_start end_time', this.end_time);
  }

  record_stop() {
    ui_log('record_stop recording', this.recording);
    if (this.recording) {
      ui_log('record_stop recorder.stop');
      this.recorder.stop();
      // this.videoKit.ui_message('');
    }
    this.recording = 0;
  }

  record_init() {
    this.chunks = [];
    this.recording = 0;
    this.end_time = Number.MAX_SAFE_INTEGER;
    let stream = document.querySelector('canvas').captureStream(this.record_fps);
    this.recorder = new MediaRecorder(stream);
    this.recorder.ondataavailable = (e) => {
      if (e.data.size) {
        this.chunks.push(e.data);
      }
    };
    this.recorder.onstop = (evt) => {
      // ui_log('recorder.onstop', evt);
      this.exportVideo();
    };
  }

  exportVideo() {
    let blob = new Blob(this.chunks, { type: 'video/webm' });
    if (this.record_show) {
      // Draw video to screen
      let videoElement = document.createElement('video');
      videoElement.setAttribute('id', Date.now());
      videoElement.controls = true;
      document.body.appendChild(videoElement);
      videoElement.src = window.URL.createObjectURL(blob);
    }
    // Download the video
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = this.record_save_name + '.webm';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}

// https://editor.p5js.org/jht1493/sketches/AnPN6baGO
// Canvas Record to Video -buts
