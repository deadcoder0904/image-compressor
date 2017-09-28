window.addEventListener('DOMContentLoaded', () => {
  const Vue = window.Vue;
  const URL = window.URL || window.webkitURL;
  const ImageCompressor = window.ImageCompressor;

  new Vue({
    el: '#app',

    data() {
      const vm = this;

      return {
        options: {
          maxWidth: undefined,
          maxHeight: undefined,
          minWidth: 0,
          minHeight: 0,
          width: undefined,
          height: undefined,
          quality: 0.8,
          mimeType: '',
          convertSize: 5000000,
          success(file) {
            console.log('Output: ', file);

            if (URL) {
              file.outputURL = URL.createObjectURL(file);
            }

            vm.output.push(file);
            vm.$refs.input.value = '';
          },
          error(e) {
            window.alert(e.message);
          },
        },
        input: [{}],
        output: [{}],
      };
    },

    filters: {
      prettySize(size) {
        const kilobyte = 1024;
        const megabyte = kilobyte * kilobyte;

        if (size > megabyte) {
          return `${(size / megabyte).toFixed(2)} MB`;
        } else if (size > kilobyte) {
          return `${(size / kilobyte).toFixed(2)} KB`;
        } else if (size >= 0) {
          return `${size} B`;
        }

        return 'N/A';
      },
    },

    methods: {
      compress(file) {
        if (!file) {
          return;
        }
        this.input = [];
        this.output = [];
        for (let i = 0; i < file.length; ++i) {
          if (URL) {
            file[i].inputURL = URL.createObjectURL(file[i]);
          }
          this.input.push(file[i]);
          new ImageCompressor(file[i], this.options);
        }
      },

      change(e) {
        this.compress(e.target.files ? e.target.files : null);
      },

      dragover(e) {
        e.preventDefault();
      },

      drop(e) {
        e.preventDefault();
        this.compress(e.dataTransfer.files ? e.dataTransfer.files : null);
      },

      downloadAll() {
        [...document.querySelectorAll('.download')].map(item => item.click());
      },
    },
  });
});
