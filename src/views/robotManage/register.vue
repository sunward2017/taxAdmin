<template>
  <div class="app-container">
    <el-col :span="24" class="toolbar">
      <el-form :inline=true :model="filters">
        <el-form-item>
          <el-input v-model="filters.value" placeholder="请输入机器人ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click.native="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="plus" @click.native="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <template v-if="(tableData==undefined)">
      <Grid :columns="robotRegisterColumns" :rows="this.tableData" v-loading="listLoading" @edit="handleEdit" @del="handleDel" :isEdit="true"
            :isDelete="true" :isSpecial="true" @yx="mutual" :editWidth="350" :isLog='isLog' @log="showLog"/>
    </template>

    <template v-if="!(tableData==undefined||tableData==[])">
      <Grid :columns="robotRegisterColumns" :rows="this.tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" v-loading="listLoading" @edit="handleEdit" @del="handleDel" :isEdit="true"
            :isDelete="true" :isSpecial="true" @yx="mutual" :editWidth="350" :isLog='isLog' @log="showLog"/>
      <div style="float: right">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-size="pageSize"
          small
          layout="total, prev, pager, next"
          :total="this.tableData.length">
        </el-pagination>
      </div>
    </template>

    <!--新增，编辑-->
    <el-dialog :title="formTitle" :visible.sync="formVisible" @close="reset" class="dialog">
      <el-form :model="formModel" label-width="120px" :rules="formRules" ref="formRef" :inline="true" >
        <el-form-item label="机器人名称" prop="robotName">
          <el-input v-model="formModel.robotName" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="机器人型号" prop="model">
          <el-input v-model="formModel.model" style="width: 300px" placeholder="机器人型号唯一，不可与已存在ID重复"></el-input>
        </el-form-item>
        <el-form-item label="机器人地址" prop="address">
          <el-input v-model="formModel.address" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input v-model="formModel.phoneNumber" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="机器人设备ID" prop="devId">
          <el-input v-model="formModel.devId" style="width: 300px" placeholder="机器人设备ID唯一，不可与已存在ID重复"></el-input>
        </el-form-item>
        <el-form-item label="系统版本号" prop="sysVer">
          <el-input v-model="formModel.sysVer" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="机器人背景" prop="currentBg">
          <el-select v-model="formModel.currentBg" placeholder="请选择" style="width: 300px">
            <el-option
              v-for="item in this.background"
              :key="item.backgroundUrl"
              :label="item.bgName"
              :value="item.backgroundUrl">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="机器人地图" >
          <el-select v-model="formModel.currentMap" placeholder="请选择" style="width: 300px">
            <el-option
              v-for="item in this.mapData"
              :key="item.regionId"
              :label="item.regionName"
              :value="item.regionId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机器人分组" prop="robotGroupName">
          <el-select v-model="formModel.robotGroupName" placeholder="请选择" style="width: 300px">
            <el-option
              v-for="item in this.groupName"
              :key="item.robotGroupName"
              :label="item.robotGroupName"
              :value="item.robotGroupName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机器人备注" prop="description" >
          <el-input v-model="formModel.description" type="textarea" :rows="3" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitForm" :loading="isSubmitting">{{submitBtnText}}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="交互系统" v-model="yxVisible" size="large" top="5%" @close="resetCookie">
      <iframe src="./webdemo/im/main.html" width="100%" height="700" frameborder="0" scrolling='no'></iframe>
    </el-dialog>
    <el-dialog title="日志信息" v-model="logVisible" @close="initMsg">
      <!--Log组件是导入的-->
      <Log :msg="curRobotId" ref="profile"></Log>
    </el-dialog>
  </div>
</template>
<script>
  import NProgress from 'nprogress'
  import { getList, saveSubmit} from '../../api/table';
  import Grid from '../../components/Grid/Grid'
  import {
    robotRegisterColumns
  } from '../../dictionary/columns'
  import {
    robotRegisterList,
    saveRegisterRobot,
    deleteRegisterRobot,
    GetRobotBg
  } from '@/api/robot'

  import Log from '../../components/runLog';
  import Cookies from 'js-cookie'
  import { getAccount,getToken } from '@/utils/auth'
  import { resetObj,cloneObj} from '@/utils/cover'
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";

  export default {
    components: {
      ElFormItem,
      Grid,
      Log
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
        groupName:'',
        dataValue:'',
        cId:0,
        session:'',
        account:'',
        //        当前页
        currentPage: 1,
//        当前页内显示条数
        pageSize:10,
        customerId:[],
        filters: {
          value: ''
        },
        formTitle: '',
        formVisible: false,
        background:[],
        formModel: {
          currentMap:0,
          robotId:0,
          robotName: '',
          model: '',
          address:'',
          phoneNumber:'',
          devId:'',
          description:'',
          sysVer:'',
//          createTime:'',
          currentBg:'',
          robotGroupName:'',
        },
        isSubmitting: false,
        submitBtnText: '保存',
        formRules: {
          robotId:[{ required: true, message: '请输入机器人ID', trigger: 'blur' }],
          robotName:[{ required: true, message: '请输入机器人名称', trigger: 'blur' },
            {min:3,max:10,message:'长度在3到10个字符',trigger:'blur'}],
          model:[{ required: true, message: '请输入机器人型号', trigger: 'blur' }],
          address:[{ required: true, message: '请输入机器人地址', trigger: 'blur' }],
          devId:[{ required: true, message: '请输入机器人ID', trigger: 'blur' }],
          phoneNumber:[{ required: true, validator:checkContact,  trigger: 'blur' }],
          sysVer:[{ required: true, message: '请输入机器人系统版本', trigger: 'blur' }],
          currentBg:[{ required: true, message: '请选择机器人背景', trigger: 'change,blur' }],
          map:[{ required: true, message: '请选择机器人地图', trigger: 'change,blur' }],
        },
        robotRegisterColumns: robotRegisterColumns,
        listLoading: true,
        tableData: [],
        mapData:[],
        yxVisible:false,

        //log
        logVisible:false,
        curRobotId:'',
      }
    },
    mounted() {
      this.init();
      this.getList();
      this.getBg();
      this.getMaps();
      this.getGroup();
    },

    computed:{
      isLog:function(){
        return   JSON.parse(unescape(getAccount())).account ==="system"
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
      getList() {
        this.listLoading = true;
        robotRegisterList({}).then(res => {
          this.listLoading = false;
          this.tableData = res.data;
          console.log("tableData");
          console.log(this.tableData);
//          this.getBg();
          this.customerId =this.tableData.map(item=>{
            return item.cId;
          });
        });
        this.listLoading = false;
      },
      getMaps() {
        this.listLoading = true;
        getList("/admin/MapList.action",{}).then(res => {
          this.listLoading =false;
          let data = [];
          if(res.data){
            data = res.data;
//            var j=0;
            for (var  i=0,j=0;  i<data.length;i++) {

              let o = new Object();
              this.mapData[j] = o;
              this.mapData[j].regionId = data[i].regionId;
              this.mapData[j].regionName = data[i].regionName;
              j++;
            }
            console.log("getMaps");
//            console.log(res.data);
            console.log(this.mapData);
          }else{
            this.mapData=[];
          }
        })
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
      getGroup(){
        getList("/admin/GetRobotGroup.action",{customerId:this.cId,session:this.session}).then(res => {
          if(res.data){
            this.groupName = res.data;
          }else {
            this.groupName = [];
          }
        });
      },
      handleSearch() {
        this.listLoading = true;
        if (this.filters.value === '') {
          robotRegisterList({}).then(res => {
            this.listLoading = false;
            this.tableData = res.data;
          });
        } else {
          robotRegisterList({
            robotId: this.filters.value
          }).then(res => {
            console.log("res.data");
            console.log(res.data);
            this.tableData = res.data;
          });
          this.listLoading = false;
        }

      },
      handleAdd() {
        this.formTitle = '新增';
        this.action = 'add';
        this.formVisible = true;
        this.formModel= resetObj(this.formModel);
        this.formModel.robotId =0;
        let  i  = this.mapData[0].regionId
        this.formModel.currentMap = i;
//        this.formModel.Action =0;
      },
      handleEdit(r)  {
        console.log("handleEdit");
        console.log(r);
        this.formTitle = "编辑";
        this.action = 'edit';
        this.formVisible = true;
        this.formModel = cloneObj(r);
        console.log(this.formModel);
        this.formModel.Action =1;
      },
      handleDel(r) {
        this.$confirm("确认删除机器人吗？", '提示', {

        }).then(() => {
          this.listLoading = true;
          NProgress.start();
          deleteRegisterRobot({
            Action: 2,
            robotId: r.robotId
          }).then((res) => {
            this.listLoading = false;
            NProgress.done();
            if (res.result === 200) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              });
              this.getList();
            } else {
              this.$notify({
                title: '成功',
                message: res.body.message,
                type: 'error'
              });
            }
            this.formVisible = false;
          });
        }).catch(() => {

        });
      },
      handleSubmitForm() {
        let params = cloneObj(this.formModel);
        this.$refs.formRef.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              NProgress.start();
              this.isSubmitting = true;
              this.submitBtnText = '提交中';
              if (this.action=== 'add') {
                saveRegisterRobot({...params, session:this.session, account:this.account, cId:this.cId, Action:0}).then((res) => {
                  this.isSubmitting = false;
                  NProgress.done();
                  this.submitBtnText = '提交';
                  if (res.result ===200) {
                    this.$notify({
                      title: '成功',
                      message: '新增成功',
                      type: 'success'
                    });

                    this.getList();
                  } else {
                    this.$notify({
                      title: '失败',
                      message: res.message,
                      type: 'error'
                    });
                  }
                  this.formVisible = false;
                });
              } else {
                saveRegisterRobot({...params, session:this.session, account:this.account, cId:this.cId, Action:1, robotId:this.formModel.robotId}).then((res) => {
                  this.isSubmitting = false;
                  NProgress.done();
                  this.submitBtnText = '提交';
                  if (res.result === 200) {
                    this.$notify({
                      title: '成功',
                      message: '编辑成功',
                      type: 'success'
                    });
                    this.getList();
                  } else {
                    this.$notify({
                      title: '失败',
                      message: res.message,
                      type: 'error'
                    });
                  }
                  this.formVisible = false;
                });
              }
            })
          } else {

          }
        });
      },
      mutual(){
        var token = JSON.parse(unescape(getAccount())).uid;
        if(token){
          Cookies.set('uid',token );
          // Cookies.set("uid",'nurse00000129')
          Cookies.set('sdktoken', token);
          this.yxVisible=true;
        }else{
          this.$notify({
            title: '提示',
            message: '机器人没有注册',
            type: 'info'
          });
        }
      },
      resetCookie(){
        Cookies.set('uid','' );
        Cookies.set('sdktoken', '');
      },
      reset(){
        this.$refs.formRef.resetFields();
      },
      showLog: function(row) {
        this.curRobotId = row.devId;
        this.logVisible = true;
        let _this = this;
        this.$nextTick(function() {
          _this.$refs.profile.getLogList();
        })

      },
      initMsg: function() {
        this.$refs.profile.initMsg();
      },
    }
  }

</script>

<style>

  /*.dialog el-form-item el-input{*/
  /*width: 120px;*/
  /*!*width: 80px;*!*/
  /*!*padding-right: 20%;*!*/
  /*}*/
  .dialog el-input{
    width: 120px;
    /*width: 80px;*/
    /*padding-right: 20%;*/
  }

</style>

