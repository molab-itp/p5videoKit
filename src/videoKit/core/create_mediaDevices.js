//
//
import { p5videoKit } from '../a/a_p5videoKit.js';

// import { a_ } from '../let/a_state.js';
// import { create_mediaDiv, remove_mediaDivs } from '../core/create_mediaDiv.js';
// import { get_capture_size } from '../core-ui/ui_capture.js';
// import { livem_restore } from '../core-ui/ui_live.js';
// import { ui_refresh } from '../core-ui/ui_patch_bar.js';

// export let a_mediaDevices = [];

// mediaDevice
//  { label, deviceId, capture, stream }

p5videoKit.prototype.media_enum = function () {
  this.a_.mediaDevices = [];
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    ui_log('enumerateDevices() not supported.');
    return;
  }
  // List cameras and microphones.
  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      devices.forEach((device) => {
        // ui_log('device', device);
        // ui_log(
        //   device.kind + ': ' + device.label + ' id=|' + device.deviceId + '|'
        // );
        if (device.kind == 'videoinput') {
          // ui_log('media_enumdevice.deviceId=' + device.deviceId);
          ui_log('media_enum label=' + device.label);
          let { label, deviceId } = device;
          if (!deviceId) {
            label = 'No-id-' + random();
          }
          this.a_.mediaDevices.push({ label, deviceId });
        }
      });
      // ui_log('a_mediaDevices', a_mediaDevices);
      this.create_mediaDevices();
    })
    .catch((err) => {
      ui_log(err.name + ': ' + err.message);
    });
};

p5videoKit.prototype.media_reset = function () {
  ui_log('media_reset');
  this.remove_mediaDivs();
  this.media_enum();
};

p5videoKit.prototype.create_mediaDevices = function () {
  for (let mediaDevice of this.a_.mediaDevices) {
    this.init_device_capture(mediaDevice);
    this.create_mediaDiv(mediaDevice, { live: 0 });
  }
  this.ui_refresh();
};

p5videoKit.prototype.init_device_capture = function (mediaDevice) {
  let vcap = {
    // audio: true,
    audio: this.a_.ui.audio_enabled,
    video: {
      deviceId: { exact: mediaDevice.deviceId },
    },
  };
  let dim = this.get_capture_size();
  if (dim && dim.width && dim.height) {
    vcap.video.width = { exact: dim.width };
    vcap.video.height = { exact: dim.height };
  }
  // ui_log('create_mediaDevices dim', dim);
  // ui_log('create_mediaDevices vcap', vcap);
  let capture = createCapture(vcap, (stream) => {
    mediaDevice.stream = stream;
    this.livem_restore();
  });
  // ui_log('create_mediaDevices capture width height', capture.width, capture.height);
  capture.elt.muted = true;
  mediaDevice.capture = capture;
};

// Save image of each media device = camera or live stream
function save_others(fn) {
  // this.a_.ui.patches.imedia
  let imd = {};
  for (let ent of this.a_.ui.patches) {
    let imedia = ent.eff_spec.imedia;
    if (imd[imedia]) {
      continue;
    }
    imd[imedia] = true;
    save_other(fn, imedia);
  }
}

function save_other(fn, imedia) {
  ui_log('save_other idev', imedia);
  let vent = this.a_.mediaDivs[imedia];
  if (!vent) return;
  let vin = vent.capture;
  if (!vin) return;
  let img = vin.get();
  image_scaled(img);
  saveCanvas(fn + '_v' + imedia, 'png');
}
