<template>
  <el-upload
  class="upload-demo"
  drag
  name="img"
  ref="upload"
  :action="url"
  :before-upload ="handlePreview"
  :on-success="handleSuccess"
  :on-error="handleError"
  :data="param"
  >

  <i class="el-icon-upload"></i>
  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  <div class="el-upload__tip" slot="tip">只能上传{{strRegExp}}文件 </div>
</el-upload>
</template>
<script scoped>
import { getToken,getAccount } from '@/utils/auth'

export default {
    props:{
           strRegExp:{
              type:String,
           },
           url:{
              type:String
           }
    },
    data() {
      return {
        param:{
          account:JSON.parse(unescape(getAccount())).account,
          session:getToken(),
        },
      };
    },
    methods: {
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
        if(response.result===200){
          this.$notify.success({
            title: '成功',
            message: '文件上传成功',
            duration:2000,
            offset: 300
          });
            this.$emit('callback', response)
        }
        else{
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
            message: '文件上传失败',
            duration:2000,
            offset: 300
          });
      }
    },

  }
</script>
