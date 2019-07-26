 <template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<!-- <el-form-item>
					  <el-select v-model="filters.cid" placeholder="请选择客户" >
					    <el-option
					      v-for="item in customs"
					      :key="item.cId"
					      :label="item.customerName"
					      :value="item.cId">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="search" v-on:click="getMaps()">查询</el-button>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" @click="handleAdd" icon="plus">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--地图列表-->
		<template>
      <div style="height: 300px">

			 <el-table border :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 98%;"  v-loading="listLoading" @row-click="pointInfo">
				  <el-table-column
			      prop="mapUrl"
				  label= '缩略图'
				  width= '200'
			      align= 'center'
			      >
			      <template scope="scope">
			      	  <img :src="cover(scope.row.mapUrl)" width="40" height="40"/>
			      </template>
			    </el-table-column>
			    <el-table-column
			        prop='regionName'
  					label='所在位置'
  					width='300'
  					align='center'>
			    </el-table-column>
			    <el-table-column
			       prop ='cTime'
 				   label='创建时间'
  				   align='center'
                   >

			    </el-table-column>

				<el-table-column inline-template :context="_self" label="操作" width="380" align='center'>
          <div>

						<el-button   size="small" icon="edit" @click="handleEdit(row)">编辑</el-button>
						<el-button    icon="delete" size="small"  type="warning" @click="handleDel(row)">删除</el-button>
						<el-button    icon="setting" size="small"  type="success" @click="pointInfo(row)">打点详情</el-button>
						<el-button   type="info" icon="setting" size="small" @click="addPoint(row)">新增打点</el-button>

          </div>
				</el-table-column>
			</el-table>
      </div>
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

    <!--打点列表-->
	     <template>
        	<el-col :span="24"><div class="point-bar" style="width: 98%">打点信息</div></el-col>

        	<el-col :span='24'>
        		<Grid4pointList :columns="pointListColumns" :rows="pointData.slice((currentPageD-1)*pageSizeD,currentPageD*pageSizeD)"  v-loading="pointlistLoading" @edit="pointEdit" @del="pointDel" :isEdit="true"
			:isDelete="true"/>
            <!--分页-->
            <div style="float: right">
              <el-pagination
                @current-change="handleCurrentChangeD"
                @size-change="handleSizeChangeD"
                :current-page="currentPageD"
                :page-size="pageSizeD"
                small
                layout="total, prev, pager, next"
                :total="pointData.length">
              </el-pagination>
            </div>
        	</el-col>
        </template>

	    <!--地图新增，编辑界面-->
		<el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false" size="tiny">
			<el-form :model="editForm" label-width="90px" :rules="editFormRules" ref="editForm">
			   <el-form-item label="客户名称" prop="cId" v-if="isShow">
					  <el-select v-model="editForm.cId" placeholder="请选择客户" style="width:100%" >
					    <el-option
					      v-for="item in customs"
					      :key="item.cId"
					      :label="item.customerName"
					      :value="item.cId">
					    </el-option>
					  </el-select>
				</el-form-item>
			    <el-form-item label="地图名字" prop="regionName">
			    	<el-input v-model="editForm.regionName" auto-complete="off" style="width: 360px"></el-input>
			    </el-form-item>
			    <el-form-item label="地图地址" prop="mapUrl">
			    	<el-input v-model="editForm.mapUrl" auto-complete="off" disabled style="width: 360px"></el-input>
			    </el-form-item>
			     <el-form-item label="地图文件" >
			    	<Upload  :url="url" strRegExp=".PNG|.JPG|.JPEG|.GIF" ref="upload" @callback="setUrl"/>
			    </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="cancel"  icon="circle-cross">取 消</el-button>
				<el-button type="primary" icon="upload2" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
			</div>
		</el-dialog>
		<!--打点新增，编辑界面-->
		<el-dialog :title="pointFormTitle" v-model="pointFormVisible" :close-on-click-modal="false" size="tiny">
			<el-form :model="pointEditForm" label-width="110px" :rules="pointFormRules" ref="pointEditForm">
			    <el-form-item label="目标点名称" prop="pointName">
			    	<el-input v-model="pointEditForm.pointName" auto-complete="off" style="width: 67%"></el-input>
			    </el-form-item>
			    <el-form-item label="目标点描述" prop="pointDescribe">
			    	<el-input v-model="pointEditForm.pointDescribe" auto-complete="off" style="width: 67%" type="textarea"
                      :rows="3"></el-input>
			    </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="pointCancel"  icon="circle-cross">取 消</el-button>
				<el-button type="primary" icon="upload2" @click.native="pointEditSubmit" :loading="pointEditLoading">{{pointBtnText}}</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
    import NProgress from 'nprogress'
	import { getList, saveSubmit} from '../../api/table';
	import { mapListColumns,pointListColumns} from '../../dictionary/columns';
    import { resetObj,cloneObj} from '@/utils/cover'
 	import Upload from "../../components/Upload/upload";
 	import { getToken,getAccount } from '@/utils/auth'
// 	import Grid from '../../components/Grid/Grid'
    import Grid4pointList from '../../components/Grid/Grid4pointList'
	export default {
		components: {
      Grid4pointList,
			Upload,
		},
		data() {
			return {
        //        当前页
        currentPage: 1,
//        当前页内显示条数
        pageSize:3,
        //        当前页
        currentPageD: 1,
//        当前页内显示条数
        pageSizeD:5,
				filters: {
					cid: ''
				},
				mapListColumns:mapListColumns,
				pointListColumns:pointListColumns,
				customs:'',
				isShow:false,
				tableData:[],
				//编辑
				editFormTtile:"新增",
				editFormVisible:false,
				editLoading:false,
				listLoading:false,
				btnEditText:'提交',
				pointBtnText:'提交',
				currentCid:'',
				currentRegionId:'',
				editForm:{
					regionId:'',
					regionName:'',
					mapUrl:'',
					Action:'',
				},
				pointData:[],
				pointFormTitle:'新增',
				pointEditLoading:false,
				pointlistLoading:false,
				pointFormVisible:false,
				pointEditForm:{
					id:'',
					cId:'',
					regionId:'',
					pointName:'',
					pointDescribe:'',
					Action:'',
				},

				url:'/admin/UploadImg.action',
				editFormRules:{
                    cId: [{ required: true, message: '请选择客户', trigger: 'blur' }],
                    regionName: [{ required: true, message: '请输入地图名字', trigger: 'blur' }],
                    mapUrl: [{ required: true, message: '请输入地图地址', trigger: 'blur' }]
				},
				pointFormRules:{
					pointName: [{ required: true, message: '请输入打点名称', trigger: 'blur' }],
				    pointDescribe: [{ required: true, message: '请输入打点描述', trigger: 'blur' }],
 				},
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
      handleSizeChangeD(pageSize){
        this.pageSizeD = pageSize;
      },
      handleCurrentChangeD(currentPage){
        this.currentPageD  = currentPage;
      },

			cover(url){
				return '.'+url;
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
					 };
				})
			},
			setUrl(res){
               this.editForm.mapUrl = res.data;
			},
			getMaps() {
				this.listLoading = true;

				getList("/admin/MapList.action",{}).then(res => {
					this.listLoading =false;
					if(res.data){
					   this.tableData = res.data
                       this.pointInfo(this.tableData[0]);
					}else{
                       this.tableData=[];
                       this.pointData =[];
					}

				})
			},
			handleAdd(){
				this.editFormTtile="新增";
				this.editForm = resetObj(this.editForm);
				this.editForm.Action=0;
				this.editForm.regionId =0;
				this.editFormVisible=true;
				this.editForm.cId=JSON.parse(unescape(getAccount())).cId
			},
      handleEdit(r){
        this.editFormTtile="编辑";
        this.editFormVisible=true;
        this.editForm.regionId= r.regionId;
        this.editForm.regionName=r.regionName;
        this.editForm.mapUrl=r.mapUrl;
        this.editForm.Action=1;
      },
      handleDel(r){
        var _this = this;
        this.$confirm('确认删除', '提示', {
          //type: 'warning'
        }).then(() => {
          _this.listLoading = true;
          NProgress.start();
          let para = {
            regionId: r.regionId,
            cId:r.cId,
            Action:2
          };
          saveSubmit("/admin/MapDelete.action",para).then((res) => {
            _this.listLoading = false;
            NProgress.done();
            if(res.result=="200"){
              _this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              });
              _this.getMaps();
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
			cancel(){
               this.editFormVisible=false;
			},
			pointCancel(){
				this.pointFormVisible=false;
			},
			editSubmit() {
        		let _this = this;
                let param  = cloneObj(_this.editForm);
	            _this.$refs.editForm.validate((valid) => {
                     if(valid) {
						_this.$confirm('确认提交吗？', '提示', {}).then(() => {
							_this.editLoading = true;
							NProgress.start();
							_this.btnEditText = '提交中';
							saveSubmit("/admin/MapModify.action",param).then((res) => {
								_this.editLoading = false;
								NProgress.done();
								_this.btnEditText = '提 交';
								let msg='';
								if(_this.editForm.Action===0){
                         msg = "新增成功";
								}else{
                         msg = "修改成功";
								}
								if(res.result=="200"){
									  _this.$notify({
										title: '成功',
										message: msg,
										type: 'success'
									});
									_this.editFormVisible = false;
									_this.getMaps();
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

			getPoints() {
				this.pointListLoading = true;
				let param = {
					cId:this.currentCid,
					regionId:this.currentRegionId,
					loginName:JSON.parse(unescape(getAccount())).account
				}
				getList("/admin/PointList.action",param).then(res => {
					this.pointListLoading =false;
					if(res.data){
					   this.pointData = res.data
					}else{
                       this.pointData=[];
					}

				})
			},
			pointInfo(r){
				this.currentCid=r.cId;
				this.currentRegionId = r.regionId;
				this.getPoints();
			},
			addPoint(r){
				this.pointFormTitle="新增";
				this.pointEditForm = resetObj(this.pointEditForm);
				this.pointEditForm.Action=0;
				this.pointEditForm.id=0;
				this.pointEditForm.cId = this.currentCid;
				this.pointEditForm.regionId=this.currentRegionId;
				this.pointFormVisible=true;
			},
			pointEdit(r){
        this.pointFormTitle="编辑";
				this.pointFormVisible=true;
				this.pointEditForm.Action=1;
				this.pointEditForm.id =r.id;
				this.pointEditForm.cId = this.currentCid;
				this.pointEditForm.regionId=this.currentRegionId;
                this.pointEditForm.pointName=r.pointName;
                this.pointEditForm.pointDescribe = r.pointDescribe;
			},
			pointDel(r){
                var _this = this;
				this.$confirm('确认删除', '提示', {
					//type: 'warning'
				}).then(() => {
					_this.pointListLoading = true;
					NProgress.start();
					let para = {
						Action:2,
						id:r.id,
						loginName:r.account
					};
					saveSubmit("/admin/PointDelete.action",para).then((res) => {
						_this.poingListLoading = false;
						NProgress.done();
						if(res.result=="200"){
							_this.$notify({
								title: '成功',
								message: '删除成功',
								type: 'success'
							});
							_this.getPoints();
						}else{
							 _this.$notify({
								title: '失败',
								message: res.message,
								type: 'error'
							});
						}
					});

				}).catch(() => {

				});
			},
			pointEditSubmit(){
				let _this = this;
                let param  = cloneObj(_this.pointEditForm)
	            _this.$refs.pointEditForm.validate((valid) => {
                     if(valid) {
						_this.$confirm('确认提交吗？', '提示', {}).then(() => {
							_this.pointEditLoading = true;
							NProgress.start();
							_this.btnEditText = '提交中';
							saveSubmit("/admin/PointModify.action",param).then((res) => {
								_this.pointEditLoading  = false;
								NProgress.done();
								_this.btnEditText = '提 交';
								let msg='';
								if(_this.editForm.Action===0){
                                    msg = "新增成功";
								}else{
                                    msg = "修改成功";
								}
								if(res.result=="200"){
									  _this.$notify({
										title: '成功',
										message: msg,
										type: 'success'
									});
									_this.pointFormVisible = false;
									_this.getPoints();
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
			}
		},
		mounted() {
			//this.getCustoms();
            this.getMaps();
		}
	}
</script>

<style scoped>
  .toolbar{
  	 padding-top:20px;

  }
  .point-bar{
  	padding:10px 0 10px 30px;
  	background:#135080;
  	color:#fff;
  }
</style>
