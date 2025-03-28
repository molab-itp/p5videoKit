import { parse } from 'path';

import { enum_files, writeSourceFile } from './enum_files.js';

// { src_path, settings, settingIndexPath, settingMetasPath, indexPrefix }
export default function build_settings(args) {
  //

  let { src_path, settings, settingIndexPath, settingMetasPath, indexPrefix } = args;

  args.files = enum_files(src_path, [settings]);

  gen_a_settingMetas(src_path, settingMetasPath, args);

  gen_settings_index(src_path, settingIndexPath, indexPrefix, args);
}

function gen_a_settingMetas(src_path, settingMetasPath, args) {
  //
  let files = args.files.concat();
  files.sort();
  // console.log('files', files);
  let settingMetas = [];
  for (let afile of files) {
    if (!afile) continue;
    const fparts = parse(afile);
    // console.log('fparts', fparts);
    if (fparts.ext !== '.json') continue;
    let label = fparts.name;
    let import_path = afile;
    let mstr = `    { label: '${label}', import_path: '${import_path}' },`;

    settingMetas.push(mstr);
  }
  // { label: '2x2', import_path: 'settings/_menu/-2x2.json', menu: 1  },
  let strm = `// !!@ Generated File
export let a_settingMetas = [
${settingMetas.join('\n')}
];
`;
  if (settingMetasPath) {
    writeSourceFile(src_path, settingMetasPath, strm);
    console.log('settingMetas.length', settingMetas.length);
  }

  args.metas = settingMetas;
}

function gen_settings_index(src_path, settingIndexPath, indexPrefix, args) {
  // console.log('gen_settings_index files', files);
  let files = args.files;
  console.log('gen_settings_index files', files.length);
  let uindex = 0;
  files = files.map((file) => {
    if (!file) return '<br/>';
    uindex++;
    // return `<a href="${indexPrefix}?u=${uindex}&d=${file}" target="settings">${file}</><br>`;
    return `<a href="${indexPrefix}?u=${uindex}&d=${file}" target="settings-${uindex}">${file}</><br/><br/>`;
  });
  let str = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
${files.join('\n')}
  </body>
</html>
`;
  writeSourceFile(src_path, settingIndexPath, str);
}
