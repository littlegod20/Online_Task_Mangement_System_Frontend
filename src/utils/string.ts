String.prototype.capitalize = function () {
  const firstLetter = this[0].toUpperCase();
  const rest = this.slice(1).toLowerCase();
  return firstLetter + rest;
};
