export function ucfirst(str) {
  return str.length ? str.charAt(0).toUpperCase() + str.substr(1) : str;
}

export function randStr(count) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < count; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

export function indexById(array, id) {
  return array.findIndex((el) => el.id === id);
}

export function valueById(array, id) {
  return array.find((el) => el.id === id);
}

export function removeById(array, id) {
  const key = indexById(array, id);
  if (key > -1) array.splice(key, 1);
}

export function spliceRecurcive(array, findFunc) {
  let count = 0;

  for (let key = array.findIndex(findFunc); key > -1; key = array.findIndex(findFunc)) {
    array.splice(key, 1);
    count += 1;
  }

  return count;
}

export function unique(array) {
  const a = array.concat();
  for (let i = 0; i < a.length; i += 1) {
    for (let j = i + 1; j < a.length; j += 1) {
      if (a[i] === a[j]) {
        a.splice(j, 1);
        j -= 1;
      }
    }
  }
  return a;
}
