//
//
import { p5videoKit } from '../a/a_p5videoKit.js';

// import { a_ } from '../let/a_state.js';
// import { ui_prop_set } from '../core-ui/ui_prop.js';
// import { liveMedia_attach, liveMedia_detach } from '../core/liveMedia_attach.js';

// import { ui_div_empty } from '../core-ui/ui_tools.js';

p5videoKit.prototype.ui_live_selection = function () {
  //
  // if (this.a_.hide_ui_option) return;

  let div = this.ui_div_empty('live_selection');

  let chk = createCheckbox('Live ', this.a_.ui.live_chk);
  div.child(chk);
  chk.style('display:inline');
  let nthis = this;
  chk.changed(function () {
    let a_live = this.checked();
    nthis.ui_prop_set('live_chk', a_live ? 1 : 0);
    select('#ichat_blk').style(nthis.a_.ui.live_chk ? 'display:inline' : 'display:none');
    nthis.livem_restore();
  });

  div.child(createSpan('Device: '));
  let aSel = createSelect();
  div.child(aSel);
  // aSel.option('Canvas', 0);
  for (let index = 0; index < this.a_.mediaDivs.length; index++) {
    let ent = this.a_.mediaDivs[index];
    // aSel.option(ent.label, index + 1);
    aSel.option(ent.label, index);
  }
  aSel.selected(this.a_.ui.live_index);
  aSel.changed(function () {
    let index = parseFloat(this.value());
    console.log('ui_live_selection index', index);
    nthis.ui_prop_set('live_index', index);
    let ent = nthis.media_for_livem_index(index);
    if (nthis.a_.ui.live_chk) nthis.liveMedia_attach(ent);
    else nthis.liveMedia_detach(ent);
  });
  {
    let elm = createSpan('Room: ');
    div.child(elm);
    elm = createInput(this.a_.ui.room_name).input(function () {
      nthis.ui_prop_set('room_name', this.value());
    });
    div.child(elm);
  }
  {
    let chk = createCheckbox('Data ', this.a_.ui.canvas_data_chk);
    div.child(chk);
    chk.style('display:inline');
    chk.changed(function () {
      let state = this.checked();
      nthis.ui_prop_set('canvas_data_chk', state ? 1 : 0);
    });
  }
};

p5videoKit.prototype.media_for_livem_index = function (index) {
  return this.a_.mediaDivs[index];
};

p5videoKit.prototype.livem_restore = function () {
  if (!this.a_.livem && this.a_.ui.live_chk) {
    console.log('livem_restore this.a_.ui.live_index', this.a_.ui.live_index);
    let mediaDiv = this.media_for_livem_index(this.a_.ui.live_index);
    console.log('livem_restore mediaDiv', mediaDiv);
    if (mediaDiv) this.liveMedia_attach(mediaDiv);
  }
};
