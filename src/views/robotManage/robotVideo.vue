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

    <!--机器人-->
  <template>
    <template v-if="!(this.tableData==undefined||this.tableData==[])">
      <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" class="robotTable1" highlight-current-row  @row-click="getCurrentRobot" v-loading="listLoading"
                ref="singleTable1">
        <el-table-column type="index" label="列号" width="70px"></el-table-column>
        <template v-for="item in robotHotVideoColumns">
          <el-table-column :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="item.formatter">
          </el-table-column>
        </template>
      </el-table>
    </template>

      <template v-if="(this.tableData==undefined)">
        <el-table :data="tableData" class="robotTable2" highlight-current-row  @row-click="getCurrentRobot" v-loading="listLoading"
                  ref="singleTable1">
          <el-table-column type="index" label="列号" width="70px"></el-table-column>
          <template v-for="item in robotHotVideoColumns">
            <el-table-column :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="item.formatter">
            </el-table-column>
          </template>
        </el-table>
      </template>

<!--分页-->
    <template v-if="!(this.tableData==undefined||this.tableData==[])">
      <div class="pagination1">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          small
          layout="total, prev, pager, next"
          :total="tableData.length">
        </el-pagination>
      </div>
    </template>
<!--提交-->

      <el-col :span="24" class="buttons">
        <el-form :inline=true >
          <div class="buttons_div1">
          <el-form-item >
            <el-button type="primary"  @click="handleRobotVideo" :loading="isSubmitting">{{submitBtnText}}</el-button>
          </el-form-item>
          <el-form-item >
            <el-button type="primary"  @click="resetRows()">取消</el-button>
          </el-form-item>
          <el-form-item>
          <el-tooltip >
            <div slot="content">添加机器人对应视频方法：<br/>
              1.点击上面机器人列表<br/>
              2.点击左下视频列表<br/>
              3.点击提交按钮<br/>
              4.机器人对应视频添加到右下表<br/>
              5.右下表显示机器人对应视频
            </div>
            <el-button >添加机器人对应视频方法</el-button>
          </el-tooltip>
          </el-form-item>
          </div>
          <div class="buttons_div2">
          <el-form-item >
            <el-button type="primary" icon="minus" @click="deleteRobotVideo" :loading="isDeleting">{{deleteText}}</el-button>
          </el-form-item>
          </div>
        </el-form>
      </el-col>


  <!--视频列表-->
    <template v-if="this.video===undefined">
      <el-table
        class="videoTable1"
        ref="singleTable2"
        :data="video"
        highlight-current-row
        @row-click="getCurrentVideo"
      >
        <el-table-column
          type="index"
          width="115%"
          label="列号">
        </el-table-column>
        <el-table-column
          property="account"
          label="用户名"
          width="250%"
          >
        </el-table-column>
        <el-table-column
          property="content"
          label="视频描述"
          width="360%"
          >
        </el-table-column>
      </el-table>
    </template>

    <template v-if="!(this.video===undefined)">
      <el-table
        class="videoTable2"
        ref="singleTable2"
        :data="video.slice((currentPageL-1)*pageSizeL,currentPageL*pageSizeL)"
        highlight-current-row
        @row-click="getCurrentVideo"
      >
        <el-table-column
          type="index"
          width="115%"
          label="列号">
        </el-table-column>
        <el-table-column
          property="account"
          label="用户名"
          width="250%"
          >
        </el-table-column>
        <el-table-column
          property="content"
          label="视频描述"
          width="360%"
          >
        </el-table-column>
      </el-table>
    </template>


<!--机器人对应视频列表-->
    <template v-if="this.videoRobot===undefined">
      <el-table
        highlight-current-row
        :data="videoRobot"
        ref="singleTable3"
        @row-click="getCurrentRobotVideo"
        highlight-current-row
        class="videoRobot1"
        >
        <el-table-column
          type="index"
          width="120%"
          label="列号">
        </el-table-column>
        <el-table-column
          property="id"
          label="ID"
          width="290%">
        </el-table-column>
        <el-table-column
          property="content"
          label="视频描述"
          >
        </el-table-column>
      </el-table>
    </template>
    <template v-if="!(this.videoRobot===undefined)">
      <el-table
        ref="singleTable3"
        highlight-current-row
        :data="videoRobot.slice((currentPageR-1)*pageSizeR,currentPageR*pageSizeR)"
        @row-click="getCurrentRobotVideo"
        class="videoRobot2"
        >
        <el-table-column
          type="index"
          width="120%"
          label="列号">
        </el-table-column>
        <el-table-column
          property="id"
          label="ID"
          width="290%">
        </el-table-column>
        <el-table-column
          property="content"
          label="视频描述"
        >
        </el-table-column>
      </el-table>
      <!--右分页-->
      <div class="pagination2">
        <el-pagination
          @current-change="handleCurrentChangeR"
          @size-change="handleSizeChangeR"
          :current-page="currentPageR"
          :page-size="pageSizeR"
          small
          layout="total, prev, pager, next"
          :total="videoRobot.length">
        </el-pagination>
      </div>
    </template>
    <!--左分页-->
<template v-if="!(video===undefined)">
  <div class="pagination3">
    <el-pagination
      @current-change="handleCurrentChangeL"
      @size-change="handleSizeChangeL"
      :current-page="currentPageL"
      :page-size="pageSizeL"
      small
      layout="total, prev, pager, next"
      :total="video.length">
    </el-pagination>
  </div>
</template>

    </template>




  </div>
</template>
<script>
  import  {getList} from '../../api/table';
  import NProgress from 'nprogress'
  import {
    robotHotVideoColumns
  } from '../../dictionary/columns'
  import {
    robotRegisterList,
    saveRegisterRobot,
    deleteRegisterRobot,
    GetRobotBg,
    SetRobotVideoInfo,
    GetRobotVideoList
  } from '@/api/robot'

  import Log from '../../components/runLog';
  import Cookies from 'js-cookie'
  import { getAccount,getToken } from '@/utils/auth'
  import { resetObj,cloneObj} from '@/utils/cover'
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";

  export default {
    components: {
      ElFormItem,

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
        a : [],
        //        当前页
        currentPage1: 1,
//        当前页内显示条数
        robotVideoId:0,
        pageSize1:10,
        videoId:0,
        devId:'',
        video:[],
        tableData: [],
        videoRobot:[],
        rows:[],
        cId:0,
        session:'',
        account:'',
        //        当前页
        currentPage: 1,
//        当前页内显示条数
        pageSize:3,
        currentPageR: 1,
//        当前页内显示条数
        pageSizeR:3,
        currentPageL: 1,
        pageSizeL:3,
        customerId:[],
        filters: {
          value: ''
        },
        formTitle: '',
        formVisible: false,
        background:[],

        isSubmitting: false,
        submitBtnText: '提交',
        deleteText:'删除视频',
        isDeleting:false,

        robotHotVideoColumns: robotHotVideoColumns,

        listLoading: false,
        yxVisible:false,

        //log
        logVisible:false,
        curRobotId:'',
      }
    },
    created() {
      this.init();
      this.getRobotList();
      this.getBg();
      this.getVideo();
    },

    computed:{
      isLog:function(){
        return   JSON.parse(unescape(getAccount())).account ==="system"
      }
    },
    methods: {
//      每页显示条数发生改变
      handleSizeChange(pageSize){
//        console.log("pageSize");
//        console.log(pageSize);
        this.pageSize = pageSize;
      },
//      当前页发生改变
      handleCurrentChange(currentPage){
        console.log("currentPage");
        console.log(currentPage);
        this.currentPage  = currentPage;
      },
      handleSizeChangeR(pageSize) {
//        console.log("pageSize");
//        console.log(pageSize);
        this.pageSizeR = pageSize;
      },
      handleCurrentChangeR(currentPage){
        console.log("currentPage");
        console.log(currentPage);
        this.currentPageR  = currentPage;
      },
      handleSizeChangeL(pageSize){
        this.pageSizeL = pageSize;
      },
      handleCurrentChangeL(currentPage){
        this.currentPageL  = currentPage;
      },
      resetRows(row) {
        console.log("resetRows");
        this.$refs.singleTable1.setCurrentRow(row);
        this.$refs.singleTable2.setCurrentRow(row);
        this.$refs.singleTable3.setCurrentRow(row);
        this.videoId = 0;
        this.devId = '';
        this.robotVideoId = 0;
//        console.log(this.videoId);
//        console.log(this.devId);
//        console.log(this.robotVideoId);
      },
      getCurrentVideo(r){
        console.log("getCurrentVideo");
        if(r===null||r===undefined){}else {
          this.videoId = r.videoId;
        }
      },
      getCurrentRobot(r){
        console.log("getCurrentRobot");
        if(r===null||r===undefined){}else {
          this.devId = r.devId;
          this.getRobotVideoList();
        }
      },
      handleRobotVideo(){
        console.log("handleRobotVideo");
//        验证数据是否为空，如果为空，就不提交
        if((this.videoId===null || this.videoId===0)||(this.devId=== null || this.devId==='')){
          alert("请先选择机器人和视频，再点击提交");
        } else{
        this.$confirm('确认提交吗？', '提示', {}).then(() => {
          NProgress.start();
          this.isSubmitting = true;
          this.submitBtnText = '提交中';
          SetRobotVideoInfo({videoId: this.videoId, devId: this.devId, Action: 0, session: this.session}).then(res => {
            console.log("SetRobotVideoInfo-handleRobotVideo");
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
              this.getRobotVideoList();
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
      getRobotVideoList(){
        console.log("getRobotVideoList");
        GetRobotVideoList({devId: this.devId, session: this.session}).then(res => {
         if(res.data===undefined||res.data===null){
           this.videoRobot = undefined;
         }else{
           this.videoRobot = res.data;
         }

        });
      },
      deleteRobotVideo(){
        console.log("deleteRobotVideo");
        if((this.robotVideoId===null ||this.robotVideoId ===0||this.robotVideoId===undefined)||(this.devId===null || this.devId ===0||this.devId ==='')){
          alert("请先选择机器人对应的视频，再点击删除！");
        }else{
        this.$confirm('确认删除吗？', '删除', {}).then(() => {
          NProgress.start();
          this.isDeleting = true;
          this.deleteText = '删除中';
          SetRobotVideoInfo({id:this.robotVideoId, devId: this.devId, session: this.session, Action: 2}).then(res => {
            console.log("delete");
            console.log(res);
            this.isDeleting = false;
            NProgress.done();
            this.deleteText = '删除视频';
            if (res.result === 200) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              });
              this.getRobotVideoList();
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
      getCurrentRobotVideo(r){
        console.log("getCurrentRobotVideo");
        console.log(r);
        if(r!==null||r!==undefined){
          this.robotVideoId = r.id;
        }else{
          this.robotVideoId = 1;
        }
//        console.log("this.robotVideoId");
//        console.log(this.robotVideoId);
      },
      getVideo() {
        console.log("getVe");
//        this.listLoading = true;
        getList("/admin/VideoList.action",{}).then(res => {
          if(res.data===undefined||res.data===null){
            this.video = undefined;
          }else{
            this.video = res.data;
          }
        })
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
      getRobotList() {
        console.log("getRobotList");
        robotRegisterList({}).then(res => {
          if(res.data===undefined||res.data===null){
            this.tableData = undefined;
          }else{
            this.tableData = res.data;
            this.customerId =this.tableData.map(item=>{
              return item.cId;
            });
          }
        });
      },
      getBg(){
        console.log("getBg");
        var j=0;
        for (var  i=0;  i<this.tableData.length;i++){

          let o  = new Object();
          this.background[j] = o;
          this.background[j].currentBg = this.tableData[i].currentBg;
//            console.log("background");
//              console.log("this.background[j].currentBg");
//              console.log(this.background[j].currentBg);
          j++;
//          console.log("this.background");
//          console.log(this.background);
        }

      },
      handleSearch() {
        console.log("handleSearch");
        this.listLoading = true;
        if (this.filters.value == '') {
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
              this.tableData=[];
//              this.tableData = undefined;
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
  .robotTable1{
       width: 100%;
     }
  .robotTable2{
    width: 100%;
  }
  .pagination1{
    float: right;
    width: 100%
  }
  .buttons{
    margin-top: 30px;
  }
   .buttons_div1{
    width: 50%;
    float: left
  }
  .buttons_div2{
    width: 50%;
    float: left
  }
  .buttons el-form-item{
    float: left
  }
  .videoTable1{
    width: 45%;
    margin-top: 10px;
    float: left;
    height: 30%;
  }
  .videoTable2{
    width: 45%;
    margin-top: 10px;
    float: left;
    height: 30%;
  }
  .videoRobot1{
    width: 50%;
    margin-top: 10px;
    float: right;
    margin-left: 3%;
    height: 30%
  }
  .videoRobot2{
    width: 50%;
    margin-top: 10px;
    float: right;
    margin-left: 3%;
    height: 30%
  }
  .pagination2{
    float: right;
  }
  .pagination3{
    float:left;
  }

</style>

