//

// --restart_period n
export function setup_restart(my) {
  let per = 0;
  if (my.opt.restart_period) {
    per = parse_period(my.opt.restart_period);
  } else if (my.opt.restart_time) {
    per = parse_restart_time(my.opt.restart_time);
  }
  // console.log('setup_restart per=' + per);
  // Seconds to milliseconds
  per = per * 1000;
  if (per > 0) {
    setTimeout(function () {
      console.log('setTimeout app.relaunch ');
      app.relaunch();
      app.exit(0);
    }, per);
  }
}

function parse_period(period_str) {
  // hh:mm:ss
  // mm:ss
  // ss
  let arr = period_str.split(':').map(parseFloat);
  if (arr.length == 1) {
    arr[2] = arr[0];
    arr[1] = 0;
    arr[0] = 0;
  } else if (arr.length == 2) {
    arr[2] = arr[1];
    arr[1] = arr[0];
    arr[0] = 0;
  }
  let secs = (arr[0] * 60 + arr[1]) * 60 + arr[2];
  // console.log('parse_period arr', arr);
  // console.log('parse_period secs', secs);
  return secs;
}

function parse_restart_time(restart_time) {
  // hh:mm:ss
  // let arr = restart_time.split(':').map(parseFloat);
  // console.log('parse_restart_time arr', arr);
  // let secs = (arr[0] * 60 + arr[1]) * 60 + arr[2];
  let secs = parse_period(restart_time);
  console.log('parse_restart_time secs', secs);
  let d = new Date();
  // console.log('parse_restart_time d.getHours()', d.getHours());
  // console.log('parse_restart_time d.getMinutes()', d.getMinutes());
  // console.log('parse_restart_time d.getSeconds()', d.getSeconds());
  let nsecs = (d.getHours() * 60 + d.getMinutes()) * 60 + d.getSeconds();
  console.log('parse_restart_time nsecs', nsecs);
  let m = 24 * 60 * 60;
  // console.log('parse_restart_time m', m);
  let per = (secs - nsecs + m) % m;
  console.log('parse_restart_time per', per);
  return per;
}
