//

import './lib/dbase/a_dbase.js';

export function dbase_init(my) {
  my.fireb_config = 'jht9629';
  my.dbase_rootPath = 'm0-@r-@w-';
  my.mo_app = my.mo_app || 'mo-america';
  my.roomName = my.roomName || 'room0';
  my.nameDevice = 'nodejs';

  dbase_app_init({ completed: app_init_completed });
}

function app_init_completed() {
  console.log('app_init_completed');
}
