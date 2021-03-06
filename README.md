<div align="center">
  <h1 align="center">Vue File Uploader</h1>
  A template-like wrapper component that adds file-upload functionalities to your components.
</div>
<br/>

Being "renderless", it doesn't insert (neither wrap your components around with) any additional element, except for the required `input` one which is hidden from the view anyway.

## Installation

#### NPM
```bash
$ npm install --save @yst/vue-file-uploader
```
#### Yarn
```bash
$ yarn add @yst/vue-file-uploader
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

```vue
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

```vue
<template>
  <vue-file-uploader v-slot="{ select }">
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

### File-size Policy/Rules Validations

```vue
<template>
  <vue-file-uploader 
    v-slot="{ select, tooLarge }" 
    :max-file-size="(1024 * 1024)"
    :accept="['image/*', '.pdf']">

    <!-- Using custom button component -->
    <my-button 
      @click="openFileDialog(select)"
      :style="{ borderColor: tooLarge ? 'red' : 'inherit' }"
      label="Select a file">
    </my-button>

  </vue-file-uploader>
</template>
```

```vue
<template>
  <vue-file-uploader 
    v-slot="{ select, tooMany, totallyTooLarge }" 
    :max-file-count="maxFileCount"
    :max-total-size="maxTotalSize"
    multiple>

    <!-- Just like the regular <template>, you need exactly one root element -->
    <div class="uploader-container">
      <input @click="select" type="button" value="Select a file" />
      
      <ul class="uploader-error-bag">
        <li v-if="tooMany">Please select no more than {{maxFileCount}} files.</li>
        <li v-if="totallyTooLarge">The total size is too large.</li>
      </ul>
    </div>

  </vue-file-uploader>
</template>

<script>
  export default {
    data: () => ({
      maxFileCount: 2,
      maxTotalSize: (1024 * 1024) * 2 // 2mb
    })
  }
</script>
```
---

The first two examples above (when rendered) will result in...

```html
<button>Select a file</button>

<input type="file" id="some-unique-id" style="display: none" aria-hidden="true" />
```
...leaving your component clean and uncluttered. 

To make it even "cleaner", consider specifying an [`uploaderContainerId`](#uploaderContainerId) for these hidden input elements to nest under its element as a container. 


## Demo

via [CodeSandbox](https://codesandbox.io/s/vue-file-uploader-examples-u7tmg?file=/src/App.vue)

## Plugin Options

#### `uploaderContainerId`
- type: `string`
- default: `undefined`

Any valid HTML `id` selector. 

By default, each (hidden) `input[type="file"]` will be positioned [`afterend`](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement#Parameters) of the target element/component itself — by specifying a container `id`, you could mount them somewhere else. Please make sure that the container exists in the DOM tree to mount to.

#### `componentName`
- type: `string`
- default: `'VueFileUploader'`

The component name to use on the `<template>` when registered globally.

## Props

#### `accept`
- type: `string` | `Array<string>`
- default: `''` (any type of file)

A string (or an array of strings) that defines the file types the file input should [accept](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept).

#### `multiple`
- type: `boolean`
- default: `false`

Allows users to select one or more files. See [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#multiple).

#### `capture`
- type: `string`
- default: `undefined`

Specifies which camera to use for capturing image or video data. Accepted values are `user` and `environment`. [Read more](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#capture).

#### `maxFileSize`
- type: `number` | `string`
- default: `0`

Maximum size of individual files in bytes.

#### `maxTotalSize`
- type: `number` | `string`
- default: `0`

Maximum size of all files combined in bytes.

#### `maxFileCount`
- type: `number` | `string`
- default: `0`

Maximum number of files to contain.

#### `errorIfInvalid`
- type: `boolean`
- default: `false`

Throws an error if any validation rule is violated.

#### `reactive`
- type: `boolean`
- default: `false`

Enables reactivity for the core attributes, with slight performance penalties.


## Scoped Slots

### `default(props: object)`
Mimicking the [`v-slot`](https://vuejs.org/v2/api/#v-slot) built-in directive, this renderless component simply provides yours with the underlying file-upload functionalities, and whatnots. 

It's worth nothing (again) that as a wrapping, template-like component, it is essentially non-existent — meaning, your target components themselves would be the real focus here. Go to [examples](#examples).

#### `props.select`
- type: `Function`
- arguments: `files`, `element`
- returns: `Promise<{ files: Array<File>, el: HTMLInputElement }>`

#### `props.files`
- type: `Array<File>`

The selected files. See: [Instance properties](https://developer.mozilla.org/en-US/docs/Web/API/File#Instance_properties).

#### `props.tooLarge`
- type: `boolean`

Determines if the individual files exceed the `maxFileSize` (in bytes).

#### `props.totallyTooLarge`
- type: `boolean`

Determines if all files combined exceed the `maxTotalSize` (in bytes).

#### `props.tooMany`
- type: `boolean`

Determines if the total number of files exceeds the `maxFileCount`.


## Events

### `selected(...args)`
- `args.files: Array<File>`
- `args.el: HTMLInputElement`

Emitted when a file has been selected.

### `invalid(violationTypes)`
- `violationTypes: Object<string, boolean>`

Emitted if any validation rule is violated, while passing the rules map that triggers the event.

Example with destructured values: 
```html
<vue-file-uploader @invalid="onInvalid">
...
```

```js
onInvalid({ tooLarge, tooMany }) {
  if (tooMany) {
    // Do something
  }
}

```

### `error(ex)`
- `ex: Error`

Emitted if any exception occurs during the whole process, including rules violations or invalid files (needs `errorIfInvalid` prop enabled) and other generic exceptions.


## License

[MIT](http://opensource.org/licenses/MIT)
