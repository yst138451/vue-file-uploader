import fileUploaderFactory from './lib/VueFileUploader';
import defaults from './config/defaults';
import { merge } from './utils/helpers';

const plugin = {
  install(Vue, originalOpts) {
    const opts = merge({}, defaults, originalOpts);

    Vue.component(opts.componentName, fileUploaderFactory(opts));
  }
}

export default plugin;

export const VueFileUploader = fileUploaderFactory(defaults);
