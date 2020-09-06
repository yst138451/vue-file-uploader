export default function createHandlers() {
  const handlers = {};

  handlers.select = () => {
    this.uploader.click();

    return new Promise((resolve, reject) => {
      this.uploader.addEventListener('change', e => {
        const el = e.currentTarget;
        const files = el.files;

        try {
          this.$emit('selected', files, el);
          resolve({ files, el });
        }
        catch (ex) {
          this.$emit('error', ex);
          reject(ex);
        }
      }, { once: true });
    })
  }

  return handlers;
}