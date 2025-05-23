//
import { p5videoKit } from '../a/a_p5videoKit.js';

// import { ui_message } from '../core-ui/ui_prop.js';

//
// videoKit.recordVideo({ save_name, fps, duration })
//
p5videoKit.prototype.recordVideo = function (props) {
  //
  // props { save_name, fps, duration }
  //
  // ui_log('recordVideo props', props, 'recVideoInst', this.recVideoInst);
  if (this.recVideoInst) {
    this.recVideoInst.record_flush();
    // return;
  }
  // ui_log('recordVideo props', props, 'recVideoInst', this.recVideoInst);
  this.recVideoInst = new RecordVideo(props);
  this.recVideoInst.videoKit = this;
  this.recVideoInst.record_start();
};

class RecordVideo {
  //
  // props { save_name, fps, duration, doneFunc, sourceElt }
  //
  constructor(props) {
    // ui_log('RecordVideo props', props);
    Object.assign(this, props);
    // ui_log('RecordVideo sourceElt', this.sourceElt);
    this.chunks = [];
    this.recording = 0;
    this.end_time = Number.MAX_SAFE_INTEGER;
    let sourceElt = this.sourceElt || document.querySelector('canvas');
    let stream = sourceElt.captureStream(this.record_fps);
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
    this.requestID = window.requestAnimationFrame((timestamp) => this.record_check_done(timestamp));
  }

  record_check_done(timestamp) {
    // ui_log('record_check_done timestamp', timestamp, 'lapse', Date.now() - this.start_time);
    if (this.recording) {
      let lapseSec = (Date.now() - this.start_time) / 100;
      lapseSec = Math.trunc(lapseSec) / 10;
      if (lapseSec != this.lapseSec) {
        this.videoKit.ui_message('Recording ' + lapseSec + ' secs');
        this.lapseSec = lapseSec;
      }
    }
    if (this.end_time < Date.now()) {
      // ui_log('record_check_done record_stop');
      this.end_time = Number.MAX_SAFE_INTEGER;
      this.record_stop();
      window.cancelAnimationFrame(this.requestID);
      this.videoKit.recVideoInst = null;
      if (this.doneFunc) {
        this.doneFunc();
      }
    } else {
      this.requestID = window.requestAnimationFrame((timestamp) => this.record_check_done(timestamp));
    }
  }

  record_flush() {
    ui_log('RecordVideo record_flush', this.requestID, this.recording);
    if (this.requestID) {
      window.cancelAnimationFrame(this.requestID);
    }
    if (this.recording) {
      this.recorder.stop();
    }
  }

  record_start() {
    // ui_log('record_start');
    this.recorder.start();
    this.recording = 1;
    this.start_time = Date.now();
    this.end_time = Date.now() + this.duration * 1000;
    this.lapseSec = -1;
  }

  record_stop() {
    // ui_log('record_stop recording', this.recording);
    if (this.recording) {
      // ui_log('record_stop recorder.stop');
      this.recorder.stop();
      this.videoKit.ui_message('');
    }
    this.recording = 0;
  }

  exportVideo() {
    let blob = new Blob(this.chunks, { type: 'video/webm' });
    // Download the video
    let url = URL.createObjectURL(blob);
    let a_elt = document.createElement('a');
    document.body.appendChild(a_elt);
    a_elt.style = 'display: none';
    a_elt.href = url;
    a_elt.download = this.save_name + '.webm';
    a_elt.click();
    window.URL.revokeObjectURL(url);
    a_elt.remove();
  }
}
