<div align="center">
  <h1 align="center">Vue File Uploader</h1>
  A template-like wrapper component that adds file-upload functionalities to your components.
</div>

## Installation

```bash
npm install --save @yst/vue-file-uploader
```

## Component Registration

### As plugin (globally accessible)

Recommended for custom configurations.

```js
import Vue from 'vue';
import VueFileUploader from '@yst/vue-file-uploader';

const opts = {
  // See: "Plugin Options" below
};

Vue.use(VueFileUploader, opts);
```

### As local component

```js
import Vue from 'vue';
import { VueFileUploader } from '@yst/vue-file-uploader';

export default {
  components: {
    VueFileUploader
  }
}
```

## Examples

### Default Event Handler

```html
<template>
  <vue-file-uploader v-slot="{ select }" @selected="onFileSelected">
    <button @click="select">Select a file</button>
  </vue-file-uploader>
</template>

<script>
  export default {
    methods: {
      onFileSelected(files, el) {
        // Do something with the selected files here
      }
    }
  }
</script>
```

### Asynchronous

```html
<template>
  <vue-file-uploader v-slot="{ select }">
    <!-- It doesn't need to be a button. Could be anything else -->
    <button @click="openFileDialog(select)">Select a file</button>
  </vue-file-uploader>
</template>

<script>
  export default {
    methods: {
      async openFileDialog(select) {
        const { files, el } = await select();
        
        // Do something with the selected files here
      }
    }
  }
</script>
```

---

The above examples (when rendered) will result in...

```html
<button>Select a file</button>

<input type="file" id="some-unique-id" style="display: none" aria-hidden="true" />
```
...leaving your component clean and uncluttered. 

And being "renderless", it doesn't insert (neither wrap your components around with) any additional element you probably don't care about in the first place.

To make it even "cleaner", consider specifying an [`uploaderContainerId`](#uploaderContainerId) for these hidden input elements to nest under. 


## Plugin Options

#### `uploaderContainerId`
- type: `string`
- default: `undefined`

Any valid HTML `id` selector. 

By default, each (hidden) `input[type="file"]` will be positioned [`afterend`](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement#Parameters) of the target element/component itself -- by specifying a container `id`, you could mount them somewhere else. Do make sure that the container exists in the DOM tree to mount to.

#### `componentName`
- type: `string`
- default: `'VueFileUploader'`

The component name to use on the `<template>` when registered globally.

## Props

#### `accept`
- type: `string` | `Array<string>`
- default: `''`

A string (or an array of strings) that defines the file types the file input should [accept](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept).

#### `multiple`
- type: `boolean`
- default: `false`

Allows users to select one or more files. See [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#multiple).

#### `capture`
- type: `string`
- default: `undefined`

Specifies which camera to use for capture of image or video data. Accepted values are `user` and `environment`. [Read more](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#capture).

#### `reactive`
- type: `boolean`
- default: `false`

Enables reactivity for the core attributes, with slight performance penalties.


## Scoped Slots

### `default(handlers)`
Mimicking the [`v-slot`](https://vuejs.org/v2/api/#v-slot) built-in directive, this renderless component simply provides yours with the underlying file-upload functionalities, and whatnots. 

It's worth nothing (again) that as a wrapping, template-like component, it will NOT get rendered at runtime — meaning, your target components themselves would be the real focus here. For more context, take a look at the [examples](#examples).

#### `handlers.select`
- type: `Function`
- arguments: `files`, `element`
- returns: `Promise<{ files: Array<File>, el: HTMLInputElement }>`


## Events

### `selected(...args)`
- `args.files: Array<File>`
- `args.el: HTMLInputElement`

Emitted when a file has been selected.

### `error(ex)`
- `ex: Error`

Emitted if any exception occurs during the whole process.


## License

[MIT](http://opensource.org/licenses/MIT)
