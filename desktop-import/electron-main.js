//
// Run p5videoKet as electron process to allow for restart and other options

import { app, BrowserWindow, screen, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// Needed for __dirname with ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('__dirname', __dirname);

import { parse_argv } from './lib/parse_argv.js';
import { setup_download } from './lib/setup_download.js';
import { setup_restart } from './lib/setup_restart.js';

import { dbase_init } from './lib/dbase.js';

let my = {};

globalThis.my = my;

my.root_index_path = '../src/index.html';
my.download_path = path.resolve(process.env.HOME, 'Downloads');
my.download_limit = -1;
my.opt = { h: 1 };
// my.width_trim;
// my.mainWindow;

console.log('download_path', my.download_path);
// console.log('globalThis', globalThis);
// console.log('window', window);

parse_argv(my, process.argv);

console.log('opt', my.opt);

app.whenReady().then(() => {
  ipcMain.on('set-line-info', (event, line) => {
    // dbase_update_item({ num, text });
    dbase_update_item({ line });
  });

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
    console.log('width_trim x', x, 'width', width);
  } else if (my.portrait) {
    let nwidth = 1080 * my.portrait;
    height = 1920 * my.portrait;
    // Make window flush right
    x += width - nwidth;
    width = nwidth;
    console.log('x', x, 'width', width, 'height', height);
  }
  // console.log('my.zoom_level', my.zoom_level);

  my.mainWindow = new BrowserWindow({
    x,
    y,
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload-scroll.cjs'),
      // zoomLevel: my.zoom_factor, // 1.8,
    },
  });

  if (my.opt.debug) {
    my.mainWindow.webContents.openDevTools();
  }

  // opt.u = opt.u || '';
  // opt.s = opt.s || '';
  // opt.d = opt.d || '';
  // opt.h = opt.h || '';
  // const url_options = { query: { u: opt.u, s: opt.s, d: opt.d, h: opt.h } };
  const url_options = { query: my.opt };
  if (my.root_index_path.startsWith('http')) {
    my.mainWindow.loadURL(my.root_index_path);
  } else {
    my.mainWindow.loadFile(my.root_index_path, url_options);
  }

  // mainWindow.fullScreen = opt.fullScreen;
  setTimeout(function () {
    my.mainWindow.fullScreen = my.opt.fullScreen;
  }, 5 * 1000);

  setup_download(my);

  setup_restart(my);

  // Send ipc event to preload
  // setInterval(function () {
  //   my.mainWindow.webContents.send('rewind', 1);
  // }, 7 * 1000);
  my.rewind_action = () => {
    my.mainWindow.webContents.send('rewind', 1);
  };
  my.full_read_action = () => {
    my.mainWindow.webContents.send('full-read', 1);
  };

  console.log('my.room', my.room);
  if (my.room) {
    dbase_init(my);
  }
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

// https://www.electronjs.org/docs/latest/tutorial/ipc

// dbase_update_item({ num, text });
