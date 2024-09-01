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
  if (my.last_elineIndex - 1 == my.elines.length - 1) {
    let rt = my.elines[0].getBoundingClientRect();
    if (rt.y < 0) return;
  }

  // remove last hilite
  if (my.last_elineIndex) {
    my.elines[my.last_elineIndex - 1].style.backgroundColor = '';
  }
  // new hilite at elineIndex
  el.style.backgroundColor = 'gold';
  my.last_elineIndex = my.elineIndex + 1;
  my.elineIndex = (my.elineIndex + 1) % my.elines.length;
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
