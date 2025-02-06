//
//

// import { a_ } from '../let/a_state.js?v=413';
// import { init_size_in } from '../core-ui/ui_canvas.js?v=413';
// import { ui_prop_set } from '../core-ui/ui_prop.js?v=413';

// !!@ Unused
export function ui_render_size(div) {
  // console.log('ui_canvas');
  render_size();

  function render_size() {
    div.child(createSpan(' Render Size: '));
    let aSel = createSelect();
    div.child(aSel);
    for (let se of a_render_sizes) {
      aSel.option(se.label);
    }
    aSel.selected(this.a_.ui.render_size);
    let nthis = this;
    aSel.changed(function () {
      let label = this.value();
      let se = a_render_sizes_dict[label];
      nthis.ui_prop_set('render_size', se.label);
    });
  }
}

let a_render_sizes_dict;

// !!@ Unused
export function ui_render_size_init() {
  a_render_sizes_dict = this.init_size_in(a_render_sizes);
}

// !!@ Unused
function render_size_default() {
  let sz = a_render_sizes_dict[this.a_.ui.render_size];
  // console.log('render_sizei index', this.a_.ui.render_sizei, 'size', sz);
  if (sz) return sz;
  return a_render_sizes[0];
}

let a_render_sizes = [
  {
    label: 'Canvas',
  },
  {
    width: 320,
    height: 240,
  },
  {
    width: 480,
    height: 270,
  },
  {
    width: 640,
    height: 480,
  },
  {
    width: 960,
    height: 540,
  },
  {
    width: 1920,
    height: 1080,
  },
  {
    width: 540,
    height: 960,
  },
  {
    width: 1080,
    height: 1920,
  },
];
