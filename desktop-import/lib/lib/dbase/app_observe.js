//
function dbase_app_observe({ observed_key, removed_key, observed_item }, options) {
  // options = { app, tag }
  let app = my.mo_app;
  let tag = 'dbase_app_observe';
  if (options) {
    app = options.app || app;
    tag = options.tag || tag;
  }
  // Setup listener for changes to firebase db device
  let path = `${my.dbase_rootPath}/${my.roomName}/${app}`;
  if (observed_item) {
    path += '/a_group';
  }
  let { getRefPath, onChildAdded, onChildChanged, onChildRemoved } = fireb_.fbase;
  let refPath = getRefPath(path);

  onChildAdded(refPath, (data) => {
    receivedDeviceKey('Added', data);
  });

  onChildChanged(refPath, (data) => {
    // console.log('Changed', data);
    receivedDeviceKey('Changed', data);
  });

  // for examples/photo-booth no remove seen
  //
  onChildRemoved(refPath, (data) => {
    receivedDeviceKey('Removed', data, { remove: 1 });
  });

  function receivedDeviceKey(op, data, remove) {
    let msg = tag + ' ' + op;
    let key = data.key;
    let value = data.val();
    // ui_log(msg, key, 'n=', Object.keys(val).length);
    ui_log(msg, 'key', key, 'value', value);
    if (remove) {
      if (removed_key) {
        removed_key(key, value);
      }
      return;
    }
    if (observed_key) {
      observed_key(key, value);
    }
    if (observed_item) {
      let group = group_key();
      if (group == key) {
        my.a_group_item = value;
        if (value) {
          observed_item(value);
        }
      }
    }
  }

  function group_key() {
    let group = my && my.group;
    if (!group) group = 's0';
    // broadcast group when has comma separated values
    if (group.indexOf(',') > -1) {
      // my.group=s1,s2,... --> group=s0
      // Special group 's0' recieves all updates
      group = 's0';
    }
    return group;
  }
}
globalThis.dbase_app_observe = dbase_app_observe;

// issue dbase_update_props to group
function dbase_update_item(item) {
  let group = my && my.group;
  if (!group) group = 's0';
  // broadcast group when has comma separated values
  if (group.indexOf(',') > -1) {
    // my.group=s1,s2,... --> group=s0,s1,s2,...
    // Special group 's0' recieves all updates
    group = 's0,' + group;
  }
  dbase_update_props(item, { group: group });
}
globalThis.dbase_update_item = dbase_update_item;

// issue dbase_update_props to group if my.group present
function dbase_group_update(item) {
  let group = my && my.group;
  if (group) {
    dbase_update_item(item);
  } else {
    dbase_update_props(item, { group: group });
  }
}
globalThis.dbase_group_update = dbase_group_update;

function dbase_group_observe(props, options) {
  let group = my && my.group;
  if (group) {
    dbase_app_observe(props, options);
  } else {
    dbase_devices_observe(props, options);
  }
}
globalThis.dbase_group_observe = dbase_group_observe;
