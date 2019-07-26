 <template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.logType" placeholder="日志类型"></el-input>
				</el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="dataValue"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getLogList" >查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="robotLogs" highlight-current-row v-loading="listLoading" style="width: 100%;height:300px;overflow-y:auto">
				<el-table-column type="index" width="80" label="列号">
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center" width="230" sortable>
	                <template scope="scope">
				        <el-icon name="time"></el-icon>
				        <span style="margin-left:10px">{{ scope.row.cTime }}</span>
				      </template>
				</el-table-column>
				<el-table-column prop="robotName" label="机器人ID"  align="center" >
				    <template scope="scope">
				      <el-tag type="">{{scope.row.robotId}}</el-tag>
				   </template>
				</el-table-column>
				<el-table-column prop="logType" label="日志类别" width="120" align="center">
				</el-table-column>
				<!-- <el-table-column prop="logUrl" label="日志来源" align="center" >
				</el-table-column> -->
				<el-table-column  prop="logUrl"  label="操作" width="100" align="center">
				    <template scope="scope">
					   <!-- <a  :href="root+scope.row.logUrl"  target="_blank">下载</a> -->
					   <el-button size="small" @click="download(scope.row.fileUrl)">下载</el-button>
					</template>
				</el-table-column>
			</el-table>
		</template>


	</section>
</template>

<script scope>
	// import util from '../../common/util'
	import NProgress from 'nprogress'
	import { getRobotLogList } from '@/api/robot';
	import { parseTime } from '../../utils';
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";

	export default {
    components: {ElFormItem},
    name:'Log',
		props:{
           msg:{
           	  type:String,
           }
		},
		data() {
				return {
          dataValue:'',
          startTime:'',
          endTime:'',
          filters: {
					   logType: ''
					},
					robotLogs: [],
					total: 0,
					page: 1,
					size:10,
					listLoading: false,

				}
			},
		methods: {
			//显示转换

			handleCurrentChange(val) {
				this.page = val;
				this.getLogList();
			},
			handleSizeChange(size){
				this.page = 1;
				this.size =size;
				this.getLogList();
			},
//      open(){
//        this.$alert('请选择时间段，再点击按钮进行搜索', '注意', {
//          confirmButtonText: '确定',
//          callback: action => {
//            this.$message({
//              type: 'info',
//              message: `action: ${ action }`
//            });
//          }
//        });
//      },

			getLogList() {
			  console.log("getLogList");

        if(this.dataValue){
          console.log("this.dataValue");
          console.log(this.dataValue);
//    这一步出错了。
//          let a  = JSON.stringify(this.dataValue[0]);
//          console.log(a);
//        a = a.replace("T"," ");
//        a = a.replace(".000Z","");
//          a = a.substring(1,20);
          let a = this.dataValue[0];
        console.log(a);
        this.startTime = a;
//    这一步出错了。
//        方法1
//          let b  = JSON.stringify(this.dataValue[1]);
//          console.log(b);
//          b = b.replace("T"," ");
//          b = b.replace(".000Z","");
//          b = b.substring(1,20);
//          方法2
//          let t;
//          t = this.dataValue[1];
//          let m =(t.getHours()+5);
//          console.log(m);
//          t = t.setTime(t.setHours(m));
//          console.log("t");
//          console.log(t);
//          let b  = t;
//          方法3
          var d  = new Date(this.dataValue[1]);
          d.setDate(d.getDate()+1);
          var month = d.getMonth()+1;
          var day = d.getDate();
          if(month<10){
            month = "0"+month;
          }
          if(day<10){
            day = "0"+day;
          }
          var val = d.getFullYear()+""+month+""+day;
          console.log("val");
          console.log(val);
          this.endTime = val;
//          方法4
//          let b = this.dataValue[1];
//          console.log("b");
//          console.log(b);
//          this.endTime = b;

				let para = {
					robotId: this.msg,
          startTime:this.startTime,
          endTime : this.endTime,
				};
          if(this.filters.logType!==''){
            para.logType= this.filters.logType;
          }else{

          }
          this.listLoading = true;

          console.log("para");
          console.log(para);
          NProgress.start();
//          getRobotLogList(para).then((res) => {
//            getRobotLogList(...para).then((res) => {
          getRobotLogList({...para,startTime:this.startTime, endTime:this.endTime}).then((res) => {
            if(res.data){
              // this.total = res.data.data.total;
              this.robotLogs = res.data;
            }else{
              this.total =0;
              this.robotLogs = [];
            }
            this.listLoading = false;
            NProgress.done();
          });
        }else {
        }
			},


			download(url){
				console.log(url)
				var a = document.createElement('a');
					a.download = name;
					a.href = "." + url;
					// 模拟a标签点击进行下载
					a.click();

			},
			initMsg(){
				this.filters.logType='';
			}
		},
		mounted() {
		  this.getLogList();
		}
	}
</script>

<style scoped>

</style>
