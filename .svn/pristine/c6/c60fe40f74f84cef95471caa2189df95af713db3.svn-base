<template>
    <textarea class='tinymce-textarea' :id="id"></textarea>
</template>

<script>
    // tinymce 在最外层目录static下 ，由index.html直接引入，挂载在window下。不通过impot，不打包
  
    export default {
      name: 'tinymce',
      props: {
        id: {
          type: String,
          default: 'tinymceEditor'
        },
        value: {
          type: String,
          default: ''
        },
        customButton: {
          type: Array,
          required: false,
          default() {
            return ['editorAudio', 'editorImage']
          }
        },
        toolbar: {
          type: Array,
          required: false,
          default() {
            // return ['removeformat undo redo |  bullist numlist | outdent indent | forecolor | fullscreen code', 'bold italic blockquote | h2 p  media link | alignleft aligncenter alignright']
            return   [' removeformat undo redo | bold italic strikethrough forecolor backcolor | link fullscreen code',' h2 p  media link | alignleft aligncenter alignright  alignjustify  | numlist bullist outdent | insertdatetime image']
          }
        },
        data() {
          return {
            hasChange: false,
            hasInit: false
          }
        },
        menubar: {
          default: ''
        },
        height: {
          type: Number,
          required: false,
          default: 300
        }
      },
      watch: {
        value(val) {
          if (!this.hasChange && this.hasInit) {
            this.$nextTick(() => tinymce.get(this.id).setContent(val))
          }
        }
      },
      mounted() {
        const _this = this;
        tinymce.init({
          selector: `#${this.id}`,
          width:"99%",
          height: this.height,
          body_class: 'panel-body ',
          object_resizing: false,
          language: 'zh_CN',
          language_url: '/static/tinymce/langs/zh_CN.js',
          toolbar: this.toolbar,
          menubar: this.menubar,
          plugins: 'advlist,autolink,code,paste,textcolor, colorpicker,fullscreen,link,lists,media,wordcount, imagetools,watermark,insertdatetime,image',
          insertdatetime_dateformat: "%Y-%m-%d",
          end_container_on_empty_block: true,
          powerpaste_word_import: 'clean',
          code_dialog_height: 450,
          code_dialog_width: 1000,
          advlist_bullet_styles: 'square',
          advlist_number_styles: 'default',
          block_formats: '普通标签=p;小标题=h2;',
          imagetools_cors_hosts: ['wpimg.wallstcn.com', 'wallstreetcn.com'],
          imagetools_toolbar: 'watermark',
          default_link_target: '_blank',
          link_title: false,
          init_instance_callback: editor => {
            if (_this.value) {
              editor.setContent(_this.value)
            }
            _this.hasInit = true;
            editor.on('Change', () => {
              //this.hasChange = true;
              this.$emit('input', editor.getContent({ format: 'raw' }));
            });
          },
          setup(editor) {
            editor.addButton('h2', {
              title: '小标题', // tooltip text seen on mouseover
              text: '小标题',
              onclick() {
                editor.execCommand('mceToggleFormat', false, 'h2');
              },
              onPostRender() {
                const btn = this;
                editor.on('init', () => {
                  editor.formatter.formatChanged('h2', state => {
                    btn.active(state);
                  });
                });
              }
            });
            editor.addButton('p', {
              title: '正文',
              text: '正文',
              onclick() {
                editor.execCommand('mceToggleFormat', false, 'p');
              },
              onPostRender() {
                const btn = this;
                editor.on('init', () => {
                  editor.formatter.formatChanged('p', state => {
                    btn.active(state);
                  });
                });
              }
            });
          }
        });
      },
      methods: {
        getTinymce(){
          var val= tinyMCE.activeEditor.getContent();
          return val;
        }
        /* 业务代码可删除 end*/
      },
      destroyed() {
        tinymce.get(this.id).destroy();
      }
}
</script>

<style scoped>
</style>
