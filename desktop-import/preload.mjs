// preload.mjs

import { contextBridge } from 'electron';

// Expose a safe API to the renderer process
contextBridge.exposeInMainWorld('myAPI', {
  doSomething: () => {
    console.log('Doing something');
  },
});
