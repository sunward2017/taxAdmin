 <template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<!-- <el-form-item>
					  <el-select v-model="filters.cid" placeholder="请选择" >
					    <el-option
					      v-for="item in customs"
					      :key="item.cId"
					      :label="item.customerName"
					      :value="item.cId">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="search" v-on:click="getManger()">查询</el-button>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" @click="handleAdd" icon="plus">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
    <template v-if="(this.tableData===null)||(this.tableData===undefined)">
      <Grid4videoList :columns="videoListColumns" :rows="tableData"  v-loading="listLoading"  @del="handleDel" :isEdit="true"
                      :isDelete="true"/>
    </template>
		<template v-if="(this.tableData!==null)||(this.tableData!==undefined)">
			<Grid4videoList :columns="videoListColumns" :rows="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"  v-loading="listLoading"  @del="handleDel" :isEdit="true"
			:isDelete="true"/>
      <div style="float: right; margin-right: 2% ">
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

	    <!--新增，编辑界面-->
		<el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false" size="tiny">
			<el-form :model="editForm" label-width="90px" :rules="editFormRules" ref="editForm">
			   <!-- <el-form-item label="客户名称" prop="cId">
					  <el-select v-model="editForm.cId" placeholder="请选择客户" style="width:100%" >
					    <el-option
					      v-for="item in customs"
					      :key="item.cId"
					      :label="item.customerName"
					      :value="item.cId">
					    </el-option>
					  </el-select>
				</el-form-item> -->
			    <el-form-item label="视频描述" prop="content">
			    	<el-input v-model="editForm.content" auto-complete="off" style="width: 360px"></el-input>
			    </el-form-item>
			     <el-form-item label="视频文件">
			    	<!--<Upload :param="editForm" :url="url" accept=".MP4" ref="upload" @callback="refreshList" :fileList="fileList"/>-->
             <Upload :param="editForm" :url="url" strRegExp=".MP4" ref="upload" @callback="refreshList" :fileList="fileList"/>
			    </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="cancel"  icon="circle-cross">取 消</el-button>
				<el-button type="primary" icon="upload2" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
    import NProgress from 'nprogress'
	import Grid4videoList from '../../components/Grid/Grid4videoList'
	import { getList, saveSubmit} from '../../api/table';
	import { videoListColumns } from '../../dictionary/columns';
    import { resetObj,cloneObj} from '@/utils/cover'
 	import Upload from "../../components/Upload";
 	import { getToken,getAccount } from '@/utils/auth'

	export default {
		components: {
      Grid4videoList,
			Upload
		},
		data() {
			return {
//        当前页
        currentPage: 1,
//        当前页内显示条数
        pageSize:10,
				filters:{},
				videoListColumns:videoListColumns,
				customs:'',
				tableData:[],
				//编辑
				editFormTtile:"新增",
				editFormVisible:false,
				editLoading:false,
				listLoading:false,
				btnEditText:'提交',
				editForm:{
					content:'',
					Action:'',
					videoId:'',
					session:'',
					account:'',
					cId: '',
				},
				url:'/admin/VideoModify.action',
				editFormRules:{
                    content: [{ required: true, message: '请输入视频描述', trigger: 'blur' }],
				},
				fileList:[],
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
			getCustoms() {
				getList("/admin/CustomerList.action",{}).then(res => {
					 if(res&&res.data){
					 	this.customs = res.data;
					 	var obj = {};
					 	res.data.forEach(item =>{
					 		obj[item.cId] = item.customerName
					 	})
					    this.$store.dispatch('setClients',obj);
					    this.getManger();
					 };
				})
			},
			getManger() {
        console.log("getManager");
				this.listLoading = true;
				getList("/admin/VideoList.action",{}).then(res => {
					this.listLoading =false;
					if(res.data){
					   this.tableData = res.data
//            console.log(this.tableData);
					}else{
             this.tableData=[];
					}

				})
			},
			handleAdd(){
				this.editFormTtile="新增";
				this.editForm = resetObj(this.editForm);
				this.editForm.Action=0;
				this.editForm.videoId =0;
				this.editForm.session= getToken();
				this.editForm.account= JSON.parse(unescape(getAccount())).account;
				this.editForm.cId = JSON.parse(unescape(getAccount())).cId;
				this.editFormVisible=true;
			},
//      handleEdit(r){
//        console.log("handleEdit");
//        console.log(r);
//        this.editFormTtile="编辑";
//        this.editFormVisible=true;
//        this.editForm = Object.assign(r);
//        console.log("editForm");
//        console.log(this.editForm);
//        this.editForm.Action=1;
//      },
			cancel(){
               this.editFormVisible=false;
			},
			editSubmit() {
			  console.log("editSubmit");
        console.log(this.$refs.upload.fileList.length);
				this.$refs.editForm.validate((valid) => {
//				  console.log("refs.upload");
//				  console.log(this.$refs.upload.fileList.length);
		          if (valid) {
		            this.$confirm('确认提交吗？', '提示', {}).then(() => {

//		              if(this.$refs.upload.fileList.length ===0){
//		                alert("请提交视频文件");
//                  }else{
//                    this.$refs.upload.submit();
//                  }
                  this.$refs.upload.submit();
				      });
				   }
				})
      		},
			handleDel(r){
			    var _this = this;
				this.$confirm('确认删除视频', '提示', {
					//type: 'warning'
				}).then(() => {
					_this.listLoading = true;
					NProgress.start();
					let para = {
						videoId: r.videoId,
						Action:2
					};
					saveSubmit("/admin/VideoDelete.action",para).then((res) => {
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
			},
			refreshList(res){
				this.editFormVisible=false;
				this.getManger();
			}
		},
		mounted() {
		   this.getManger();
		}
	}
</script>

<style scoped>
  .toolbar{
  	 padding-top:20px;

  }
</style>
