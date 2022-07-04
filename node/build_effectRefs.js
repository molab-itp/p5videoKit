const fs = require('fs-extra');
const path = require('path');

// 'let/a_effectRefs.js'
// 'mods'
//
function build_effectRefs(effectRefsPath, effectModPath) {
  //
  if (!fs.existsSync(effectModPath)) {
    console.log('build_effectRefs not effectModPath', effectModPath);
    return;
  }
  const dirs = fs.readdirSync(effectModPath);
  dirs.sort();
  // console.log(dir, files);
  let imparts = [];
  for (let dir of dirs) {
    // dir = eff, eff2
    if (dir.substring(0, 1) == '.') continue;

    let dpath = path.join(effectModPath, dir);
    // dpath = mods/eff
    if (!fs.lstatSync(dpath).isDirectory()) {
      console.log('build_effectRefs no dpath', dpath);
      continue;
    }
    const files = fs.readdirSync(dpath);
    if (!files) {
      continue;
    }
    files.sort();
    files.map((ent) => {
      if (ent.endsWith('.js')) {
        imparts.push(dir + '/' + ent);
      }
    });
  }
  console.log('imparts', imparts);
  let ents = imparts.map((ent) => {
    let pos = ent.lastIndexOf('_');
    let label = ent.substring(pos + 1);
    return `{ label: '${label}', import_path: '${ent}' },`;
  });
  console.log('ents', ents);
}

module.exports = build_effectRefs;

// EffectRef
// { label, factory, path }

// let a_effectRefs = [
//    { label: 'show', factory: eff_show_pad },
//    { label: 'bestill', import_path: 'eff/eff_bestill' },
// ];
//