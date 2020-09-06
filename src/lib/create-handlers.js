import { validIndividualSizes, validTotalSize, validFileCount } from './file-size-policies';
import { merge } from '../utils/helpers';

export default function createHandlers() {
  const handlers = {
    select: () => {
      this.uploader.click();

      return new Promise(selectExecutor.bind(this));
    },

    files: [],
    tooLarge: false,
    totallyTooLarge: false,
    tooMany: false
  };

  return handlers;
}

function selectExecutor(resolve, reject) {
  this.uploader.addEventListener('change', e => {
    const el = e.currentTarget;
    const files = Array.from(el.files);

    try {
      merge(this.handlers, {
        files,
        tooLarge: !validIndividualSizes(files, this.maxFileSize),
        totallyTooLarge: !validTotalSize(files, this.maxTotalSize),
        tooMany: !validFileCount(files, this.maxFileCount)
      });

      this.$emit('selected', files, el);
      resolve({ files, el });
    }
    catch (ex) {
      this.$emit('error', ex);
      reject(ex);
    }
  }, { once: true });
}