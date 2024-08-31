//
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ['chrome', 'node', 'electron']) {
    // replaceText(`${dependency}-version`, process.versions[dependency])
    console.log('versions', dependency, '=', process.versions[dependency]);
  }

  setup_scroll();
});

let scrollYTop = 564;
let scrollYBottom = 3466;
let lastScrollY;
let lastScrollMatchTime = 0;
let matchDiff = 5000;

function setup_scroll() {
  //
  console.log('setup_scroll');

  let et = document.querySelector('.field--title');
  let nb = document.querySelector('.navbar-brand');
  nb.innerHTML = nb.textContent + '<br/>' + et.textContent;

  nb.style.fontSize = 'xx-large';

  let scrollPeriod = 0.1;
  let period = scrollPeriod * 1000;
  setInterval(scroll_track, period);

  window.scrollTo(0, scrollYTop);
}

function scroll_track() {
  lastScrollY = window.scrollY;
  window.scrollBy(0, 1);
  // console.log(' lastScrollY', lastScrollY);
  if (window.scrollY > scrollYBottom) {
    window.scrollTo(0, scrollYTop);
  }
}

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
