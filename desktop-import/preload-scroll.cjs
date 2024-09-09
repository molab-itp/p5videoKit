//
const { webFrame, ipcRenderer } = require('electron');

let my = {};
window.my = my;
my.gcCount = 0;
my.margin = 32;
my.overlayColors = ['rgba(255, 80, 80, 1.0)', 'rgba(255, 180, 60, 1.0)', 'rgba(60, 190, 70, 1.0)'];
my.overlayColorsIndex = 0;
my.scrollYTopShort = 760;
// my.scrollYTopShort = 580;
my.scrollYTopLong = 616;
// my.scrollYTopLong = 460;

// my.scrollPeriod = 0.1; // * 0.75;
// my.elineDelayPeriod = 30; // * 0.75;

// my.scrollPeriod = 0.1 * 0.75;
// my.elineDelayPeriod = 30 * 0.75;

my.scrollPeriod = 0.1;
my.elineDelayPeriod = 30 * 0.5;

my.zoomFactorLong = 2.18;
my.zoomFactorShort = 1.4;

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(setup_scroll, 1000);
  setup_responder();

  webFrame.setZoomFactor(my.zoomFactorShort);
  // webFrame.setZoomFactor(my.zoomFactorLong);

  let zoomFactor = webFrame.getZoomFactor();
  console.log('zoomFactor', zoomFactor);
});

// ipcRenderer.send('asynchronous-message', 'ping')
// set-line-info
/*
ipcMain.on('set-line-info', (event, lineInfo) => {
  // dbase_update_item({ num, text });
  dbase_update_item(lineInfo);
*/

// lineInfo = { num, text }
function send_lineInfo(lineInfo) {
  ipcRenderer.send('set-line-info', lineInfo);
}

function send_current_line() {
  if (!my.elines) return;
  let eln = my.elines[my.elineIndex];
  let num = my.elineIndex + 1;
  let text = eln.textContent;
  let color = my.overlayColors[my.overlayColorsIndex];
  if (!my.offscreen) {
    send_lineInfo({ num, text, color });
  }
}

function setup_responder() {
  ipcRenderer.on('rewind', (_event, value) => {
    console.log('ipcRenderer.on rewind', value);
    play_from_top_short();
  });
  ipcRenderer.on('full-read', (_event, value) => {
    console.log('ipcRenderer.on full-read', value);
    play_from_top_long();
  });
}

function play_from_top_short() {
  if (my.full_read_enabled) {
    webFrame.setZoomFactor(my.zoomFactorShort);
  }
  play_from_top(my.scrollYTopShort);
  my.full_read_enabled = 0;
}

function play_from_top_long() {
  if (!my.full_read_enabled) {
    webFrame.setZoomFactor(my.zoomFactorLong);
  }
  play_from_top(my.scrollYTopLong);
  my.full_read_enabled = 1;
}

function play_from_top(ytop) {
  //

  gc();
  my.gcCount++;
  console.log('my.gcCount', my.gcCount);

  window.scrollTo(0, ytop);

  start_scroll_pause();

  my.elineIndex = 0;
  my.elineDelayCount = 0;
  my.overlayColorsIndex = (my.overlayColorsIndex + 1) % my.overlayColors.length;

  send_current_line();
}

window.addEventListener('mouseup', function (event) {
  // console.log('mouseup clientX', event.clientX, 'clientY', event.clientY);
  let zoomFactor = webFrame.getZoomFactor();
  console.log('mouseup window.scrollY', window.scrollY, 'my.scrollEnabled', my.scrollEnabled);
  console.log('zoomFactor', zoomFactor);
  my.scrollEnabled = !my.scrollEnabled;
});

function setup_scroll() {
  //
  console.log('setup_scroll my', my);
  console.log('setup_scroll window.location.href', window.location.href);

  let fi = document.querySelector('.field--field_image');
  my.authorImageDiv = fi;

  let nt = document.querySelector('.navbar-toggler');
  nt.remove();

  let pa = document.querySelector('.poem-actions--vertical');
  pa.remove();

  let et = document.querySelector('.field--title');
  let nb = document.querySelector('.navbar-brand');
  nb.innerHTML = nb.textContent + '<br/>' + et.textContent;
  nb.style.fontSize = 'xx-large';
  my.topBox = nb;

  let ar = document.querySelector('article');
  let fb = ar.querySelector('.field--body');
  my.fieldBody = fb.querySelector('p');

  my.elines = ar.querySelectorAll('.long-line');

  my.elineIndex = 0;
  my.elineDelayCount = 0;

  let period = my.scrollPeriod * 1000;
  setInterval(scroll_track, period);

  window.scrollTo(0, my.scrollYTopShort);

  start_scroll_pause();

  send_current_line();
}

function start_scroll_pause() {
  my.scrollEnabled = 0;
  my.scrollPausePeriod = 5000;
  my.scrollPauseStart = Date.now();
}

function scroll_track() {
  displayStatus();
  my.lastScrollY = window.scrollY;
  check_scroll_pause();
  check_line_hilite();
  if (!my.scrollEnabled) return;
  window.scrollBy(0, 1);

  // the author image moving off top of screen triggers play from top
  // in short read, when view is two column, this is line 8 of poem
  // in full read the image is below the last line of poem

  let rt = my.authorImageDiv.getBoundingClientRect();
  if (rt.y < 0) {
    // play_from_top();
    pause_at_bottom();
  }
}

// pause at bottom of screen before playing from top
//
function pause_at_bottom() {
  // console.log('pause_at_bottom', my.paused_at_bottom);
  if (my.paused_at_bottom) {
    check_scroll_pause();
    if (my.scrollEnabled) {
      // play_from_top();
      play_from_top_short();
      my.paused_at_bottom = 0;
    }
    return;
  }
  my.paused_at_bottom = 1;
  start_scroll_pause();
}

function check_line_hilite() {
  // Keep up last hilite until starting from the top
  if (my.last_elineIndex == my.elines.length - 1) {
    let rt = my.elines[0].getBoundingClientRect();
    if (rt.y < 0) {
      my.elineIndex = my.last_elineIndex;
    }
  }

  let el = my.elines[my.elineIndex];
  let rt = el.getBoundingClientRect();
  overlayElement(el);

  my.elineDelayCount = (my.elineDelayCount + 1) % my.elineDelayPeriod;
  if (my.elineDelayCount != 1) return;

  // delay new hilite until upper half of window
  let midWindow = window.innerHeight / 2;
  if (rt.y > midWindow) {
    // console.log('delayed my.elineIndex', my.elineIndex);
    my.elineDelayCount = 0;
    return;
  }
  if (rt.y < 0) {
    // Hilite scroll off top of screen
    let lastLine = my.elineIndex;
    my.offscreen = 1;
    let n = my.elines.length;
    while (rt.y < midWindow) {
      my.elineIndex = (my.elineIndex + 1) % my.elines.length;
      el = my.elines[my.elineIndex];
      rt = el.getBoundingClientRect();
      if (lastLine > my.elineIndex) break;
      n--;
      if (n < 0) break;
    }
  } else {
    my.offscreen = 0;
  }

  if (!my.scrollEnabled) return;

  my.last_elineIndex = my.elineIndex;
  my.elineIndex = (my.elineIndex + 1) % my.elines.length;
  my.overlayColorsIndex = (my.overlayColorsIndex + 1) % my.overlayColors.length;

  if (my.elineIndex) {
    send_current_line();
  }
}

function check_scroll_pause() {
  if (!my.scrollPauseStart) return;
  let now = Date.now();
  let nowDiff = now - my.scrollPauseStart;
  if (nowDiff > my.scrollPausePeriod) {
    my.scrollEnabled = 1;
    my.scrollPauseStart = 0;
  }
}

function overlayElement(elt) {
  // Create a new div element for the overlay
  if (!my.overlay) {
    my.overlay = document.createElement('div');
    my.fieldBody.appendChild(my.overlay);
    my.overlay.style.position = 'fixed';
    my.overlay.style.pointerEvents = 'none'; // Ensures the overlay doesn't block clicks
  }
  if (!my.cloned) {
    my.cloned = elt.cloneNode(true);
    my.fieldBody.appendChild(my.cloned);
    my.cloned.style.position = 'fixed';
    my.cloned.style.pointerEvents = 'none';
  }
  my.overlay.style.backgroundColor = my.overlayColors[my.overlayColorsIndex];
  my.cloned.innerHTML = elt.innerHTML;

  let { x, y, width, height } = elt.getBoundingClientRect();
  x -= my.margin;
  width += my.margin;
  // !!@ some text lines go beyond rect

  let x1 = 0;
  let w1 = window.innerWidth;
  my.overlay.style.top = `${y}px`;
  // my.overlay.style.left = `${x}px`;
  // my.overlay.style.width = `${width}px`;
  my.overlay.style.left = `${x1}px`;
  my.overlay.style.width = `${w1}px`;
  my.overlay.style.height = `${height}px`;

  my.cloned.style.top = `${y}px`;
  my.cloned.style.left = `${x}px`;
  my.cloned.style.width = `${width}px`;
  my.cloned.style.height = `${height}px`;
}

// https://chatgpt.com/
// create a DOM element that overlays a transparent color at a specified location on the window
// overlay a transparent color at a specified location on the window
function overlayAtPosition({ x, y, width, height }) {
  // Create a new div element for the overlay
  // ...
}

function createStatusDiv() {
  if (!my.statusDiv) {
    let w = window.innerWidth;
    let h = 32;

    let x = window.innerWidth - w;
    let y = window.innerHeight - h;
    let width = w;
    let height = h;

    my.statusDiv = document.createElement('div');
    // document.body.appendChild(my.statusDiv);
    // my.topBox.appendChild(my.statusDiv);

    // my.statusDiv.style.top = `${y}px`;
    my.statusDiv.style.left = `${x}px`;
    my.statusDiv.style.width = `${width}px`;
    my.statusDiv.style.height = `${height}px`;

    my.statusDiv.style.zIndex = 10;
    my.statusDiv.style.backgroundColor = 'black';
    my.statusDiv.style.color = 'white';
    my.statusDiv.style.fontSize = `${h}px`;
    // my.statusDiv.style.textAlign = 'right';
    my.statusDiv.textContent = 'Starting...';

    console.log('window.scrollY', window.scrollY);
    console.log('my.statusDiv', my.statusDiv);
  }
}

function displayStatus() {
  //
  createStatusDiv();
  // my.statusDiv.textContent = window.scrollY + '';
  // my.topBox.innerHTML += window.scrollY + '';
  // my.topBox.innerHTML = window.scrollY + '';
}

// my.overlayColors = ['rgba(255, 205, 50, 1.0)', 'red', 'green'];
// my.overlayColors = ['rgba(255, 205, 50, 1.0)', 'rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)'];
// Apple Finder window close-hide-max
// let my.scrollYTop = 465;
// let my.scrollYTop = 635;
// window.innerWidth 520
// my.lastScrollY;
