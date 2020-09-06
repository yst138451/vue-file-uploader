import { captureModes } from '../config/input-file-attributes';
import { coreProps } from '../lib/VueFileUploader';

const coreAttributesIterator = iteratee => {
  for (const name in coreProps) {
    iteratee(name);
  }
}

const watchHandlers = {
  accept(val) {
    this.uploader.accept = val && Array.isArray(val)
      ? this.accept.join(',')
      : this.accept;
  },

  multiple(val) {
    this.uploader.multiple = val;
  },

  capture(val) {
    if (captureModes.includes(val)) {
      this.uploader.capture = val;
    }
  }
};

export default function () {
  const unwatch = {};

  return {
    created() {
      if (this.reactive) {
        coreAttributesIterator(name => {
          unwatch[name] = this.$watch(name, watchHandlers[name]);
        });
      }
    },

    destroyed() {
      if (this.reactive) {
        coreAttributesIterator(name => unwatch[name].call(this));
      }
    }
  }
}