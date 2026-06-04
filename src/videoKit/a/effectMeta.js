//
//
import { p5videoKit } from './a_p5videoKit.js';

let a_import_err;

p5videoKit.prototype.effectMeta_init = async function () {
  // ui_log('effectMeta_init this.a_.effectMetas.length', this.a_.effectMetas.length);
  // ui_log('effectMeta_init import_effect_handler', this.import_effect_handler);
  this.a_.effectMetaDict = {};
  let imports = [];
  let index = 0;
  for (let effMeta of this.a_.effectMetas) {
    // ui_log('effectMeta_init effMeta', effMeta);
    this.a_.effectMetaDict[effMeta.label] = effMeta;
    effMeta.index = index;
    if (!effMeta.factory && effMeta.import_path && this.import_effect_handler) {
      // imports.push(effectMeta_import(effMeta));
      imports.push(this.import_effect(effMeta));
    } else {
      ui_log('effectMeta_init can not init effMeta', effMeta);
    }
    index++;
  }
  await Promise.allSettled(imports);
};

p5videoKit.prototype.effectMeta_find = function (label) {
  if (!label) {
    ui_log('effectMeta_find no label', label);
    label = 'show';
    // return this.a_.effectMetas[0];
  }
  let effMeta = this.a_.effectMetaDict[label];
  if (!effMeta) {
    ui_log('effectMeta_find label not found', label);
    effMeta = this.a_.effectMetas[0];
  }
  if (!effMeta.factory) {
    ui_log('effectMeta_find no factory effMeta', effMeta);
    effMeta = this.a_.effectMetas[0];
  }
  return effMeta;
};

p5videoKit.prototype.import_effect = function (effMeta) {
  // ui_log('p5videoKit import_effect label', effMeta.label);
  // ui_log('p5videoKit import_effect import_path', effMeta.import_path);
  return new Promise((resolve, reject) => {
    // import('./' + effMeta.import_path)
    this.import_effect_handler(effMeta)
      .then((module) => {
        // ui_log('import_effect label', effMeta.label, 'module', module);
        resolve(module.default);
      })
      .catch((err) => {
        ui_log('catch error import_effect label', effMeta.label, '\n err', err);
        a_import_err = err;
        reject(err);
      });
  });
};

// !!@ does not handle factory.meta_props as array
p5videoKit.prototype.factory_prop_inits = function (factory, init_props = {}) {
  let dict = factory.meta_props;
  // ui_log('factory_prop_inits dict', dict);
  let videoKit = this;
  let inits = Object.assign({}, init_props, { videoKit });
  for (let prop in dict) {
    // eg. items = factor: [10, 50, 100 ... ]
    let items = dict[prop];
    if (prop.substring(0, 1) === '_') {
      prop = prop.substring(1);
    }
    if (Array.isArray(items)) {
      // eg. items = factor: [10, 50, 100 ... ]
      inits[prop] = items[0];
    } else {
      // eg: _next: { button: next_action }
    }
  }
  // ui_log('factory_prop_inits inits', inits);
  return inits;
};

class eff_null {
  static meta_props = [];
  constructor() {}
  prepareOutput() {}
}
