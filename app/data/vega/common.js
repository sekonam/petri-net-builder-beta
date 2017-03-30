const randIntDiapason = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const randIntMax = (max) => randIntDiapason(0, max);

const randArrayEl = (array) => array[randIntMax(array.length)];

const genArray = (c) => {
  const a = [];
  for (let i = 0; i < c; i += 1) {
    a.push(i);
  }
  return a;
};

export {
  randIntDiapason,
  randIntMax,
  randArrayEl,
  genArray,
};
