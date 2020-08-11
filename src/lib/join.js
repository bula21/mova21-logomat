export const joinInPlace = (
  left,
  right,
  leftPropName,
  rightPropName = "id",
  transformRight = (x) => x
) => {
  const rightLookup = right.reduce((obj, item) => {
    obj[item[rightPropName]] = transformRight(item);
    return obj;
  }, {});

  for (const obj of left) {
    const rightId = obj[leftPropName];
    if (rightId !== undefined && rightId !== null) {
      obj[leftPropName] = rightLookup[rightId];
    } else {
      obj[leftPropName] = null;
    }
  }

  return left;
};
