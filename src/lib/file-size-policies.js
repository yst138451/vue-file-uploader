function validRange(size, max) {
  return size <= parseFloat(max);
}

export function validIndividualSizes(files, max) {
  if (max <= 0) {
    return true;
  }

  return Array
    .from(files)
    .every(file => validRange(file.size, max));
}

export function validTotalSize(files, max) {
  if (max <= 0) {
    return true;
  }

  const totalSize = Array
    .from(files)
    .reduce((total, size) => total + size, 0);

  return validRange(totalSize, max);
}

export function validFileCount(files, max) {
  if (max <= 0) {
    return true;
  }

  return files.length <= max;
}