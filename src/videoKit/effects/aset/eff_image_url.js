import { layer_image_scaled_pad } from '../../util/image.js?v=407';

export default class eff_image_url {
  static meta_props = {
    // labeled: [0, 1],
    // label_align: ['center', 'left', 'right'],
    image_align: ['center', 'none'],
    _image_url: {
      style: 'width:80%',
      text_input: './external/media/webdb/jht/IMG_4491.JPEG',
    },
  };
  constructor(props) {
    Object.assign(this, props);
    this.init();
  }
  prepareOutput() {
    this.show_image();
  }
  init() {
    // !!@ this.eff_spec.urect undefined
    this.output = createGraphics(this.eff_spec.urect.width, this.eff_spec.urect.height);
    this.load_image();
  }
  show_image() {
    if (!this.img) return;
    let centered = this.image_align === 'center';
    layer_image_scaled_pad(this.output, this.img, this.eff_spec.urect, centered);
  }
  load_image() {
    // add version for cache busting
    let imageUrl = this.image_url + '';
    loadImage(
      imageUrl,
      (img) => {
        console.log('eff_image_url loaded image_url', this.image_url);
        console.log('eff_image_url img.width', img.width, 'height', img.height);
        this.img = img;
      },
      () => {
        console.log('eff_image_url load failed image_url', this.image_url);
      }
    );
  }
}
