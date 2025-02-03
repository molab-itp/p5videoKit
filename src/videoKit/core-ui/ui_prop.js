// Set a ui property that's stored into local storage
export function ui_prop_set(prop, value) {
  a_.ui[prop] = value;
  let str = JSON.stringify([value]);
  store_set('a_.ui_' + prop, str);
}

// Get or set a ui property that's stored into local storage
function ui_prop_ref(prop, value) {
  if (value === undefined) {
    return a_.ui[prop];
  } else {
    a_.ui[prop] = value;
    let str = JSON.stringify([value]);
    store_set('a_.ui_' + prop, str);
  }
}
