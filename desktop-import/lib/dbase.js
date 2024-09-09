//

import './lib/dbase/a_dbase.js';

export function dbase_init(my) {
  my.fireb_config = 'jht9629';
  // my.fireb_config = 'jht1493';
  // my.fireb_config = 'jhtitp';

  my.dbase_rootPath = 'm0-@r-@w-';
  my.roomName = 'm0-america';
  my.mo_app = 'mo-america-rewind';
  // -election excludes this device from status count report
  my.nameDevice = 'america-electron';
  // set group for all devices to share item values
  my.group = 's0';

  dbase_app_init({ completed: app_init_completed });
}

function app_init_completed() {
  console.log('app_init_completed ');
  // console.log('app_init_completed my', my);
  //
  dbase_app_observe({ observed_item });

  function observed_item(item) {
    //
    dbase_if_action({ item, prop: 'action_rewind', actionFunc: my.rewind_action });

    dbase_if_action({ item, prop: 'action_full_read', actionFunc: my.full_read_action });
  }
}

// dbase_if_action(item.action_rewind, 'action_rewind', my.rewind_action)
// !!@ dbase_if_action --> p5moLibrary
function dbase_if_action({ item, prop, actionFunc }) {
  let count = item[prop];
  if (count != null) {
    if (my[prop] && count != my[prop]) {
      // trigger action
      console.log('triggering action', prop, 'old count', my[prop], 'new count', count);
      actionFunc();
    }
    my[prop] = count;
  }
}
// !!@ dbase_issue_action to p5moLibrary
// function dbase_issue_action(prop) {
// dbase_issue_action is complement by dbase_if_action
//

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
