function chunk <T>(array: T[], size: number) {
  var R = [];

  for (var i = 0; i < array.length; i += size)
    R.push(array.slice(i, i + size));

  return R;
}

export default chunk;