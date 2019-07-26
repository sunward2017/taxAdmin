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
        <el-table-column
          prop='robotId'
          label='机器人ID'
          align='center'>
        </el-table-column>
        <el-table-column
          prop='setTime'
          label='时间'
          align='center'>
        </el-table-column>
         <el-table-column
            prop="bgUrl"
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
    <el-dialog :title="editFormTitle" v-model="editFormVisible" :close-on-click-modal="false" size="tiny" >
      <el-form :model="editForm" label-width="90px"  ref="editForm" :inline="true" >
        <el-form-item  prop="robotId" label="ID">
          <el-select v-model="editForm.robotId" placeholder="请选择机器人ID">
            <el-option
              v-for="item in options"
              :key="item.robotId"
              :label="item.robotName"
              :value="item.robotId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="time" label="日期">
          <el-date-picker
            v-model="editForm.time"
            type="date"
            placeholder="选择日期">
        </el-date-picker>

          <!--<el-date-picker-->
            <!--v-model="editForm.time"-->
            <!--type="datetime"-->
            <!--placeholder="选择日期时间">-->
          <!--</el-date-picker>-->
        </el-form-item>
        <el-form-item  prop="currentBg" label="机器人背景">
          <el-select v-model="editForm.currentBg" placeholder="请选择机器人背景" style="width: 300px">
            <el-option
              v-for="item in this.background"
              :key="item.backgroundUrl"
              :label="item.bgName"
              :value="item.backgroundUrl">
            </el-option>
          </el-select>
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
  import { robotRegisterList ,GetRobotBg } from '@/api/robot';
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

      return {
        background:[],
        value:'',
        value1:'',
        options:[],
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
        editFormTitle:"新增",
        editFormVisible:false,
        editLoading:false,
        sess:getToken(),
        listLoading:false,
        btnEditText:'提交',
        Action:0,
        editForm:{
          currentBg:'',
          id:0,
          robotId:'',
          time:'',
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
//      机器人信息
      getList() {
        this.listLoading = true;
        robotRegisterList({}).then(res => {
          this.listLoading = false;
          this.options = res.data;
          console.log("options");
          console.log(this.options);
//          this.getBg();
          this.customerId =this.options.map(item=>{
            return item.cId;
          });
        });
        this.listLoading = false;
      },
      cover(url){
        return "."+url;
      },

      getManger() {
        this.listLoading = true;
        getList("/admin/GetRobotBGList.action",{customerId:this.cId,session:this.session}).then(res => {
          this.listLoading =false;

          if(res.data){
            this.tableData = res.data
          }else{
            this.tableData=[];
          }
          console.log("this.tableData");
          console.log(this.tableData);
        });


      },
      handleAdd(){
        this.editFormTtile="新增";
        this.editFormVisible=true;
        this.editForm = resetObj(this.editForm);
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
      getBg(){
        this.listLoading = true;
        getList("/admin/GetRobotBg.action",{customerId:this.cId}).then(res => {
          this.listLoading = false;
          if (res.data) {
            this.background = res.data
          } else {
            this.background = [];
          }
          console.log("background");
          console.log(this.background);
        });

//        var j=0;
//        for (var  i=0;  i<this.tableData.length;i++){
//            let o  = new Object();
//            this.background[j] = o;
//            this.background[j].currentBg = this.tableData[i].currentBg;
//             j++;
//          //            console.log("background");
////              console.log("this.background[j].currentBg");
////              console.log(this.background[j].currentBg);
////          console.log("this.background");
////          console.log(this.background);
//        }
      },
//      submitUpload(){
//          this.$refs.upload.submit();
//      },

      editSubmit(){
//        console.log(this.tableData);
        let _this = this;
        let param  = cloneObj(_this.editForm);
        let t = this.editForm.time;
        console.log("editForm.time");
        console.log(t);
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
              saveSubmit("/admin/AddRobotBGList.action",{robotId:this.editForm.robotId, bgUrl:this.editForm.currentBg, setTime:this.editForm.time, customerId: this.cId}).then((res) => {
//              saveSubmit("/admin/AddRobotBGList.action",{...param, custromerId: this.cId, session:this.session}).then((res) => {
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
          saveSubmit("/admin/DelRobotBGList.action?Action=2",para).then((res) => {
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
      this.getList();
      this.getBg();
    }
  }
</script>

<style scoped>
  .toolbar{
    padding-top:20px;

  }
</style>
