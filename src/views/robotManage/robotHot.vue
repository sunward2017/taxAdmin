<template>
  <div class="app-container">
    <el-col :span="24" class="toolbar">
      <el-form :inline=true :model="filters">
        <el-form-item>
          <el-input v-model="filters.value" placeholder="请输入机器人ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="handleSearch">查询</el-button>
        </el-form-item>
        <!--<el-form-item>-->
          <!--<el-button type="primary" icon="plus" @click="handleAdd">新增</el-button>-->
        <!--</el-form-item>-->
      </el-form>
    </el-col>

    <template>

<template v-if="!(tableData ==undefined)||tableData==[]">
      <el-table :data="tableData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)" class="robot1" highlight-current-row @current-change="getCurrentRobot" v-loading="listLoading"
                  ref="singleTable1">
        <el-table-column type="index" label="列号" width="70px"></el-table-column>
        <template v-for="item in robotHotVideoColumns">
          <el-table-column :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="item.formatter">
          </el-table-column>
        </template>
      </el-table>
</template>

      <template  v-if="(tableData ==undefined)">
        <el-table :data="tableData" class="robot2" highlight-current-row @current-change="getCurrentRobot" v-loading="listLoading"
                  ref="singleTable1">
          <el-table-column type="index" label="列号" width="70px"></el-table-column>
          <template v-for="item in robotHotVideoColumns">
            <el-table-column :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="item.formatter">
            </el-table-column>
          </template>
        </el-table>
      </template>

<!--分页-->
      <template v-if="!(tableData ==undefined)">
      <div class="pagination1">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-size="pageSize"
          small
          layout="total, prev, pager, next"
          :total="tableData.length"
        >
        </el-pagination>
      </div>
      </template>

    <!--提交 取消按钮-->

      <el-col :span="24" class="button">
        <el-form :inline=true >
          <div class="button_div1">
          <el-form-item class="button_form_item1">
            <el-button type="primary"  @click="handleRobotHotList" :loading="isSubmitting">{{submitBtnText}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  @click="setCurrent()">取消</el-button>
          </el-form-item>
          <el-form-item>
            <el-tooltip >
              <div slot="content">添加机器人对应热点方法：<br/>
                1.点击上面机器人列表<br/>
                2.点击左下热点问题列表<br/>
                3.点击提交按钮<br/>
                4.机器人对应热点添加到右下表<br/>
                5.右下表显示机器人对应热点
              </div>
              <el-button>添加机器人对应热点方法</el-button>
            </el-tooltip>
          </el-form-item>
          </div>
          <div class="button_form_item2">
          <el-form-item >
            <el-button type="primary" icon="minus" @click="deleteRobotHot" :loading="isDeleting">{{deleteText}}</el-button>
          </el-form-item>
          </div>
        </el-form>
      </el-col>

<!--提交 取消-->

<!--热点大类列表-->
<template v-if="!(hotList===undefined)">
      <div class="hotList1">
        <el-table :data="hotList.slice((currentPageL-1)*pageSizeL,currentPageL*pageSizeL)"   highlight-current-row  @row-click="getCurrentHotList" ref="singleTable2">
          <template v-for="item in hotBigListForColumns">
            <el-table-column :prop="item.prop" :label="item.label"
                             :width=item.width :align="item.align"
                             :sortable="item.sortable" :formatter="item.formatter"
            >
            </el-table-column>
          </template>
        </el-table>
      </div>
</template>

      <template v-if="(hotList===undefined)">
        <div class="hotList2">
          <el-table :data="hotList"   highlight-current-row  @row-click="getCurrentHotList" ref="singleTable2">
            <template v-for="item in hotBigListForColumns">
              <el-table-column :prop="item.prop" :label="item.label"
                               :width=item.width :align="item.align"
                               :sortable="item.sortable" :formatter="item.formatter"
              >
              </el-table-column>
            </template>
          </el-table>
        </div>
      </template>
      <!--机器人对应热点大类列表 -->
      <template v-if="!(robotHotList===undefined)">
        <div style="float: right; width: 50%; height: 25%">
          <el-table :data="robotHotList.slice((currentPageR-1)*pageSizeR,currentPageR*pageSizeR)" highlight-current-row @row-click="getCurrentRobotHotList"  ref="singleTable3">
            <template v-for="item in hotBigListColumns">
              <el-table-column :prop="item.prop" :label="item.label"
                               :width=item.width :align="item.align"
                               :sortable="item.sortable" :formatter="item.formatter"
              >
              </el-table-column>
            </template>
          </el-table>
        </div>
      </template>
      <template v-if="(robotHotList===undefined)">
        <div style="float: right; width: 50%; height: 25%">
          <el-table :data="robotHotList"  @row-click="getCurrentRobotHotList" highlight-current-row  ref="singleTable3">
            <template v-for="item in hotBigListColumns">
              <el-table-column :prop="item.prop" :label="item.label"
                               :width=item.width :align="item.align"
                               :sortable="item.sortable" :formatter="item.formatter"
              >
              </el-table-column>
            </template>
          </el-table>
        </div>
      </template>

    </template>

    <!--热点大类列表  分页-->
    <template v-if="!(hotList===undefined)">
    <div style="float:left;">
      <el-pagination
        @current-change="handleCurrentChangeL"
        @size-change="handleSizeChangeL"
        :current-page="currentPageL"
        :page-size="pageSizeL"
        small
        layout="total, prev, pager, next"
        :total="hotList.length">
      </el-pagination>
    </div>
    </template>
    <!--机器人热点大类列表 分页 -->
    <template v-if="!(robotHotList===undefined)">
    <div style="float: right; ">
      <el-pagination
        @current-change="handleCurrentChangeR"
        @size-change="handleSizeChangeR"
        :current-page="currentPageR"
        :page-size="pageSizeR"
        small
        layout="total, prev, pager, next"
        :total="robotHotList.length">
      </el-pagination>
    </div>
    </template>

  </div>
</template>
<script>
  import  {getList} from '../../api/table';
  import NProgress from 'nprogress'
//  import Grid4robotHot from '../../components/Grid/Grid4robotHot'
  import {
    hotBigListForColumns,
    hotBigListColumns,
    robotHotVideoColumns
  } from '../../dictionary/columns'
  import {
    robotRegisterList,
    saveRegisterRobot,
    deleteRegisterRobot,
    GetRobotBg,
    GetHotBigType
  } from '@/api/robot'

  import Log from '../../components/runLog';
  import Cookies from 'js-cookie'
  import { getAccount,getToken } from '@/utils/auth'
  import { resetObj,cloneObj} from '@/utils/cover'
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";
  import {SetRobotBigType, GetRobotBigType} from '@/api/robot'

  export default {
    components: {
      ElFormItem,
//      Grid4robotHot,
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
        devId:'',
        bigTypeId:0,
        dBigTypeId:0,
        dId:0,
        hotList:[],
        robotHotList:[],
        rows:[],
        cId:0,
        session:'',
        account:'',
        //        当前页
        currentPage: 1,
//        当前页内显示条数
        pageSize:3,
        currentPageL: 1,
        pageSizeL:3,
        currentPageR: 1,
        pageSizeR:3,
        customerId:[],
        filters: {
          value: ''
        },
        formTitle: '',
        formVisible: false,
        background:[],

        isSubmitting: false,
        submitBtnText: '提交',
        isDeleting:false,
        deleteText:'删除热点',

        robotHotVideoColumns: robotHotVideoColumns,
        hotBigListColumns: hotBigListColumns,
        hotBigListForColumns:hotBigListForColumns,
        listLoading: false,
        a:[],
        tableData: [],
        yxVisible:false,

        //log
        logVisible:false,
        curRobotId:'',
      }
    },
    created() {
      this.init();
      this.getRobotList();
//      this.getBg();
      this.getHotList();
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
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
      },
      handleSizeChangeL(pageSize){
        this.pageSizeL = pageSize;
      },
      handleCurrentChangeL(currentPage){
        this.currentPageL  = currentPage;
      },
      handleSizeChangeR(pageSize){
        this.pageSizeR = pageSize;
      },
      handleCurrentChangeR(currentPage){
        this.currentPageR  = currentPage;
      },

      setCurrent(row) {
        this.$refs.singleTable1.setCurrentRow(row);
        this.$refs.singleTable2.setCurrentRow(row);
        this.$refs.singleTable3.setCurrentRow(row);
        this.bigTypeId = 0;
        this.devId = '';

//        console.log(this.bigTypeId);
//        console.log(this.devId);
      },

      getCurrentRobot(r){
        console.log("getCurrentRobot");
        console.log(r);
        if(r===null||r===undefined){}else{
          this.devId = r.devId;
          GetRobotBigType({devId:this.devId, session: this.session}).then(res=> {
            if(res.data===undefined||res.data===null){
              this.robotHotList = undefined;
            }else{
              this.robotHotList = res.data;
            }
          });
        }
      },
      getCurrentHotList(r){
        console.log("getCurrentHotList");
        console.log(r);
        if(r===undefined||r===null){}else{
          this.bigTypeId  = r.id;
        }

      },
      handleRobotHotList() {
//        验证数据是否为空，如果为空，就不提交
        if ((this.bigTypeId === null || this.bigTypeId === 0) || (this.devId === null || this.devId === '')) {
          alert("请先选择机器人和视频，再点击提交");
        } else {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            NProgress.start();
            this.isSubmitting = true;
            this.submitBtnText = '提交中';
            SetRobotBigType({
              bigTypeId: this.bigTypeId,
              devId: this.devId,
              Action: 0,
              session: this.session
            }).then(res => {
              console.log("handleRobotHotList-SetRobotBigType");
              console.log(res);
              this.isSubmitting = false;
              NProgress.done();
              this.submitBtnText = '提交';
              if (res.result === 200) {
                this.$notify({
                  title: '成功',
                  message: '新增成功',
                  type: 'success'
                });
                this.getRobotBigType();
              } else {
                this.$notify({
                  title: '失败',
                  message: res.message,
                  type: 'error'
                });
              }
            });
          });
        }
      },
      getRobotBigType(){
        GetRobotBigType({devId:this.devId, session: this.session}).then(res=> {
          console.log("GetRobotBigType");
          console.log(res);
          this.robotHotList = res.data;
        });
      },
      getCurrentRobotHotList(r){
        console.log("getCurrentRobotHotList");
        console.log(r);
        this.dId = r.id;
        this.dBigTypeId = r.bigTypeId;
      },
      deleteRobotHot(){
        if((this.dId===null ||this.dId ===0)||(this.dBigTypeId===null || this.dBigTypeId ===0|| this.dBigTypeId ===undefined)||(this.devId===null ||this.devId ===undefined||this.devId ==='')){
          alert("请先选择机器人对应的问题，再点击删除！");
        }else{
          this.$confirm('确认删除吗？', '删除', {}).then(() => {
            NProgress.start();
            this.isDeleting = true;
            this.deleteText = '删除中';
            SetRobotBigType({id:this.dId, bigTypeId:this.dBigTypeId, devId:this.devId, Action:2, session: this.session}).then(res=> {
              console.log("deleteRobotHot");
              console.log(res);
              this.isDeleting = false;
              NProgress.done();
              this.deleteText = '删除问题';
              if (res.result === 200) {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success'
                });
                this.getRobotBigType();
              } else {
                this.$notify({
                  title: '失败',
                  message: res.message,
                  type: 'error'
                });
              }
            });

          });
        }

      },
      handleClear(){
//        console.log("dangqianhang");
//        console.log(row);
        this.bigTypeId = 0;
        this.devId = '';
        console.log(this.bigTypeId);
        console.log(this.devId);
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
      getHotList(){
        GetHotBigType({cId : this.cId , session : this.session}).then(res=>{
          let a = [];
          if(res.data===null){
            this.hotList =res.data;
          }else{
            a = res.data;
            this.hotList = a;
          }
        });

      },
      getRobotList() {
        robotRegisterList({}).then(res => {
          if(res.data===undefined||res.data===null){
            this.tableData = undefined;
          }else{
//            this.listLoading = true;
            this.tableData = res.data;
            this.customerId =this.tableData.map(item=>{
              return item.cId;
            });
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
            if(res.result===200){
              this.tableData = res.data;
            }else{
              this.tableData = [];
            }
          });
          this.listLoading = false;
        }

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
  .robot1{
    width: 100%
  }
  .robot2{
    width: 100%
  }
  .pagination1{
    float: right;
    width: 100%
  }
  .button{
    margin-top: 30px
  }
  .button_div1{
    width: 50%;
    float: left
  }
  .button_form_item1{
    float: left
  }
  .button_form_item2{
    width: 50%;
    float: left
  }
  .hotList1{
    float: left;
    width: 45% ;
    height: 25%
  }
  .hotList2{
    float: left;
    width: 45% ;
    height: 25%
  }
</style>

