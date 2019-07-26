<template>
  <div class="app-container">
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.value" placeholder="请输入客户姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <template v-if="(this.tableData===undefined)">
      <Grid4clientUserRegister :columns="userRegisterColumns" :rows="tableData" v-loading="listLoading" @edit="handleEdit" @del="handleDel" :isEdit="true"
            :isDelete="true" :isSpecial="true" @yx="mutual" :editWidth="400" :isLog='isLog' @log="showLog" />
    </template>

    <template v-if="!(this.tableData===undefined)">
      <Grid4clientUserRegister :columns="userRegisterColumns" :rows="tableData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)" v-loading="listLoading" @edit="handleEdit" @del="handleDel" :isEdit="true"
            :isDelete="true" :isSpecial="true" @yx="mutual" :editWidth="400" :isLog='isLog' @log="showLog" />
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



    <!--el-dialog是对话框 el-form里面包含el-form-item子项目-->
    <el-dialog :title="formTitle" :visible.sync="formVisible" @close="reset">
      <el-form :model="formModel" label-width="120px" :rules="formRules" ref="formRef" :inline=true>


        <el-form-item label="客户名" prop="customerName">
          <el-input v-model="formModel.customerName" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="formModel.phone" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="客户联系地址" prop="contactName">
          <el-input v-model="formModel.contactName" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="客户联系电话" prop="contactPhone">
          <el-input v-model="formModel.contactPhone" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender" style="margin-right: 220px">
          <!--<el-input v-model="formModel.gender" placeholder="输入1代表男，输入0代表女" style="width: 300px"></el-input>-->
          <template>
            <el-radio v-model="formModel.gender" label="1">男</el-radio>
            <el-radio v-model="formModel.gender" label="0">女</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="头像Url链接" prop="faceUrl">
          <el-input v-model="formModel.faceUrl" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="qq" prop="qq">
          <el-input v-model="formModel.qq" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="fax" prop="fax">
          <el-input v-model="formModel.fax" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="eMail" prop="eMail">
          <el-input v-model="formModel.eMail" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="国家" prop="country">
          <el-input v-model="formModel.country" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="formModel.city" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="社区" prop="community">
          <el-input v-model="formModel.community" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="formModel.address" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="行业" prop="industry">
          <el-input v-model="formModel.industry" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="客户备注" prop="memo">
          <el-input v-model="formModel.memo" :autosize=true style="width: 300px" type="textarea"
                    :rows="3"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取 消</el-button>
        <!--这个el-button里面的内容是动态的-->
        <el-button type="primary" @click="handleSubmitForm" :loading="isSubmitting">{{submitBtnText}}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="交互系统" v-model="yxVisible" size="large" top="5%" @close="resetCookie">
      <iframe src="./webdemo/im/main.html" width="100%" height="700" frameborder="0" scrolling='no'></iframe>
    </el-dialog>
    <!--<el-dialog title="日志信息" v-model="logVisible" @close="initMsg">-->
    <!--<clientLog :msg="curClientId" ref="profile"></clientLog>-->
    <!--</el-dialog>-->
  </div>
</template>


<script>
  import NProgress from 'nprogress'
  import Grid4clientUserRegister from '../../components/Grid/Grid4clientUserRegister'
  import {
    userRegisterColumns
  } from '../../dictionary/columns'

  import {
    CustomerList,
    CustomerModify,
  } from '../../api/clientUser'

  //  import clientLog from '../../components/runLog';
  import Cookies from 'js-cookie'
  import { getAccount ,getToken} from '@/utils/auth'
  import { resetObj,cloneObj} from '@/utils/cover'

  export default {
    components: {
      Grid4clientUserRegister,
//      clientLog
    },
    data() {
      var checkPhone = (rule,str, callback) => {
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
      var checkContact = (rule,str, callback) => {
        let reg =  /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
        let value = str.replace(/^\s*$/g,'');
        if(value===''){
          return callback(new Error('电话号码不能为空'));
        }else if(!reg.test(value)) {
          return callback(new Error('电话号码不正确'));
        }else{
          callback();
        }
      };

      return {
        //        当前页
        currentPage: 1,
//        当前页内显示条数
        pageSize:10,

        action:'',
        filters: {
          value: ''
        },
        formTitle: '',
        formVisible: false,
        formModel: {
          cId: "",
          customerName: '',
          phone: '',
          contactName:'',
          contactPhone:'',
          gender:1,
          faceUrl:'',
//          cTime:'',
          fax:'',
          qq:'',
          eMail:'',
          country:'',
          city:'',
          community:'',
          address:'',
          industry:'',
          memo:''
        },
        isSubmitting: false,
        submitBtnText: '保存',

        formRules: {
//          cId:[{ required: true, message: '请输入客户ID', trigger: 'blur' }],
          customerName:[{ required: true, message: '请输入客户名称', trigger: 'blur' }],
//          phone:[{ required: true, validator:checkPhone, trigger: 'blur' }],
          contactName:[{ required: true, message: '请输入客户联系地址', trigger: 'blur' }],
//          contactPhone:[{ required: true,validator:checkContact, trigger: 'blur' }],
//          gender:[{ required: true, message: '性别输入1代表男，0代表女',  trigger: 'blur' }],
//          faceUrl:[{ required: true, message: '请输入客户头像url链接', trigger: 'blur' }],
//          cTime:[{ required: true, message: '请输入时间', trigger: 'blur' }],
//          fax:[{ required: true, message: '请输入传真', trigger: 'blur' }],
//          qq:[{ required: true, message: '请输入qq', trigger: 'blur' }],
//          email:[{ required: true, message: '请输入邮箱', trigger: 'blur' }],
//          country:[{ required: true, message: '请输入国家', trigger: 'blur' }],
//          city:[{ required: true, message: '请输入城市', trigger: 'blur' }],
//          community:[{ required: true, message: '请输入社区', trigger: 'blur' }],
//          address:[{ required: true, message: '请输入地址', trigger: 'blur' }],
//          industry:[{ required: true, message: '请输入工厂', trigger: 'blur' }],
//          memo:[{ required: true, message: '请输入备忘录', trigger: 'blur' }],
        },
        userRegisterColumns:userRegisterColumns,
        listLoading: true,
        tableData: [],
        yxVisible:false,

        //log
        logVisible:false,
        curClientId:'',
      }
    },
    created() {
      this.getList();
      this.init();
    },
    computed:{
      isLog:function(){
        return   JSON.parse(unescape(getAccount())).account ==="system"
      }
    },
    methods: {
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
        CustomerList({}).then(res => {
          if(res.data===undefined||res.data===null){
            this.tableData = undefined;
          }else{
            this.tableData = res.data;
          }
        });
        this.listLoading = false;
      },
      handleSearch() {
        this.listLoading = true;
        if (this.filters.value === '') {
          CustomerList({}).then(res => {
            this.listLoading = false;
            if(res.data===null){
            }else{
              this.tableData = res.data;
            }
          });
        } else {
          CustomerList({
            customerName:this.filters.value
          }).then(res => {
//            console.log("filter res.data");
//            console.log(res.data);
            this.listLoading = false;
            if(res.data===null){
            }else{
              this.tableData = res.data;
            }
          });
        }
      },
      handleAdd() {
        this.formTitle = '新增';
        this.action = 'add';
        this.formVisible = true;
        this.formModel= resetObj(this.formModel);
//        this.formModel.cId =0;   不需要有cId吧
        this.formModel.Action =0;
      },
      handleEdit(r) {
        this.formModel = cloneObj(r);
        console.log("r");
        console.log(r);
        this.formTitle = "编辑";
        this.action = 'edit';
        this.formVisible = true;
        this.formModel.cId = r.cId;
//        console.log("this.formModel.cId");
//        console.log(this.formModel.cId);
        this.formModel.customerName=r.customerName;
        this.formModel.phone= r.phone;
        this.formModel.contactName = r.contactName;
        this.formModel.contactPhone = r.contactPhone;
        this.formModel.faceUrl= r.faceUrl;
//        var gender;
//        if(r.gender===1){
//           gender = '男';
//        }else if(r.gender===0){
//           gender =  '女';
//        }else{
//          gender= '无';
//        }
        this.formModel.gender = r.gender;
          this.formModel.fax= r.fax;
          this.formModel.qq= r.qq;
          this.formModel.eMail= r.eMail;
          this.formModel.country= r.country;
          this.formModel.city= r.city;
          this.formModel.community= r.community;
          this.formModel.address= r.address;
          this.formModel.industry= r.industry;
          this.formModel.memo= r.memo;
        this.formModel.Action =1;

      },
      handleDel(r) {
        console.log("r");
        console.log(r);
        this.$confirm("确认删除客户吗？", '提示', {
        }).then(() => {
          this.listLoading = true;
          NProgress.start();
          console.log("shc1");
          CustomerModify({
            Action: 2,
            cusId: r.cId,
            customerName:r.customerName
          }).then((res) => {
            console.log("shc2");
            this.listLoading = false;
            NProgress.done();
            if (res.result ===200) {
              console.log("res.result");
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              });
              this.getList();
            } else {
              this.$notify({
                title: '失败',
                message:res.message,
//                message: res.body.message,
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
        console.log("handleSubmitForm----params");
        console.log(params);
//        $refs指向所有ref  $refs.formRef就是<el-form :model="formModel" label-width="120px" :rules="formRules" ref="formRef"> formRef.validate时候指有效性
        this.$refs.formRef.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              NProgress.start();
              this.isSubmitting = true;
              this.submitBtnText = '提交中';
//              console.log("this.formModel.cId submit");
//              console.log(this.formModel.cId);
              if (this.action === 'add') {
                console.log("add");
                CustomerModify({...params,  session:this.session, account:this.account, Action:0 }).then((res) => {
                  this.isSubmitting = false;
                  NProgress.done();
                  this.submitBtnText = '提交';
                  if (res.result === 200) {
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
//                customerModify传入了 let params = cloneObj(this.formModel); 克隆的formModel
//               通过res结果判断给出怎样的提示，是成功的提示，然后重新显示List getList  还是失败的提示
                CustomerModify({...params, session:this.session, account:this.account, cusId:this.formModel.cId, cId:this.cId, Action:1}).then((res) => {
                  this.isSubmitting = false;
                  console.log("a1");
//                  进度条
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
                  console.log("a2");
                  //设置表单不可见
                  this.formVisible = false;
                });
              }
            })
          } else {
            console.log('error submit!!');
            return false;
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
            message: '客户没有注册',
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

