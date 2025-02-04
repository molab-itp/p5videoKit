//
export class p5videoKit {
  //
  // let effects = [
  //   { label: 'example', import_path: 'module/eff_example', menu: 1 },

  constructor(config, p5_instance) {
    // console.log('p5videoKit p5_instance', p5_instance);
    // To work in p5 instance mode we need to use this.p5_instance on all p5 globals
    //
    this.room_name_prefix = '';
    // this.room_name_prefix = 'dev-';
    if (!p5_instance) {
      console.log('p5videoKit !!@ no p5_instance');
      return;
    }
    this.p5_instance = p5_instance;
    this.my_canvas = p5_instance._renderer;
    if (!this.my_canvas) {
      console.log('p5videoKit !!@ no my_canvas');
    }
  }

  async init(config) {
    //
    await this.setup(config);

    // Report startup lapse time
    let init_lapse = window.performance.now() - dice.startTime;
    dice.dapi('stats', { init_lapse });
  }

  draw() {
    console.log('p5videoKit draw stub');
  }
}
// globalThis.p5videoKit = p5videoKit;

// --
