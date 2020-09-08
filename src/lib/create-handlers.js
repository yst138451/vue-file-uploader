import { validIndividualSizes, validTotalSize, validFileCount } from './file-size-policies';
import { merge, isEmptyObject } from '../utils/helpers';

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
      const invalids = {
        tooLarge: !validIndividualSizes(files, this.maxFileSize),
        totallyTooLarge: !validTotalSize(files, this.maxTotalSize),
        tooMany: !validFileCount(files, this.maxFileCount)
      };

      merge(this.handlers, {
        files,
        ...invalids
      });

      const filteredInvalids = Object
        .entries(invalids)
        .reduce((seed, [name, invalid]) => {
          if (invalid) {
            seed[name] = invalid;
          }
          return seed;
        }, {});

      const anyPolicyViolations = !isEmptyObject(filteredInvalids);

      if (anyPolicyViolations) {
        this.$emit('invalid', filteredInvalids);

        if (this.errorIfInvalid) {
          throw new Error(
            'The following file-size policies didn\'t make it: ' +
            Object.keys(filteredInvalids)
          );
        }
        else {
          resolve({ files: [], el });
        }
      }
      else {
        this.$emit('selected', files, el);
        resolve({ files, el });
      }
    }
    catch (ex) {
      this.$emit('error', ex);
      reject(ex);
    }
  }, { once: true });
}