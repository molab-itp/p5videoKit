//

function ui_break(id) {
  let element = ui_element(id);
  if (!element) {
    element = createElement('br');
    ui_fresh_element(element);
  }
  return element;
}
globalThis.ui_break = ui_break;

function ui_span(id, html) {
  let span = ui_element(id);
  if (!span) {
    span = createSpan();
    ui_fresh_element(span);
  }
  span.html(html);
  return span;
}
globalThis.ui_span = ui_span;

function ui_div(id, html) {
  let div = ui_element(id);
  if (!div) {
    div = createDiv();
    ui_fresh_element(div);
  }
  div.html(html);
  return div;
}
globalThis.ui_div = ui_div;

// Create empty div or empty it if it already exists
function ui_div_empty(id) {
  let div = ui_element(id);
  if (!div) {
    div = createDiv();
    ui_fresh_element(div);
  } else {
    let children = div.child();
    for (let index = children.length - 1; index >= 0; index--) {
      let elm = children[index];
      elm.remove();
    }
  }
  return div;
}
globalThis.ui_div_empty = ui_div_empty;

function ui_checkbox(label, value) {
  let chk = ui_element(label);
  if (!chk) {
    chk = createCheckbox(label, value);
    chk.style('display:inline');
    ui_fresh_element(chk);
  }
  return chk;
}
globalThis.ui_checkbox = ui_checkbox;

function ui_createButton(label) {
  let element = ui_element(label);
  if (!element) {
    element = createButton(label);
    ui_fresh_element(element);
  }
  return element;
}
globalThis.ui_createButton = ui_createButton;

function ui_select(id) {
  let element = ui_element(id);
  if (!element) {
    element = createSelect();
    ui_fresh_element(element);
  }
  return element;
}
globalThis.ui_select = ui_select;

function ui_input(id, text) {
  let element = ui_element(id);
  if (!element) {
    element = createInput(text);
    ui_fresh_element(element);
  }
  return element;
}
globalThis.ui_input = ui_input;

function ui_begin() {
  my.ui_id_index = 1;
}
globalThis.ui_begin = ui_begin;

function ui_begin_update() {
  my.ui_id_index = 1001;
}
globalThis.ui_begin_update = ui_begin_update;

function ui_element(id) {
  // console.log('ui_element id', id);
  if (!id) {
    id = 'uid_' + my.ui_id_index;
    my.ui_id_index++;
  }
  if (!my.ui_uids) {
    my.ui_uids = {};
  }
  my.ui_last_id = id;
  let element = my.ui_uids[id];
  return element;
}

function ui_fresh_element(element) {
  // console.log('ui_fresh_element my.ui_last_id', my.ui_last_id);
  my.ui_uids[my.ui_last_id] = element;
  element.id(my.ui_last_id);
  if (my.ui_container) {
    my.ui_container.child(element);
  }
}
