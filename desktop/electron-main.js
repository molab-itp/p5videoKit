//
// Run p5videoKet as electron process to allow for restart and other options

const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const { parse_argv } = require('./lib/parse_argv.js');
const { setup_download } = require('./lib/setup_download.js');
const { setup_restart } = require('./lib/setup_restart.js');

let my = {};

my.root_index_path = '../src/index.html';
my.download_path = path.resolve(process.env.HOME, 'Downloads');
my.download_limit = -1;
my.opt = { h: 1 };
// my.width_trim;
// my.mainWindow;

console.log('download_path', my.download_path);

parse_argv(my, process.argv);

console.log('opt', my.opt);

app.whenReady().then(() => {
  // path.join(__dirname, 'preload.js'),

  // We cannot require the screen module
  // until the app is ready
  const { screen } = require('electron');

  const screens = screen.getAllDisplays();
  let index = my.opt.index || '1';
  index = parseFloat(index) - 1;
  if (index < 0) index = 0;
  if (index >= screens.length) index = screens.length - 1;
  const primaryDisplay = screens[index];
  let { x, y, width, height } = primaryDisplay.workArea;

  // Create a window that fills the sceen's available work area.
  // const primaryDisplay = screen.getPrimaryDisplay();

  // Adjust width and position for debugging
  if (my.width_trim) {
    console.log('width_trim', my.width_trim, 'width', width);
    let nwidth = Math.floor(width * my.width_trim);
    // Make window flush right
    x += width - nwidth;
    width = nwidth;
    // console.log('x', x, 'width', width);
  }

  mainWindow = new BrowserWindow({
    x,
    y,
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload-scroll.js'),
      zoomFactor: 1.8,
    },
  });

  if (my.opt.debug) {
    mainWindow.webContents.openDevTools();
  }

  // opt.u = opt.u || '';
  // opt.s = opt.s || '';
  // opt.d = opt.d || '';
  // opt.h = opt.h || '';
  // const url_options = { query: { u: opt.u, s: opt.s, d: opt.d, h: opt.h } };
  const url_options = { query: my.opt };
  if (my.root_index_path.startsWith('http')) {
    mainWindow.loadURL(my.root_index_path);
  } else {
    mainWindow.loadFile(my.root_index_path, url_options);
  }

  // mainWindow.fullScreen = opt.fullScreen;
  setTimeout(function () {
    mainWindow.fullScreen = my.opt.fullScreen;
  }, 5 * 1000);

  setup_download(my);

  setup_restart(my);

  // console.log('main screen', screen);
  // console.log('main screens', screens);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Retrieve information about screen size, displays, cursor position, etc.
// For more info, see:
// https://electronjs.org/docs/api/screen

// function print_process_argv() {
//   process.argv.forEach((val, index) => {
//     console.log(`${index}: ${val}`);
//   });
// }
// print_process_argv();

// bin/run-gallery.sh
// npm run start electron-main -- --ddebug --download_path Documents/projects/daily
// 0: /Users/jht2/Documents/projects/dice_face_aa/p5videoKit-private/desktop/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron
// 1: electron-main
// 2: --ddebug
// 3: --download_path
// 4: Documents/projects/daily
