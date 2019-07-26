<template>
	<section>
		<!--工具条-->
		<el-row>
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.value" placeholder="请输入查询字段"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="search" v-on:click="getCustoms">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd" icon="plus">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
        </el-row>
		<!--列表-->
		<template>
			<Grid :columns="customColumns" :rows="tableData"  v-loading="listLoading" @edit="handleEdit" @del="handleDel" :isEdit="true"
			:isDelete="true"/>
		</template>

	    <!--编辑界面-->
		<el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="90px" :rules="editFormRules" ref="editForm">
			   <el-col :span="12">
			     <el-form-item label="客户名称" prop="customerName">
			    	<el-input v-model="editForm.customerName" auto-complete="off"></el-input>
			    </el-form-item>
			  </el-col>
			  <el-col :span="12">
				<el-form-item label="客户手机" prop="phone">
					<el-input v-model="editForm.phone" auto-complete="off"></el-input>
				</el-form-item>
			  </el-col>
			  <el-col :span="12">
				<el-form-item label="联系人" prop="contactName">
					<el-input v-model="editForm.contactName" auto-complete="off"></el-input>
				</el-form-item>
			  </el-col>
			  <el-col :span="12">
				<el-form-item label="联系人手机" prop="contactPhone">
					<el-input v-model="editForm.contactPhone" auto-complete="off"></el-input>
				</el-form-item>
			 </el-col>
				<el-col :span="12">
					<el-form-item label="性别" prop="gender">
						  <el-radio class="radio" v-model="editForm.gender" :label="1">男</el-radio>
	                      <el-radio class="radio" v-model="editForm.gender" :label="0">女</el-radio>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="头像上传" prop="faceUrl">
						<el-input v-model="editForm.faceurl"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="QQ号码" prop="qq" >
	                    <el-input  v-model="editForm.qq"></el-input >
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="邮箱" prop="eMail" >
					    <el-input  v-model="editForm.eMail" placeholder="请输入邮箱"></el-input >
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="国家" prop="country">
					   <el-input  v-model="editForm.country" placeholder="中国"></el-input >
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="城市" prop="city">
					   <el-input  v-model="editForm.city" placeholder="北京"></el-input >
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="社区" prop="community" >
	                    <el-input  v-model="editForm.community" placeholder="朝阳区"></el-input >
					</el-form-item>
				</el-col>

				<el-col :span="12">
					<el-form-item label="行业" prop="industry" >
	                    <el-input  v-model="editForm.industry" placeholder=""></el-input >
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="传真" prop="address" >
	                    <el-input  v-model="editForm.fax" placeholder="010-xxxxxxxx"></el-input >
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="地址" prop="address" >
	                    <el-input  v-model="editForm.address" placeholder="XX街XX路168号"></el-input >
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="备注" prop="memo">
	                    <el-input  v-model="editForm.memo" placeholder=""></el-input >
					</el-form-item>
				</el-col>
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
	import Grid from '../../components/Grid/Grid'
	import { getList, saveSubmit} from '../../api/table';
	import { customColumns } from '../../dictionary/columns';
    import { resetObj,cloneObj} from '@/utils/cover'


	export default {
		components: {
			Grid,
		},
		data() {
			return {
				filters: {
					custom: '',
					value: ''
				},
				customColumns:customColumns,
				tableData:[],
				//编辑

				editFormTtile:"新增",
				editFormVisible:false,
				editLoading:false,
				listLoading:false,
				btnEditText:'提交',
				editForm:{
					cId:0,
				    customerName:'',
				    phone:'',
				    contactName:'',
			        contactPhone:'',
				    gender:'',
				    faceUrl:'',
				    fax:'',
				    qq:'',
			        eMail:'',
			        country:'',
				    city:'',
				    community:'',
			        address:'',
				    industry:'',
				    memo:'',
				    Action:0,
				},
				editFormRules:{

				},
			}
		},
		methods: {
			getCustoms() {
				this.listLoading = true;
				getList("/admin/CustomerList.action",{}).then(res => {
					if(res&&res.data){
					  this.tableData = res.data
					}else{
					  this.tableData = [];
					}
					this.listLoading =false;
				})
			},
			handleAdd(){
				this.editFormTtile="新增";

				this.editFormVisible=true;
				this.editForm = resetObj(this.editForm);
				this.editForm.Action=0;
				this.editForm.cId =0;
			},
			cancel(){
               this.editFormVisible=false;
			},
			editSubmit(){
				let _this = this;
                let param  = cloneObj(_this.editForm)
	            _this.$refs.editForm.validate((valid) => {
                     if(valid) {
						_this.$confirm('确认提交吗？', '提示', {}).then(() => {
							_this.editLoading = true;
							NProgress.start();
							_this.btnEditText = '提交中';
							  if(_this.editForm.Action===0){
								saveSubmit("/admin/CustomerModify.action",param).then((res) => {
									_this.editLoading = false;
									NProgress.done();
									_this.btnEditText = '提 交';
									if(res.result===200){
										  _this.$notify({
											title: '成功',
											message: '新增成功',
											type: 'success'
										});
										_this.editFormVisible = false;
										_this.getCustoms();
									}else{
										 _this.$notify({
											title: '失败',
											message: res.message,
											type: 'error'
										});
									}

								});
							} else {
								saveSubmit("/admin/CustomerModify.action",param).then((res) => {
									_this.editLoading = false;
									NProgress.done();
									_this.btnEditText = '提 交';
									if(res.result===200){
										  _this.$notify({
											title: '成功',
											message: '编辑成功',
											type: 'success'
										});
									    _this.getCustoms();
									}else{
										 _this.$notify({
											title: '失败',
											message: res.message,
											type: 'error'
										});
									}
									_this.editFormVisible = false;
								});

							}

						}).catch(()=>{});

					}
				});
			},
			handleEdit(r){
        this.editFormTtile="编辑";
				this.editFormVisible=true;
        this.editForm = cloneObj(r);
        this.editForm.Action=1;
			},
			handleDel(r){
			    var _this = this;
				this.$confirm('确认删除客户：'+r.customerName+' 吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					_this.listLoading = true;
					NProgress.start();
					let para = {
						cId: r.cId,
					};
					saveSubmit("/admin/CustomerDelete.action?Action=2",para).then((res) => {
						_this.listLoading = false;
						NProgress.done();
						if(res.result=="200"){
							_this.$notify({
								title: '成功',
								message: '删除成功',
								type: 'success'
							});
							_this.getCustoms();
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
			}
		},
		mounted() {
            this.getCustoms();
		}
	}
</script>

<style scoped>
  .toolbar{
  	 padding-top:20px;
  	 padding-left:20px;
  }
</style>
