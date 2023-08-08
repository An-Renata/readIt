export const formatRating = function (num) {
  if (typeof num === "string") {
    num = parseFloat(num);
  }
  //   check if there is no value -> return 0
  if (isNaN(num)) {
    return 0;
  }
  return num.toFixed(1);
};
