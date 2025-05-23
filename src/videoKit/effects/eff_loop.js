//
//

// import {  factory_prop_inits } from '../core/effectMeta.js';
import { image_scaled_pad } from '../util/image.js';
import { PeriodTimer } from '../util/PeriodTimer.js';
// import { patch_index1 } from '../core-ui/ui_patch_eff.js';

export default class eff_loop {
  static meta_props = {
    period: [1, 0, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 60],
    // phase_check: [0, 1],
    next: {
      button: (ent, aPatch) => {
        ent.next_action(aPatch);
      },
    },
    prev: {
      button: (ent, aPatch) => {
        ent.prev_action(aPatch);
      },
    },
    step_patch: [0, 2, 3],
    _freeze_patch: [0, 1],
    freeze_screen: [0, 1],
    _effects: {
      style: 'width:80%',
      // text_input: 'sketchy,slant_scan,slit_scan',
      text_input: 'bright,delaunay,grid,maze,sketchy,slant_scan,slit_scan',
    },
  };
  static eff_names = ['bright', 'delaunay', 'grid', 'bright', 'maze', 'sketchy', 'slant_scan', 'slit_scan'];
  constructor(props) {
    Object.assign(this, props);
    this.basic_props = Object.assign({}, props);
    this.init();
  }
  prepareOutput() {
    this.advance_check();
    if (this.advancePending) {
      this.patch_step();
      this.trigger_step();
      this.advancePending = 0;
    }
    let other = this.prepare_input(this.eff_inst);
    if (other) {
      if (this.freeze_patch && this.wasFrozen && this.got_freeze) {
        // ui_log('eff_loop  ', this.got_freeze);
        this.draw_freeze();
      } else {
        other.prepareOutput();
        this.output = other.output;
      }
    }
    this.period_timer.check(() => {
      this.iperiod++;
      if (this.has_phase_check) {
        // Waiting for other.completed_phase
      } else {
        this.possibleAdvance();
      }
    });
    if (0) {
      let src = this.videoKit.patch_index1(1);
      if (src) {
        src.draw = 'mesh';
      }
    }
  }
  possibleAdvance() {
    if (this.freeze_patch && this.wasFrozen) {
      return;
    }
    this.advancePending = 1;
  }
  prepare_input(other) {
    if (other) {
      other.input = this.input;
    }
    return other;
  }
  init() {
    if (!this.effects) this.effects = 'show';
    this.eff_names = this.effects.split(',');
    this.index = 0;
    this.eff_inst = null;
    this.eff_inst_arr = [];
    this.next_eff();
    this.period_timer = new PeriodTimer(this.period);
    this.iperiod = 0;
    this.img_freeze = createImage(this.input.width, this.input.height);
  }
  deinit() {
    for (let eff of this.eff_inst_arr) {
      this.videoKit.deinitEffect(eff);
    }
  }
  trigger_step() {
    if (!this.step_patch) return;
    let src = this.vidoeKit.patch_index1(this.step_patch);
    // ui_log(  'trigger_step src', src, 'src.patch_stepper', src.patch_stepper );
    if (src && src.patch_stepper) {
      src.patch_stepper();
    }
  }
  draw_freeze() {
    image_scaled_pad(this.img_freeze, this.eff_spec.urect);
  }
  advance_check() {
    if (this.freeze_patch) {
      let src = this.videoKit.patch_index1(this.freeze_patch);
      if (src) {
        // ui_log('src.frozen', src.frozen);
        // if (!this.wasFrozen && src.frozen) {
        //   this.advancePending = 1;
        // }
        this.wasFrozen = src.frozen;
      }
    }
    if (this.has_completed_phase) {
      let other = this.eff_inst;
      if (other.completed_phase()) {
        // this.advancePending = 1;
        this.possibleAdvance();
      }
    }
  }
  patch_step() {
    // ui_log('eff_loop step');
    this.next_eff();
  }
  next_action(aPatch) {
    this.next_eff();
  }
  prev_action(aPatch) {
    ui_log('eff_loop c index', this.index);
    this.index = this.index - 2;
    let eff_names = this.eff_names;
    this.index = (eff_names.length + this.index) % eff_names.length;
    ui_log('eff_loop d index', this.index);
    this.next_eff();
  }
  async next_eff() {
    // ui_log('eff_loop a index', this.index);
    let eff_names = this.eff_names;
    let label = eff_names[this.index];
    this.index = (this.index + 1) % eff_names.length;
    let effMeta = await this.videoKit.effectMeta_find(label);
    // ui_log('next_eff effMeta', effMeta);
    if (effMeta) {
      ui_log('next_eff effMeta', effMeta.label);
      // let iprops = this.eff_prop_inits(effMeta.factory.meta_props);
      // let inits = this.eff_prop_inits(effMeta.factory.meta_props);
      let inits = this.videoKit.factory_prop_inits(effMeta.factory, this.basic_props);
      // Set input on inits for eff_inst.init
      this.prepare_input(inits);
      let eff_inst = this.eff_inst_arr[this.index];
      if (eff_inst) {
        this.videoKit.deinitEffect(eff_inst);
      }
      eff_inst = new effMeta.factory(inits);
      this.eff_inst_arr[this.index] = eff_inst;
      // } else {
      //   // ui_log('next_eff init eff_inst', eff_inst);
      //   eff_inst.init();
      // }
      this.eff_inst = eff_inst;
      this.has_completed_phase = this.eff_inst.completed_phase;
    }
  }
  // eff_prop_inits(dict) {
  //   let inits = Object.assign({}, this.basic_props);
  //   for (let prop in dict) {
  //     // eg. items = factor: [10, 50, 100 ... ]
  //     let items = dict[prop];
  //     if (prop.substring(0, 1) === '_') {
  //       prop = prop.substring(1);
  //     }
  //     if (Array.isArray(items)) {
  //       // eg. items = factor: [10, 50, 100 ... ]
  //       inits[prop] = items[0];
  //     } else {
  //       // eg: _next: { button: next_action }
  //     }
  //   }
  //   return inits;
  // }
}

// static eff_names = [
//   'show',
//   'bright',
//   'show',
//   'delaunay',
//   'show',
//   'grid',
//   'show',
//   'bright',
//   'show',
//   'maze',
//   'show',
//   'sketchy',
//   'show',
//   'slant_scan',
//   'show',
//   'slit_scan',
// ];
// static eff_names = ['show', 'sketchy'];
// show will trigger patch_stepper in face_mesh

// static eff_namesXX = [
//   'show',
//   'delaunay',
//   'sketchy',
//   'maze',
//   'grid',
//   // 'bright',
//   // 'diff',
//   // 'triangle',
//   // 'slit_scan',
//   // 'slant_scan',
// ];
