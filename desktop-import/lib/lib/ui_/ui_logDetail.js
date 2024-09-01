//
function ui_logDetailFlag_changed(newValue) {
  my.logDetailFlag = newValue;
  ui_set_hidden(my.logDetail_div, my.logDetailFlag);
}
globalThis.ui_logDetailFlag_changed = ui_logDetailFlag_changed;

// Updates my.logDetail_div with running log
function ui_log(...args) {
  if (!my.logLines) {
    ui_log_init();
  }
  if (!my.logDetail_div) {
    ui_logSummary_div();
  }
  let key = args[0];
  let ent = ui_logTagEntry(key);
  ent.count++;
  if (ent.console) {
    console.log(...args);
  }
  let str = args.join(' ');
  ui_log_add(my.logLines, str);
  ui_log_add(ent.lines, str);
  str = my.logLines.join('<br/>');
  my.logDetail_div.html(str);
}
globalThis.ui_log = ui_log;

function ui_log_add(lines, str) {
  lines.push(str);
  if (lines.length > my.logLinesMax) {
    lines.splice(0, 1);
  }
}

function ui_log_clear() {
  my.logLines = [];
  my.logDetail_div.html('');
}
globalThis.ui_log_clear = ui_log_clear;

function ui_logTagEntry(key) {
  let ent = my.logTags[key];
  if (!ent) {
    let console = my.logLoud ? 1 : 0;
    ent = { count: 0, console, lines: [] };
    my.logTags[key] = ent;
  }
  return ent;
}

function ui_log_init() {
  my.logLines = [];
  if (!my.logLinesMax) {
    my.logLinesMax = 5;
  }
  if (!my.logTags) {
    my.logTags = {};
  }
}

function ui_error(...args) {
  // ui_log(...args);
  console.log(...args);
  alert(...args);
}
globalThis.ui_error = ui_error;

// --

function ui_toggle_scroll() {
  if (globalThis.scrollY > 0) {
    // scroll down some. jump back to top
    console.log('ui_toggle_scroll jump to top');
    globalThis.scrollBy(0, -1000);
    my.scrolling = 0;
  } else {
    // At top. initiated scrolling
    console.log('ui_toggle_scroll start');
    my.scrolling = 1;
    setTimeout(function () {
      console.log('ui_toggle_scroll stop');
      my.scrolling = 0;
    }, my.scrollStopSecs * 1000);
  }
}
globalThis.ui_toggle_scroll = ui_toggle_scroll;

function ui_check_scroll() {
  if (my.scrolling) {
    globalThis.scrollBy(0, 1);
  }
}
globalThis.ui_check_scroll = ui_check_scroll;

//
