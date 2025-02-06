//
//
import { p5videoKit } from '../a/a_p5videoKit.js?v=413';

// import { a_ } from '../let/a_state.js?v=413';
// import { ui_prop_set } from '../core-ui/ui_prop.js?v=413';
// import { patch_instances_clear_all } from '../a/patch_inst.js?v=413';

// this.a_mediaDivs = []
// { imedia, mediaDevice, id, label, div, chk, vis, capture, info, ready, livem }
// 0: canvas
// 1: first local device
// 2: livem device for self
// 3: livem device for others ...

// { live: 1 }
p5videoKit.prototype.create_mediaDiv = function (mediaDevice, options) {
  // let vis_in = !this.a_.hideui; // default to visible except if ui hidden
  let addSort = options.live;
  let vis_in = 0; // default to not visible, more stable on mobile
  let capture = mediaDevice.capture;
  let id = mediaDevice.deviceId;
  let label = mediaDevice.label;
  if (!label) label = id;
  let imedia = this.a_.mediaDivs.length;
  let media_state = this.ui_media_state_default(imedia, vis_in);

  // Can't re-parent capture, so move div before it
  let div = createDiv();
  capture.elt.parentNode.insertBefore(div.elt, capture.elt);

  if (this.a_.hideui || this.a_.hide_ui_option) {
    div.hide();
  }

  let chk = createCheckbox('View', media_state.vis);
  chk.style('display:inline');
  div.child(chk);

  let chk_mute = createCheckbox('Mute', media_state.mute);
  chk_mute.style('display:inline');
  div.child(chk_mute);

  // !!@ find video event change to update width and height in info element
  let info = createSpan();
  div.child(info);

  let notReadyWarningIssued;
  let ready = function (note) {
    let isReady = capture.loadedmetadata && capture.width > 0 && capture.height > 0;
    if (!isReady) {
      if (!notReadyWarningIssued) {
        console.log(note + ' NOT Ready imedia', imedia);
        notReadyWarningIssued = 1;
      }
    } else {
      if (notReadyWarningIssued) {
        console.log(note + ' Ready imedia', imedia);
        notReadyWarningIssued = 0;
      }
    }
    return isReady;
  };

  let update_info = () => {
    let info = ent.info;
    let capture = ent.capture;
    let label = ent.label;
    if (ent.nlabel) {
      label = '[' + ent.nlabel + '] ' + ent.label;
    }
    info.html(' ' + label + ' width=' + capture.width + ' height=' + capture.height);
    capture.style(ent.media_state.vis ? 'display:inline' : 'display:none');
    capture.elt.muted = ent.media_state.mute;
  };

  let ent = {
    imedia,
    mediaDevice,
    id,
    label,
    div,
    chk,
    media_state,
    capture,
    info,
    ready,
    update_info,
  };

  // place new mediaDiv in right order
  let arr = this.a_.mediaDivs;
  if (!addSort) {
    // No live media yet, Add at end
    arr.push(ent);
    this.a_.lastMediaDivIndex = arr.length;
    // console.log('this.a_.lastMediaDivIndex', this.a_.lastMediaDivIndex);
  } else {
    // For live media, add the new entry in sort order by id
    //  to keep entries in same order between reloads
    let index = this.a_.lastMediaDivIndex || 0;
    for (; index < arr.length; index++) {
      if (arr[index].id > id) {
        break;
      }
    }
    arr.splice(index, 0, ent);
    if (!this.a_.ui.hold_create_media_clear) {
      console.log('this.a_.ui.hold_create_media_clear OFF');
      this.patch_instances_clear_all();
    } else {
      console.log('this.a_.ui.hold_create_media_clear ON');
    }
  }

  update_info();

  let nthis = this;
  chk.changed(function () {
    ent.media_state.vis = this.checked() ? 1 : 0;
    nthis.ui_media_state_update(ent.imedia);
    update_info();
  });

  chk_mute.changed(function () {
    ent.media_state.mute = this.checked() ? 1 : 0;
    // console.log(ent.imedia, 'chk_mute.changed ent.capture.elt.muted', ent.capture.elt.muted);
    ent.capture.elt.muted = ent.media_state.mute;
    // console.log(ent.imedia, 'chk_mute.changed ent.media_state.mute', ent.media_state.mute);
    nthis.ui_media_state_update(ent.imedia);
  });

  // !!@ causes removeDomElement failure
  // div.child(capture);
};

p5videoKit.prototype.find_media_by_id = function (id) {
  if (!id) return null;
  return this.a_.mediaDivs.find((item) => item.id === id);
};

p5videoKit.prototype.remove_media_by_id = function (id) {
  this.a_.mediaDivs = this.a_.mediaDivs.filter((item) => item.id !== id);
  console.log('remove_media_by_id id=', id);
  // console.log('remove_media_by_id id=', id, 'this.a_mediaDivs', this.a_mediaDivs);
  // tile_notify_media_update({ remove: id });
};

p5videoKit.prototype.remove_mediaDivs = function () {
  // Remove all but first
  for (let index = this.a_.mediaDivs.length - 1; index > 0; index--) {
    let ent = this.a_.mediaDivs[index];
    this.remove_mediaDiv(ent.id);
  }
};

p5videoKit.prototype.remove_mediaDiv = function (id) {
  // console.log('remove_mediaDiv id=', id, !id);
  // Remove the div associated with id
  let ent = this.find_media_by_id(id);
  console.log('remove_mediaDiv ent', ent);
  if (ent) {
    ent.div.remove();
    ent.capture.remove();
  }
  this.remove_media_by_id(id);
};

p5videoKit.prototype.attach_media_nlabel = function (id, nlabel) {
  let ent = this.a_.mediaDivs.find((item) => item.id === id);
  if (ent) {
    ent.nlabel = nlabel;
    if (ent.update_info) ent.update_info();
  }
};

p5videoKit.prototype.init_mediaDivs = function () {
  // First media pane is canvas
  this.a_.mediaDivs = [
    {
      label: 'Canvas',
      capture: this.a_.my_canvas,
      ready: function () {
        return 1;
      },
    },
  ];
};

// return a reference to mediaDiv_state entry, ui will modify directly
p5videoKit.prototype.ui_media_state_default = function (imedia, vis) {
  let ent = this.a_.ui.mediaDiv_states[imedia];
  if (ent) {
    ent.vis = ent.vis ? 1 : 0;
    if (typeof ent.mute === 'undefined') ent.mute = 1;
    ent.mute = ent.mute ? 1 : 0;
    return ent;
  }
  let mute = 1;
  ent = { vis, mute };
  this.a_.ui.mediaDiv_states[imedia] = ent;
  this.ui_prop_set('mediaDiv_states', this.a_.ui.mediaDiv_states);
  return ent;
};

// imedia is not used. entire mediaDiv_state is updated to local storage
p5videoKit.prototype.ui_media_state_update = function (imedia) {
  this.ui_prop_set('mediaDiv_states', this.a_.ui.mediaDiv_states);
};
