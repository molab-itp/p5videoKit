// p5LiveVideo example dashboard
// https://github.com/jht1493/p5videoKit
//
let videoKit; // home for library routines

p5.disableFriendlyErrors = true; // disables FES to improve performance

let my = {};
globalThis.my = my;

function setup() {
  // Report startup time for debugging
  let lapse = window.performance.now() - a_start_now;
  console.log('setup lapse', lapse);
  // indicate how long it took to load everything

  // Lowest pixel density for performance
  pixelDensity(1);

  // Need some starting dimensions for canvas.
  // Make it small, size will get adjusted by UI (user interface) later in startup
  my.canvas = createCanvas(100, 100);

  // must call createCanvas before new p5videoKit

  // sets videoKit
  videoKit_setup();

  setup_dbase();
}

function draw() {
  videoKit.draw();
}

// https://editor.p5js.org/shawn/sketches/jZQ64AMJc
// p5LiveMedia Test Video
// https://github.com/vanevery/p5LiveMedia
