function parse_data(data) {
  let arr = [];

  data.value.forEach((val) => {
    arr.push(val.givenName);
  });

  return arr;
}

module.exports = { parse_data };
