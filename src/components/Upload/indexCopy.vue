<template>
  <el-upload
    class="upload-demo"
    ref="upload"
    :action="url"
    :before-upload ="handlePreview"
    :on-success="handleSuccess"
    :on-error="handleError"
    :file-list="fileList"
    :auto-upload="false">
    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
  </el-upload>

</template>
<script>

  export default {
    props:{
//      param:{
//        type:Object,
//      },
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
//      submitUpload(){
//        this.$emit("upload");
//      },
      submitUpload() {
        this.$refs.upload.submit();
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
        console.log();
        this.$refs.upload.clearFiles();
        if(response.result===200){
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
        this.$notify.error({
          title: '失败',
          message: '文件上传失败!!',
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
