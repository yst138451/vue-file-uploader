import { captureModes } from '../config/input-file-attributes';
import { coreProps } from '../lib/VueFileUploader';

const coreAttributesIterator = iteratee => {
  for (const name in coreProps) {
    iteratee(name);
  }
}

const attributeUpdater = {
  accept(val) {
    this.uploader.accept = val && Array.isArray(val)
      ? val.join(',')
      : val;
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
    mounted() {
      if (this.reactive) {
        coreAttributesIterator(name => {
          unwatch[name] = this.$watch(name, attributeUpdater[name]);
        });
      }
    },

    destroyed() {
      if (this.reactive) {
        coreAttributesIterator(name => unwatch[name].call(this));
      }
    },

    methods: {
      updateCoreAttributes() {
        coreAttributesIterator(name =>
          attributeUpdater[name].call(this, this.$props[name])
        );
      }
    }
  }
}