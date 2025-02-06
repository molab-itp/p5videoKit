//
//
import { p5videoKit } from '../a/a_p5videoKit.js?v=413';

// import { location_noquery } from '../core/store_url_parse.js?v=413';
// import { ui_message } from '../core-ui/ui_prop.js?v=413';

// On first use in browser sometimes camera permissions
// are not requested and no video is displayed.
// This simple use of createCapture appears to trigger permissions
let myVideo;

p5videoKit.prototype.reset_video_clear_locals = function (storen) {
  this.ui_message('Resetting Configuration', { initTimer: 1 });
  localStorage.clear();
  if (storen) {
    localStorage.setItem('a_.store_name', storen);
  }
  let vconstraints = {
    video: true,
  };
  myVideo = createCapture(vconstraints, function (stream) {
    console.log('reset_video_clear_locals create_video stream', stream);
  });
  console.log('reset_video_clear_locals create_video myVideo', myVideo);
  myVideo.muted = true;
  let delay = 2000;
  // let delay = 1000;
  let func = () => {
    let nref = (random() + '').substring(2);
    nref = this.location_noquery() + '?v=' + nref;
    window.location = nref;
    // console.log('nref', nref);
  };
  setTimeout(func, delay);
  // function alert_reload() {
  //   window.alert('reloading page');
  //   let nref = document.location.href + '?v=' + random();
  //   window.location.href = nref;
  // }
};
