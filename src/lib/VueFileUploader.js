import createHandlers from './create-handlers';
import { isEmptyObject } from '../utils/helpers';
import { captureModes } from '../config/input-file-attributes';
import createMixinWatchers, { attributeUpdater, coreAttributesIterator } from '../mixins/watchers';
import * as logger from '../utils/logger';

export const coreProps = {
  accept: {
    type: [String, Array],
    default: ''
  },

  multiple: {
    type: Boolean
  },

  capture: {
    type: String,
    validator(val) {
      return captureModes.includes(val);
    }
  }
}

export default opts => ({
  name: opts.componentName,
  inheritAttrs: false,

  mixins: [createMixinWatchers()],

  props: {
    ...coreProps,

    maxFileSize: {
      type: [Number, String],
      default: 0
    },

    maxTotalSize: {
      type: [Number, String],
      default: 0
    },

    maxFileCount: {
      type: [Number, String],
      default: 0
    },

    reactive: {
      type: Boolean
    }
  },

  data: vm => ({
    uploader: {},
    handlers: createHandlers.call(vm)
  }),

  render() {
    const [vnode, otherNodes] = this.$scopedSlots.default(this.handlers) || [];

    if (typeof vnode === 'undefined') {
      throw new ReferenceError('A single, nested element or component is required.');
    }

    if (otherNodes) {
      logger.warn('Multiple root components detected. Only the first one will be exposed to the template.');
    }

    if (!isEmptyObject(this.$attrs)) {
      logger.warn(
        'In case you are trying to bind certain props on the target component, ' +
        'please do so on the component itself.', Object.keys(this.$attrs)
      );
    }

    return vnode;
  },

  mounted() {
    this.uploader = this.createUploader();

    this.updateCoreAttributes();

    this.injectUploader();
  },

  methods: {
    createUploader() {
      const uploader = document.createElement('input');

      uploader.id = `vue-file-uploader-${this._uid}`;
      uploader.type = 'file';
      uploader.style.display = 'none';
      uploader.ariaHidden = true;

      return uploader;
    },

    injectUploader() {
      let inserted;

      if (opts.uploaderContainerId) {
        const container = document.querySelector(opts.uploaderContainerId);

        inserted = container?.appendChild(this.uploader);
      }
      else {
        if (this.$el instanceof Text) {
          throw new TypeError('An HTMLElement or Vue component is required.');
        }

        inserted = this.$el.insertAdjacentElement('afterend', this.uploader);
      }

      if (inserted !== this.uploader) {
        throw new Error(
          'Failed injecting an `input` element onto the DOM tree, subsequent actions may thus fail.'
        );
      }
    }
  }
})
