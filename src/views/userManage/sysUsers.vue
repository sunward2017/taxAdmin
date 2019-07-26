 <template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item>
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
					  <el-select v-model="filters.type" placeholder="请选择">
					    <el-option
					      v-for="item in types"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value"
					      :disabled="item.disabled">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="search" v-on:click="getManger()">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd" icon="plus">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<template>
			<Grid :columns="sysUsersColumns" :rows="tableData"  v-loading="listLoading" @edit="handleEdit" @del="handleDel" :isEdit="true" 
			:isDelete="true"/>
		</template>
	    
	    <!--编辑界面-->
		<el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false" size="tiny">
			<el-form :model="editForm" label-width="90px" :rules="editFormRules" ref="editForm">
			   <el-form-item label="客户" prop="cId">
					  <el-select v-model="editForm.cId" placeholder="请选择客户" style="width:100%" >
					    <el-option
					      v-for="item in customs"
					      :key="item.cId"
					      :label="item.customerName"
					      :value="item.cId">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item label="权限" prop="type">
					  <el-select v-model="editForm.type" placeholder="请选择权限" style="width:100%">
					    <el-option
					      v-for="item in types"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value"
					      :disabled="item.disabled">
					    </el-option>
					  </el-select>
				</el-form-item>  
			    <el-form-item label="用户名" prop="account">
			    	<el-input v-model="editForm.account" auto-complete="off"></el-input>
			    </el-form-item>	
			     <el-form-item label="密码" prop="password">
			    	<el-input type="password" v-model="editForm.password" auto-complete="off"></el-input>
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
	import Grid from '../../components/Grid/Grid'
	import { getList, saveSubmit} from '../../api/table';
	import { sysUsersColumns } from '../../dictionary/columns';
    import { resetObj,cloneObj} from '@/utils/cover'
 	
 	 
	export default {
		components: {
			Grid,
		},
		data() {
			return {
				filters: {
					cid: '',
					type: ''
				},
				types: [{
		          value: "1",
		          label: '超级管理员'
		        }, {
		          value: "2",
		          label: '普通管理员',
		          // disabled: true
		        }], 
				sysUsersColumns:sysUsersColumns,
				customs:'',
				tableData:[],
				//编辑
				action:'',
				editFormTtile:"新增",
				editFormVisible:false,
				editLoading:false,
			 
				listLoading:false,
				btnEditText:'提交',
				editForm:{
					cId:'', 
				    type:'',
				    account:'',
				    password:'',
				},
				editFormRules:{
                    cId: [{ required: true, message: '请选择用户', trigger: 'blur' }],
                    type: [{ required: true, message: '请选择权限', trigger: 'blur' }],
                    account: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],	
				},		
			}
		},
		methods: {
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
			getManger() {
				this.listLoading = true;
				let param = {
					cid:this.filters.cid,
					type:this.filters.type
				}
				getList("/admin/AdminSelectAll.action",param).then(res => {
					this.listLoading =false;
					if(res.data){
					   this.tableData = res.data	
					}else{
                       this.tableData=[];
					}
						 
				})
			},
			handleAdd(){
				this.editFormTtile="新增";
				this.action = "add";
				this.editFormVisible=true;
				this.editForm = resetObj(this.editForm); 
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
							  if(_this.action==="add"){ 
								saveSubmit("/admin/AdminAdd.action?Action=0",param).then((res) => {
									_this.editLoading = false;
									NProgress.done();
									_this.btnEditText = '提 交';
									if(res.result=="200"){
										  _this.$notify({
											title: '成功',
											message: '新增成功',
											type: 'success'
										});
										_this.editFormVisible = false;
										_this.getManger();
									}else{
										 _this.$notify({
											title: '失败',
											message: res.message,
											type: 'error'
										});
									}
									 
								});
							} else {
								saveSubmit("/admin/AdminModify.action?Action=1",param).then((res) => {
									_this.editLoading = false;
									NProgress.done();
									_this.btnEditText = '提 交';
									if(res.result=="200"){
										  _this.$notify({
											title: '成功',
											message: '编辑成功',
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

							}

						}).catch(()=>{});

					}
				});
			},
			handleEdit(r){
				this.editFormVisible=true;
				this.action = 'edit';
                this.editForm = cloneObj(r);
                this.editForm.type=this.editForm.type.toString();
			},
			handleDel(r){
				console.log(r)
			    var _this = this;
				this.$confirm('确认删除用户：'+r.account+' 吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					_this.listLoading = true;
					NProgress.start();
					let para = {
						uid: r.uid,
					};
					saveSubmit("/admin/AdminDel.action?Action=2",para).then((res) => {
						_this.listLoading = false;
						NProgress.done();
						if(res.result=="200"){
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
			}
		},
		mounted() {
            this.getCustoms();
            this.getManger();
		}
	}
</script>

<style scoped>
  .toolbar{
  	 padding-top:20px;
  	 padding-left:20px;
  }
</style>