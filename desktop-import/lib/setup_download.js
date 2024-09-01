//
import path from 'path';
import fs from 'fs';

export function setup_download(my) {
  my.mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    // Set the save path, making Electron not to prompt a save dialog.
    let fn = item.getFilename();
    // console.log('fn', fn);
    let dpath = next_download_filename(my, fn);
    // let dpath = path.join(download_path, fn);
    console.log('dpath', dpath);
    item.setSavePath(dpath);
    // item.setSavePath('/tmp/save.png');
    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed');
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused');
        } else {
          // console.log(`Received bytes: ${item.getReceivedBytes()}`);
        }
      }
    });
    item.once('done', (event, state) => {
      if (state === 'completed') {
        // console.log('Download successfully');
      } else {
        console.log(`Download failed: ${state}`);
      }
    });
  });
}

function next_download_filename(my, fn) {
  let pfile = path.parse(fn);
  let { name, ext } = pfile;
  let dpath;
  if (download_limit > 0) {
    let nfn = name + ext;
    dpath = path.join(my.download_path, nfn);
    // console.log('dpath', dpath);
    // fs.removeSync(dpath);
    return dpath;
  }
  // !!@ consider count_dict[name] to cache last used count
  let count = 1;
  for (;;) {
    let nfn = name + '-' + pad(count) + ext;
    dpath = path.join(my.download_path, nfn);
    if (fs.existsSync(dpath)) {
      count++;
    } else {
      return dpath;
    }
    // if (download_limit > 0 && count > download_limit) {
    //   return dpath;
    // }
  }
}

function pad(n) {
  n = n + '';
  return n.padStart(4, '0');
}
