//
//

import { p5videoKit } from '../a/a_p5videoKit.js';

//
// import { a_ } from '../let/a_state.js';

p5videoKit.prototype.ui_createButton = function (txt) {
  let elm = createButton(txt);
  if (this.a_.top_dash_div) {
    this.a_.top_dash_div.child(elm);
  }
  return elm;
};
p5videoKit.prototype.ui_createElement = function (tag) {
  let elm = createElement('tag');
  if (this.a_.top_dash_div) {
    this.a_.top_dash_div.child(elm);
  }
  return elm;
};

p5videoKit.prototype.ui_div_append = function (div, str) {
  let ndiv = document.createElement('div');
  // window.ndiv = ndiv;
  ndiv.innerHTML = str;
  let childNodes = ndiv.childNodes.values();
  let narr = [];
  // Must make a copy since appendChild will remove child from childNodes
  for (let child of childNodes) {
    narr.push(child);
  }
  // Append all children of ndiv to div
  for (let child of narr) {
    div.elt.appendChild(child);
  }
};

// Create empty div or empty it if already exists
p5videoKit.prototype.ui_div_empty = function (id) {
  let div = select('#' + id);
  // console.log('ui_device_selection div', div);
  if (!div) {
    div = createDiv().id(id);
    if (this.a_.top_dash_div) {
      this.a_.top_dash_div.child(div);
    }
  } else {
    let children = div.child();
    for (let index = children.length - 1; index >= 0; index--) {
      let elm = children[index];
      elm.remove();
    }
  }
  return div;
};

p5videoKit.prototype.ui_hide = function () {
  this.my_canvas.elt.style.cursor = 'none';
  let m = select('main').elt;
  while (m.nextSibling) {
    // elt.nodeName VIDEO
    if (m.nextSibling.nodeName === 'VIDEO') {
      m = m.nextSibling;
    } else {
      m.nextSibling.remove();
    }
  }
};
