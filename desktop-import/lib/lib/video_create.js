//
export function video_create() {
  // console.log('video_create my.video', my.video);
  if (my.video) {
    my.video.remove();
  }
  let options = { video: { facingMode: my.facingMode } };
  my.video = createCapture(options);
  my.video.size(my.vwidth, my.vheight);
  my.video.hide();
}
globalThis.video_create = video_create;

export function video_ready() {
  return (
    my.video && //
    my.video.loadedmetadata &&
    my.video.width > 0 &&
    my.video.height > 0
  );
}
globalThis.video_ready = video_ready;
