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

let scrollYTop = 506.5;
let lastScrollY;
let lastScrollMatchTime = 0;
let matchDiff = 1000;

function setup_scroll() {
  //
  console.log('setup_scroll');
  let scrollPeriod = 0.1;
  let period = scrollPeriod * 1000;
  setInterval(scroll_track, period);

  let et = document.querySelector('.field--title');
  let nb = document.querySelector('.navbar-brand');
  nb.innerHTML = et.textContent;

  window.scrollY = scrollYTop - 1;
}

function scroll_track() {
  if (lastScrollY && lastScrollY == window.scrollY) {
    console.log('match lastScrollY', lastScrollY);
    if (!lastScrollMatchTime) {
      lastScrollMatchTime = Date.now();
    } else {
      let now = Date.now();
      if (now - lastScrollMatchTime > matchDiff) {
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
