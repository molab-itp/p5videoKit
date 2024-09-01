//
// device {
//   "count": 259,
//   "date_s": "2023-12-22T03:51:03.651Z",
//   event: [ ... ]
// }

// inputs:
// my.uid
// my.nameDevice

function dbase_site_event_visit() {
  dbase_site_event({ event: 'visit', count: 'visit_count' });
}
globalThis.dbase_site_event_visit = dbase_site_event_visit;

function dbase_site_event_update() {
  dbase_site_event({ event: 'update', count: 'update_count' });
}
globalThis.dbase_site_event_update = dbase_site_event_update;

function dbase_site_event(keys) {
  dbase_site_updates({}, keys);
}

function dbase_site_updates(updates, keys) {
  // console.log('dbase_site_event my.uid', my.uid);
  // ui_log('dbase_site_event my.uid', my.uid);
  if (!my.uid) {
    return;
  }
  let path = `${my.dbase_rootPath}/${my.roomName}/device/${my.uid}`;
  let { getRefPath, update, increment } = fireb_.fbase;
  let refPath = getRefPath(path);
  // ui_log('dbase_site_event', path);

  let date_s = new Date().toISOString();
  let count = increment(1);
  let name_s = my.nameDevice || '';
  let userAgent = navigator.userAgent;

  if (!updates) updates = {};
  if (!keys) {
    keys = { event: 'update', count: 'update_count' };
  }
  Object.assign(updates, { date_s, [keys.count]: count, name_s, userAgent });

  // Acivity is only updated if present in recently received server info
  let events = dbase_site_events(keys, my.uid, date_s);
  if (events) {
    updates[keys.event] = events;
    updates.time = events[0].time;
    updates.time_s = events[0].time_s;
  }
  update(refPath, updates);
}
globalThis.dbase_site_updates = dbase_site_updates;

function dbase_site_events(keys, uid, date_s) {
  // ui_log('dbase_site_events uid', uid, date_s);
  let events = dbase_app_init_events(keys, uid, date_s);
  if (!events) return null;

  let event = events[0];
  if (!my.eventLogTimeMax) {
    my.eventLogTimeMax = 2000;
    my.eventLogMax = 9;
  }
  let nowTime = new Date(date_s).getTime();
  let pastTime = new Date(event.date_s).getTime();
  let ndiff = nowTime - pastTime;
  if (ndiff > my.eventLogTimeMax) {
    // Create a new entry at head of the event log
    let time = 0;
    let time_s = '';
    event = { date_s, time, time_s };
    events.unshift(event);
  } else {
    // Update the first entry with new time and date
    event.date_s = date_s;
    event.time += ndiff;
    event.time_s = dbase_timeToSeconds(event.time);
  }
  dbase_updateTimeGap(events);
  if (events.length > my.eventLogMax) {
    // Delete the last entry to keep to max number permitted
    events.splice(-1, 1);
  }
  return events;
}

function dbase_app_init_events(keys, uid, date_s) {
  let time = 0;
  let initActivities = [{ date_s, time }];
  // return null if no server info received yet
  //  or no entry for this device
  if (!my.fireb_devices) return null;

  let device = my.fireb_devices[uid];
  if (!device) return null;

  let events = device.dbase && device.dbase[keys.event];
  if (!events || events.length == 0) {
    return initActivities;
  }

  return events;
}

function dbase_site_isActive(device) {
  let gapTime = dbase_site_eventGapTime(device);
  // console.log('dbase_site_isActive device.index', device.index, 'gapTime', lapgapTimese, my.eventLogTimeMax);
  return gapTime < my.eventLogTimeMax;
}
globalThis.dbase_site_isActive = dbase_site_isActive;

function dbase_site_eventGapTime(device) {
  let events = device.dbase && device.dbase.update;
  if (!events || events.length == 0) {
    return Number.MAX_VALUE;
  }
  let event = events[0];
  let gapTime = Date.now() - new Date(event.date_s);
  // console.log('dbase_site_eventGapTime device.index', device.index, 'gapTime', gapTime);
  return gapTime;
}

function dbase_site_device_for_uid(uid) {
  let device = my.fireb_devices[uid];
  return device;
}
globalThis.dbase_site_device_for_uid = dbase_site_device_for_uid;

//
// fdevice.dbase.remote
//
function device_uid_isActive(uid) {
  //
  let fdevice = my.fireb_devices[uid];
  // console.log('device_uid_isActive uid', uid, 'remote', fdevice.dbase.remote);
  return dbase_site_isActive(fdevice) && fdevice.dbase.remote;
}
globalThis.device_uid_isActive = device_uid_isActive;
