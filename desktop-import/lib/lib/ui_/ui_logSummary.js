//

function ui_logSummary_div() {
  my.logSummary_div = ui_div('logSummary', 'Welcome to the debug pane');
  ui_set_hidden(my.logSummary_div, my.logSummaryFlag);

  my.logDetail_div = ui_div('logDetail', '');
  ui_set_hidden(my.logDetail_div, my.logDetailFlag);

  my.logSummary_div.style('background-color:#ddd');
  my.logDetail_div.style('background-color:#eee');
}
globalThis.ui_logSummary_div = ui_logSummary_div;

function ui_set_hidden(element, flag) {
  if (flag) {
    element.elt.classList.remove('hidden');
  } else {
    element.elt.classList.add('hidden');
  }
}
globalThis.ui_set_hidden = ui_set_hidden;

function ui_logSummaryFlag_changed(newValue) {
  my.logSummaryFlag = newValue;
  ui_set_hidden(my.logSummary_div, my.logSummaryFlag);
  // console.log('my.logTags', my.logTags);
  if (!my.logTags) return;
  let div = ui_div_empty('logSummary');
  for (let key in my.logTags) {
    let ent = my.logTags[key];
    // console.log('my.logTags key=', key, 'ent', ent);

    let span = createSpan(key);

    let chk = createCheckbox('console', ent.console);
    chk.style('display:inline');
    chk.changed(function () {
      ent.console = this.checked();
    });

    let spanCount = createSpan(' count=' + ent.count);

    div.child(createElement('br'));
    div.child(span);
    div.child(chk);
    div.child(spanCount);

    div.child(createElement('br'));

    let span2 = createSpan(ent.lines[0]);
    div.child(span2);

    div.child(createElement('br'));
  }
  div.child(createElement('br'));
}
globalThis.ui_logSummaryFlag_changed = ui_logSummaryFlag_changed;
