//
//

// function dbase_update_props(props, options) {
//
// options.group
// options.count
// options.all
//
function dbase_update_props(props, options) {
  let deviceProps = props;
  let groupProps = {};
  options = options || {};
  let uids = { [my.uid]: 1 };
  if (options.all) {
    uids = my.a_device_values || uids;
  }
  let group = options.group;
  if (group) {
    groupProps = props;
    deviceProps = {};
  }
  //
  // ui_log('dbase_update_props props', props, 'deviceProps', deviceProps);
  if (!my.uid) {
    return;
  }
  let path = `${my.dbase_rootPath}/${my.roomName}/${my.mo_app}`;
  let { getRefPath, update, increment } = fireb_.fbase;
  let refPath = getRefPath(path);

  let a_group = options.a_group;
  if (!a_group) a_group = 'a_group';

  let groups = options.group;
  if (!groups) groups = 's0';
  groups = groups.split(',');

  let updates = {};

  // options.count for increment
  //  ../mo_app/a_device/count
  if (options.count) {
    deviceProps.count = increment(1);
  }

  for (let uid in uids) {
    for (let prop in deviceProps) {
      let value = deviceProps[prop];
      let dpath = `a_device/${uid}/${prop}`;
      updates[dpath] = value;
    }
  }

  // group=s1,s2,s3,s4 to broadcast
  // console.log('dbase_update_props groups', groups);
  for (let group of groups) {
    for (let prop in groupProps) {
      let value = groupProps[prop];
      let dpath = `${a_group}/${group}/${prop}`;
      updates[dpath] = value;
    }
  }
  // ui_log('dbase_update_props updates', updates);

  update(refPath, updates);

  dbase_site_event_update();
}
globalThis.dbase_update_props = dbase_update_props;

//
function dbase_update_value(value, apps) {
  // apps = { app, tag, suffix }
  //
  let app = my.mo_app;
  let tag = 'dbase_update_value';
  let suffix = '';
  if (apps) {
    app = apps.app || app;
    tag = apps.tag || tag;
    if (apps.suffix != undefined) suffix = '/' + apps.suffix;
  }
  if (!my.uid) {
    ui_log(tag + ' no uid', my.uid);
    return;
  }
  let path = `${my.dbase_rootPath}/${my.roomName}/${app}/${my.uid}${suffix}`;
  let { getRefPath, update } = fireb_.fbase;
  let refPath = getRefPath(path);

  update(refPath, value);

  dbase_site_event_update();
}
globalThis.dbase_update_value = dbase_update_value;

function dbase_increment(value) {
  let { increment } = fireb_.fbase;
  return increment(value);
}
globalThis.dbase_increment = dbase_increment;

//
function dbase_remove_room() {
  //
  let path = `${my.dbase_rootPath}/${my.roomName}`;
  let { getRefPath, set } = fireb_.fbase;
  let refPath = getRefPath(path);
  set(refPath, {})
    .then(() => {
      // Data saved successfully!
      console.log('dbase_remove_room OK');
    })
    .catch((error) => {
      // The write failed...
      console.log('dbase_remove_room error', error);
    });
}
globalThis.dbase_remove_room = dbase_remove_room;

//
function dbase_remove_mo_app() {
  //
  let path = `${my.dbase_rootPath}/${my.roomName}/${my.mo_app}`;
  let { getRefPath, set } = fireb_.fbase;
  let refPath = getRefPath(path);
  set(refPath, {})
    .then(() => {
      // Data saved successfully!
      console.log('dbase_remove_mo_app OK');
    })
    .catch((error) => {
      // The write failed...
      console.log('dbase_remove_mo_app error', error);
    });
}
globalThis.dbase_remove_mo_app = dbase_remove_mo_app;
