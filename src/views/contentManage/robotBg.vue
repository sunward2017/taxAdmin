<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="filters">

        <el-form-item>
          <el-button type="primary" @click="handleAdd" icon="plus">新增</el-button>
        </el-form-item>
      </el-form>

    </el-col>

    <!--列表-->
    <template>
      <!--<Grid :columns="VipColumns" :rows="tableData"  v-loading="listLoading" @edit="handleEdit" @del="handleDel" :isEdit="true"-->
      <!--:isDelete="true"/>-->

      <el-table
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        border
        style="width: 100%">
        <el-table-column type="index" label="列号" width="100"></el-table-column>
        <!--<el-table-column-->
          <!--prop='id'-->
          <!--label='ID'-->
          <!--align='center'>-->
        <!--</el-table-column>-->
        <el-table-column
          prop='bgName'
          label='背景名称'
          align='center'>
        </el-table-column>
        <el-table-column
          prop="backgroundUrl"
          label= '背景'
          align= 'center'
        >
          <template scope="scope">
            <img :src="cover(scope.row.backgroundUrl)" width="30" height="30"/>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="操作"
          >
          <template scope="scope">
            <el-button type="warning" size="small" icon='delete' @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
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

    <!--新增界面-->
    <el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false" size="tiny" >
      <el-form :model="editForm" label-width="90px"  ref="editForm">
        <el-form-item label="背景名称" prop="bgName">
          <el-input v-model="editForm.bgName" style="width: 360px"/>
        </el-form-item>

        <el-form-item label="背景上传" >
          <Upload   :url="backgroundUrl" strRegExp=".PNG|.JPG|.JPEG|.GIF" ref="upload" @callback="setUrl" ></Upload>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancel"  icon="circle-cross">取 消</el-button>
        <el-button type="primary" icon="upload2" @click="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import NProgress from 'nprogress';
  import { getList, saveSubmit} from '../../api/table';
  import { VipColumns } from '../../dictionary/columns';
  import { resetObj,cloneObj} from '@/utils/cover'
  import Upload from "../../components/Upload/upload";
  import { getAccount,getToken } from '@/utils/auth'
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";
  import ElInput from "../../../node_modules/element-ui/packages/input/src/input.vue";
  export default {
    components: {
      ElInput,
      ElFormItem,
      Upload,
    },
    data() {
      var checkContact = (rule,str, callback) => {
        let reg =  /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
        let value = str.replace(/^\s*$/g,'');
        if(value===''){
          return callback(new Error('手机号不能为空'));
        }else if(!reg.test(value)) {
          return callback(new Error('手机号码不正确'));
        }else{
          callback();
        }

      };
      return {
        //        当前页
        currentPage: 1,
//        当前页内显示条数
        pageSize:10,
        filters: {
          cid: '',
        },
        VipColumns:VipColumns,
        customs:'',
        tableData:[],
        //编辑
        editFormTtile:"新增",
        editFormVisible:false,
        editLoading:false,
        sess:getToken(),
        listLoading:false,
        btnEditText:'提交',
        Action:0,
        editForm:{
          id:0,
          bgName:'',
          Action:0,
        },
        backgroundUrl:'/admin/UploadImg.action',


      }
    },
    methods: {

      init(){
        this.account = getAccount();
        this.session = getToken();
        var arrCookie =this.account.split("%");
        for(let i =0;i<arrCookie.length;i++){
          var arr =arrCookie[i];
          if(arrCookie[i]==="22cId"){
            let cid = arrCookie[i+3].split("22");
            this.cId = cid[1];
          }
        }
      },
//      每页显示条数发生改变
      handleSizeChange(pageSize){
        console.log("pageSize");
        console.log(pageSize);
        this.pageSize = pageSize;
      },
//      当前页发生改变
      handleCurrentChange(currentPage){
        console.log("currentPage");
        console.log(currentPage);
        this.currentPage  = currentPage;
      },
      cover(url){
        return "."+url;
      },

      getManger() {
        this.listLoading = true;
        getList("/admin/GetRobotBg.action",{customerId:this.cId}).then(res => {
          this.listLoading =false;

          if(res.data){
            this.tableData = res.data
          }else{
            this.tableData=[];
          }
//					console.log("res.data")
//          console.log(res.data);
					console.log("this.tableData");
          console.log(this.tableData);
        });


      },
      handleAdd(){
        this.editFormTtile="新增";
        this.editFormVisible=true;
//        this.editForm = resetObj(this.editForm);
//        this.editForm.id=0;
        this.editForm.Action = 0;

      },
      cancel(){
        this.editFormVisible=false;
      },
      setUrl(res){
        console.log(res);
        this.editForm.backgroundUrl = res.data;
      },

//      submitUpload(){
//          this.$refs.upload.submit();
//      },

      editSubmit(){
//        console.log(this.tableData);
        let _this = this;
        let param  = cloneObj(_this.editForm);
        console.log("editSubmit");
        console.log(param);
        _this.$refs.editForm.validate((valid) => {
          if(valid) {
            _this.$confirm('确认提交吗？', '提示', {}).then(() => {
              _this.editLoading = true;
              NProgress.start();
              _this.btnEditText = '提交中';
              if(_this.editForm.Action===0){
                this.Action=0;
              }else{
                this.Action=1;
              }
              saveSubmit("/admin/ModifyRobotBg.action",{...param, Action:this.Action, custromerId: this.cId}).then((res) => {
                _this.editLoading = false;
                NProgress.done();
                _this.btnEditText = '提 交';
                let msg='';
                if(_this.editForm.Action===0){
                  msg = "新增成功";
                }else{
                  msg = "修改成功";
                }
                if(res.result===200){
                  _this.getManger();
                  _this.$notify({
                    title: '成功',
                    message: msg,
                    type: 'success'
                  });
                  _this.editFormVisible = false;

                }else{
                  _this.$notify({
                    title: '失败',
                    message: res.message,
                    type: 'error'
                  });
                }

              });
            }).catch(()=>{});

          }
        });
      },

      handleDel(r){

        var _this = this;
        this.$confirm('确认删除吗?', '提示', {
          //type: 'warning'
        }).then(() => {
          _this.listLoading = true;
          NProgress.start();
          let para = {
            id: r.id,
          };
          saveSubmit("/admin/ModifyRobotBg.action?Action=2",para).then((res) => {
            _this.listLoading = false;
            NProgress.done();
            if(res.result===200){
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
      }
    },
    mounted() {
       this.init();
      this.getManger();
    }
  }
</script>

<style scoped>
  .toolbar{
    padding-top:20px;

  }
</style>
