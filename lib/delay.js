export const delay = (t, v) =>
new Promise(function (resolve) {
  setTimeout(resolve.bind(null, v), t);
});
