 <template>
  <div class="app-container">

    <el-col :span="24" class="toolbar">
      <el-form :inline="true">
        <div style="width: 50%; float: left">
          <el-form-item  style="float: left">
          <el-button type="primary" icon="plus" @click="handleAddL">新增热点大类</el-button>
        </el-form-item>
        </div>
      <div style="width: 50%; float: left">
        <el-form-item style="float: left">
          <el-button type="primary" icon="plus" @click="handleAddR" >新增热点小类</el-button>
        </el-form-item>
      </div>
      <!--<el-form-item  style="float: left">-->
        <!--<el-button type="primary" icon="plus" @click="handleAddL">新增热点大类</el-button>-->
      <!--</el-form-item>-->
        <!--<el-form-item style="float: right">-->
          <!--<el-button type="primary" icon="plus" @click="handleAddR" >新增热点小类</el-button>-->
      <!--</el-form-item>-->
    </el-form>
    </el-col>


    <template >
      <div class="fix" >
        <!--左边图-->
        <div style="float: left; margin-right:4%; width: 46% ">
          <el-table :data="tableData"  class="robot" @row-click="getHotMiddleType" highlight-current-row>
            <el-table-column type="index" label="列号" width="100"></el-table-column>
            <template v-for="item in hotBigListColumns">
              <el-table-column :prop="item.prop" :label="item.label"
                               width="130%" :align="item.align"
                               :sortable="item.sortable" :formatter="item.formatter"
              >
              </el-table-column>
            </template>
            <el-table-column  style="width: 450px" inline-template :context="_self" label="操作"  align='center'>
				<span>

					<el-button  size="small" icon="edit" @click="handleEditL(row)">编辑</el-button>
					<el-button   type="danger" icon="delete" size="small" @click="handleDelL(row)">删除</el-button>
        </span>
            </el-table-column>
          </el-table>
        </div>


        <!--右边图-->
        <div style="float: left; width: 50% ">
          <el-table :data="rightTable"  class="robot" >
            <el-table-column type="index" label="列号" width="100"></el-table-column>
             <template v-for="item in hotMiddleListColumns">
              <el-table-column :prop="item.prop" :label="item.label"
                               width="150%" :align="item.align"
                               :sortable="item.sortable" :formatter="item.formatter"
              >
              </el-table-column>
            </template>
            <el-table-column style="width: 450px" inline-template :context="_self" label="操作" align='center'>
				<span>
					<el-button  size="small" icon="edit" @click="handleEditR(row)">编辑</el-button>
					<el-button   type="danger" icon="delete" size="small" @click="handleDelR(row)">删除</el-button>
        </span>
            </el-table-column>
          </el-table>
        </div>

      </div>

    </template>

<!--HotBigType左边图添加、编辑表单-->
    <el-dialog :title="formTitle" :visible.sync="formVisible" size="tiny">
      <el-form :model="formModel" label-width="90px" :rules="formRulesL" ref="formRef">
        <!--<template v-if="this.action==='edit'">-->
        <!--<el-form-item label="ID" prop="id">-->
        <!--<el-input v-model="formModel.id" placeholder="请输入内容" style="width: 300px"></el-input>-->
        <!--</el-form-item>-->
        <!--</template>-->
        <el-form-item label="热点大类" prop="bigType">
             <el-input v-model="formModel.bigType" style="width: 300px"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitForm" :loading="isSubmitting">{{submitBtnText}}</el-button>
      </div>
    </el-dialog>

    <!--右边图新增，编辑表单-->
    <el-dialog :title="formTitleR" :visible.sync="formVisibleR" size="tiny">
      <el-form :model="formModelR" label-width="100px"  ref="formRefR" :rules="formRulesR">
        <!--<template v-if="this.actionR==='add'">-->
          <!--<el-form-item label="热点大类ID" prop="pid">-->
            <!--<el-input v-model="formModelR.pid" style="width: 300px"></el-input>-->
          <!--</el-form-item>-->
        <!--</template>-->
        <!--<template v-if="this.actionR==='edit'">-->
          <!--<el-form-item label="热点小类ID" prop="id">-->
            <!--<el-input v-model="formModelR.id" style="width: 300px"></el-input>-->
          <!--</el-form-item>-->
        <!--</template>-->
        <el-form-item label="热点小类" prop="taxType">
        <el-input v-model="formModelR.taxType" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisibleR = false">取 消</el-button>
        <el-button type="primary" @click="sumbitRForm" :loading="isSubmitting">{{submitBtnText}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import NProgress from 'nprogress'
  import Grid from '../../components/Grid/Grid'
  import {
    hotBigListColumns,
    robotRegisterColumnsForQuestions,
    hotMiddleListColumns
  } from '../../dictionary/columns'
  import {
    robotRegisterList,
    GetRobotCurrentQA,
    GetHotBigType,
    ModifyHotBigType
  } from  '../../api/robot';
  import {login} from '../../api/login';
  import { getList, saveSubmit} from '../../api/table';
  import { resetObj,cloneObj} from '@/utils/cover';
  import { getAccount,getToken } from '@/utils/auth';
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";

  export default {
    components: {
      ElFormItem,
      Grid
    },
    data() {
      var checkId =(rule,str, callback) => {
        console.log("str");
        console.log(str);
        let reg = /^[0-9]*$/;
        let v  = str.toString();
        let value = v.replace(/^\s*$/g,'');
        if(value===''){
          return callback(new Error('id不能为空'));
        }else if(!reg.test(value)) {
          return callback(new Error('id不正确，id应该为数字'));
        }else{
          callback();
        }
      };
      var checkPid=(rule,str, callback) => {
        let reg = /^[0-9]*$/;
        let value = str.replace(/^\s*$/g,'');
        if(value===''){
          return callback(new Error('pid不能为空'));
        }else if(!reg.test(value)) {
          return callback(new Error('pid不正确，pid应该为数字'));
        }else{
          callback();
        }
      };

      return {
        pid:null,
        cId:0,
        tsession:'',
        account:'',
        rowCustomId: '',
        rowDevId:'',
        lRow:{},
        rRow:{},
//        tableData1: [],
        questionColumns: [],
        robotRegisterColumnsForQuestions: robotRegisterColumnsForQuestions,
        hotMiddleListColumns:hotMiddleListColumns,
        rightTable:[],
        input: '',
        filters: {
          value: '1'
        },
        formTitle: '',
        formVisible: false,
        formTitleR:'',
        formVisibleR:false,
        formModel: {
           id:null,
          bigType:'',
        },
        formModelR: {
          id:null,
          pid:null,
          taxType:'',
          cId:''
        },
        isSubmitting: false,
        submitBtnText: '保存',
        action: '',
        actionR:'',
        formRulesL: {
          id: [{ required: true,validator:checkId,trigger: 'blur' }],
          bigType: [{ required: true, message: '请输入热点大类', trigger: 'blur' }]
        },
        formRulesR:{
          pid: [{ required: true,validator:checkPid,trigger: 'blur' }],
          id: [{ required: true,validator:checkId, trigger: 'blur' }],
          taxType: [{ required: true, message: '请输入税务类型', trigger: 'blur' }],
        },
        hotBigListColumns: hotBigListColumns,
        currentPage: 1,
        listLoading: true,
        tableData: []
      }
    },
    created() {
      this.getTableData();
      this.init();
    },
    methods: {
//      功能实现
      filterType(item){
        let pid = this.filters.value;
        if(pid){
          if(item.pid==pid){
            return item;
          }
        }else{
           return item;
        }

      },
      init(){
        this.listLoading = true;
        this.account = getAccount();
        this.tsession = getToken();
        var arrCookie =this.account.split("%");
        for(let i =0;i<arrCookie.length;i++){
          var arr =arrCookie[i];
          if(arrCookie[i]==="22cId"){
            let cid = arrCookie[i+3].split("22");
            this.cId = cid[1];
          }
        }
      },
      getTableData(){
        GetHotBigType({cId : this.cId , session : this.tsession}).then(res=>{
          console.log("res.data");
          console.log(res.data);
            this.tableData = res.data.map((item)=>{
              return item;
            });
          });
        },
      handleAddL() {
        this.formTitle = '新增';
        this.action = 'add';
        this.formModel.bigType ='';
        this.formModel.id =0;
        this.formVisible = true;
      },
      handleEditL(r) {
        this.formTitle = "编辑";
        this.action = 'edit';
        this.formVisible = true;
        this.formModel = cloneObj(r);
        this.formModel.bigType = this.formModel.bigType.toString();
      },
      handleDelL(r) {
        console.log(r);
        this.$confirm("确认删除类别“" + r.bigType + "”吗？", '提示', {

        }).then(() => {
          this.listLoading = true;
          NProgress.start();
          console.log(1);
          ModifyHotBigType({id:r.id,
            Action: 2,
          }).then((res) => {
            console.log(2);
            this.listLoading = false;
            NProgress.done();
            if (res.result === 200) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              });
              this.getTableData();
            } else {
              this.$notify({
                title: '成功',
                message: res.body.message,
                type: 'error'
              });
            }
            console.log(3);
            this.formVisible = false;
          });
        }).catch(() => {

        });
      },
      handleAddR(){
        if(this.pid===null){
          alert("请先在左边列表选择一个热点大类");
        }else{
//          console.log("新增");
//          console.log(this.pid);
          this.formTitleR = '新增';
          this.formModelR.taxType='';
          this.formModelR.id = 0;
          this.actionR = 'add';
          this.formVisibleR = true;
        }
//       ......还有什么属性需要初始化
      },
      handleEditR(r){
        this.formTitleR= '编辑';
        this.actionR = 'edit';
        this.formVisibleR = true;
        this.formModelR = cloneObj(r);
//        还有什么属性
      },
      handleDelR(r){
        console.log(r);
        this.$confirm("确认删除类别“" + r.taxType + "”吗？", '提示', {

        }).then(() => {
          this.listLoading = true;
          NProgress.start();
          saveSubmit("/admin/HotBigDelete.action",{
            Action: 2,
            id: r.id
          }).then((res) => {
            this.listLoading = false;
            NProgress.done();
            if (res.result === 200) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              });
              this.refreshHotMiddile(r.pid);
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
      handleSubmitForm(r) {
//        Object.assign方法用于对象的合并
        this.tsession = getToken();
//        console.log("获取session");
//        console.log(this.tsession);
        console.log("r");
        console.log(r);
        let params = Object.assign(this.formModel);
        this.$refs.formRef.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              NProgress.start();
              this.isSubmitting = true;
              this.submitBtnText = '提交中';
              if (this.action === 'add') {
//                console.log(this.formModel.bigType);
//                console.log(this.tsession);
//                console.log(this.cId);
                ModifyHotBigType({bigType:this.formModel.bigType, cId:this.cId, session:this.tsession,
                  Action:0,
              }).then((res) => {
                  this.isSubmitting = false;
                  NProgress.done();
                  this.submitBtnText = '提交';
                  if (res.result === 200) {
                    this.$notify({
                      title: '成功',
                      message: '新增成功',
                      type: 'success'
                    });
//                    更新hotlist
                    this.getTableData();
                  } else {
                    this.$notify({
                      title: '失败',
                      message: res.message,
                      type: 'error'
                    });
                  }
//                  设置dialog的可视性
                  this.formVisible = false;
                });
              }
//              编辑
              else {
                ModifyHotBigType({bigType:this.formModel.bigType, cId:this.cId,id:this.formModel.id, session: this.tsession ,account:this.account,
                  Action: 1,
                }).then((res) => {
                  this.isSubmitting = false;
                  NProgress.done();
                  this.submitBtnText = '提交';
                  if (res.result == '200') {
                    this.$notify({
                      title: '成功',
                      message: '编辑成功',
                      type: 'success'
                    });

                    this.getTableData();
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
      sumbitRForm(r){
        this.$refs.formRefR.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              NProgress.start();
              this.isSubmitting = true;
              this.submitBtnText = '提交中';
              if (this.actionR === 'add') {
                  saveSubmit("/admin/HotBigModify.action?",{ cId:this.cId, session:this.tsession, taxType:this.formModelR.taxType, account:this.account, pid:this.pid,
                    Action: 0,
                  }).then((res) => {
                    this.isSubmitting = false;
                    NProgress.done();
                    this.submitBtnText = '提交';
                    if (res.result === 200) {
                      this.$notify({
                        title: '成功',
                        message: '新增成功',
                        type: 'success'
                      });
                      this.refreshHotMiddile(this.pid);
                    } else {
                      this.$notify({
                        title: '失败',
                        message: res.message,
                        type: 'error'
                      });
                    }
                    this.formVisibleR = false;
                  });
                }

                 else {
                saveSubmit("/admin/HotBigModify.action?",{taxType:this.formModelR.taxType, account:this.account, session:this.tsession, cId:this.cId, id:this.formModelR.id,
                  Action: 1,
                }).then((res) => {
                  this.isSubmitting = false;
                  NProgress.done();
                  this.submitBtnText = '提交';
                  if (res.result === 200) {
                    this.$notify({
                      title: '成功',
                      message: '编辑成功',
                      type: 'success'
                    });

                    this.refreshHotMiddile(this.pid);
                  } else {
                    this.$notify({
                      title: '失败',
                      message: res.message,
                      type: 'error'
                    });
                  }
                  this.formVisibleR = false;
                });
              }
            })
          } else {

          }
        });
      },
      refreshHotMiddile(rpid){
        this.listLoading = true;
        getList("/admin/HotBigList.action",{pid:rpid}).then(res => {
          this.listLoading = false;
          console.log("问题小类");
          console.log(res.data);
          this.rightTable = res.data;
        });
      },
      getHotMiddleType(r){
        this.listLoading = true;
//        console.log("r.id");
//        console.log(r.id);
//        把左边列表的pid放进
        this.pid = r.id;
        getList("/admin/HotBigList.action",{pid:r.id}).then(res => {
          this.listLoading = false;
          this.rightTable = res.data;
          console.log("问题小类");
          console.log(res.data);
        });
      },

    },
  }

</script>

 <style>
   /*清除浮动*/
   .fix::after {
     content:".";
     display:block;
     height:0;
     visibility:hidden;
     clear:both;
   }
   .fix{
     zoom:1
   }
   /*清除浮动*/
 </style>

