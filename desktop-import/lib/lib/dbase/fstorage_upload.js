//

async function fstorage_upload({ layer, path, imageQuality }) {
  // console.log('fstorage_img_upload');
  if (!layer || !layer.elt || !layer.elt.toBlob) {
    ui_error('fstorage_upload bad layer', layer);
    return;
  }
  if (!path) {
    ui_error('fstorage_upload missing path', path);
    return;
  }
  let imageType = 'image/jpeg';
  let last4 = path.substring(path.length - 4);
  if (last4.toLowerCase() == '.png') {
    imageType = 'image/png';
  }
  // console.log('last4', last4, 'imageType', imageType);

  let imagePath = `${my.dbase_rootPath}/${my.roomName}/${path}`;

  let blob = await getBlob(layer.elt, imageType, imageQuality);

  return fstorage_upload_blob(blob, imagePath);
}
globalThis.fstorage_upload = fstorage_upload;

function getBlob(elt, imageType, imageQuality) {
  return new Promise(function (resolve, reject) {
    elt.toBlob(
      (blob) => {
        resolve(blob);
      },
      imageType,
      imageQuality
    );
  });
}

async function fstorage_upload_blob(blob, imagePath) {
  // console.log('fstorage_upload', blob);
  let { getStorage, ref, uploadBytes } = fireb_.fstorage;
  // ui_log('fstorage_upload my.imagePath', my.imagePath);
  const storageRef = ref(getStorage(), imagePath);

  // 'file' comes from the Blob or File API
  return uploadBytes(storageRef, blob);
}

async function fstorage_remove({ path }) {
  if (!path) {
    ui_error('fstorage_remove missing path', path);
    return;
  }
  let imagePath = `${my.dbase_rootPath}/${my.roomName}/${path}`;

  let { getStorage, ref, deleteObject } = fireb_.fstorage;
  const desertRef = ref(getStorage(), imagePath);

  return deleteObject(desertRef);
}
globalThis.fstorage_remove = fstorage_remove;

async function fstorage_download_url({ path }) {
  // console.log('fstorage_img_download ');

  let imagePath = `${my.dbase_rootPath}/${my.roomName}/${path}`;

  let { getStorage, ref, getDownloadURL } = fireb_.fstorage;

  return getDownloadURL(ref(getStorage(), imagePath));
}
globalThis.fstorage_download_url = fstorage_download_url;
