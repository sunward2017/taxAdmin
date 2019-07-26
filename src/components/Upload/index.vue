<template>
  <div>
  <el-upload
    class="upload-content"
    drag
    ref='upload'
    :action="url"
    :auto-upload="false"
    :before-upload ="handlePreview"
    :on-success="handleSuccess"
    :on-error="handleError"
    :data="param"
    :file-list="fileList"
  >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>选取文件</em></div>
    <div class="el-upload_tip" slot="tip">只能上传{{strRegExp.split("|").join("或")}}文件</div>
  </el-upload>
  <!--<el-button  size="small" icon="edit" @click="test()">test</el-button>-->
  </div>
</template>
<script>

  import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";

  export default {
    components: {ElButton},
    props:{
      param:{
        type:Object,
      },
      strRegExp:{
        type:String,
      },
      url:{
        type:String
      },
      fileList:{
        type: Array,
        default:[]
      }
    },
    data() {
      return {

      };
    },
    methods: {
      upload(r){
        this.$emit("resp_res",r);
      },
      test(){
        this.$emit("test",'hello,test');
      },
      handlePreview(file){
        var reg=new RegExp(this.strRegExp);
        if(reg.test(file.name.toUpperCase())){
          return true;
        }else{
          this.$notify.info({
            title: '提示',
            message: '文件格式不正确',
            duration:2000,
            offset: 300
          });
          return false;
        }

      },
      handleSuccess(response, file, fileList){
        this.$refs.upload.clearFiles();

        this.upload(response.result);

        console.log("handleSuccess");
        console.log(response.result);

        if(response.result==200){
          this.$notify.success({
            title: '成功',
            message: '文件上传成功',
            duration:2000,
            offset: 300
          });

          this.$emit('callback', response)
        }else{
          this.$notify.error({
            title: '失败',
            message: response.message,
            duration:2000,
            offset: 300
          });
        }

      },
      handleError(e,file,fileList){
        this.$emit("resp_res",'文件上传失败');
        this.$notify.error({
          title: '失败',
          message: '文件上传失败',
          duration:2000,
          offset: 300
        });
      },
      submit(){
        this.$refs.upload.submit();
      }
    },

  }
</script>
<style scoped>
</style>
