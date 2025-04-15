//
//
import { p5videoKit } from '../a/a_p5videoKit.js';

// import { a_ } from '../let/a_state.js';
// import { ui_prop_set } from '../core-ui/ui_prop.js';
// import { attach_media_nlabel } from '../core/create_mediaDiv.js';
// import { livem_send } from '../core/liveMedia_attach.js';

p5videoKit.prototype.ui_chat_pane = function () {
  // ichat_blk
  let blk = createSpan('').id('ichat_blk');
  if (this.a_.top_dash_div) {
    this.a_.top_dash_div.child(blk);
  }
  blk.style(this.a_.ui.live_chk ? 'display:inline' : 'display:none');
  let elm;
  elm = createSpan(' Chat name: ');
  blk.child(elm);
  elm = createInput(this.a_.ui.chat_name).input(() => {
    this.ui_prop_set('chat_name', this.value());
  });
  blk.child(elm);
  elm = createButton('Send').mousePressed(() => {
    let str = select('#ichat_msg').value();
    this.livem_send(str);
    select('#ichat_log').html('me: ' + str + '<br/>', true);
  });
  blk.child(elm);
  elm = createButton('Clear').mousePressed(() => {
    select('#ichat_msg').value('');
    select('#ichat_log').html('');
  });
  blk.child(elm);

  elm = createElement('br');
  blk.child(elm);
  // ichat_msg
  let nthis = this;
  elm = createInput('')
    .id('ichat_msg')
    .input(function () {
      ui_log('ichat_msg ' + this.value());
      nthis.ui_prop_set('chat_text', this.value());
    });
  blk.child(elm);
  select('#ichat_msg').style('width', '80%');
  // ichat_log
  elm = createDiv().id('ichat_log');
  blk.child(elm);
  a_chat_log = elm;
};

let a_chat_log;

p5videoKit.prototype.ui_chat_receive = function (str, id) {
  // ui_log('ui_chat_receive', str);
  let obj = { name: id, text: 'Bye' };
  if (str) {
    obj = JSON.parse(str);
    if (!obj) return;
  }
  let { name, text } = obj;
  if (!text) text = '';
  if (name === this.a_.ui.chat_name) {
    name += '-' + id;
  }
  a_chat_log.html(name + ': ' + text + '<br/>', true);
  this.attach_media_nlabel(id, name);
  // !!@ tile: Hello restart
  if (name === 'tile' && text === 'restart') {
    window.location.reload();
  }
};
