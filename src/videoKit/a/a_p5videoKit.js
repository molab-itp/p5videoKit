//
import { a_init } from '../core/a_init.js';

//
// videoKit = new p5videoKit(config, p5_instance)
//
export class p5videoKit {
  constructor(config, p5_instance) {
    //
    // ui_log('p5videoKit p5_instance', p5_instance);
    // To work in p5 instance mode we need to use this.p5_instance on all p5 globals
    //
    this.room_name_prefix = '';
    // this.room_name_prefix = 'dev-';
    //
    if (!p5_instance) {
      ui_log('p5videoKit !!@ no p5_instance');
      return;
    }
    this.p5_instance = p5_instance;
    this.my_canvas = p5_instance._renderer;
    if (!this.my_canvas) {
      ui_log('p5videoKit !!@ no my_canvas');
    }
    this.config = config;
    this.a_ = a_init();
  }

  draw() {
    ui_log('p5videoKit draw stub');
  }
}
// globalThis.p5videoKit = p5videoKit;

// --
