
<template>
  <div class="app-container">

    <div style="margin: 20px auto">
      <el-col :span="24" class="toolbar">
      <el-form :inline=true>

        <div style="width: 53%; float: left; margin-right:1%">
        <el-form-item>
        <el-tag type="success">机器人列表</el-tag>
        </el-form-item>
        </div>
        <div style="width: 46%; float: left">
        <el-form-item>
          <el-tag type="success">问答库列表</el-tag>
        </el-form-item>
        </div>

        <!--<div style="width: 52%; float: left; margin-right:1%">-->
        <!--<el-form-item>-->
          <!--<el-button :plain="true" @click="open">注意事项</el-button>-->
        <!--</el-form-item>-->
        <!--</div>-->
        <!--<div style="width: 47%; float: left">-->
        <!--<el-form-item>-->
          <!--<el-tooltip placement="bottom" >-->
            <!--<div slot="content">1.默认问题显示为该行颜色为灰色<br/>-->
              <!--2.点击该行，点击“提交”，即可以选中该行为默认问题<br/>-->
              <!--3.只有（复选框）被勾选的问题类别可以被设置为默认问题<br/>-->
              <!--4.当有勾选问题时，有且只有一个默认问题。-->
            <!--</div>-->
            <!--<el-button>右列表默认问题设置规则</el-button>-->
          <!--</el-tooltip>-->
        <!--</el-form-item>-->
        <!--</div>-->
      </el-form>

      </el-col>
      <!--左边图-->
      <div style="float: left; margin-right:1%; width: 50%">
        <el-table :data="tableData"  class="robot" @row-click="getQuestionsList"  highlight-current-row  >
          <el-table-column type="index" label="列号" width="70%" ></el-table-column>
          <template v-for="item in robotRegisterColumnsForQuestions">
            <el-table-column :prop="item.prop" :label="item.label"
                            :align="item.align"
                             :sortable="item.sortable" :formatter="item.formatter"

            >
            </el-table-column>
          </template>
        </el-table>
      </div>

      <!--右边图-->

      <div style="float: right;margin-right:1%; margin-left: 1%; width: 45%">
        <el-table
          ref="singleTable"
          :data="questionColumns"
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column>
            <template   scope="scope">
              <el-checkbox v-model="scope.row.checked"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="typeId" label="类型编号" ></el-table-column>
          <el-table-column prop="typrName" label="类别名" ></el-table-column>
        </el-table>

        <el-button  type="primary" @click="submitTable" style="margin-top: 3%; float:right; ">{{submitBtnText}}</el-button>


      </div>
    </div>

  </div>
</template>

<script>
  import NProgress from 'nprogress'
  import {
    robotRegisterColumnsForQuestions,
    QATypeListColumns
  } from '../../dictionary/columns'
  import {
    robotRegisterList,
    saveRegisterRobot,
    deleteRegisterRobot,
    SetRobotCurrentQA,
    GetRobotCurrentQA
  } from '@/api/robot'

  import Log from '../../components/runLog';
  import Cookies from 'js-cookie'
  import { getAccount } from '@/utils/auth'
  import { resetObj,cloneObj} from '@/utils/cover'
  import ElCheckboxGroup from "../../../node_modules/element-ui/packages/checkbox/src/checkbox-group.vue";
  import ElCheckbox from "../../../node_modules/element-ui/packages/checkbox/src/checkbox.vue";
  import ElRadio from "../../../node_modules/element-ui/packages/radio/src/radio.vue";
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";
  import ElForm from "../../../node_modules/element-ui/packages/form/src/form.vue";
  import ElDialog from "../../../node_modules/element-ui/packages/dialog/src/component.vue";
  import ElRadioGroup from "../../../node_modules/element-ui/packages/radio/src/radio-group.vue";

  export default {
    components: {
      ElRadioGroup,
      ElRadio,
      ElDialog,
      ElForm,
      ElButton,
      ElFormItem,
      ElCheckbox,
    },
    data() {

      return {
//        content:'只有一个问题为对应机器人的默认问题',
        isSubmitting: false,
        rowCustomId: '',
        rowDevId:'',
        lRow:{},
        rRow:{},
        obj:{},
        formVisible: false,
        submitBtnText: '提交',
        robotRegisterColumnsForQuestions: robotRegisterColumnsForQuestions,
        QATypeListColumns:QATypeListColumns,
        currentPage: 1,
        listLoading: true,
        tableData: [],
        questionColumns: [],
        checkArray:[],
      }
    },
    created() {
      this.getAllRobotList();
    },
    computed:{
      isLog:function(){
        return   JSON.parse(unescape(getAccount())).account ==="system"
      }
    },
    methods: {
      open() {
        this.$message({
          message: '请双击左列表，获取右列表数据',
          type: 'success',
          showClose: true,
        });
      },

      setCurrent(row) {
        this.$refs.singleTable.setCurrentRow(row);
      },

      getAllRobotList() {
        this.listLoading = true;
        robotRegisterList({}).then(res => {
          this.tableData = res.data;
          if (res.result===200){
            GetRobotCurrentQA({customerId:this.tableData[0].cId, deviceId: this.tableData[0].devId}).then(res =>{
              this.questionColumns = res.data.map((item) => {
                if (res.result === 200) {
                  item.checked = ((item.checked===0)?false : true);
                  return item;
                }
                NProgress.done();
              });
              this.questionColumns.map((item) => {
                if (item.checked === true) {
                  NProgress.start();
                  this.$refs.singleTable.setCurrentRow(item);
                  NProgress.done();
                }
              });
            });
          }
        });

        this.listLoading = false;
      },

      getQuestionsList(r) {
        this.lRow = r;
        this.listLoading = true;
        NProgress.start();
        GetRobotCurrentQA({customerId: r.cId, deviceId: r.devId}).then(res => {
//          console.log("res");
//          console.log(res);
          this.listLoading = false;
          this.rowCustomId = r.cId;
          this.rowDevId = r.devId;
//          遍历res.data.map  遍历,修改item.checked的值 返回item  res是从服务器取出来的,放到questionColumns里面
          this.questionColumns = res.data.map((item) => {
            if (res.result === 200) {
              item.checked = ((item.checked===0)?false : true);
              return item;
            }
            NProgress.done();
          });
          this.questionColumns.map((item) => {
            if (item.checked === true) {
              NProgress.start();
              this.$refs.singleTable.setCurrentRow(item);
              NProgress.done();
            }
//            if (item.firstRet === 1) {
//              NProgress.start();
//              this.$refs.singleTable.setCurrentRow(item);
//              console.log(2);
//              NProgress.done();
//            }
          });
        });
//        判断questionColumns里面是否有firstRet=1 如果等于1，就是默认选中问题。

      },

      getChange1() {
        this.check1 = !this.check1;
      },

      getChange2() {
        this.check2 = !this.check2;
      },

      submitTable() {
        let arr = [];
        let valId = this.rRow.id;
        for (let item in this.questionColumns) {
          if (this.questionColumns[item].checked === true) {
            this.obj.typeId = this.questionColumns[item].typeId;
//            valId是唯一的，因为this.rRow是唯一的。
            if (this.questionColumns[item].id === valId) {
              this.obj.firstRet = 1;
            }
            arr.push(this.obj);
//            因为obj是全局变量，所以需要清空。如果obj只是局部变量就会自动清空。
            this.obj = {};
          } else {
//           修改questionColumn并未上传服务器
//            this.questionColumns[item].firstRet=0;
          }
        }
//        var countC = 0;
//        var countF = 0;
//        if (arr.length>0){
//            countC++;
//        }
//        console.log("countC");
//        console.log(countC);
//          if (countC>0){
//            for (let j in arr){
//              if(arr[j].firstRet===1){
//                countF ++;
//              }
//            }
//            if(countF>0){
        let arr4SetRob = new Object();
        arr4SetRob.customerId = this.rowCustomId;
        arr4SetRob.deviceId = this.rowDevId;
        arr4SetRob.event = arr;
        //        修改了提交格式。
        var data = {};
        data.QatypeParam = JSON.stringify(arr4SetRob);
        data.type = 1;
        this.$confirm('确认提交吗？', '提示', {}).then(() => {
          NProgress.start();
          this.isSubmitting = true;
          this.submitBtnText = '提交中';
          SetRobotCurrentQA(data).then((res) => {
            this.isSubmitting = false;
            NProgress.done();
            this.submitBtnText = '提交';
            if (res.result === 200) {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success'
              });
              this.getQuestionsList(this.lRow);
            } else {
              this.$notify({
                title: '失败',
                message: res.message,
                type: 'error'
              });
            }
            this.qFormVisible = false;
          });
        });

//            }
//            else{
//              alert("需要设置默认问题");
//            }
        arr = [];
      },

//            拿到被单击的行
      handleCurrentChange(val) {
        this.rRow = val;
      },

// 提交过程


//      checkFirstRet(){
//        console.log("this.questionColumns");
//        console.log(this.questionColumns);
//        for (item in this.questionColumns){
//          if(this.questionColumns[item].firstRet===1){
//
//          }else{
//            alert("必须设置默认问题");
//          }
//        }
//      },

//      reset(){
//        this.$refs.formRef.resetFields();
//      },


    },



  }

</script>

<style>
  .el-checkbox{
    float:left;
  }
</style>

