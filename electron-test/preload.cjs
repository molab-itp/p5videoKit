// preload.js

const { ipcRenderer } = require('electron');

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }

  setup_counter();
});

// Create a counter div that is update via ipc call from main.js
//
function setup_counter() {
  //
  let width = 50;
  let height = 32;
  let x = window.innerWidth - width;
  // let y = window.innerHeight - height;
  let y = 0;

  console.log('x', x, 'y', y, 'window.innerWidth', window.innerWidth, 'window.innerHeight', window.innerHeight);

  let elm = document.createElement('div');
  document.body.appendChild(elm);

  elm.style.position = 'fixed';
  elm.style.pointerEvents = 'none';
  elm.style.top = `${y}px`;
  elm.style.left = `${x}px`;
  elm.style.width = `${width}px`;
  elm.style.height = `${height}px`;
  elm.style.backgroundColor = 'gold';
  elm.style.textAlign = 'center';

  ipcRenderer.on('update-counter', (_event, value) => {
    // console.log('ipcRenderer.on update-counter', value, 'elm', elm);
    console.log('ipcRenderer.on update-counter', value);
    const oldValue = Number(elm.innerText);
    const newValue = oldValue + value;
    elm.innerText = newValue;
  });
}
