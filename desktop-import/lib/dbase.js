//

import './lib/dbase/a_dbase.js';

export function dbase_init(my) {
  my.fireb_config = 'jht9629';
  my.dbase_rootPath = 'm0-@r-@w-';
  my.mo_app = my.mo_app || 'mo-america';
  my.roomName = my.roomName || 'room0';
  my.nameDevice = 'nodejs';

  dbase_app_init({
    completed: () => {
      app_init_completed(my);
    },
  });

  // test_my();
}

// function test_my() {
//   console.log('test_my', my);
// }

function app_init_completed() {
  console.log('app_init_completed');
  //
  setInterval(() => {
    app_poll(my);
  }, 1000);

  dbase_devices_observe({ observed_key, observed_item, all: 1 });

  function observed_key(key, device) {
    // console.log('observed_a_device key', key, 'uid', my.uid, 'device', device);
    console.log('observed_a_device key', key, 'device.vote_count', device && device.vote_count);
  }

  function observed_item(device) {
    console.log('observed_item device.vote_count', device.vote_count);
    if (device.vote_count != undefined) {
      my.vote_count = device.vote_count;
    }
  }
}

function app_poll(my) {
  // console.log('app_poll');
  if (dbase_actions_issued(my.uid, { rewind_action: 1 })) {
    my.rewind_action();
  }
  dbase_poll();
}

function ui_log(...args) {
  console.log(...args);
}
globalThis.ui_log = ui_log;
