//
import { a_ } from '../let/a_state.js?v=409';

let a_effectMetaDict;
let a_import_err;

export async function effectMeta_init() {
  a_effectMetaDict = {};
  let imports = [];
  let index = 0;
  for (let effMeta of a_.effectMetas) {
    a_effectMetaDict[effMeta.label] = effMeta;
    effMeta.index = index;
    if (!effMeta.factory) {
      imports.push(effectMeta_import(effMeta));
    }
    index++;
  }
  await Promise.allSettled(imports);
}

export async function effectMeta_import(effMeta) {
  if (!effMeta.import_path) {
    // console.log('effectMeta_import no import_path', effMeta);
    return null;
  }
  let import_path = effMeta.import_path;
  // console.log('effectMeta_import import_path', import_path);
  let inpath;
  let videoKitPrefix = 'videoKit/';
  if (import_path.startsWith(videoKitPrefix)) {
    // effectMeta_import ../../videoKit/effects/aset/eff_bestill.js
    inpath = '../' + import_path.substring(videoKitPrefix.length);
  } else {
    // effectMeta_import ../../effects/eff_a_example_props.js
    // let inpath = '../../' + effMeta.import_path;
    inpath = '../../' + import_path;
  }
  // console.log('effectMeta_import inpath', inpath);
  return new Promise((resolve, reject) => {
    import(inpath + '')
      .then((module) => {
        // console.log('effectMeta_import module', module, '\n effMeta.import_path', effMeta.import_path);
        // console.log('effMeta.import_path', effMeta.import_path);
        effMeta.factory = module.default;
        resolve();
      })
      .catch((err) => {
        console.log('effectMeta_import err', err, '\n inpath', inpath);
        a_import_err = err;
        reject();
      });
  });
}

export function effectMeta_find(label) {
  if (!label) {
    console.log('effectMeta_find no label', label);
    label = 'show';
    // return a_.effectMetas[0];
  }
  let effMeta = a_effectMetaDict[label];
  if (!effMeta) {
    console.log('effectMeta_find label not found', label);
    effMeta = a_.effectMetas[0];
  }
  return effMeta;
}

export function factory_prop_inits(factory, init_props = {}) {
  let dict = factory.meta_props;
  // console.log('factory_prop_inits dict', dict);
  let inits = Object.assign({}, init_props);
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
  // console.log('factory_prop_inits inits', inits);
  return inits;
}
