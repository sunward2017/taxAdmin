<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
    </el-col>
    <template>
      <!--左边表-->
      <!--<div style="float: left; margin-right:60px; margin-left: 80px">-->
        <!--<el-table :data="tableLeft" style="width: 450px" class="robot" @row-click="getEmoticonList" >-->
          <!--<el-table-column type="index" label="列号" ></el-table-column>-->
          <!--<template v-for="item in robotRegisterColumnsForQuestions">-->
            <!--<el-table-column :prop="item.prop" :label="item.label"-->
                             <!--:width="item.width" :align="item.align"-->
                             <!--:sortable="item.sortable" :formatter="item.formatter"-->
            <!--&gt;-->
            <!--</el-table-column>-->
          <!--</template>-->
        <!--</el-table>-->
      <!--</div>-->

      <!--右边表-->
      <el-table
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        border
        style=" width: 99%; ">
        <!--<el-table-column-->
          <!--prop="emoticonUrl"-->
          <!--label= '相片'-->

          <!--align= 'center'-->
        <!--&gt;-->
          <!--<template scope="scope">-->
            <!--<img :src="cover(this.emoticonUrl)" width="40" height="40"/>-->

          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column type="index" label="列号" width="100"></el-table-column>
        <el-table-column
          prop='id'
          label='ID'
          width="300%"
          align='center'>
        </el-table-column>
        <el-table-column
          prop ='emoticon'
          label='名字'
          align='center'
        >
        </el-table-column>
      </el-table>
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

  </section>
</template>

<script>
  import { getList, saveSubmit} from '../../api/table';
  import Upload from "../../components/Upload/upload";
  import { getAccount,getToken } from '@/utils/auth'
  import {
    robotRegisterList,
    GetRobotEmoticon
  } from '@/api/robot'
  import {
    robotRegisterColumnsForQuestions,
  } from '../../dictionary/columns'
  export default {
    components: {
      Upload,
    },
    data() {
      return {
//        当前页
        currentPage: 1,
//        当前页内显示条数
        pageSize:10,
        emoticonUrl:'',
        tableData:[],
        tableLeft:[],
        faceUrl:'/admin/UploadImg.action',
        robotRegisterColumnsForQuestions: robotRegisterColumnsForQuestions,

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
      cover(url){
        return "."+url;
      },
      getAllRobotList(){
//        console.log("1");
        this.listLoading = true;
        robotRegisterList({}).then(res => {
          this.listLoading = false;
          this.tableLeft = res.data;
//          console.log(this.tableLeft);
        });
      },
      getEmoticonList(){
        let tsession =  getToken();
        console.log(tsession);
        GetRobotEmoticon({}).then(res=>{
//        GetRobotEmoticon({customerId : r.cId , deviceId : r.devId , session : tsession} ).then(res => {
          this.tableData = res.data.map((item)=>{
            return item;
          });
          console.log(this.tableData);
        });
        this.emoticonUrl =  this.tableData.map((item)=>{
//          console.log("item.emoticonUrl");
//          console.log(item.emoticonUrl);
          return item.emoticonUrl;
        });
      },
    },

    mounted() {
      this.getEmoticonList();
//      this.getAllRobotList();
    },

  }
</script>

<style scoped>
  .toolbar{
    padding-top:20px;
    padding-left:20px;
  }
</style>
