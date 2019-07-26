<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.versionCode" auto-complete="off" placeholder="请输入版本号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" v-on:click="getManger()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd" icon="plus">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <template v-if="(tableData===undefined)">
      <Grid4version :columns="versionColumns" :rows="tableData"  v-loading="listLoading" @edit="handleEdit" @del="handleDel" :isEdit="true"
                    :isDelete="true"/>
    </template>
    <template v-if="!(tableData===undefined)">
      <Grid4version :columns="versionColumns" :rows="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"  v-loading="listLoading" @edit="handleEdit" @del="handleDel" :isEdit="true"
                    :isDelete="true"/>
      <div style="float: right">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-size="pageSize"
          small
          layout="total, prev, pager, next"
          :total="tableData.length">
        </el-pagination>
      </div>
    </template>

    <!--编辑界面-->
    <el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false" size="tiny" @close="resetForm">
      <el-form :model="editForm" label-width="90px" :rules="editFormRules" ref="editForm">
        <el-form-item label="包名称" prop="packageName">
          <el-input v-model="editForm.packageName" auto-complete="off" style="width: 360px"></el-input>
        </el-form-item>
        <el-form-item label="版本名称" prop="versionName">
          <el-input v-model="editForm.versionName" auto-complete="off"  style="width: 360px"> </el-input>
        </el-form-item>
        <el-form-item label="版本号" prop="versionCode">
          <el-input v-model="editForm.versionCode" auto-complete="off"  style="width: 360px"></el-input>
        </el-form-item>
        <el-form-item label="版本描述" prop="versionDescription">
          <el-input v-model="editForm.versionDescription" auto-complete="off"  style="width: 360px"></el-input>
        </el-form-item>
        <el-form-item label="是否保存">
          <el-radio class="radio" v-model="editForm.status" label="1">保存</el-radio>
          <el-radio class="radio" v-model="editForm.status" label="0">不保存</el-radio>
        </el-form-item>
        <el-form-item label="版本文件" v-if="!editForm.Action">
          <Upload :param="editForm" :url="url" strRegExp=".APK" ref="uploadApk" @callback="getManger" :fileList="fileList"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancel"  icon="circle-cross">取 消</el-button>
        <el-button type="primary" icon="upload2" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import NProgress from 'nprogress'
  import Grid4version from '../../components/Grid/Grid4version'
  import { getList, saveSubmit} from '../../api/table';
  import { versionColumns } from '../../dictionary/columns';
  import { resetObj,cloneObj} from '@/utils/cover'
  import Upload from "../../components/Upload";
  import { getToken,getAccount } from '@/utils/auth'

  export default {
    components: {
      Grid4version,
      Upload
    },
    data() {
      return {
        //        当前页
        currentPage: 1,
//        当前页内显示条数
        pageSize:10,
        filters: {
          versionCode: ''
        },
        versionColumns:versionColumns,
        customs:'',
        tableData:[],
        //编辑
        editFormTtile:"新增",
        editFormVisible:false,
        editLoading:false,
        listLoading:false,
        btnEditText:'提交',
        editForm:{
          id:'',
          packageName:'',
          versionCode:'',
          Action:'',
          versionName:'',
          versionDescription:'',
          status:"1",
          session:'',
          account:'',
        },
        url:'/admin/saveVersionInfo.action',
        editFormRules:{
          versionName: [{ required: true, message: '请输入版本名称', trigger: 'blur' }],
          packageName: [{ required: true, message: '请输入包名', trigger: 'blur' }],
          versionCode: [{ required: true, message: '请输入版本号', trigger: 'blur' }]
        },
        fileList:[]
      }
    },
    methods: {
      //      每页显示条数发生改变
      handleSizeChange(pageSize){
        this.pageSize = pageSize;
      },
//      当前页发生改变
      handleCurrentChange(currentPage){
        this.currentPage  = currentPage;
      },
      getManger() {
        this.listLoading = true;
        var param;
        if(this.filters.versionCode===''){
          console.log("this.filters.versionCode===''");
          getList("/admin/getVersionInfos.action").then(res => {
            this.listLoading =false;
            if(res.data){
              this.tableData = res.data
            }else{
              this.tableData=[];
            }
          });
        }else{
          console.log("this.filters.versionCode==='param'");
          param = {
            versionCode:this.filters.versionCode,
          };
          getList("/admin/getVersionInfos.action",param).then(res => {
            this.listLoading =false;
            if(res.data){
              this.tableData = res.data
            }else{
              this.tableData=[];
            }
          });
        }
//				console.log("this.tableData");
//				console.log(this.tableData);
      },
      handleAdd(){
        this.editFormTtile="新增";
        this.editForm = resetObj(this.editForm);
        this.editForm.Action=0;
        this.editForm.id =0;
        this.editForm.status="1";
        this.editForm.session= getToken();
        this.editForm.account= JSON.parse(unescape(getAccount())).account;
        this.editFormVisible=true;
      },
      cancel(){
        this.editFormVisible=false;
      },
      editSubmit() {
        this.$refs.editForm.validate(valid => {
          if(valid){
            if(this.editForm.Action===0){
              console.log("editSubmit.Action===0");
//              如果是新增，应该有提交动作，为什么没写
              let _this= this;
              let param = cloneObj(_this.editForm);
              saveSubmit('/admin/saveVersionInfo.action',param).then((res)=>{
                if(res.result===200){
                  _this.$notify({
                    title: '成功',
                    message: '新增成功',
                    type: 'success'
                  });
                  _this.getManger();
                }else{
                  _this.$notify({
                    title: '失败',
                    message: res.message,
                    type: 'error'
                  });
                }
              });
              this.editFormVisible=false;
              this.$refs.uploadApk.submit();
            }else{
              let _this= this;
              let param = cloneObj(_this.editForm);
              saveSubmit('/admin/saveVersionInfo.action',param).then((res)=>{
                if(res.result=="200"){
                  _this.$notify({
                    title: '成功',
                    message: '修改成功',
                    type: 'success'
                  });
                  _this.getManger();
                }else{
                  _this.$notify({
                    title: '失败',
                    message: res.message,
                    type: 'error'
                  });
                }
              })
            }

          }
        })
      },
      handleEdit(r){
        this.editFormVisible=true;
        this.editForm = cloneObj(r);
        this.editForm.Action=1;
        this.editForm.status = this.editForm.status.toString();
        this.editForm.session= getToken();
        this.editForm.account= JSON.parse(unescape(getAccount())).account;
      },
      handleDel(r){
        var _this = this;
        this.$confirm('确认删除', '提示', {
          //type: 'warning'
        }).then(() => {
          _this.listLoading = true;
          NProgress.start();
          let para = {
            id: r.id,
            Action:2
          };
          saveSubmit("/admin/deleteVersionInfo.action",para).then((res) => {
            _this.listLoading = false;
            NProgress.done();
            if(res.result=="200"){
              _this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              });
              _this.getManger();
            }else{
              _this.$notify({
                title: '失败',
                message: res.message,
                type: 'error'
              });
            }
            _this.editFormVisible = false;
          });

        }).catch(() => {

        });
      },
      resetForm:function(){
        this.fileList=[];
        this.$refs.editForm.resetFields();
      }
    },
    mounted() {
      this.getManger();
    }
  }
</script>

<style scoped>
  .toolbar{
    padding-top:20px;

  }
</style>
