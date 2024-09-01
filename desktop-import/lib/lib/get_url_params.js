//

// return null or url query as object
// eg. query='abc=foo&def=%5Basf%5D&xyz=5'
// params={abc: "foo", def: "[asf]", xyz: "5"}
export function get_url_params() {
  let query = globalThis.location.search;
  // console.log('query |' + query + '|');
  // console.log('get_url_params query.length=', query.length);
  if (query.length < 1) return {};
  let params = params_query(query);
  // console.log('get_url_params params=', params);
  return params;
  // let store = params['store'];
  // console.log('nstore', store);
  // return store;
}
globalThis.get_url_params = get_url_params;

// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
function params_query(query) {
  // eg. query='abc=foo&def=%5Basf%5D&xyz=5'
  // params={abc: "foo", def: "[asf]", xyz: "5"}
  const urlParams = new URLSearchParams(query);
  const params = Object.fromEntries(urlParams);
  return params;
}

// console.log('in get_url_params');
