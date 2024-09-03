//

import './lib/dbase/a_dbase.js';

export function dbase_init(my) {
  my.fireb_config = 'jht9629';
  // my.fireb_config = 'jht1493';
  // my.fireb_config = 'jhtitp';

  my.dbase_rootPath = 'm0-@r-@w-';
  my.roomName = 'room0';
  my.nameDevice = '';

  my.mo_app = 'mo-america-rewind';
  my.group = 's0';

  my.rewind_action_count = 0;

  dbase_app_init({ completed: app_init_completed });
}

function app_init_completed() {
  console.log('app_init_completed ');
  // console.log('app_init_completed my', my);
  //
  dbase_app_observe({ observed_item });

  function observed_item(item) {
    let rewind_action_count = item.rewind_action_count;
    if (rewind_action_count != null && rewind_action_count != my.rewind_action_count) {
      // rewind action triggered
      console.log('rewind action triggered my.rewind_action_count', my.rewind_action_count);
      console.log('rewind_action_count', rewind_action_count);
      my.rewind_action_count = rewind_action_count;

      my.rewind_action();
    }
  }
}

function ui_log(...args) {
  console.log(...args);
}
globalThis.ui_log = ui_log;

function ui_error(...args) {
  ui_log(...args);
  // !!@ not available in nodejs
  // alert(...args);
}
globalThis.ui_error = ui_error;
