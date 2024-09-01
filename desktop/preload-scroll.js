//
window.addEventListener('DOMContentLoaded', () => {
  // show_versions();
  setTimeout(setup_scroll, 1000);
});

window.addEventListener('mouseup', function (event) {
  // console.log('mouseup clientX', event.clientX, 'clientY', event.clientY);
  console.log('mouseup window.scrollY', window.scrollY, 'my.scrollEnabled', my.scrollEnabled);
  my.scrollEnabled = !my.scrollEnabled;
});

let my = {};
window.my = my;

let scrollYTopMargin = 100;
let scrollYTop = 580;
// let scrollYTop = 465;
// let scrollYTop = 635;
let scrollYBottom = 4800; // 3769 * 2;
let lastScrollY;
let scrollPeriod = 0.1 * 0.75;
my.elineDelayPeriod = 30 * 0.75;

function setup_scroll() {
  //
  console.log('setup_scroll my', my);
  console.log('setup_scroll window.location.href', window.location.href);

  let nt = document.querySelector('.navbar-toggler');
  nt.remove();

  let et = document.querySelector('.field--title');
  let nb = document.querySelector('.navbar-brand');
  nb.innerHTML = nb.textContent + '<br/>' + et.textContent;
  nb.style.fontSize = 'xx-large';

  let ar = document.querySelector('article');
  my.elines = ar.querySelectorAll('.long-line');
  // my.elines = document.querySelectorAll('.long-line');
  my.elineIndex = 0;
  // el[0].style.backgroundColor = 'gold'
  // console.log('my.elines.length', my.elines.length);
  my.elineDelayCount = 0;
  // my.elineDelayPeriod = 30;

  let period = scrollPeriod * 1000;
  setInterval(scroll_track, period);

  window.scrollTo(0, scrollYTop);

  start_scroll_pause();
}

function start_scroll_pause() {
  my.scrollEnabled = 0;
  my.scrollPausePeriod = 5000;
  my.scrollPauseStart = Date.now();
}

function scroll_track() {
  lastScrollY = window.scrollY;
  check_scroll_pause();
  check_line_hilite();
  if (!my.scrollEnabled) return;
  window.scrollBy(0, 1);
  // console.log(' lastScrollY', lastScrollY);
  if (window.scrollY > scrollYBottom) {
    window.scrollTo(0, scrollYTop);
    start_scroll_pause();
    my.elineIndex = 0;
    my.elineDelayCount = 0;
  }
  // if (window.scrollY < scrollYTopMargin) {
  //   window.scrollTo(0, scrollYTop);
  // }
}

function check_line_hilite() {
  if (!my.scrollEnabled) return;
  my.elineDelayCount = (my.elineDelayCount + 1) % my.elineDelayPeriod;
  if (my.elineDelayCount != 1) return;

  let el = my.elines[my.elineIndex];
  // console.log('check_line_hilite elineIndex', my.elineIndex, 'el', el);

  // delay new hilite until upper half of window
  let rt = el.getBoundingClientRect();
  if (rt.y > window.innerHeight / 2) {
    // console.log('delayed my.elineIndex', my.elineIndex);
    my.elineDelayCount = 0;
    return;
  }

  // Keep up last hilite until starting from the top
  // if (my.last_elineIndex - 1 == my.elines.length - 1) {
  //   return;
  // }

  // remove last hilite
  if (my.last_elineIndex) {
    my.elines[my.last_elineIndex - 1].style.backgroundColor = '';
  }
  // new hilite at elineIndex
  el.style.backgroundColor = 'gold';
  my.last_elineIndex = my.elineIndex + 1;
  my.elineIndex = (my.elineIndex + 1) % my.elines.length;
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

// retired
let lastScrollMatchTime = 0;
let matchDiff = 5000;
function scroll_track_timecheck() {
  if (lastScrollY && lastScrollY == window.scrollY) {
    if (!lastScrollMatchTime) {
      lastScrollMatchTime = Date.now();
    } else {
      let now = Date.now();
      let nowDiff = now - lastScrollMatchTime;
      console.log('match lastScrollY', lastScrollY, 'nowDiff', nowDiff, 'matchDiff', matchDiff);
      if (nowDiff > matchDiff) {
        window.scrollTo(0, scrollYTop);
        lastScrollY = 0;
        lastScrollMatchTime = 0;
        return;
      }
    }
  }
  lastScrollY = window.scrollY;
  window.scrollBy(0, 1);
}

function show_versions() {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ['chrome', 'node', 'electron']) {
    // replaceText(`${dependency}-version`, process.versions[dependency])
    console.log('versions', dependency, '=', process.versions[dependency]);
  }
}
